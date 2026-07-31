# MBN React Điện thoại-first Notice & Lint v20

## Scope

- Reworked the automatic notice modal into a concise transaction-safety notice.
- Removed bank-account details from the global notice; payment details belong to a concrete order/payment flow.
- Added two-hour snooze handling and official safety/support actions.
- Converted modals to mobile bottom sheets below 640px.
- Added mobile purchase dock on account detail pages.
- Increased mobile typography and touch targets.
- Fixed React Hooks ESLint errors in `useRemoteData`.
- Fixed render-purity errors in `FullScreenLoader` and `DepositPage`.

## Điện thoại behavior

- Hộp thoại: bottom sheet, max 92dvh, scrollable body, sticky footer.
- Detail: fixed purchase dock above bottom navigation.
- Núts/touch controls: minimum 44px where practical.
- Catalog: one-column cards under 620px, stable price/action footer.
- Typography: 14px body baseline on mobile.

## Verification

- `npm run check:route-meta`: passed.
- CSS brace balance: passed.
- Invalid Ant Design icon scan: passed.
- Full ESLint/build could not run in the packaging environment because its internal npm registry returned 404 for `zod-validation-error@4.0.2`.
