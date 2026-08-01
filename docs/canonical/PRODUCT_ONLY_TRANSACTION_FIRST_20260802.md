# Product-only / Transaction-first Notes - 2026-08-02

## Decision

The public MBN app uses Products directly. Listing pages and listing form pages are replaced by My Products and Product Form.

Offer modes are normalized to transaction types at the detail page boundary:

- `sell` / `sale` -> `sale`
- `rent` / `rental` -> `rental`

## Customer Surface

- Catalog and detail pages read products.
- Sellers manage products, offer modes and rental rates.
- Buyers/renters create transactions from products.
- Customer documents are shown as transaction documents.
- Support, wallet, payout, trust and account flows stay transaction/product oriented.

## Removed / Deprecated

- `ListingFormPage` and `MyListingsPage`.
- `/customer/listings` and `/marketplace/listings` client references.
- `listing_type` validation labels.
- Legacy seller-listing CSS source file that is no longer imported.

## Merge Notes

- Do not reintroduce listing routes or listing repositories.
- Keep user-facing text on "sản phẩm", "tài khoản" and "giao dịch" unless the text is editorial/legal guidance.
- Product-only checks must validate behavior, not freeze a single implementation string.
