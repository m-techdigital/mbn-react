import api, { unwrap } from "../api";
import { readFromConfiguredSource, isMockMode } from "../dataMode";
import { mockNotification, mockServices } from "../../data/mockData";
import {
    MARKETPLACE_DISPUTE_OUTCOMES,
    MARKETPLACE_DOCUMENT_TYPES,
    MARKETPLACE_OPTIONS_CACHE_TTL_SECONDS,
    MARKETPLACE_OPTIONS_CONTRACT_VERSION,
    MARKETPLACE_TRANSACTION_STATUSES,
} from "../../generated/marketplaceOptions";
import { page } from "./shared";
export const contentRepository = {
    // Nội dung bài viết được phát hành cùng MBN. Chỉ chuyển sang API/CMS khi Backend có contract chính thức.
    topics: (params = {}) =>
        readFromConfiguredSource(
            () =>
                api
                    .get("/content", { params: { ...params, type: "topic" } })
                    .then(unwrap),
            async () => {
                const { loadDetailedTopics } = await import("../../data/topicContent.js");
                return page(await loadDetailedTopics(), params);
            },
        ),
    topic: (slug) =>
        readFromConfiguredSource(
            () => api.get(`/content/slug/${slug}`).then(unwrap),
            async () => {
                const { loadDetailedTopics } = await import("../../data/topicContent.js");
                const topics = await loadDetailedTopics();
                return topics.find((item) => item.slug === slug) || null;
            },
        ),
    notification: () => Promise.resolve(mockNotification),
};

const marketplaceOptionFallback = {
    document_types: MARKETPLACE_DOCUMENT_TYPES,
    dispute_outcomes: MARKETPLACE_DISPUTE_OUTCOMES,
    transaction_statuses: MARKETPLACE_TRANSACTION_STATUSES,
    contract_version: MARKETPLACE_OPTIONS_CONTRACT_VERSION,
    cache_ttl_seconds: MARKETPLACE_OPTIONS_CACHE_TTL_SECONDS,
};

let marketplaceOptionsCache = null;
let marketplaceOptionsExpiresAt = 0;

export const marketplaceOptionsRepository = {
    get: ({ force = false } = {}) => {
        if (
            !force &&
            marketplaceOptionsCache &&
            Date.now() < marketplaceOptionsExpiresAt
        ) {
            return Promise.resolve(marketplaceOptionsCache);
        }

        return api
            .get("/marketplace/options")
            .then((response) => {
                const payload = response?.data?.data ?? response?.data ?? {};
                const meta = response?.data?.meta ?? {};
                const serverContractVersion =
                    meta.contract_version ||
                    MARKETPLACE_OPTIONS_CONTRACT_VERSION;
                const ttl = Number(
                    meta.cache_ttl_seconds ||
                        MARKETPLACE_OPTIONS_CACHE_TTL_SECONDS,
                );
                const mismatch =
                    serverContractVersion !==
                    MARKETPLACE_OPTIONS_CONTRACT_VERSION;
                marketplaceOptionsCache = {
                    document_types: payload?.document_types?.length
                        ? payload.document_types
                        : marketplaceOptionFallback.document_types,
                    dispute_outcomes: payload?.dispute_outcomes?.length
                        ? payload.dispute_outcomes
                        : marketplaceOptionFallback.dispute_outcomes,
                    transaction_statuses: payload?.transaction_statuses?.length
                        ? payload.transaction_statuses
                        : marketplaceOptionFallback.transaction_statuses,
                    contract_version: serverContractVersion,
                    cache_ttl_seconds: ttl,
                };
                marketplaceOptionsExpiresAt =
                    Date.now() + (mismatch ? Math.min(ttl, 30) : ttl) * 1000;
                return marketplaceOptionsCache;
            })
            .catch(() => {
                marketplaceOptionsCache = marketplaceOptionFallback;
                marketplaceOptionsExpiresAt =
                    Date.now() + MARKETPLACE_OPTIONS_CACHE_TTL_SECONDS * 1000;
                return marketplaceOptionsCache;
            });
    },
    invalidate: () => {
        marketplaceOptionsCache = null;
        marketplaceOptionsExpiresAt = 0;
    },
};

const unavailableService = (label) =>
    Promise.reject(
        new Error(`${label} chưa được Backend hỗ trợ. Vui lòng quay lại sau.`),
    );
export const serviceRepository = {
    carrots: () =>
        isMockMode()
            ? Promise.resolve({ data: mockServices.carrots })
            : unavailableService("Dịch vụ Carrot"),
    carrot: (id) =>
        isMockMode()
            ? Promise.resolve(
                  mockServices.carrots.find((x) => String(x.id) === String(id)),
              )
            : unavailableService("Dịch vụ Carrot"),
    ninjaCoins: () =>
        isMockMode()
            ? Promise.resolve({ data: mockServices.ninjaCoins })
            : unavailableService("Dịch vụ xu Ninja"),
    ninjaCoin: (id) =>
        isMockMode()
            ? Promise.resolve(
                  mockServices.ninjaCoins.find(
                      (x) => String(x.id) === String(id),
                  ),
              )
            : unavailableService("Dịch vụ xu Ninja"),
    ninjaCoinPrices: () =>
        isMockMode()
            ? Promise.resolve(mockServices.ninjaCoins)
            : unavailableService("Bảng giá xu Ninja"),
};
