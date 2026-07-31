import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  HistoryOutlined,
  HomeFilled,
  LogoutOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';

export const PRIMARY_NAV_ITEMS = [
  { to: '/', icon: HomeFilled, label: 'Trang chủ', match: (path) => path === '/' },
  { to: '/games', action: 'game-catalog', icon: AppstoreOutlined, label: 'Tài khoản trò chơi', match: (path) => path.startsWith('/teamobi/') || path.startsWith('/garena/') || path.startsWith('/g4m/') },
  { to: '/support', icon: CustomerServiceOutlined, label: 'Hỗ trợ', match: (path) => path.startsWith('/support') || path.startsWith('/account/cases') },
  { to: '/topics', icon: BookOutlined, label: 'Bài đăng', match: (path) => path.startsWith('/topics') || path.startsWith('/events/') },
];

export const ACCOUNT_NAV_ITEMS = [
  { to: '/account/notifications', icon: BellOutlined, label: 'Thông báo của tôi' },
  { to: '/account/profile', icon: UserOutlined, label: 'Thông tin cá nhân' },
  { to: '/account/wallet/deposit/bank', icon: WalletOutlined, label: 'Nạp tiền ngân hàng' },
  { to: '/account/listings', icon: ShoppingCartOutlined, label: 'Tin đăng của tôi' },
  { to: '/account/purchases', icon: ShoppingCartOutlined, label: 'Giao dịch mua và thuê' },
  { to: '/account/documents', icon: FileTextOutlined, label: 'Hồ sơ tài liệu' },
  { to: '/account/wallet/transactions', icon: HistoryOutlined, label: 'Biến động số dư' },
  { to: '/account/payouts', icon: WalletOutlined, label: 'Xác minh và rút tiền' },
  { to: '/account/cases', icon: CustomerServiceOutlined, label: 'Trung tâm yêu cầu' },
  { to: '/account/trust', icon: SafetyCertificateOutlined, label: 'Tin đã lưu và bảo mật' },
];

export const SUPPORT_NAV_ITEMS = [
  { to: '/guides', icon: SafetyCertificateOutlined, label: 'Hướng dẫn và an toàn' },
  { to: '/dieu-khoan-va-chinh-sach', icon: SafetyCertificateOutlined, label: 'Điều khoản và chính sách' },
];

export const BOTTOM_NAV_ITEMS = [
  { to: '/', icon: HomeFilled, label: 'Trang chủ' },
  { to: '/teamobi/ninja-school', icon: ShoppingOutlined, label: 'Tài khoản' },
  { to: '/support', icon: CustomerServiceOutlined, label: 'Hỗ trợ' },
  { to: '/topics', icon: ReadOutlined, label: 'Bài đăng' },
];

export const LOGOUT_ICON = LogoutOutlined;

export function isPrimaryNavActive(item, path) {
  return item.match ? item.match(path) : (item.to === '/' ? path === '/' : path.startsWith(item.to));
}
