# Architecture & Experience v56

## Mục tiêu
Giảm rủi ro lệch menu/route, giảm kích thước bundle khởi động và tránh màn hình trắng khi một page lỗi render.

## Owner mới
- `src/config/navigation.js`: nguồn duy nhất cho điều hướng chính, tài khoản, hỗ trợ và bottom navigation.
- `src/components/system/RouteBoundary.jsx`: fallback tải route và màn hình phục hồi khi route lỗi.
- `src/styles/architecture-system-v56.css`: UX cho skip link và route boundary.

## Quy tắc
1. Không khai báo mảng menu riêng trong Header, sidebar hoặc bottom nav.
2. Page route phải lazy-load trừ layout/core boundary.
3. Route phải nằm trong `RouteBoundary` và `Suspense`.
4. Lỗi render không được lộ stack trace cho người dùng.
5. Navigation label/path chỉ sửa tại `src/config/navigation.js`.
