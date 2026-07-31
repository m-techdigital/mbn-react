# UI/UX Canonicalization v66.8

## Phạm vi
- Loại bỏ fallback dữ liệu mẫu ngầm trong API runtime.
- Chuyển tài khoản gợi ý ở trang chi tiết sang API marketplace thật.
- Bổ sung loading, error, retry và empty state cho khối gợi ý.
- Loại ảnh trùng, không tạo ba ảnh fallback giả.
- Reset slider và kỳ hạn thuê khi đổi listing.
- Chặn giao dịch thuê/trả góp khi cấu hình nghiệp vụ không hợp lệ.
- Điều hướng tới chi tiết giao dịch ngay sau khi tạo thành công.
- Việt hóa trang sắp ra mắt và không quảng bá capability chưa hỗ trợ.
- Dịch vụ chưa có API chỉ hoạt động khi chủ động bật mock mode; API mode trả lỗi rõ ràng.
- Bổ sung bảo vệ responsive cho modal mua/thuê, action và thông tin chi tiết.

## Quality gates đã chạy
Toàn bộ 24 script check:* hiện có đã pass, gồm route, Vietnamese UI, base UI, UX, layout, canonical ownership, mobile, API contract, table scroll, marketplace, trust, two-factor, runtime và system v66.

## Giới hạn môi trường đóng gói
npm ci không hoàn tất vì registry nội bộ trả 404 cho zod-validation-error. Vì vậy lint/build cần chạy tại máy dự án theo package-lock hiện có.
