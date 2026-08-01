# Hợp đồng API MBN v32

## API thật

- `GET /api/v1/runtime`
- `GET /api/v1/marketplace/products`
- `GET /api/v1/marketplace/products/{code}`
- Nhóm `/api/v1/auth/customer/*`
- Nhóm `/api/v1/customer/*`

## Nội dung phát hành cùng giao diện

Các bài viết, hướng dẫn, thông báo công khai và gói dịch vụ minh họa hiện được đọc từ mã nguồn MBN. Giao diện không gọi các endpoint chưa được Backend công bố như `/topics`, `/notifications/public`, `/carrots` hoặc `/ninja-coins`.

Khi chuyển các nội dung này sang hệ quản trị nội dung, phải bổ sung contract Backend chính thức và kiểm thử trước khi thay nguồn dữ liệu.

## Quy tắc hiển thị lỗi

Giao diện không được hiển thị route, stack trace, SQLSTATE, exception hoặc nội dung kỹ thuật từ Backend. Người dùng chỉ thấy thông báo thân thiện và mã hỗ trợ nếu có.
