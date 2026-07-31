# MBN React agent guide

- Keep routes compatible with the former Nuxt storefront.
- Put HTTP calls only in `src/services/repositories.js` or a domain service.
- Use `useRemoteData` for standard remote reads.
- Use `AuthContext` as the only authentication owner.
- Do not add Vue compatibility layers or duplicate API clients.
- Preserve the AXIRO mini conventions: one canonical service and one canonical state owner per concern.
- Never fake successful purchases or deposits when the API fails.
- Run route check, lint, and build before delivery.
