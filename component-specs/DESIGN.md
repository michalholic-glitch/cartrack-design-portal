---
name: Cartrack Portal Design System (Material 2, desktop)
version: 0.1.0
source: md2-cartrack-library/assets/ds.css + build/mdc.cartrack.theme.scss
colors:
  # Brand
  primary: "#F47735"          # Cartrack orange
  primary-dark: "#BB4800"     # AA-safe orange for white text / hover fill
  primary-light: "#FFA863"
  on-primary: "#FFFFFF"
  secondary: "#333333"
  secondary-light: "#5C5C5C"
  on-secondary: "#FFFFFF"
  # Semantic / status
  success: "#4CAF50"
  error: "#F44336"            # MDC theme error is #BA1A1A; see note below
  warning: "#FF9800"
  info: "#2196F3"
  # Surfaces
  bg: "#FAFAFA"               # page background
  surface: "#FFFFFF"          # cards, sheets, menus
  field: "#F5F5F5"            # filled input background
  # Text / on-surface (opacity-based, MD2)
  on-surface: "rgba(0,0,0,.87)"
  on-surface-med: "rgba(0,0,0,.60)"
  on-surface-dis: "rgba(0,0,0,.38)"
  # Lines & state layers
  divider: "rgba(0,0,0,.12)"
  hover: "rgba(0,0,0,.04)"
  selected: "rgba(244,119,53,.10)"   # primary @ 10%
typography:
  font-family-base: "Roboto, Helvetica, Arial, sans-serif"
  font-family-mono: "Roboto Mono, monospace"
  root-size: "14px"           # html font-size; 1rem = 14px
  body: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.55 }
  h1: { fontSize: "2rem", fontWeight: 400 }
  h2: { fontSize: "1.3rem", fontWeight: 500 }
  h3: { fontSize: "1rem", fontWeight: 500 }
  button-label: { fontSize: "0.875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }
  caption: { fontSize: "0.72rem", fontWeight: 400 }
spacing:
  # MD2 8px grid. Use these steps; avoid arbitrary px.
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
radius:
  sm: "4px"          # buttons, cards, fields, dialogs
  chip: "16px"       # pill
  full: "9999px"
elevation:
  el1: "0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)"   # cards, buttons, app bar
  el2: "0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12)"
  el8: "0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)"  # dialogs, menus, sheets
breakpoints:
  narrow: "680px"    # single-column collapse used in the library
---

## Overview

Dense, data-first fleet-management UI for desktop operators. The system is
**Material Design 2** themed with Cartrack brand colours, implemented on
**Material Components Web (MDC) 14.0.0**. Priorities are clarity and
scannability over decoration. Tokens are exposed as CSS custom properties in
`assets/ds.css` (`--primary`, `--on-surface`, …) and as Sass theme inputs in
`build/mdc.cartrack.theme.scss`.

## How to use this file

Reference **token names**, never raw hex/px values, when generating UI. In CSS
use the custom properties (`var(--primary)`); in MDC Sass use the theme keys.
One name, everywhere — Figma, CSS, and these docs must match.

## Colour intent

- **`--primary` (#F47735)** — the single brand interactive colour: contained
  buttons, selected states, active tabs/nav, sliders, progress. *Do not* use it
  for large blocks of body text or as a decorative fill.
- **`--primary-dark` (#BB4800)** — hover fill for contained buttons **and** the
  required fill whenever white text sits on the brand colour. White on the base
  orange #F47735 is only ~2.79:1 and **fails WCAG AA** — use `--primary-dark`
  for legible white labels.
- **`--secondary` (#333333)** — neutral high-emphasis actions and the avatar
  fill; not a second brand accent.
- **Status colours** — `--success`, `--warning`, `--error`, `--info`. Use for
  status chips, banners, and validation only. Always pair colour with a text
  label or icon; never encode meaning by colour alone.
- **Text** — `--on-surface` (.87) for primary text, `--on-surface-med` (.60)
  for secondary/captions, `--on-surface-dis` (.38) for disabled. These are
  opacity-on-black, the MD2 convention.
- **Surfaces** — `--bg` for the page, `--surface` for raised content (cards,
  menus, sheets, dialogs), `--field` for filled input backgrounds.

> Note: the MDC Sass theme sets `error` to `#BA1A1A` while the CSS layer uses
> `#F44336`. Pick one before shipping and make them identical. `on-primary`
> currently defaults to white — see the WCAG note above.

## Typography

Roboto everywhere; Roboto Mono for code/IDs. Root is 14px so `1rem = 14px`.
Button labels are uppercase with 0.05em tracking (an MD2 trait). Don't introduce
other typefaces or weights outside 400/500/700.

## Spacing, radius, elevation

Lay out on the **8px grid** (`xs 4 / sm 8 / md 16 / lg 24 / xl 32`). Corner
radius is 4px for nearly everything; chips are 16px pills. Use the three
elevation levels by role: `el1` for resting surfaces (cards, buttons, app bar),
`el8` for transient overlays (dialogs, menus, side sheets). Don't invent new
shadows.

## Deprecated / do not use

- **FAB (floating action button)** — mobile pattern; on desktop the primary
  action lives in the page toolbar / app bar.
- **White text on base `--primary`** for important labels — fails AA; use
  `--primary-dark`.
- Arbitrary hex, px, shadows, or fonts not listed above.
