# V34 — tài khoản, quyền riêng tư và tải ảnh

- Khi chưa đăng nhập, nút tài khoản mở hộp đăng nhập; không bị vô hiệu hóa.
- Khi đã đăng nhập, nút tài khoản đi thẳng tới hồ sơ.
- Route bảo vệ tự mở hộp đăng nhập khi khách truy cập khi chưa xác thực.
- Nhật ký audit nội bộ không được trả về Customer API và không hiển thị trên MBN.
- MBN chỉ hiển thị tiến trình nghiệp vụ, các mốc xác nhận, thanh toán, tài liệu và tranh chấp liên quan trực tiếp đến khách hàng.
- Ảnh sản phẩm được tải lên API, lưu trên disk public và trả về URL canonical.
