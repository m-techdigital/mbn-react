# MBN React agent guide

- Keep routes compatible with the former Nuxt storefront.
- Put HTTP calls only in `src/services/repositories.js` or a domain service.
- Use `useRemoteData` for standard remote reads.
- Use `AuthContext` as the only authentication owner.
- Do not add Vue compatibility layers or duplicate API clients.
- Preserve the AXIRO mini conventions: one canonical service and one canonical state owner per concern.
- Never fake successful purchases or deposits when the API fails.
- Run route check, lint, and build before delivery.
- Apply the base-first UI policy: search `src/components/base` before creating UI markup.
- Feature/page code must not create a second owner for forms, tables, modals, drawers, notices, loading, empty states, panels, step headings, record lists, or common table cells.
- When a UI pattern is needed in two places, move it to a canonical base component instead of copying markup or CSS.
- Run `npm run check:base-first` together with all other `check:*` gates before delivery.
