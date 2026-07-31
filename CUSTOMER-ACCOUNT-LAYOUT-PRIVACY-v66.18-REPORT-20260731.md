# Customer Account Layout & Privacy v66.18

## Phạm vi

- Cân lại account workspace và ví ở desktop/tablet/mobile.
- Ngăn sidebar làm tràn ngang ở viewport trung bình.
- Đưa PageShell trong account workspace về một khung cân đều hai cạnh.
- Rút gọn dữ liệu ví customer về thông tin cần thiết.
- Không hiển thị lifetime totals, internal reference, idempotency, metadata hoặc số dư trước trong lịch sử ví.
- Bổ sung `check:customer-visibility`.

## Customer-facing wallet contract

Hiển thị:
- số dư khả dụng;
- số tiền tạm giữ;
- tổng số dư;
- thời gian;
- loại nghiệp vụ;
- khoản khả dụng/tạm giữ;
- số tiền;
- số dư sau;
- trạng thái.

Không hiển thị trong ledger:
- lifetime credit/debit;
- idempotency key;
- customer id;
- external reference;
- raw metadata;
- available/held before;
- audit/admin fields.
