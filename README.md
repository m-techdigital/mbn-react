# MBN React

React 19 + Vite storefront migrated from the original Nuxt 2 `mbn-fe` and aligned with AXIRO mini customer/marketplace APIs.

## Data modes

Configure `.env`:

```env
# Khuyến nghị local: không khai báo VITE_API_URL để dùng proxy cùng origin.
VITE_API_PROXY_TARGET=http://127.0.0.1:8000

# Chỉ khai báo URL tuyệt đối khi deploy API khác origin.
# VITE_API_URL=https://api.example.com/api/v1
VITE_APP_NAME=MuaBanNick.Pro
VITE_DATA_MODE=mock
```

- `mock`: full UI/UX preview with local listings, topics, notifications, purchases, wallet history and demo customer. Write operations never fake success.
- `auto`: read from the real API first and fall back to mock data only when a read request fails.
- `api`: use the real AXIRO mini API only; errors are shown normally.

Use `mock` while reviewing UI, `auto` during integration, and `api` for verification/deployment.

## Run

```bash
cp -n .env.example .env
npm ci
npm run check:route-meta
npm run lint
npm run build
npm run dev -- --host 127.0.0.1 --port 5174
```

Yarn alternative:

```bash
yarn install
yarn check:route-meta
yarn lint
yarn build
yarn dev --host 127.0.0.1 --port 5174
```

Do not mix npm and Yarn lockfiles in the same repository workflow.

## Canonical modules

- Customer authentication and profile
- Khu mua bán listings: sale and rental
- Ninja School, Dragon Ball and Avatar catalogs
- Purchase/rental transaction history
- Wallet history and bank top-up route
- Bài viết, guides, announcements and policies
- Service routes

All red-theme raster assets were replaced with purple variants. The storefront uses one purple-black theme only.

## Tài khoản kiểm thử Marketplace

Khi Backend đã chạy `migrate:fresh --seed`, hộp thoại đăng nhập hiển thị các tài khoản kiểm thử nhanh: `customer`, `seller`, `renter`, `lessor`, `dispute`. Mật khẩu chung: `change-me`.

## Cập nhật v32

- Ngừng gọi các endpoint nội dung chưa tồn tại.
- Chuẩn hóa tham số `per_page` cho Marketplace API.
- Che thông báo lỗi kỹ thuật khỏi người dùng.
- Cân lại bộ lọc và hộp thoại xác thực.

## Base-first UI policy

Frontend sử dụng chính sách **base-first**: page/feature chỉ ghép các owner trong `src/components/base`, không tự dựng lại form, table, modal, drawer, notice, loading hoặc empty state khi đã có base tương ứng.

Tài liệu chi tiết: `BASE-FIRST-UI-ARCHITECTURE-v66.29-REPORT-20260801.md`.

Gate bắt buộc:

```bash
npm run check:base-first
```
