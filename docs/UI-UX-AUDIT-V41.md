# MBN UI/UX audit v41

## Phạm vi

Rà soát toàn bộ route công khai và khu vực khách hàng, các trạng thái tải/rỗng/lỗi, biểu mẫu, bộ lọc, bảng, hộp thoại, phân trang, trạng thái nghiệp vụ và khả năng sử dụng bằng bàn phím.

## Chuẩn canonical

- `PageShell`: tiêu đề, mô tả, thao tác, tải lại, lỗi và loading.
- `BaseForm` / `FormField`: toàn bộ biểu mẫu.
- `BaseFilter`: bộ lọc và nhóm nút tìm/đặt lại.
- `ResponsiveDataTable`: bảng máy tính và thẻ trên màn hình hẹp.
- `GamingModal`: hộp thoại, khóa cuộn, Escape và giữ focus.
- `StatusBadge`: trạng thái nghiệp vụ tiếng Việt với màu semantic.
- `InlineNotice`: thông báo trong trang.
- `EmptyState`: trạng thái chưa có dữ liệu.
- `BasePagination`: phân trang đồng bộ với theme.

## Nội dung bổ sung

Trang danh sách tài khoản hiển thị ba cam kết cần thiết: tin được duyệt trước khi công khai, thanh toán/bàn giao có dấu vết và có cơ chế khiếu nại/tài liệu.

## Kiểm tra tự động

Chạy:

```bash
yarn run check:base-ui
yarn run check:ux-ui
```

`check:ux-ui` chặn việc tái đưa các thành phần Ant Design Form/Table/Modal/Alert/Empty/Pagination/message vào phần giao diện nghiệp vụ và chặn một số trạng thái tiếng Anh thường gặp.
