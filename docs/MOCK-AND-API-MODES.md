# Mock and API modes

`VITE_DATA_MODE` controls the source of storefront data.

## mock

Provides deterministic local data for visual review:

- Published sale and rental listings
- Detail galleries
- Quản trị viên announcements
- Bài viết and guides
- Purchase/rental history
- Wallet transactions
- Demo customer session

Mutation requests such as creating a real transaction are deliberately blocked and return an explanatory message.

## auto

Read requests use AXIRO mini first and use local mock data only when the API is unavailable. Mutation requests always go to the real API.

## api

No fallback is allowed. Use this mode for integration tests and deployment verification.
