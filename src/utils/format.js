export const formatMoney = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`;
export const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));
export const arrayData = (payload) => payload?.data || payload?.items || (Array.isArray(payload) ? payload : []);
export const metaData = (payload) => payload?.meta || payload?.pagination || {};
export const imageOf = (item) => item?.thumbnail || item?.image || item?.images?.[0]?.url || item?.images?.[0] || '/banner.jpg';
