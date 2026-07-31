# Hook lint fix v16.1

- `useRemoteData` no longer passes a variable dependency array to `useCallback`.
- The latest loader is stored in a ref, while the callback uses a literal dependency list.
- Caller dependency values are serialized into a primitive effect key so reloads still occur when route/query inputs change.
- Stale request cancellation and minimum skeleton duration remain intact.
- `Trò chơiDetailPage` memoizes the fallback product object to keep `useMemo` dependencies stable.
