# MBN React UI/UX V13

## Scope

V13 continues the Nuxt-to-React visual reconciliation with focus on component rhythm rather than theme recoloring.

## Changes

- Canonical `GamingNút` supports `primary`, `secondary`, `contact`, `danger`, sizes, block mode and loading state.
- Payment modal actions now use the same button owner as detail and storefront actions.
- Hộp thoại body scrolls independently while header/footer remain stable.
- Bộ lọc controls use fixed-height, predictable desktop/tablet/mobile grids.
- Tài khoản cards have stable media/body/footer dimensions and CTA width.
- Detail gallery, info panel, action grid and recommendation rail use consistent surfaces and widths.
- Hồ sơ cá nhân and secondary-page data surfaces are opaque enough for legibility over the background image.
- Added shared surface, border, control height and shadow tokens.

## Verification

- Route contract passed.
- Invalid Ant Design icon scan passed.
- Basic JSX delimiter scan passed.
- Full dependency install/build must be run locally because the sandbox package registry is unavailable.
