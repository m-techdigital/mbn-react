# MBN React — Mobile-first audit v47

Ngày rà soát: 29/07/2026

## Phạm vi

Audit các route và base chính ở các mốc 390px, 430px, 768px, 980px và desktop:

- Trang chủ
- Danh sách tài khoản
- Chi tiết tài khoản
- Đăng nhập/đăng ký
- Thông báo
- Hồ sơ khách hàng
- Nạp tiền
- Giao dịch mua và thuê
- Chi tiết giao dịch
- Ví và biến động số dư
- Hồ sơ tài liệu
- Topics, hướng dẫn và chính sách
- Menu mobile và bottom navigation

## Nguyên nhân kiến trúc

Bản v46 vẫn có nhiều breakpoint từ các vòng cũ cùng tác động lên một component. Một số quy tắc dùng 520px, 620px, 640px, 720px, 768px, 820px, 900px, 960px và 980px nên cùng một màn hình có thể nhận nhiều layout khác nhau. v47 tạo một owner mobile cuối cùng, tập trung vào base và không chỉnh riêng từng route bằng selector rời rạc.

## Owner mới

- `src/styles/mobile-system-v47.css`: owner cuối cho mobile/tablet.
- `Header.jsx`: menu mobile dùng cùng nhóm chức năng với sidebar PC.
- `check:mobile-ui`: chặn thiếu breakpoint/base mobile và sai số cột bottom navigation.

## Quy chuẩn

- Mobile gutter: 8–12px.
- Header: 60px.
- Bottom navigation: 64px, đúng 4 cột.
- Control: 42px; chữ input 16px để tránh iOS tự phóng to.
- Page action: 28px.
- Page title: 17–18px.
- Panel padding: 11–12px.
- Table chuyển thành card dưới 980px.
- Modal chuyển bottom sheet dưới 768px.
- Form/filter một hoặc hai cột tùy chiều rộng, không tràn ngang.

## Thay đổi đáng chú ý

- Menu mobile có đầy đủ thông báo, hồ sơ, nạp tiền, tin đăng, giao dịch, tài liệu, biến động số dư, hướng dẫn, điều khoản và đăng xuất.
- Drawer có chiều cao `100dvh`, cuộn riêng và safe-area.
- Bottom navigation sửa từ 5 cột cho 4 liên kết thành đúng 4 cột.
- Table/card, definition grid, metric grid, filter, form, upload và document actions có layout mobile thống nhất.
- Chi tiết tài khoản, gallery, thumbnail, kỳ hạn thuê, gợi ý và dock mua được khóa kích thước mobile.
- Modal có body cuộn, footer hai nút và safe-area.
- Topics/chính sách dùng cỡ chữ và spacing đọc dài phù hợp mobile.

## Kiểm tra

- `check:mobile-ui`
- `check:route-meta`
- `check:vietnamese-ui`
- `check:base-ui`
- `check:base-layout`
- `check:ux-ui`
- `check:canonical-ui`
- `check:shared-pages`
- `check:motion-ui`
- CSS brace balance
- Relative import resolution

Do môi trường đóng gói thiếu một package trong registry nội bộ, lint/build trình duyệt cuối cần xác nhận tại máy local.
