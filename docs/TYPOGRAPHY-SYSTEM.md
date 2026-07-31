# MBN React typography system

The React storefront keeps the original MBN use of Arial/Helvetica while defining a single canonical scale for visual consistency.

## Scale

- 9px: micro metadata and compact labels.
- 10px: eyebrow labels, status pills, table headings.
- 11px: compact controls, card metadata and secondary copy.
- 13px: default body text and important values.
- 14px: emphasized body text.
- 16px: page and modal headings.
- 18px: article section headings.
- 22px: large content headings only.

## Weight

- 400: supporting copy.
- 500: form values and normal emphasis.
- 600: navigation and medium emphasis.
- 700: buttons, labels and important values.
- 800: uppercase storefront headings and prices.

## Rendering

The app enables font kerning, antialiasing, grayscale smoothing and tabular numerals for prices and balances. Components should use the variables in `src/styles/tokens.css` rather than inventing new sizes.
