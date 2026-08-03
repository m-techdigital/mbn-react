import api, { unwrap } from "../api";
import { readFromConfiguredSource } from "../dataMode";
import { mockWalletTransactions } from "../../data/mockData";
import { invalidateAfter, page } from "./shared";
export const documentRepository = {
    mine: () => api.get("/customer/documents").then(unwrap),
    transaction: (transactionId) =>
        api
            .get(`/customer/transactions/${transactionId}/documents`)
            .then(unwrap),
    preview: (id) => api.get(`/customer/documents/${id}/preview`).then(unwrap),
    accept: (id, payload) =>
        invalidateAfter(
            api.post(`/customer/documents/${id}/accept`, payload).then(unwrap),
            ["documents", "purchase-detail"],
        ),
    download: (id) =>
        api
            .get(`/customer/documents/${id}/download`, { responseType: "blob" })
            .then((response) => response.data),
};

export const notificationRepository = {
    list: (params = {}) =>
        api.get("/customer/notifications", { params }).then(unwrap),
    read: (id) =>
        invalidateAfter(
            api.post(`/customer/notifications/${id}/read`).then(unwrap),
            ["notifications"],
        ),
    readAll: () =>
        invalidateAfter(
            api.post("/customer/notifications/read-all").then(unwrap),
            ["notifications"],
        ),
};

export const walletRepository = {
    transactions: (params = {}) =>
        readFromConfiguredSource(
            () =>
                api
                    .get("/customer/wallet/transactions", { params })
                    .then(unwrap)
                    .then((payload) => ({
                        data: payload?.transactions?.data || [],
                        meta: payload?.transactions || {},
                        wallet: payload?.wallet,
                    })),
            () => Promise.resolve(page(mockWalletTransactions, params)),
        ),
    deposits: (params = {}) =>
        api.get("/customer/wallet/deposits", { params }).then(unwrap),
    bankTopup: (payload) =>
        invalidateAfter(
            api.post("/customer/wallet/deposit/bank", payload).then(unwrap),
            ["wallet-transactions", "deposit", "deposits"],
        ),
    deposit: (id) => api.get(`/customer/wallet/deposits/${id}`).then(unwrap),
    submitDepositProof: (id, file, payload = {}) => {
        const form = new FormData();
        form.append("proof", file);
        Object.entries(payload).forEach(
            ([key, value]) => value != null && form.append(key, value),
        );
        return invalidateAfter(
            api
                .post(`/customer/wallet/deposits/${id}/proof`, form, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then(unwrap),
            ["deposit", "deposits"],
        );
    },
};

export const profileRepository = {
    updateAvatar: (file, onProgress) => {
        const form = new FormData();
        form.append("avatar", file);
        return api
            .post("/customer/profile/avatar", form, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (event) => {
                    if (event.total && onProgress)
                        onProgress(
                            Math.round((event.loaded * 100) / event.total),
                        );
                },
            })
            .then(unwrap);
    },
    update: (payload) => api.put("/customer/profile", payload).then(unwrap),
    requestEmailChange: (payload) =>
        api.post("/customer/profile/email-change", payload).then(unwrap),
    verifyEmail: (payload) =>
        api.post("/auth/customer/verify-email", payload).then(unwrap),
    changePassword: (payload) =>
        api.put("/customer/profile/password", payload).then(unwrap),
};

export const payoutRepository = {
    overview: () => api.get("/customer/payouts").then(unwrap),
    submitVerification: (payload) => {
        const form = new FormData();
        Object.entries(payload).forEach(
            ([key, value]) =>
                value != null && value !== "" && form.append(key, value),
        );
        return api
            .post("/customer/seller-verification", form, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(unwrap);
    },
    addAccount: (payload) =>
        api.post("/customer/payout-accounts", payload).then(unwrap),
    withdraw: (payload) =>
        invalidateAfter(
            api.post("/customer/withdrawals", payload).then(unwrap),
            ["payout", "wallet-transactions"],
        ),
    cancelWithdrawal: (id) =>
        invalidateAfter(
            api.post(`/customer/withdrawals/${id}/cancel`).then(unwrap),
            ["payout", "wallet-transactions"],
        ),
};

export const marketplaceOperationsRepository = {
    cases: (params = {}) => api.get("/customer/cases", { params }).then(unwrap),
    caseDetail: (caseId) => api.get(`/customer/cases/${caseId}`).then(unwrap),
    openCase: (transactionId, payload) =>
        api
            .post(`/customer/transactions/${transactionId}/cases`, payload)
            .then(unwrap),
    message: (caseId, payload) =>
        api.post(`/customer/cases/${caseId}/messages`, payload).then(unwrap),
    snapshots: (transactionId) =>
        api
            .get(`/customer/transactions/${transactionId}/asset-snapshots`)
            .then(unwrap),
    storeSnapshot: (transactionId, payload) =>
        api
            .post(
                `/customer/transactions/${transactionId}/asset-snapshots`,
                payload,
            )
            .then(unwrap),
};
