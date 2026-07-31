# MBN React UI/UX Reconcile v12

## Mục tiêu

Vòng v12 tiếp tục đối chiếu trực tiếp giao diện React với cấu trúc, style phân tán và ảnh thực tế của repo Nuxt `mbn-fe`.

## Thay đổi chính

- Chuẩn hóa lại tỷ lệ shell desktop theo source gốc: header 137px, sidebar 224px, content 1120px.
- Cân lại header hai tầng, logo, account pill và tab điều hướng.
- Tăng độ rõ của sidebar, khoảng cách profile/menu và trạng thái hover.
- Thay filter Ant Design bằng form storefront custom để tránh input/select/button không đồng bộ.
- Đồng bộ control height 34px, label addon, search/reset và responsive filter.
- Cân lại account card, tỷ lệ ảnh, metadata, price box và CTA.
- Cân lại detail gallery 420px, info panel, action grid và suggested slider.
- Sửa modal footer để note, Hủy và Thanh toán không co hoặc xuống dòng sai.
- Cân lại modal header/body/table/QR/payment method theo ảnh thực tế.
- Chuẩn hóa profile width và table density.
- Rà lại typography theo từng vùng, không dùng một kích thước chung quá nhỏ.

## Kiểm tra

- Route contract: pass.
- Invalid Ant icon scan: pass.
- Basic JSX delimiter scan: pass.
- `npm ci` không hoàn tất trong container do internal registry trả 404 cho `zod-validation-error@4.0.2`; cần chạy lint/build trên máy local.
