# Hệ base UI/UX/Layout v42

## Mục tiêu
Một nguồn chuẩn cho khung trang, biểu mẫu, bộ lọc, bảng, hộp thoại, lựa chọn và breakpoint.

## Thành phần canonical
- PageShell: khung trang và heading.
- BaseForm / BaseFormGrid / BaseFormSection / BaseFormActions.
- FormField / BaseChoice / MoneyInput / PasswordField / ImageUploadField.
- BaseFilter / FilterField.
- ResponsiveDataTable.
- GamingModal.
- GamingButton / GamingLink.
- InlineNotice / EmptyState / StatusBadge / BasePagination.

## Quy tắc
- Không tự dựng page heading trong pages.
- Không dùng form/table/modal Ant Design cho nghiệp vụ storefront.
- Checkbox/radio dùng BaseChoice.
- Control cao 44px, label 14px, body 14–15px.
- Trang rộng 1160px, trang đọc 1040px, trang form hẹp 760px.
- Bảng chuyển thành thẻ dưới 960px.
- Modal chuyển bottom sheet dưới 720px.

## Kiểm tra
```bash
yarn run check:base-ui
yarn run check:base-layout
yarn run check:ux-ui
```
