# Merge Notes - mbn-react - 2026-07-31

## Merge scope

This merge captures the current development updates for cookie-based customer session recovery, same-origin local API proxy behavior, customer profile/avatar validation, deposit proof validation, wallet visibility, form styling, and contract compatibility checks.

## Verification completed

- `npm run lint`
- `npm run build`
- `npm run check:customer-session`
- `npm run check:customer-visibility`
- `npm run check:validation-ui`
- `npm run check:contract-compatibility`
- `npm run check:system-v66`
- `npm run check:runtime-v65`

All commands completed successfully.

## Development acceptance

The code is acceptable to merge into the active development branch. New checks were added for customer session behavior, validation UI, visibility rules, container stability, and contract compatibility.

## Known follow-up items

- `npm audit --audit-level=high` reports high severity advisories in the frontend dependency tree, including `axios`, `react-router`, `vite`, and related transitive packages.
- This merge should not be treated as production-release clearance until dependency upgrades are completed and audit is rerun.
- Generated `dist/`, local env files, and `node_modules/` remain ignored and must not be committed.

## Merge decision

Proceed with development merge. Track dependency remediation separately before production release.
