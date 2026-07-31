# MBN React — Integration Stability v33

## Phạm vi

- Sửa payload đăng nhập Customer: giao diện gửi `login` đúng contract Backend.
- Việt hóa lỗi đăng nhập và che thông tin kỹ thuật.
- Ẩn tài khoản kiểm thử khi chạy API thật.
- Sửa trạng thái active của menu máy tính, menu trượt và sidebar.
- Thu gọn bộ lọc, ảnh giới thiệu, card và menu trên điện thoại.
- Ẩn cụm nút nổi trên điện thoại để không che biểu mẫu.
- Đồng bộ mật khẩu tối thiểu 8 ký tự với Backend.

## Kiểm tra bắt buộc

```bash
yarn run check:route-meta
yarn run check:vietnamese-ui
yarn lint
yarn build
```
