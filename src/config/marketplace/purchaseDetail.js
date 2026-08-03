import { formatMoney } from "../../utils/format.js";

export const purchaseActionLabels = {
    seller_handover: "Xác nhận đã bàn giao",
    buyer_receive: "Xác nhận đã nhận tài khoản",
    renter_return: "Gửi yêu cầu hoàn trả",
    lessor_receive_return: "Xác nhận đã nhận lại tài khoản",
    complete: "Xác nhận hoàn tất",
};

export const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString("vi-VN") : "—";

export const actionablePaymentStatuses = new Set([
    "pending",
    "rejected",
    "overdue",
]);

const paymentComponentOrder = {
    deposit: 10,
    initial_payment: 20,
    principal: 30,
    installment: 40,
    rental: 50,
    rental_cycle: 60,
    service_fee: 70,
    tax: 80,
};

const paymentTime = (payment) => {
    const value = payment.due_date || payment.period_start || payment.created_at;
    const timestamp = value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
    return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
};

export const comparePayments = (left, right) => {
    const leftActionable = actionablePaymentStatuses.has(left.status) ? 0 : 1;
    const rightActionable = actionablePaymentStatuses.has(right.status) ? 0 : 1;
    if (leftActionable !== rightActionable) return leftActionable - rightActionable;

    const leftSequence = Number(left.installment_number || left.cycle_number || 0);
    const rightSequence = Number(right.installment_number || right.cycle_number || 0);
    if (leftSequence !== rightSequence) return leftSequence - rightSequence;

    const dateDifference = paymentTime(left) - paymentTime(right);
    if (dateDifference !== 0) return dateDifference;

    const componentDifference =
        (paymentComponentOrder[left.component_type] || 999) -
        (paymentComponentOrder[right.component_type] || 999);
    if (componentDifference !== 0) return componentDifference;

    return Number(left.id || 0) - Number(right.id || 0);
};

export const buildPurchaseMetrics = (transaction) =>
    transaction
        ? [
              { label: "Tổng phải thanh toán", value: formatMoney(transaction.total_payable) },
              { label: "Phí nền tảng", value: formatMoney(transaction.service_fee || 0) },
              { label: "Đã thanh toán", value: formatMoney(transaction.paid_amount || 0), tone: "success" },
              { label: "Đang tạm giữ", value: formatMoney(transaction.escrow_amount || 0), tone: "warning" },
              { label: "Đã giải ngân", value: formatMoney(transaction.released_amount || 0), tone: "success" },
              { label: "Đã hoàn tiền", value: formatMoney(transaction.refunded_amount || 0) },
              ...(transaction.transaction_type === "rental"
                  ? [{
                        label: "Khấu trừ tiền cọc",
                        value: formatMoney(transaction.rental_deposit_deduction_amount || 0),
                        tone: Number(transaction.rental_deposit_deduction_amount || 0) > 0 ? "warning" : undefined,
                    }]
                  : []),
              { label: "Hạn kế tiếp", value: formatDateTime(transaction.next_payment_due_at) },
          ]
        : [];
