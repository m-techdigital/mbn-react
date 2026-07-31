# Form Base Canonicalization v66.10

- Added canonical `BaseInput`, `BaseSelect`, and `BaseTextarea` controls.
- Migrated every feature-level native input/select/textarea to canonical controls.
- Retained native elements only inside base-component owners.
- Added `check:form-base` to block future feature forms from bypassing the base layer.
- Unified text, placeholder, option, disabled, readonly, focus, error, password, money, filter, modal, auth, seller, profile and deposit control colors through one token set.
- All 25 source-level quality gates pass, including the new form-base contract.
- `npm run lint` and `npm run build` require local dependencies; the delivery ZIP intentionally excludes `node_modules`.
