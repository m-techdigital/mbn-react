import api, { unwrap } from "../api";
export const authRepository = {
    login: (payload) =>
        api
            .post("/auth/customer/login", {
                login: payload.login ?? payload.username ?? payload.email ?? "",
                password: payload.password,
                remember: Boolean(payload.remember),
            })
            .then(unwrap),
    verifyTwoFactor: (payload) =>
        api.post("/auth/customer/two-factor/verify", payload).then(unwrap),
    register: (payload) =>
        api.post("/auth/customer/register", payload).then(unwrap),
    refresh: () => api.post("/auth/customer/refresh", {}).then(unwrap),
    logout: () => api.post("/auth/customer/logout").then(unwrap),
    customer: () => api.get("/auth/customer/me").then(unwrap),
    forgotPassword: (payload) =>
        api.post("/auth/customer/forgot-password", payload).then(unwrap),
    resetPassword: (payload) =>
        api.post("/auth/customer/reset-password", payload).then(unwrap),
};
