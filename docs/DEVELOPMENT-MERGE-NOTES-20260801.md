# Development Merge Notes - mbn-react - 2026-08-01

## Scope reviewed

This review covers the current development updates for customer account presentation, purchase detail canonicalization, support pages, mobile table behavior, base-first UI primitives, runtime/system contracts, navigation, and customer transaction experience.

## Verification

- `npm run lint`
- `npm run build`
- `npm run check:architecture-contract`
- `npm run check:ui-contract`
- `npm run check:interaction-contract`
- `npm run check:runtime-contract`
- `npm run check:system-contract`
- `npm run check:purchase-detail`
- `npm run check:customer-experience`
- `npm run check:customer-transaction-experience`
- `npm run check:customer-account-presentation`
- `npm run check:customer-tables`
- `npm run check:base-first`

All commands completed successfully.

## Known warnings

- ESLint reports one non-blocking `react-hooks/exhaustive-deps` warning in `src/pages/SupportCaseDetailPage.jsx`.
- Vite build reports a Node deprecation warning for `module.register()`. Build output is still successful.

## Development merge decision

Approved for development merge. The UI, runtime, interaction, purchase detail, customer experience, account presentation, table, and base-first contracts all pass.

## Release blockers

- `npm audit --audit-level=high` reports 9 vulnerabilities, including high severity advisories in `axios`, `react-router`, `vite`, `postcss`, `form-data`, `immutable`, and transitive packages.
- This merge is not production-release clearance.
- Before release hardening, upgrade affected npm dependencies and rerun audit, lint, build, and all contract checks.
