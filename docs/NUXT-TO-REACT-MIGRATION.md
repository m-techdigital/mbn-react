# Nuxt to React migration

## Architecture

The Nuxt repository used Nuxt 2, Vue 2, Vuetify, Vuex modules, repository injection, and file-system routing. The React repository uses React 19, React Router, Ant Design, Axios repositories, context for authentication, and reusable remote-data hooks.

## Canonical mapping

| Nuxt source | React destination |
|---|---|
| `layouts/clientBố cục.vue` | `src/components/layout/AppBố cục.jsx` |
| `AppBar.vue`, `MenuBottom.vue`, `SideBarMenu.vue` | `Header.jsx`, `BottomNav.jsx`, Ant Drawer |
| `store/home/users` | `context/AuthContext.jsx` + `authRepository` |
| `store/client/game/*` | `gameRepository` + `Trò chơiListPage`/`Trò chơiDetailPage` |
| `Tài khoảnIndex`, `Tài khoảnList`, `Tài khoảnThẻ nội dung` | `Trò chơiListPage`, `Tài khoảnThẻ nội dung` |
| `Tài khoảnShow` | `Trò chơiDetailPage` |
| `accountPurchases` | `purchaseRepository`, `PurchasesPage` |
| `walletTransactions` | `walletRepository`, `WalletTransactionsPage` |
| `topics` | `contentRepository`, `TopicPage` |

## API compatibility

Existing endpoint names are preserved: `/login`, `/register`, `/logout`, `/user`, `/ninjas`, `/avatars`, `/dragon-balls`, `/account-purchases`, `/account/transactions`, `/topics`, `/carrots`, `/ninja-coins`, and `/top-up/bank`.

## Deliberate changes

- Vuex query state is local page state and reusable hooks.
- Repository injection is replaced by explicit modules.
- Authentication token is handled centrally by Axios and AuthContext.
- Protected account routes use `ProtectedRoute`.
- UI is responsive and visually follows the single canonical dark-purple gaming theme across header, content, panels, cards, dialogs, forms, and mobile navigation.

## Remaining backend-dependent behavior

The exact request/response contracts of purchase, top-up, and registration depend on the deployed API. Errors remain visible and are not hidden with mock success responses. Static service pages keep their routes and can be connected to richer backend contracts later.
