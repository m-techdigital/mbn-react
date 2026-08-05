import api, { unwrap } from "../api";
import { readFromConfiguredSource, isMockMode } from "../dataMode";
import { mockProducts, mockTransactions } from "../../data/mockData";
import {
    createIdempotencyKey,
    invalidateAfter,
    list,
    page,
    show,
} from "./shared";
const byGameCode = (game_code) => ({
    list: (params = {}) =>
        readFromConfiguredSource(
            () => list("/marketplace/products", { ...params, game_code }),
            () =>
                page(
                    mockProducts.filter(
                        (x) =>
                            x.game_code === game_code ||
                            x.product?.product_type === game_code,
                    ),
                    params,
                ),
        ),
    show: (id) =>
        readFromConfiguredSource(
            () => show("/marketplace/products", id),
            () =>
                Promise.resolve(
                    mockProducts.find(
                        (x) =>
                            String(x.id) === String(id) ||
                            String(x.code) === String(id),
                    ) || null,
                ),
        ),
});

export const gameRepository = {
    ninjas: byGameCode("ninja_school"),
    avatars: byGameCode("avatar"),
    dragonBalls: byGameCode("dragon_ball"),
};

export const mediaRepository = {
    uploadImages: (files, onProgress) => {
        const form = new FormData();
        Array.from(files || []).forEach((file) =>
            form.append("images[]", file),
        );
        return api
            .post("/customer/media/images", form, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (event) => {
                    if (!event.total || !onProgress) return;
                    onProgress(Math.round((event.loaded * 100) / event.total));
                },
            })
            .then(unwrap);
    },
};

export const productRepository = {
    mine: (params = {}) => list("/customer/products", params),
    create: (payload) =>
        invalidateAfter(api.post("/customer/products", payload).then(unwrap), [
            "products",
            "my-products",
        ]),
    update: (id, payload) =>
        invalidateAfter(
            api.put(`/customer/products/${id}`, payload).then(unwrap),
            ["products", "my-products", "game-list", "game-detail"],
        ),
};

export const escrowBoxRepository = {
    list: (params = {}) => list("/customer/escrow-boxes", params),
    show: (id) => show("/customer/escrow-boxes", id),
    create: (payload) =>
        invalidateAfter(api.post("/customer/escrow-boxes", payload).then(unwrap), [
            "escrow-boxes",
        ]),
    preview: (token) =>
        api.get(`/customer/escrow-boxes/join/${token}`).then(unwrap),
    claim: (token) =>
        invalidateAfter(
            api.post(`/customer/escrow-boxes/join/${token}/claim`).then(unwrap),
            ["escrow-boxes"],
        ),
    updateTerms: (id, payload) =>
        invalidateAfter(
            api.put(`/customer/escrow-boxes/${id}/terms`, payload).then(unwrap),
            ["escrow-boxes", `escrow-box:${id}`],
        ),
    confirm: (id, expectedVersion) =>
        invalidateAfter(
            api
                .post(`/customer/escrow-boxes/${id}/confirm`, {
                    expected_version: expectedVersion,
                })
                .then(unwrap),
            ["escrow-boxes", `escrow-box:${id}`],
        ),
    cancel: (id, expectedVersion) =>
        invalidateAfter(
            api
                .post(`/customer/escrow-boxes/${id}/cancel`, {
                    expected_version: expectedVersion,
                })
                .then(unwrap),
            ["escrow-boxes", `escrow-box:${id}`],
        ),
    uploadMedia: (id, files, handoverStepId, onProgress) => {
        const form = new FormData();
        Array.from(files || []).forEach((file) => form.append("images[]", file));
        if (handoverStepId) form.append("handover_step_id", handoverStepId);
        return invalidateAfter(
            api
                .post(`/customer/escrow-boxes/${id}/media`, form, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (event) => {
                        if (event.total && onProgress)
                            onProgress(Math.round((event.loaded * 100) / event.total));
                    },
                })
                .then(unwrap),
            [`escrow-box:${id}`],
        );
    },
    submitHandover: (id, side, payload) =>
        invalidateAfter(
            api
                .post(`/customer/escrow-boxes/${id}/handover/${side}`, payload)
                .then(unwrap),
            [`escrow-box:${id}`],
        ),
    confirmReceipt: (id, expectedVersion) =>
        invalidateAfter(
            api
                .post(`/customer/escrow-boxes/${id}/confirm-receipt`, {
                    expected_version: expectedVersion,
                })
                .then(unwrap),
            [`escrow-box:${id}`, "wallet-transactions"],
        ),
    openDispute: (id, payload) =>
        invalidateAfter(
            api
                .post(`/customer/escrow-boxes/${id}/disputes`, payload)
                .then(unwrap),
            [`escrow-box:${id}`, "cases"],
        ),
};

export const transactionRepository = {
    list: (params) =>
        readFromConfiguredSource(
            () => list("/customer/transactions", params),
            () => page(mockTransactions, params),
        ),
    show: (id) =>
        readFromConfiguredSource(
            () => show("/customer/transactions", id),
            () =>
                Promise.resolve(
                    mockTransactions.find((x) => String(x.id) === String(id)) ||
                        null,
                ),
        ),
    transact: (productId, payload = {}) => {
        const normalized = {
            ...payload,
            idempotency_key: payload.idempotency_key || createIdempotencyKey(),
        };
        if (isMockMode())
            return Promise.reject(
                new Error(
                    "Đang ở chế độ dữ liệu mẫu. Chuyển VITE_DATA_MODE=api để tạo giao dịch thật.",
                ),
            );
        return invalidateAfter(
            api
                .post(`/customer/products/${productId}/transact`, normalized)
                .then(unwrap),
            [
                "purchases",
                "purchase-detail",
                "wallet-transactions",
                "game-list",
                "game-detail",
            ],
        );
    },
    action: (id, action, payload = {}) =>
        invalidateAfter(
            api
                .post(`/customer/transactions/${id}/actions`, { action, ...payload })
                .then(unwrap),
            ["purchases", "purchase-detail", "wallet-transactions"],
        ),
    paymentQr: (transactionId, paymentId) =>
        api
            .get(
                `/customer/transactions/${transactionId}/payments/${paymentId}/qr`,
            )
            .then(unwrap),
    submitPayment: (transactionId, paymentId, payload) =>
        invalidateAfter(
            api
                .post(
                    `/customer/transactions/${transactionId}/payments/${paymentId}/submit`,
                    payload,
                )
                .then(unwrap),
            ["purchases", "purchase-detail", "wallet-transactions"],
        ),
    openDispute: (id, payload) =>
        invalidateAfter(
            api
                .post(`/customer/transactions/${id}/disputes`, payload)
                .then(unwrap),
            ["purchases", "purchase-detail", "cases"],
        ),
};

export const purchaseRepository = {
    list: (params) => transactionRepository.list({ ...params, role: "buyer" }),
    show: transactionRepository.show,
    create: ({ product_id, ...payload }) =>
        transactionRepository.transact(product_id, payload),
};
