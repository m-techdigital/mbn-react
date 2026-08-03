# Baseline Acceptance - 2026-08-03

## Accepted Baseline

- Repository: `mbn-react`
- Commit: `b3222da`
- Marketplace contract baseline: `2026-08-03.1`
- Status: `ACCEPTED`

## Scope

MBN React remains a one-admin-many-customers marketplace storefront. It keeps customer product, sell/rent transaction, wallet, payout, document and profile flows in Mini scope.

Excluded parent domains remain RBAC, company, department, project, HR/payroll, accounting, BI reports, CRM reservations and generic workflow automation.

## Verification

Passed source/package gates:

- `npm run check:release-package`
- `npm run check:semantic-owners`
- `npm run check:ownership`
- `npm run check:base-first`
- `npm run check:api-contract`
- `npm run check:customer-transaction-experience`
- `npm run check:marketplace-closure`
- `npm run lint`
- `npm run build`

Browser core smoke exists but still requires `MBN_E2E_LOGIN` and `MBN_E2E_PASSWORD` to run against real test data.
