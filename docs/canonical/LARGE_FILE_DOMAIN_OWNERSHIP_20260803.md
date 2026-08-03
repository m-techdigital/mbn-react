# Large-file domain ownership closure

The common, mobile and content style domains are now SCSS-owned while preserving the existing manifest and cascade order.

Converted groups:

- `styles/components/common-*.scss`
- `styles/mobile-*.scss`
- `styles/pages/content-*.scss`

`app.css` remains the canonical import manifest during staged migration. Ownership and maintainability checks read nested CSS/SCSS manifests recursively. Selector deletion requires component-usage evidence plus visual verification; string-only unused detection is not authoritative.
