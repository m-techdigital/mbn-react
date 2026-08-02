import api, { unwrap } from './api';
import { readFromConfiguredSource, isMockMode } from './dataMode';
import { mockProducts, mockNotification, mockServices, mockTopics, mockTransactions, mockWalletTransactions } from '../data/mockData';
import { invalidateQueries } from './queryClient';

const normalizeParams = (params = {}) => {
  const normalized = { ...params };
  if (normalized.perPage != null && normalized.per_page == null) normalized.per_page = normalized.perPage;
  delete normalized.perPage;
  return normalized;
};
const createIdempotencyKey = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};
const list = (resource, params = {}) => api.get(resource, { params: normalizeParams(params) }).then(unwrap);
const show = (resource, id) => api.get(`${resource}/${id}`).then(unwrap);
const invalidateAfter = (promise, prefixes = []) => promise.then((result) => {
  prefixes.forEach((prefix) => invalidateQueries(prefix));
  return result;
});

const page = (items, params = {}) => {
  const perPage = Number(params.per_page || params.perPage || 24); const current = Number(params.page || 1);
  const filtered = items.filter(item => !params.keyword || `${item.code} ${item.title} ${item.description}`.toLowerCase().includes(String(params.keyword).toLowerCase()));
  return { data: filtered.slice((current - 1) * perPage, current * perPage), meta: { total: filtered.length, current_page: current, per_page: perPage } };
};

export const authRepository = {
  login: (payload) => api.post('/auth/customer/login', {
    login: payload.login ?? payload.username ?? payload.email ?? '',
    password: payload.password,
    remember: Boolean(payload.remember),
  }).then(unwrap),
  verifyTwoFactor: (payload) => api.post('/auth/customer/two-factor/verify', payload).then(unwrap),
  register: (payload) => api.post('/auth/customer/register', payload).then(unwrap),
  refresh: () => api.post('/auth/customer/refresh', {}).then(unwrap),
  logout: () => api.post('/auth/customer/logout').then(unwrap),
  customer: () => api.get('/auth/customer/me').then(unwrap),
  forgotPassword: (payload) => api.post('/auth/customer/forgot-password', payload).then(unwrap),
  resetPassword: (payload) => api.post('/auth/customer/reset-password', payload).then(unwrap),
};

const byGameCode = (game_code) => ({
  list: (params = {}) => readFromConfiguredSource(
    () => list('/marketplace/products', { ...params, game_code }),
    () => page(mockProducts.filter(x => x.game_code === game_code || x.product?.product_type === game_code), params),
  ),
  show: (id) => readFromConfiguredSource(
    () => show('/marketplace/products', id),
    () => Promise.resolve(mockProducts.find(x => String(x.id) === String(id) || String(x.code) === String(id)) || null),
  ),
});

export const gameRepository = { ninjas: byGameCode('ninja_school'), avatars: byGameCode('avatar'), dragonBalls: byGameCode('dragon_ball') };


export const mediaRepository = {
  uploadImages: (files, onProgress) => {
    const form = new FormData();
    Array.from(files || []).forEach((file) => form.append('images[]', file));
    return api.post('/customer/media/images', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) return;
        onProgress(Math.round((event.loaded * 100) / event.total));
      },
    }).then(unwrap);
  },
};

export const productRepository = {
  mine: (params = {}) => list('/customer/products', params),
  create: (payload) => invalidateAfter(api.post('/customer/products', payload).then(unwrap), ['products', 'my-products']),
  update: (id, payload) => invalidateAfter(api.put(`/customer/products/${id}`, payload).then(unwrap), ['products', 'my-products', 'game-list', 'game-detail']),
};

export const transactionRepository = {
  list: (params) => readFromConfiguredSource(() => list('/customer/transactions', params), () => page(mockTransactions, params)),
  show: (id) => readFromConfiguredSource(() => show('/customer/transactions', id), () => Promise.resolve(mockTransactions.find(x => String(x.id) === String(id)) || null)),
  transact: (productId, payload = {}) => {
    const normalized = { ...payload, idempotency_key: payload.idempotency_key || createIdempotencyKey() };
    if (isMockMode()) return Promise.reject(new Error('Đang ở chế độ dữ liệu mẫu. Chuyển VITE_DATA_MODE=api để tạo giao dịch thật.'));
    return invalidateAfter(api.post(`/customer/products/${productId}/transact`, normalized).then(unwrap), ['purchases', 'purchase-detail', 'wallet-transactions', 'game-list', 'game-detail']);
  },
  action: (id, action) => invalidateAfter(api.post(`/customer/transactions/${id}/actions`, { action }).then(unwrap), ['purchases', 'purchase-detail', 'wallet-transactions']),
  paymentQr: (transactionId, paymentId) => api.get(`/customer/transactions/${transactionId}/payments/${paymentId}/qr`).then(unwrap),
  submitPayment: (transactionId, paymentId, payload) => invalidateAfter(api.post(`/customer/transactions/${transactionId}/payments/${paymentId}/submit`, payload).then(unwrap), ['purchases', 'purchase-detail', 'wallet-transactions']),
  openDispute: (id, payload) => invalidateAfter(api.post(`/customer/transactions/${id}/disputes`, payload).then(unwrap), ['purchases', 'purchase-detail', 'cases']),
};

export const purchaseRepository = {
  list: (params) => transactionRepository.list({ ...params, role: 'buyer' }), show: transactionRepository.show,
  create: ({ product_id, ...payload }) => transactionRepository.transact(product_id, payload),
};

export const contentRepository = {
  // Nội dung bài viết được phát hành cùng MBN. Chỉ chuyển sang API/CMS khi Backend có contract chính thức.
  topics: (params = {}) => readFromConfiguredSource(() => api.get('/content', { params: { ...params, type: 'topic' } }).then(unwrap), () => Promise.resolve(page(mockTopics, params))),
  topic: (slug) => readFromConfiguredSource(() => api.get(`/content/slug/${slug}`).then(unwrap), () => Promise.resolve(mockTopics.find((item) => item.slug === slug) || null)),
  notification: () => Promise.resolve(mockNotification),
};



export const documentRepository = {
  mine: () => api.get('/customer/documents').then(unwrap),
  transaction: (transactionId) => api.get(`/customer/transactions/${transactionId}/documents`).then(unwrap),
  preview: (id) => api.get(`/customer/documents/${id}/preview`).then(unwrap),
  accept: (id, payload) => invalidateAfter(api.post(`/customer/documents/${id}/accept`, payload).then(unwrap), ['documents', 'purchase-detail']),
  download: (id) => api.get(`/customer/documents/${id}/download`, { responseType: 'blob' }).then((response) => response.data),
};

export const notificationRepository = {
  list: (params = {}) => api.get('/customer/notifications', { params }).then(unwrap),
  read: (id) => invalidateAfter(api.post(`/customer/notifications/${id}/read`).then(unwrap), ['notifications']),
  readAll: () => invalidateAfter(api.post('/customer/notifications/read-all').then(unwrap), ['notifications']),
};

export const walletRepository = {
  transactions: (params = {}) => readFromConfiguredSource(
    () => api.get('/customer/wallet/transactions', { params }).then(unwrap).then((payload) => ({ data: payload?.transactions?.data || [], meta: payload?.transactions || {}, wallet: payload?.wallet })),
    () => Promise.resolve(page(mockWalletTransactions, params)),
  ),
  deposits: (params = {}) => api.get('/customer/wallet/deposits', { params }).then(unwrap),
  bankTopup: (payload) => invalidateAfter(api.post('/customer/wallet/deposit/bank', payload).then(unwrap), ['wallet-transactions', 'deposit', 'deposits']),
  deposit: (id) => api.get(`/customer/wallet/deposits/${id}`).then(unwrap),
  submitDepositProof: (id, file, payload = {}) => { const form = new FormData(); form.append('proof', file); Object.entries(payload).forEach(([key,value]) => value != null && form.append(key, value)); return invalidateAfter(api.post(`/customer/wallet/deposits/${id}/proof`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap), ['deposit', 'deposits']); },
};

export const profileRepository = {
  updateAvatar: (file, onProgress) => { const form = new FormData(); form.append('avatar', file); return api.post('/customer/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: (event) => { if (event.total && onProgress) onProgress(Math.round((event.loaded * 100) / event.total)); } }).then(unwrap); },
  update: (payload) => api.put('/customer/profile', payload).then(unwrap),
  requestEmailChange: (payload) => api.post('/customer/profile/email-change', payload).then(unwrap),
  verifyEmail: (payload) => api.post('/auth/customer/verify-email', payload).then(unwrap),
  changePassword: (payload) => api.put('/customer/profile/password', payload).then(unwrap),
};

const unavailableService = (label) => Promise.reject(new Error(`${label} chưa được Backend hỗ trợ. Vui lòng quay lại sau.`));
export const serviceRepository = {
  carrots: () => isMockMode() ? Promise.resolve({ data: mockServices.carrots }) : unavailableService('Dịch vụ Carrot'),
  carrot: (id) => isMockMode() ? Promise.resolve(mockServices.carrots.find(x => String(x.id) === String(id))) : unavailableService('Dịch vụ Carrot'),
  ninjaCoins: () => isMockMode() ? Promise.resolve({ data: mockServices.ninjaCoins }) : unavailableService('Dịch vụ xu Ninja'),
  ninjaCoin: (id) => isMockMode() ? Promise.resolve(mockServices.ninjaCoins.find(x => String(x.id) === String(id))) : unavailableService('Dịch vụ xu Ninja'),
  ninjaCoinPrices: () => isMockMode() ? Promise.resolve(mockServices.ninjaCoins) : unavailableService('Bảng giá xu Ninja'),
};

export const payoutRepository = {
  overview: () => api.get('/customer/payouts').then(unwrap),
  submitVerification: (payload) => { const form = new FormData(); Object.entries(payload).forEach(([key,value]) => value != null && value !== '' && form.append(key,value)); return api.post('/customer/seller-verification', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap); },
  addAccount: (payload) => api.post('/customer/payout-accounts', payload).then(unwrap),
  withdraw: (payload) => invalidateAfter(api.post('/customer/withdrawals', payload).then(unwrap), ['payout', 'wallet-transactions']),
};


export const marketplaceOperationsRepository = {
  cases: (params = {}) => api.get('/customer/cases', { params }).then(unwrap),
  caseDetail: (caseId) => api.get(`/customer/cases/${caseId}`).then(unwrap),
  openCase: (transactionId, payload) => api.post(`/customer/transactions/${transactionId}/cases`, payload).then(unwrap),
  message: (caseId, payload) => api.post(`/customer/cases/${caseId}/messages`, payload).then(unwrap),
  snapshots: (transactionId) => api.get(`/customer/transactions/${transactionId}/asset-snapshots`).then(unwrap),
  storeSnapshot: (transactionId, payload) => api.post(`/customer/transactions/${transactionId}/asset-snapshots`, payload).then(unwrap),
};


export const trustRepository = {
  favorites: (params = {}) => api.get('/customer/favorites', { params }).then(unwrap),
  favorite: (productId) => invalidateAfter(api.post(`/customer/favorites/${productId}`).then(unwrap), ['favorites', 'game-detail']),
  unfavorite: (productId) => invalidateAfter(api.delete(`/customer/favorites/${productId}`).then(unwrap), ['favorites', 'game-detail']),
  savedSearches: () => api.get('/customer/saved-searches').then(unwrap),
  saveSearch: (payload) => invalidateAfter(api.post('/customer/saved-searches', payload).then(unwrap), ['saved-searches']),
  deleteSearch: (id) => invalidateAfter(api.delete(`/customer/saved-searches/${id}`).then(unwrap), ['saved-searches']),
  reviews: (params = {}) => api.get('/customer/reviews', { params }).then(unwrap),
  review: (transactionId, payload) => invalidateAfter(api.post(`/customer/transactions/${transactionId}/reviews`, payload).then(unwrap), ['reviews', 'purchase-detail', 'game-detail']),
  productReviews: (productId, params = {}) => api.get(`/marketplace/products/${productId}/reviews`, { params }).then(unwrap),
  preferences: () => api.get('/customer/notification-preferences').then(unwrap),
  updatePreferences: (items) => invalidateAfter(api.put('/customer/notification-preferences', { items }).then(unwrap), ['notification-preferences']),
  sessions: () => api.get('/customer/sessions').then(unwrap),
  revokeSession: (id) => invalidateAfter(api.delete(`/customer/sessions/${id}`).then(unwrap), ['sessions']),
  twoFactorStatus: () => api.get('/customer/security/two-factor').then(unwrap),
  beginTwoFactorSetup: () => api.post('/customer/security/two-factor/setup').then(unwrap),
  confirmTwoFactor: (code) => api.post('/customer/security/two-factor/confirm', { code }).then(unwrap),
  regenerateRecoveryCodes: (code) => api.post('/customer/security/two-factor/recovery-codes', { code }).then(unwrap),
  disableTwoFactor: (payload) => api.delete('/customer/security/two-factor', { data: payload }).then(unwrap),
};
