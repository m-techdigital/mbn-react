# CSS DOMAIN OWNERSHIP CLOSURE — 2026-08-03

## Canonical decision

The former large CSS owners are import-only manifests:

- `mobile-responsive-foundation.css`
- `shared-page-architecture.css`
- `pages/content-editorial-pages.css`
- `components/common.css`

Their rules are split into semantic owners for shell/layout, filters, tables, reading/content, account/purchase, documents, catalog/detail, modal and responsive behavior. Import order preserves the previous cascade.

`check:css-domain-ownership` and the recursive maintainability guard prevent declarations from returning to the manifests or detached CSS owners.
