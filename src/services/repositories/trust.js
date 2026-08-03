import api, { unwrap } from "../api";
import { invalidateAfter } from "./shared";
export const trustRepository = {
    favorites: (params = {}) =>
        api.get("/customer/favorites", { params }).then(unwrap),
    favorite: (productId) =>
        invalidateAfter(
            api.post(`/customer/favorites/${productId}`).then(unwrap),
            ["favorites", "game-detail"],
        ),
    unfavorite: (productId) =>
        invalidateAfter(
            api.delete(`/customer/favorites/${productId}`).then(unwrap),
            ["favorites", "game-detail"],
        ),
    savedSearches: () => api.get("/customer/saved-searches").then(unwrap),
    saveSearch: (payload) =>
        invalidateAfter(
            api.post("/customer/saved-searches", payload).then(unwrap),
            ["saved-searches"],
        ),
    deleteSearch: (id) =>
        invalidateAfter(
            api.delete(`/customer/saved-searches/${id}`).then(unwrap),
            ["saved-searches"],
        ),
    reviews: (params = {}) =>
        api.get("/customer/reviews", { params }).then(unwrap),
    review: (transactionId, payload) =>
        invalidateAfter(
            api
                .post(
                    `/customer/transactions/${transactionId}/reviews`,
                    payload,
                )
                .then(unwrap),
            ["reviews", "purchase-detail", "game-detail"],
        ),
    productReviews: (productId, params = {}) =>
        api
            .get(`/marketplace/products/${productId}/reviews`, { params })
            .then(unwrap),
    preferences: () =>
        api.get("/customer/notification-preferences").then(unwrap),
    updatePreferences: (items) =>
        invalidateAfter(
            api
                .put("/customer/notification-preferences", { items })
                .then(unwrap),
            ["notification-preferences"],
        ),
    sessions: () => api.get("/customer/sessions").then(unwrap),
    revokeSession: (id) =>
        invalidateAfter(api.delete(`/customer/sessions/${id}`).then(unwrap), [
            "sessions",
        ]),
    twoFactorStatus: () =>
        api.get("/customer/security/two-factor").then(unwrap),
    beginTwoFactorSetup: () =>
        api.post("/customer/security/two-factor/setup").then(unwrap),
    confirmTwoFactor: (code) =>
        api
            .post("/customer/security/two-factor/confirm", { code })
            .then(unwrap),
    regenerateRecoveryCodes: (code) =>
        api
            .post("/customer/security/two-factor/recovery-codes", { code })
            .then(unwrap),
    disableTwoFactor: (payload) =>
        api
            .delete("/customer/security/two-factor", { data: payload })
            .then(unwrap),
};
