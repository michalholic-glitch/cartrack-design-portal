# Navigation rail

**Status:** stable  
**Category:** Navigation  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Drawer (rail)`  
**Source:** `md2-cartrack-library/components/navigation-rail.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
The navigation rail is a compact, icon-first side navigation. It's the collapsed form of the drawer — used on narrower desktop widths or when an operator wants more room for a dense map or table.

## Key rule
> Use the rail as the space-saving alternative to the drawer, not as a second navigation. The two are the same destinations at different widths.

## When to use
- **Labelled** — Icon + short label (recommended for clarity).
- **Icon-only** — Maximum density; labels via tooltip on hover.
- **Expandable** — Toggles to the full navigation drawer.

## When NOT to use (and what to do instead)
- Don't show different destinations than the drawer.
- Don't pack more than ~7 items.
- Don't rely on icon alone without an accessible name.

## Variants
| Variant | When to use |
| --- | --- |
| Labelled | Icon + short label (recommended for clarity). |
| Icon-only | Maximum density; labels via tooltip on hover. |
| Expandable | Toggles to the full navigation drawer. |

## Anatomy
- Container — the fixed narrow strip (~72–80px).
- Item — an icon with a short label beneath it.
- Active indicator — highlight on the selected item.
- Menu / expand control — optional toggle back to the full drawer.

## Behaviors
- **Selection** — Selecting an item navigates and moves the active indicator; only one is active.
- **Expand** — An optional control expands the rail into the full drawer and back.
- **Tooltips** — Icon-only items reveal their label on hover/focus so meaning isn't lost.

## States
| State | Treatment |
| --- | --- |
| Item enabled | Medium-emphasis icon + label. |
| Item hover/focus | 4% overlay. |
| Item active | Primary icon/label (+ indicator). |

## Specs
| Property | Value |
| --- | --- |
| Width | 72–80px |
| Icon size | 24px |
| Label | Roboto ~11–12px / 500 |
| Item target | ≥48px tall |

## Correct usage (themed MDC markup)
```html
<div class="rail">
<div class="it on"><span style="font-size:1.2rem">🗺</span>Map</div>
<div class="it"><span style="font-size:1.2rem">🚚</span>Assets</div>
<div class="it"><span style="font-size:1.2rem">👤</span>People</div>
<div class="it"><span style="font-size:1.2rem">📊</span>Reports</div>
</div>
```

## Do
- Keep labels even in the compact form where possible.
- Mirror the drawer's destinations exactly.
- Provide tooltips for icon-only items.

## Don't
- Don't show different destinations than the drawer.
- Don't pack more than ~7 items.
- Don't rely on icon alone without an accessible name.

## Accessibility
- A navigation landmark of links; the active item exposes aria-current. Every item has an accessible name even when icon-only. Keyboard reachable with visible focus.
