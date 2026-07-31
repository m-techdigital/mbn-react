# MBN React Architectural UI Reconcile v44

## Kết luận audit

Bản v43 có base nhưng bốn vùng quan trọng vẫn bị nhiều lớp CSS lịch sử cùng sở hữu: notification header, PageShell actions, profile layout và BaseFilter. Nguyên nhân chính không nằm ở thiếu CSS mà ở component vẫn dùng class legacy, trong khi `index.css` import nhiều lớp integration từ các phiên trước.

## Cách xử lý

- Tạo `NotificationTrigger` với DOM và class riêng, không còn chịu selector generic `span` của notification cũ.
- Viết lại PageShell header bằng lưới đối xứng 32px / nội dung / 32px; page action nằm hàng riêng.
- Chuyển ProfilePage sang `mbn-profile-layout`, `mbn-profile-card`, `mbn-profile-security`; loại bỏ owner layout cũ và bổ sung tải lại hồ sơ.
- Viết lại BaseFilter thành panel compact, footer kết quả/action riêng; reset dùng secondary thay vì danger lớn.
- Thêm `canonical-v44.css` chỉ sở hữu các component v44 bằng namespace mới.
- Thêm `check:canonical-ui` để chặn component quay lại class legacy.

## Các yêu cầu được xử lý

- Nút quay lại/tải lại nhỏ, cân đối, giữ tiêu đề ở chính giữa.
- Trang hồ sơ có nút tải lại và bố cục cân top, không lồi lõm.
- Chuông thông báo nằm giữa vòng tròn; badge chỉ hiện khi unread_count > 0.
- Filter gọn, control 38px, action 34px, không còn hai nút to chi phối panel.
- Responsive: profile 2 cột desktop, 1 cột tablet/mobile; filter 6/4/3/2/1 cột tùy breakpoint.
- Không sửa API/backend trong phiên này.

## Kiểm tra

- `check:canonical-ui`: đạt.
- `check:route-meta`: đạt.
- `check:vietnamese-ui`: đạt.
- `check:base-ui`: đạt.
- `check:base-layout`: đạt.
- `check:ux-ui`: đạt.
- Chưa chạy ESLint/Vite build do gói không chứa node_modules.
