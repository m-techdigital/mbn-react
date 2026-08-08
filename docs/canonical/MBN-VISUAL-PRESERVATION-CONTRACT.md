# MBN Visual Preservation Contract

## Visual truth

The runtime UI/CSS baseline for this closure is `mbn-react-parent-ui-sync-20260807-clean(2).zip`.

Generic architecture work may reorganize non-rendering code, checks, documentation, or adapters only when it preserves the rendered UI exactly. CSS/SCSS, stylesheet import order, and render-critical shared table behavior are treated as visual contracts until browser visual regression approves a deliberate change.

## Rules

- Do not remove or consolidate CSS merely because declarations look duplicated. Cascade order is part of the visual contract.
- Do not change breakpoint values, spacing, typography, dimensions, sticky/fixed behavior, z-index, overflow, modal geometry, sidebar/drawer behavior, or table fixed-column presentation without browser evidence.
- Parent/Base architecture is a behavior/reference source, not a license to restyle the marketplace client.
- Marketplace presentation remains app-specific.
- `npm run check:visual-baseline-integrity` must pass before packaging.
