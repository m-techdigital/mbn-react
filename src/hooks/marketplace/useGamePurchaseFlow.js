import { useCallback, useState } from "react";
import { transactionRepository } from "../../services/repositories";
import { showToast } from "../../utils/toast";
import { getUserFacingError } from "../../utils/userFacingError";

export function useGamePurchaseFlow({
    item,
    account,
    selectedRate,
    listingType,
    navigate,
}) {
    const [purchaseOpen, setPurchaseOpen] = useState(false);
    const [purchaseTab, setPurchaseTab] = useState("info");
    const [paymentMethod, setPaymentMethod] = useState("balance");
    const [showPolicy, setShowPolicy] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [instantQr, setInstantQr] = useState(null);
    const [instantTransactionId, setInstantTransactionId] = useState(null);

    const openLogin = useCallback(() => {
        setPurchaseOpen(false);
        window.dispatchEvent(
            new CustomEvent("mbn:open-auth", { detail: { mode: "login" } }),
        );
    }, []);

    const openTransaction = (tab) => {
        setPurchaseTab(tab);
        setShowPolicy(false);
        setPaymentMethod(tab === "qr" ? "bank" : "balance");
        setPurchaseOpen(true);
    };

    const transact = async () => {
        if (!account) {
            openLogin();
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                availability_version: item.availability_version,
                transaction_type: listingType,
                payment_method:
                    paymentMethod === "balance" ? "wallet" : paymentMethod,
            };

            if (!item?.id)
                throw new Error("Không xác định được sản phẩm cần giao dịch.");
            if (!["balance", "bank"].includes(paymentMethod))
                throw new Error("Phương thức thanh toán không hợp lệ.");

            if (listingType === "rental") {
                if (!selectedRate?.id)
                    throw new Error(
                        "Vui lòng chọn kỳ hạn thuê trước khi tiếp tục.",
                    );
                payload.rental_rate_id = selectedRate.id;
                payload.rental_period_unit =
                    selectedRate?.period_unit ||
                    item?.rental_period_unit ||
                    item?.rental_price_unit ||
                    "day";
                payload.rental_period_count = Number(
                    selectedRate?.period_count ||
                        item?.minimum_rental_period ||
                        1,
                );
                payload.rental_billing_mode =
                    item?.rental_billing_mode || "upfront";
                payload.rental_billing_cycle_unit =
                    item?.rental_billing_cycle_unit ||
                    payload.rental_period_unit;
                payload.rental_billing_cycle_count = Number(
                    item?.rental_billing_cycle_count || 1,
                );
                payload.rental_start_at = new Date().toISOString();
            } else {
                payload.purchase_mode =
                    purchaseTab === "installment"
                        ? "installment"
                        : purchaseTab === "deposit"
                          ? "deposit"
                          : "full";
                if (payload.purchase_mode === "installment") {
                    const minimumInitialPayment = Number(
                        item?.minimum_initial_payment,
                    );
                    if (
                        !Number.isFinite(minimumInitialPayment) ||
                        minimumInitialPayment <= 0
                    )
                        throw new Error(
                            "Sản phẩm chưa có cấu hình số tiền trả trước hợp lệ.",
                        );
                    payload.installment_count = Number(
                        item?.max_installment_count || 3,
                    );
                    payload.initial_payment_amount = minimumInitialPayment;
                    payload.installment_interval_unit =
                        item?.installment_interval_unit || "week";
                    payload.installment_interval_count = Number(
                        item?.installment_interval_count || 1,
                    );
                }
            }

            const transaction = await transactionRepository.transact(
                item.id,
                payload,
            );
            const transactionData =
                transaction?.transaction || transaction?.data || transaction;
            const transactionId = transactionData?.id;
            if (!transactionId)
                throw new Error(
                    "Máy chủ chưa trả về mã giao dịch. Vui lòng tải lại sản phẩm và thử lại.",
                );
            const payments = transactionData?.payments || [];
            const firstPendingPayment =
                payments.find((payment) =>
                    ["pending", "rejected", "overdue"].includes(payment.status),
                ) || payments[0];
            setPurchaseOpen(false);

            if (
                paymentMethod === "bank" &&
                transactionId &&
                firstPendingPayment?.id
            ) {
                const qr = await transactionRepository.paymentQr(
                    transactionId,
                    firstPendingPayment.id,
                );
                setInstantTransactionId(transactionId);
                setInstantQr({
                    ...qr,
                    payment: firstPendingPayment,
                    transaction: transactionData,
                });
                showToast("success", "Đã tạo giao dịch và mã QR thanh toán.");
            } else if (
                paymentMethod === "balance" &&
                transactionId &&
                firstPendingPayment?.id
            ) {
                try {
                    await transactionRepository.submitPayment(
                        transactionId,
                        firstPendingPayment.id,
                        {
                            payment_method: "wallet",
                            reference: `WALLET-${transactionData?.code || transactionId}-${firstPendingPayment.id}`,
                        },
                    );
                    showToast(
                        "success",
                        "Đã tạo giao dịch và thanh toán bằng số dư ví.",
                    );
                } catch (walletError) {
                    showToast(
                        "error",
                        getUserFacingError(
                            walletError,
                            "Đã tạo giao dịch nhưng chưa thể thanh toán bằng số dư ví. Vui lòng kiểm tra số dư hoặc chọn chuyển khoản.",
                        ),
                    );
                }
                navigate(`/account/purchases/${transactionId}`);
            } else {
                showToast(
                    "success",
                    "Đã tạo giao dịch. Hãy hoàn tất bước thanh toán.",
                );
                if (transactionId)
                    navigate(`/account/purchases/${transactionId}`);
                else navigate("/account/purchases");
            }
        } catch (requestError) {
            showToast(
                "error",
                getUserFacingError(
                    requestError,
                    "Chưa thể tạo giao dịch. Vui lòng thử lại.",
                ),
            );
        } finally {
            setSubmitting(false);
        }
    };

    return {
        purchaseOpen,
        purchaseTab,
        paymentMethod,
        showPolicy,
        submitting,
        instantQr,
        instantTransactionId,
        openLogin,
        openTransaction,
        transact,
        setPurchaseOpen,
        setPurchaseTab,
        setPaymentMethod,
        setShowPolicy,
        setInstantQr,
        setInstantTransactionId,
    };
}
