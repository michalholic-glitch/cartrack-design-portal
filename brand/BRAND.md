# Cartrack Brand Guidelines (reference)

This folder documents Cartrack's **marketing brand system** — the visual guidelines used for the Cartrack website and marketing collateral (brochures, ads, social, campaigns). It is derived from the Figma file *"Brand Visual Guidelines"* (fileKey `mnlqr5RcDM9Kftw0wyh8rA`), reviewed section by section on 2026-07-20.

## This is not the product design system

`tokens/tokens.json` and `components/` (see root `CLAUDE.md`) remain the **only** source of truth for the Fleet Portal product UI. Nothing in `brand/` should be referenced directly in component code or `.doc.json` token lists.

The two systems overlap on some values (primary orange, the Material icon base) and diverge deliberately on others (a dedicated brand-blue, Montserrat, pure black). Where that's known, each section below says so explicitly — treat anything not flagged as unconfirmed rather than assuming alignment.

**Why keep them separate:** the brand system is designed for marketing surfaces (open layout, high-contrast photography, campaign flexibility); the product system is designed for a dense, data-heavy operational UI (WCAG AA text contrast, MUI component constraints, white-label theming). Merging them by default would quietly import marketing-only decisions into the product, or vice versa.

## Structure

```
brand/
├── BRAND.md                         # This file — index and scope
├── logo/Logo.doc.json               # Lockups, clearspace, partner co-branding, correct/incorrect usage
├── colour/Colour.doc.json           # Palette, gradients, greys, ratio, usage, colour-in-type, combinations
├── typography/Typography.doc.json   # Montserrat + Roboto pairing, case, tracking, type scale, editorial rules
├── imagery/Imagery.doc.json         # Art direction: people, vehicles, platform, operations, editing rules
├── icons/Icons.doc.json             # Material UI Icons base, colour usage, fallback rules
├── graphic-design/GraphicDesign.doc.json  # Shape language, overlay treatments, logomark watermark, seasonal badges
├── collaterals/Collaterals.doc.json # Catalogue of applied examples (brochures, digital ads, social)
├── grid-layouts/GridLayouts.doc.json      # PENDING — see status field, wrong Figma node supplied
└── video/Video.doc.json             # PENDING — not yet reviewed in detail, thumbnails only
```

Each `<Section>.doc.json` uses a schema adapted from the component `.doc.json` pattern (`rules`, `doThis`/`dontDoThis`, `relationToProductTokens`), not the prop/variant schema used for components — brand sections don't have props.

## Relationship to product tokens — current known findings

| Area | Brand guideline | Product `tokens.json` | Status |
|---|---|---|---|
| Primary orange | Orange (main brand colour) | `primitive.color.brand.orange` / `semantic.color.brand.primary` | Aligned conceptually — exact hex not yet cross-checked (see `colour/Colour.doc.json`) |
| Secondary colour | Dedicated Blue, with its own tints/gradients | No brand-secondary blue; only a muted categorical `hue.blue` for data-viz/status | **Gap — undecided**, not yet represented in product tokens |
| Black | Pure black used in swatches/applications | Product avoids pure black (charcoal primitives, rgba-opacity text tokens) | Likely intentional (marketing vs. UI ergonomics) — not yet written down anywhere until now |
| Typography | Montserrat (display) + Roboto (body) | `semantic.typography.fontFamily` → Roboto/Helvetica/Arial only, no Montserrat | Likely intentional (marketing-only display face) |
| Icons | Standardizes on Material UI Icons + custom vehicle icons | Product components are MUI-based | **Real, working alignment** — reinforce, don't duplicate |

## Known gaps in this documentation

- **Exact hex/type-scale values are not yet verified.** The source Figma file is too large for the Figma MCP tool's metadata/design-context calls (both time out even per-section), so this was built from high-resolution screenshots, not extracted values. Colour and type specs below are described qualitatively; anywhere a literal value would normally go, it's marked `TBD — verify against Figma`.
- **Grid & Layouts** — not reviewed; the link supplied for this section pointed at the same Figma node as Icons.
- **Video** — not reviewed in detail; only seen as thumbnails in the file overview (title/safe zones, on-screen typography, ending screens).

## Changelog

- 2026-07-20: Initial version — Logo, Colour, Typography, Imagery, Icons, Graphic Design, Collaterals documented from Figma review. Grid & Layouts and Video left pending.
