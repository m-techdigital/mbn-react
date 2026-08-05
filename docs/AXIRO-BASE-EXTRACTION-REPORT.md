# AXIRO Base Extraction Report

## Source
- Frontend: mylands-admin-report-top-goods-sqlite-final-FULL-20260729(1).zip
- Backend: mylands-api-report-top-goods-sqlite-final-FULL-20260729(1).zip

## Result
Two independent mini repositories were extracted while preserving the original React module layout and Laravel controller/request/model/service layout.

## Canonical dependency map
`Customer -> Product -> Transaction -> GeneratedDocument`

- Customer authenticates through the Mini customer guard.
- Product has sale/rental offer modes, availability and media.
- Transaction owns sale, rental, payment, dispute, payout and handover journeys.
- Generated documents derive from transaction snapshots; there is no standalone Contract customer module.

## Kept
- JWT login, refresh rotation, logout, current user.
- Shared JSON response envelope.
- CRUD service factory, API interceptor, auth provider.
- Shared list/detail/async/relation hooks.
- Products, Transactions, Generated Documents, Wallets, Payouts, Notifications, Escrow Box and customer profile.
- 401 refresh flow and 422 form error mapping.

## Removed
RBAC, roles, permissions, users CRUD, companies, departments, projects, opportunities, reservations, inventory quantity modules, accounting, commission, HR, reports, audit center, workflow automation, system operations and their routes/schema/runtime bindings.

## Final schema
- users
- refresh_tokens
- products
- transactions
- generated_documents / document_templates
- escrow_boxes and escrow handover/payment/media tables
- cache / jobs support tables

Money uses `decimal(18,2)`. Transaction totals are calculated by the Backend; MBN never trusts client-side totals.

## Lifecycle
- Product: draft, active, inactive
- Transaction: draft, pending, completed, cancelled
- Generated Document: draft, issued, accepted, superseded
- Escrow Box: draft, waiting_party, terms_review, admin_review, handover, completed, disputed, cancelled

## Integrity rules
- Product with transactions cannot be deleted.
- Transaction with issued documents, payments or lifecycle references cannot be blindly deleted.
- Document templates used by issued documents are versioned instead of mutated in place.
- Escrow Box terms are versioned and claim invites are one-time hashed tokens.
- Negative money and overpayment are rejected.

## Verification performed
- PHP syntax lint passed for all Backend application, migration, route and test files.
- Frontend route metadata check passed.
- Frontend/Backend source dependency scans were completed.

## Environment limitations
Older extraction notes about missing Composer/npm are obsolete. The current local source has Composer and npm dependencies available for the documented guards.

## Intentional limitations
Legacy extraction baseline was single administrator only. The current Mini baseline is one admin with many marketplace customers and includes bounded customer auth/profile, media upload, transaction documents and audit/history surfaces.

Still excluded: RBAC graph, company/department/project scope, HR/payroll, accounting posting, BI report runtime, CRM reservation/opportunity modules, parent inventory quantity modules and organization hierarchy.
