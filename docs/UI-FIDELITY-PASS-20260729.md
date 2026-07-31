# MBN React UI Fidelity Pass

## Goal
Preserve the AXIRO mini customer-auth and marketplace contracts while bringing the React storefront closer to the original Nuxt gaming experience.

## Updated
- Canonical purple-black announcement, header, navigation and customer balance control.
- Hero hierarchy and dual primary/help actions.
- Trò chơi category and service blocks with denser storefront proportions.
- Neon account cards with listing state, account code, metadata, discount/price and CTA.
- Catalog result toolbar, compact filters and centered pagination.
- Product detail gallery, sticky transaction panel, deposit line and purchase checklist.
- Máy tính/tablet/mobile responsive density.

## Preserved
- Customer authentication and refresh-token handling.
- AXIRO mini marketplace listing endpoints.
- Purchase/rental transaction creation.
- Existing public route URLs.
- Single purple-black theme; no theme switcher or secondary palette.

## Local validation
Run:

```bash
npm ci
npm run check:route-meta
npm run lint
npm run build
npm run dev -- --host 127.0.0.1 --port 5174
```
