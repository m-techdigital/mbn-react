import { useState } from "react";
import { transactionRepository } from "../../services/repositories";
import { supportMessage } from "../../utils/apiError";
import { showToast } from "../../utils/toast";

export function usePurchaseDetailActions(transaction, reload) {
    const [acting, setActing] = useState("");
    const [notice, setNotice] = useState("");
    const [bankPayment, setBankPayment] = useState(null);
    const [bankQr, setBankQr] = useState(null);
    const [bankReference, setBankReference] = useState("");

    const run = async (operation, key) => {
        setActing(key);
        setNotice("");
        try {
            await operation();
            showToast("success", "Đã cập nhật giao dịch.");
            await reload();
            return true;
        } catch (exception) {
            const text = supportMessage(exception, "Không thể thực hiện thao tác.");
            setNotice(text);
            showToast("error", text);
            return false;
        } finally {
            setActing("");
        }
    };

    const openBankPayment = async (payment) => {
        setActing(`qr-${payment.id}`);
        try {
            const data = await transactionRepository.paymentQr(transaction.id, payment.id);
            setBankPayment(payment);
            setBankQr(data);
            setBankReference("");
        } catch (exception) {
            showToast("error", supportMessage(exception, "Không thể tạo mã QR thanh toán."));
        } finally {
            setActing("");
        }
    };

    const confirmBankPayment = async () => {
        if (!bankPayment) return;
        setActing(`bank-${bankPayment.id}`);
        try {
            await transactionRepository.submitPayment(transaction.id, bankPayment.id, {
                payment_method: "bank",
                reference: bankReference || bankQr?.transfer_content,
            });
            showToast("success", "Đã gửi thông tin chuyển khoản để đối soát.");
            closeBankPayment();
            await reload();
            return true;
        } catch (exception) {
            showToast("error", supportMessage(exception, "Không thể gửi thông tin chuyển khoản."));
        } finally {
            setActing("");
        }
    };

    const closeBankPayment = () => {
        setBankPayment(null);
        setBankQr(null);
        setBankReference("");
    };

    return {
        acting,
        notice,
        bankPayment,
        bankQr,
        bankReference,
        setBankReference,
        run,
        openBankPayment,
        confirmBankPayment,
        closeBankPayment,
    };
}
