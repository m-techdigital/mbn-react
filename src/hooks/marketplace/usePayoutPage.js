import { useEffect, useMemo, useState } from "react";
import { payoutRepository } from "../../services/repositories";
import { showToast } from "../../utils/toast";
import { getUserFacingError } from "../../utils/userFacingError";

const initialData = {
    wallet: {},
    verification: null,
    accounts: [],
    withdrawals: { data: [] },
};

export function usePayoutPage() {
    const [data, setData] = useState(initialData);
    const [busy, setBusy] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [verify, setVerify] = useState({
        document_type: "citizen_id",
        document_number: "",
        document_front: null,
        document_back: null,
        selfie: null,
    });
    const [account, setAccount] = useState({
        bank_code: "",
        bank_name: "",
        account_name: "",
        account_number: "",
        is_default: true,
    });
    const [withdraw, setWithdraw] = useState({
        payout_account_id: "",
        amount: "",
        note: "",
    });

    const load = async () => {
        setLoading(true);
        setLoadError("");
        try {
            setData(await payoutRepository.overview());
        } catch (error) {
            const message = getUserFacingError(error, "Không thể tải thông tin nhận tiền.");
            setLoadError(message);
            showToast("error", message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const verifiedAccounts = useMemo(
        () => data.accounts?.filter((item) => item.status === "verified") || [],
        [data.accounts],
    );

    const submit = async (type, operation, success = "Đã gửi yêu cầu.") => {
        setBusy(type);
        try {
            await operation();
            showToast("success", success);
            await load();
        } catch (error) {
            showToast("error", getUserFacingError(error, "Không thể gửi yêu cầu."));
        } finally {
            setBusy("");
        }
    };

    const verificationStatus = data.verification?.status || "unverified";
    const journey = data.journey || {};
    const canWithdraw =
        journey.can_withdraw ??
        (verificationStatus === "verified" && verifiedAccounts.length > 0);

    return {
        data,
        busy,
        loading,
        loadError,
        verify,
        setVerify,
        account,
        setAccount,
        withdraw,
        setWithdraw,
        load,
        submit,
        verifiedAccounts,
        verificationStatus,
        journey,
        canWithdraw,
    };
}
