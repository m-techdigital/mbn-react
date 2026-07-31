# Purchase Detail Canonicalization v66.22

## Phạm vi

- Hồ sơ hợp đồng/biên bản hiển thị theo đúng giao dịch đang mở bằng danh sách đính kèm gọn, không dùng bảng rộng toàn cục.
- Bỏ khối `Các mốc đã xác nhận` vì trùng dữ liệu với tiến trình giao dịch.
- Đưa `Thao tác tiếp theo` lên cột phải, trước tiến trình, chỉ hiển thị action hợp lệ từ backend.
- Thanh toán được sắp theo: cần xử lý trước, sau đó kỳ/chu kỳ, ngày đến hạn, loại khoản và ID.
- Chia thành `Cần thanh toán` và `Đã xử lý`.
- Tạm bỏ form đánh giá khỏi trang chi tiết; component và API trust vẫn giữ để tái kích hoạt sau.
- Bổ sung `check:purchase-detail` và cập nhật các gate mobile/trust/table phù hợp presentation mới.

## Kiểm tra đã chạy

- Toàn bộ `scripts/check-*.mjs`: pass.
- `npm ci`, lint và build chưa thể chạy trong container vì registry nội bộ trả 404 cho `zod-validation-error@4.0.2`; cần chạy tại máy phát triển.
