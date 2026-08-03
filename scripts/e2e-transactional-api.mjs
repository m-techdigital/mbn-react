import crypto from "node:crypto";

const baseUrl = String(process.env.MBN_E2E_API_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");
const customerPassword = process.env.MBN_E2E_PASSWORD || "change-me";
const adminUsername = process.env.MBN_E2E_ADMIN_LOGIN || "admin";
const adminPassword = process.env.MBN_E2E_ADMIN_PASSWORD || "change-me";
const allowMutation = process.env.MBN_E2E_ALLOW_MUTATION === "1";
const contractVersion = "2026-08-04.1";

if (!allowMutation) {
    console.error("Transactional E2E sẽ thay đổi dữ liệu. Thiết lập MBN_E2E_ALLOW_MUTATION=1 sau khi chạy migrate:fresh --seed trên DB kiểm thử.");
    process.exit(2);
}

const unwrap = (payload) => payload?.data ?? payload?.response ?? payload;
const headers = (token, extra = {}) => ({
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Client-App": "mbn-transactional-e2e",
    "X-Marketplace-Contract-Version": contractVersion,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
});

async function request(path, { method = "GET", token, body, expected = [200] } = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: headers(token, body?.idempotency_key ? { "Idempotency-Key": body.idempotency_key } : {}),
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
    if (!expected.includes(response.status)) {
        throw new Error(`${method} ${path} -> ${response.status}: ${text.slice(0, 800)}`);
    }
    return unwrap(payload);
}

async function customerLogin(login) {
    const data = await request("/auth/customer/login", {
        method: "POST",
        body: { login, password: customerPassword },
    });
    if (!data?.access_token) throw new Error(`Không nhận được customer token cho ${login}`);
    return data.access_token;
}

async function adminLogin() {
    const data = await request("/login", {
        method: "POST",
        body: { username: adminUsername, password: adminPassword },
    });
    if (!data?.access_token) throw new Error("Không nhận được admin token");
    return data.access_token;
}

async function product(code) {
    const item = await request(`/marketplace/products/${code}`);
    if (!item?.id || !item?.availability_version) throw new Error(`Sản phẩm demo ${code} không sẵn sàng.`);
    return item;
}

async function createTransaction(customerToken, code, body) {
    const item = await product(code);
    const idempotencyKey = `e2e-${code}-${crypto.randomUUID()}`;
    const transaction = await request(`/customer/products/${item.id}/transact`, {
        method: "POST",
        token: customerToken,
        expected: [201],
        body: {
            idempotency_key: idempotencyKey,
            availability_version: item.availability_version,
            ...body,
        },
    });
    const detail = await request(`/customer/transactions/${transaction.id}`, { token: customerToken });
    return detail;
}

async function payNextByWallet(token, transaction) {
    const payment = transaction.payments?.find((item) => ["pending", "rejected", "overdue"].includes(item.status));
    if (!payment) throw new Error(`Không có kỳ thanh toán khả dụng cho ${transaction.code}`);
    await request(`/customer/transactions/${transaction.id}/payments/${payment.id}/submit`, {
        method: "POST",
        token,
        body: { payment_method: "wallet", reference: `E2E-${payment.code}` },
    });
    return request(`/customer/transactions/${transaction.id}`, { token });
}

async function payAllDueByWallet(token, transaction) {
    let detail = transaction;
    while (detail.payments?.some((item) => ["pending", "rejected", "overdue"].includes(item.status))) {
        detail = await payNextByWallet(token, detail);
    }
    return detail;
}

async function customerAction(token, transactionId, action) {
    return request(`/customer/transactions/${transactionId}/actions`, {
        method: "POST",
        token,
        body: { action },
    });
}

async function adminAction(token, transactionId, action, extra = {}) {
    return request(`/transactions/${transactionId}/actions`, {
        method: "POST",
        token,
        body: { action, note: `Transactional E2E: ${action}`, ...extra },
    });
}

const buyer = await customerLogin("customer");
const renter = await customerLogin("renter");
const seller = await customerLogin("seller");
const lessor = await customerLogin("lessor");
const admin = await adminLogin();

console.log("PASS authentication");

let sale = await createTransaction(buyer, "NSO-0102", {
    transaction_type: "sale",
    purchase_mode: "full",
    payment_method: "wallet",
});
sale = await payAllDueByWallet(buyer, sale);
if (sale.status !== "paid") throw new Error(`Sale status expected paid, got ${sale.status}`);
await request(`/customer/transactions/${sale.id}/disputes`, {
    method: "POST",
    token: buyer,
    expected: [201],
    body: { reason: "not_as_described", description: "Transactional E2E dispute evidence", evidence: ["e2e://sale"] },
});
console.log("PASS sale wallet + dispute mutation");

let rental = await createTransaction(renter, "NSO-0201", {
    transaction_type: "rental",
    purchase_mode: "full",
    payment_method: "wallet",
    rental_period_count: 1,
    rental_period_unit: "day",
});
rental = await payAllDueByWallet(renter, rental);
await customerAction(lessor, rental.id, "seller_handover");
await customerAction(renter, rental.id, "buyer_receive");
await customerAction(renter, rental.id, "renter_return");
await customerAction(lessor, rental.id, "lessor_receive_return");
const completedRental = await adminAction(admin, rental.id, "complete", {
    rental_deposit_deduction_amount: "0.00",
});
if (completedRental.status !== "completed") throw new Error(`Rental status expected completed, got ${completedRental.status}`);
console.log("PASS rental lifecycle + deposit settlement mutation");

let installment = await createTransaction(buyer, "NRO-0301", {
    transaction_type: "sale",
    purchase_mode: "installment",
    initial_payment_amount: "800000",
    installment_count: 3,
    installment_interval_unit: "week",
    installment_interval_count: 1,
    payment_method: "wallet",
});
installment = await payNextByWallet(buyer, installment);
if (!['partially_paid', 'paid'].includes(installment.status)) throw new Error(`Installment status unexpected: ${installment.status}`);
console.log("PASS installment first-period mutation");

const payoutOverviewBefore = await request("/customer/payouts", { token: seller });
const payoutAccount = payoutOverviewBefore.accounts?.find((item) => item.status === "verified");
if (!payoutAccount) throw new Error("Không có payout account demo đã xác minh.");
const withdrawal = await request("/customer/withdrawals", {
    method: "POST",
    token: seller,
    expected: [201],
    body: {
        payout_account_id: payoutAccount.id,
        amount: "100000",
        note: "Transactional E2E payout",
        idempotency_key: `e2e-payout-${crypto.randomUUID()}`,
    },
});
await request(`/withdrawals/${withdrawal.id}/approve`, { method: "POST", token: admin, body: {} });
await request(`/withdrawals/${withdrawal.id}/paid`, {
    method: "POST",
    token: admin,
    body: { payment_reference: `E2E-PAYOUT-${withdrawal.id}` },
});
const payoutOverviewAfter = await request("/customer/payouts", { token: seller });
const paidWithdrawal = payoutOverviewAfter.withdrawals?.data?.find((item) => item.id === withdrawal.id);
if (paidWithdrawal?.status !== "paid") throw new Error("Payout mutation did not reach paid state.");
console.log("PASS payout reserve + approve + paid mutation");

await request(`/transactions/${sale.id}/documents/ensure`, { method: "POST", token: admin, body: {} });
const documents = await request(`/customer/transactions/${sale.id}/documents`, { token: buyer });
if (!Array.isArray(documents) || documents.length === 0) throw new Error("Document generation did not produce records.");
console.log("PASS document generation mutation");
console.log("Transactional API E2E PASS");
