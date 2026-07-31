# MBN React - Base-First UI Architecture

## 1. Mục tiêu

Mọi tính năng mới phải ưu tiên tái sử dụng component base hiện có. Không tạo một phiên bản form, table, modal, notice, loading, empty state, panel hoặc mobile wrapper riêng trong page khi base đã đáp ứng cùng trách nhiệm.

Nguyên tắc:

```text
Feature/Page
→ ghép các component base
→ chỉ chứa logic nghiệp vụ và cấu hình hiển thị
→ không sở hữu lại cấu trúc UI dùng chung
```

## 2. Các owner canonical

| Trách nhiệm | Owner |
|---|---|
| Page shell và trạng thái page | `PageShell` |
| Section, stack, columns, metric, definition | `PageSection.jsx` |
| Form, grid, section, actions | `BaseForm.jsx` |
| Field label, hint, error | `FormField.jsx` |
| Input, select, textarea | `FormControls.jsx` |
| Password, money, choice, upload | Base control tương ứng |
| Table desktop/mobile | `ResponsiveDataTable.jsx` |
| Modal | `GamingModal.jsx` |
| Drawer | `BaseDrawer.jsx` |
| Loading/error/empty remote data | `AsyncContent.jsx` |
| Empty state | `EmptyState.jsx` |
| Notice/error/banner nội dung | `InlineNotice.jsx` |
| Primary table cell | `PrimaryTextCell` |
| Step heading | `StepHeading` |
| Surface panel | `SurfacePanel` |
| Record/list row | `RecordList`, `RecordListItem` |
| Modal footer explanation | `ModalFooterNote` |
| Image/media fallback | `MarketplaceImage`, `AsyncImage` |
| Action group | `ActionGroup` |
| Status | `StatusBadge` |

## 3. Phần đã refactor trong v66.29

- Chuyển các ô table tự dựng `table-primary-cell` sang `PrimaryTextCell`.
- Chuyển step title của nạp tiền sang `StepHeading`.
- Chuyển form panel bảo mật sang `SurfacePanel`.
- Chuyển alert riêng từng form sang `InlineNotice`.
- Chuyển footer note modal sang `ModalFooterNote`.
- Chuyển mobile navigation dialog sang `BaseDrawer`.
- Chuyển notification list sang `RecordList`, `RecordListItem`, `AsyncContent`, `EmptyState`.
- Nâng `InlineNotice` để quản lý thống nhất `title`, `description`, `action`, `supportCode`.
- Bổ sung stylesheet owner `base-primitives.css`.

## 4. Những pattern legacy bị cấm trong feature/page

```text
table-primary-cell
deposit-step-title
security-form-card
mbn-form-alert
empty-panel
```

Feature/page cũng không được tự dựng:

```text
<form>, <input>, <select>, <textarea>
<table>, <thead>, <tbody>, <th>, <td>
role="dialog"
```

Ngoại lệ chỉ nằm trong component base owner.

## 5. Quality gate

Lệnh:

```bash
npm run check:base-first
```

Gate sẽ fail khi page/feature:

- dựng native form/table ngoài owner;
- dựng modal/drawer riêng;
- dùng lại marker legacy;
- thiếu base primitive bắt buộc.

Gate này phải chạy cùng toàn bộ `check:*`, lint và build trước merge.

## 6. Quy trình phát triển component mới

1. Tìm trong `src/components/base` trước.
2. Nếu base đáp ứng 80% trở lên, mở rộng base bằng prop có contract rõ.
3. Nếu pattern xuất hiện từ lần thứ hai, tách về base ngay.
4. Không thêm CSS page để ghi đè cấu trúc bên trong base.
5. Page chỉ được đặt spacing ngoài, nội dung nghiệp vụ và cấu hình cột/field.
6. Bổ sung gate khi một lỗi kiến trúc có khả năng tái diễn.
7. Cập nhật tài liệu này khi thêm owner canonical mới.

## 7. Ngoại lệ hợp lệ

Một số thành phần có thiết kế riêng theo nghiệp vụ vẫn được giữ, ví dụ hero trang chủ hoặc asset gallery. Ngoại lệ chỉ hợp lệ khi:

- không trùng trách nhiệm với base;
- không tạo form/table/modal/remote-state owner thứ hai;
- có lý do nghiệp vụ và responsive contract rõ;
- được ghi trong tài liệu kiến trúc.

## 8. Kết quả kiểm tra

- `check:base-first`: pass.
- Toàn bộ `check:*`: pass.
- Raw native form/table trong feature/page: 0.
- Custom dialog ngoài `GamingModal`/`BaseDrawer`: 0.
- Marker legacy đã nêu: 0.
- Lint/build cần chạy trên máy tích hợp vì ZIP không chứa `node_modules`.
