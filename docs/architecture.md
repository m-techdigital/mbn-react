# Architecture
React + Vite storefront with AXIRO Mini marketplace contracts. Pages stay thin and delegate lifecycle-heavy behavior to canonical hooks, repository modules, base components and config/data owners.

Recent split boundaries:

- Product form behavior lives in `src/hooks/marketplace/useProductForm.js`.
- Purchase detail actions live in `src/hooks/marketplace/usePurchaseDetailActions.js`.
- Payout page behavior lives in `src/hooks/marketplace/usePayoutPage.js`.
- Large knowledge/topic content is split under `src/data/knowledge/*` and `src/data/topics/*` for lazy loading.

Do not add Vue compatibility layers, duplicate API clients, company/RBAC/HR/accounting/report scope or a separate Contract module for customer transaction journeys.
