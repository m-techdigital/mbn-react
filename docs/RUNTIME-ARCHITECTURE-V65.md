# Runtime Architecture v65

## Authentication
- Customer refresh token is stored only in the Backend-managed HttpOnly cookie.
- MBN keeps the short-lived access token in memory only.
- On page reload, AuthProvider restores the session by calling the cookie-backed refresh endpoint.
- Legacy access/refresh token keys are removed from localStorage during boot.

## Query state
- `queryClient.js` owns short-lived cache, stale time and in-flight request deduplication.
- `useRemoteData` remains the page-facing compatibility hook, now backed by the query owner.
- Query keys are explicit per resource to prevent cache collisions.

## Public metadata
- `RouteMetadata` owns title, description, canonical URL, Open Graph metadata and robots rules.
- `/account/*` and password routes are marked `noindex,nofollow`.
