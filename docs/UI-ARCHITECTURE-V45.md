# MBN UI Architecture v45

## Owners

- `PageShell`: page width, title, description, back/reload and page-level actions.
- `PageSection`: all repeated content panels.
- `PageStack` / `PageColumns`: vertical rhythm and multi-column page composition.
- `DefinitionGrid`: label/value data.
- `MetricGrid`: financial and operational summaries.
- `BaseFilter`: filter fields, result text and actions.
- `ResponsiveDataTable`: desktop table and mobile cards.
- `StatusBadge` + `utils/labels`: all enum labels and tones.

## Pages migrated in v45

- Customer profile
- Purchases list
- Purchase detail
- Wallet transactions
- Topics list/detail
- Knowledge hub/policies
- Seller listings

## Rules

1. A page may not create a new panel shell when `PageSection` is sufficient.
2. Status and enum labels must come from `utils/labels.js`.
3. List data uses `ResponsiveDataTable` unless a card grid is the product experience itself.
4. Reading pages use `PageShell width="reading"`.
5. Operational pages use `PageShell width="wide"`.
