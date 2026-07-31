import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'MuaBanNick.Pro';
const DEFAULT_DESCRIPTION = 'Mua, bán và thuê tài khoản trò chơi với quy trình giao dịch, tài liệu và thanh toán minh bạch.';

const ROUTE_META = [
  [/^\/$/, 'Chợ tài khoản trò chơi', DEFAULT_DESCRIPTION],
  [/^\/teamobi\/ninja-school/, 'Tài khoản Ninja School', 'Tìm tài khoản Ninja School đang bán hoặc cho thuê.'],
  [/^\/teamobi\/ngoc-rong/, 'Tài khoản Ngọc Rồng', 'Tìm tài khoản Ngọc Rồng đang bán hoặc cho thuê.'],
  [/^\/teamobi\/avatar/, 'Tài khoản Avatar', 'Tìm tài khoản Avatar đang bán hoặc cho thuê.'],
  [/^\/topics/, 'Bài đăng và thông báo', 'Tin tức, hướng dẫn và cập nhật từ MuaBanNick.Pro.'],
  [/^\/guides|^\/policies|^\/dieu-khoan-va-chinh-sach/, 'Hướng dẫn và chính sách', 'Hướng dẫn giao dịch, an toàn tài khoản và chính sách của MuaBanNick.Pro.'],
  [/^\/services/, 'Dịch vụ hỗ trợ giao dịch', 'Các dịch vụ hỗ trợ và quy trình giao dịch tại MuaBanNick.Pro.'],
  [/^\/account/, 'Khu vực tài khoản', 'Quản lý hồ sơ, giao dịch, ví và bảo mật tài khoản.'],
];

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
}

export default function RouteMetadata() {
  const location = useLocation();

  useEffect(() => {
    const [,, title = 'Không tìm thấy trang', description = DEFAULT_DESCRIPTION] =
      ROUTE_META.find(([pattern]) => pattern.test(location.pathname)) || [];
    const pageTitle = `${title} | ${SITE_NAME}`;
    const publicOrigin = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
    const canonical = new URL(location.pathname, publicOrigin).toString();
    const isPrivate = location.pathname.startsWith('/account') || location.pathname.includes('password');

    document.title = pageTitle;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: isPrivate ? 'noindex,nofollow' : 'index,follow' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertCanonical(canonical);
  }, [location.pathname]);

  return null;
}
