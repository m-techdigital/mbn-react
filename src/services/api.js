import axios from 'axios';
import { getUserFacingError } from '../utils/userFacingError';
import contract from '../contracts/marketplace-contract.json';

const LEGACY_ACCESS_KEY = 'mbn_customer_access_token';
const LEGACY_REFRESH_KEY = 'mbn_customer_refresh_token';
let accessToken = null;
let refreshPromise = null;

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
const commonHeaders = {
  Accept: 'application/json',
  'X-Client-App': 'mbn-react',
  'X-Marketplace-Contract-Version': contract.contract_version,
};

const api = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
  headers: commonHeaders,
});

const clearLegacyTokens = () => {
  try {
    window.localStorage.removeItem(LEGACY_ACCESS_KEY);
    window.localStorage.removeItem(LEGACY_REFRESH_KEY);
  } catch {
    // Storage can be unavailable in hardened/private browser contexts.
  }
};

clearLegacyTokens();

export const tokenStore = {
  access: () => accessToken,
  set: ({ access_token } = {}) => { accessToken = access_token || null; },
  clear: () => { accessToken = null; clearLegacyTokens(); },
};

api.interceptors.request.use((config) => {
  const token = tokenStore.access();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios.post(
      `${baseURL}/auth/customer/refresh`,
      {},
      { withCredentials: true, headers: commonHeaders, timeout: 20000 },
    ).then((response) => {
      const payload = response?.data?.data ?? response?.data;
      tokenStore.set(payload);
      if (!payload?.access_token) throw new Error('Không nhận được access token mới.');
      return payload;
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isCustomerAuth = original?.url?.includes('/auth/customer/');

    if (error.response?.status === 401 && !original?._retried && !isCustomerAuth) {
      original._retried = true;
      try {
        const payload = await refreshAccessToken();
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${payload.access_token}`;
        return api(original);
      } catch (refreshError) {
        tokenStore.clear();
        window.dispatchEvent(new CustomEvent('mbn:unauthorized', { detail: { reason: 'refresh_failed', error: refreshError } }));
      }
    } else if (error.response?.status === 401 && !isCustomerAuth) {
      tokenStore.clear();
      window.dispatchEvent(new CustomEvent('mbn:unauthorized', { detail: { reason: 'retry_unauthorized' } }));
    }

    const payload = error.response?.data || {};
    error.validationErrors = payload.errors || {};
    error.userMessage = getUserFacingError(error);
    error.requestId = payload.meta?.request_id || error.response?.headers?.['x-request-id'];
    error.correlationId = payload.meta?.correlation_id || error.response?.headers?.['x-correlation-id'];
    return Promise.reject(error);
  },
);

export const unwrap = (response) => response?.data?.data ?? response?.data?.response ?? response?.data;
export default api;
