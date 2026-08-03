# AXIRO Mini - Operational Audit & Today Queue Closure

**Ngày:** 2026-08-03  
**Phạm vi:** một admin - nhiều khách hàng.

## Quyết định

- Notification có trạng thái `handled` riêng với read/unread.
- Action hoàn tất giao dịch hoặc giải quyết tranh chấp tự đóng notification liên quan.
- Payout, seller verification và payout account review phải ghi audit actor/time/reason.
- Dashboard Today gom payout chờ xử lý, giao dịch kẹt, tài liệu chờ xác nhận và notification chưa xử lý.
- Timeline vận hành dùng chung shape cho transaction, withdrawal và support case.
- Customer payout journey hiển thị rõ trạng thái đang chờ xác minh hoặc đang chờ chi trả.
- Customer style phải tách owner theo AXIRO cha:
    - `src/styles/app.css` chỉ là ordered import manifest.
    - Page-specific style mới đi vào `src/styles/pages/*`.
    - Payout và purchase next-action thuộc `src/styles/pages/payout.scss`, không nhồi thêm vào `app.css`.

## Không mở rộng

Không port RBAC, company/project/team, Accounting, Reports, generic workflow/SLA hoặc fraud engine.

## Repository ownership follow-up

- `src/services/repositories.js` is now a compatibility-only export barrel.
- HTTP ownership is split under `src/services/repositories/` into bounded domains: auth, marketplace, content/options, customer operations and trust.
- `scripts/check-repository-ownership.mjs` prevents HTTP calls from returning to the barrel and protects the `transaction_statuses` marketplace-options contract.
- Existing consumers continue importing from `src/services/repositories.js`; this is a source-compatible decomposition, not a second repository layer.

## Large-file ownership follow-up — 2026-08-03

- Large files are split only when a stable business owner exists; line count alone is not a reason to introduce another abstraction.
- `src/styles/app.css` is now an ordered import-only manifest instead of a 17k-line concatenated owner.
- The 31 source sections keep their previous cascade order and now live in explicit layout, component, page, typography, and versioned integration owners.
- `check:style-ownership` prevents declarations from being reintroduced into the manifest or canonical owners from disappearing.

## Large stylesheet ownership follow-up

The former large content, mobile and interaction owners are now ordered manifests. Their rules are split into semantic sub-owners while preserving the exact cascade order. New rules must be added to the narrowest semantic owner rather than back into a manifest.

## Large-file ownership follow-up — 2026-08-03

- `GameDetailPage` delegates checkout payload construction, transaction creation, instant QR state and login handoff to `useGamePurchaseFlow`.
- Product-gallery rendering is delegated to `components/marketplace/GameDetailGallery.jsx`; the detail page keeps route data, selected transaction mode and customer action orchestration.
- `styles/components/modals.css` is now an import-only manifest with semantic modal owners for foundation, admin information, authentication, purchase/payment and responsive refinements.
- CSS import order is preserved to keep the previous cascade contract.
- New content/mobile/interaction style owners are registered in the canonical style manifest and guarded by `check:style-ownership`.
