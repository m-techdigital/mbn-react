# MBN kết nối AXIRO thật

## Chế độ mặc định

`VITE_DATA_MODE=api` là mặc định. Dữ liệu mẫu chỉ dùng khi chủ động chuyển sang `mock`.

## Luồng người bán

1. Khách hàng đăng nhập.
2. Mở **Tin đăng của tôi**.
3. Tạo tài khoản trò chơi và tin bán/cho thuê.
4. Tin chuyển sang **Chờ duyệt**.
5. Admin duyệt trên AXIRO Admin.
6. Tin xuất hiện ở sảnh MBN.

## Luồng người mua/thuê

1. Chọn tin đăng đã duyệt.
2. Chọn thanh toán đủ, đặt cọc hoặc trả góp (nếu tin cho phép).
3. API tạo giao dịch, giữ tin và sinh kế hoạch thanh toán.
4. Khách hàng gửi thông tin thanh toán.
5. Admin xác nhận khoản thanh toán.
6. Hai bên xác nhận bàn giao/hoàn trả/hoàn tất.
7. API tự tạo hợp đồng khi giao dịch đủ điều kiện.

## Nạp tiền

Yêu cầu nạp tiền luôn ở trạng thái chờ. Số dư chỉ tăng sau khi Admin xác nhận.

## Tranh chấp

Khách hàng có thể mở yêu cầu từ chi tiết giao dịch. Admin xem giao dịch, khoản thanh toán, nhật ký và đưa ra kết luận.
