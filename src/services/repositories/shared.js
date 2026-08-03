import api, { unwrap } from "../api";
import { invalidateQueries } from "../queryClient";

export const normalizeParams = (params = {}) => {
    const normalized = { ...params };
    if (normalized.perPage != null && normalized.per_page == null) {
        normalized.per_page = normalized.perPage;
    }
    delete normalized.perPage;
    return normalized;
};

export const createIdempotencyKey = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const list = (resource, params = {}) =>
    api.get(resource, { params: normalizeParams(params) }).then(unwrap);

export const show = (resource, id) => api.get(`${resource}/${id}`).then(unwrap);

export const invalidateAfter = (promise, prefixes = []) =>
    promise.then((result) => {
        prefixes.forEach((prefix) => invalidateQueries(prefix));
        return result;
    });

export const page = (items, params = {}) => {
    const perPage = Number(params.per_page || params.perPage || 24);
    const current = Number(params.page || 1);
    const filtered = items.filter(
        (item) =>
            !params.keyword ||
            `${item.code} ${item.title} ${item.description}`
                .toLowerCase()
                .includes(String(params.keyword).toLowerCase()),
    );

    return {
        data: filtered.slice((current - 1) * perPage, current * perPage),
        meta: {
            total: filtered.length,
            current_page: current,
            per_page: perPage,
        },
    };
};
