# Navigation drawer

**Status:** stable  
**Category:** Navigation  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Drawer, List`  
**Source:** `md2-cartrack-library/components/navigation-drawer.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
The navigation drawer is the portal's primary, persistent navigation — anchored to the left edge and grouped by purpose. It's how operators move between the map, assets, and the domain pillars throughout a session.

## Key rule
> On desktop the drawer is permanent (always visible) — not a temporary overlay. Group items by purpose so the model stays legible; default new features into a pillar, not the top level.

## When to use
- **Permanent** — Default on desktop — always visible alongside content.
- **Collapsible** — Can collapse to a rail (icons only) to reclaim width.
- **Grouped** — Sections by purpose (Quick access / Pillars / Workflow & comms).

## When NOT to use (and what to do instead)
- Don't make it a flat dump of every feature.
- Don't use brand/codenames as labels — name by job.
- Don't put transient page actions in the drawer.

## Variants
| Variant | When to use |
| --- | --- |
| Permanent | Default on desktop — always visible alongside content. |
| Collapsible | Can collapse to a rail (icons only) to reclaim width. |
| Grouped | Sections by purpose (Quick access / Pillars / Workflow & comms). |

## Anatomy
- Container — the fixed left panel.
- Section header — optional group label (Quick access, Pillars, Workflow).
- Item — a destination with an icon + label.
- Active indicator — the selected item's highlighted/pill state.
- Badge — optional count on an item (e.g. unread alerts).

## Behaviors
- **Selection** — The current destination shows the active indicator; selecting an item navigates and updates it.
- **Collapse** — Collapsing hides labels and narrows to a rail; tooltips reveal labels on hover.
- **Permissions** — Items the operator can't access are hidden; a pillar with no accessible sub-pages collapses away rather than showing dead ends.

## States
| State | Treatment |
| --- | --- |
| Item enabled | Medium-emphasis icon + label. |
| Item hover/focus | 4% overlay. |
| Item active | Primary-tint pill, primary-dark label/icon. |

## Specs
| Property | Value |
| --- | --- |
| Width | ~240–256px (expanded) |
| Item height | 48px |
| Item text | Roboto 14px / 500 |
| Active indicator | primary tint (~10%); rounded pill |
| Icon size | 24px, 16px gap to label |

## Correct usage (themed MDC markup)
```html
<aside class="mdc-drawer" style="position:relative;height:300px;border-radius:4px">
<div class="mdc-drawer__content">
<nav class="mdc-deprecated-list">
<a aria-current="page" class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#"><span class="mdc-deprecated-list-item__ripple"></span><i aria-hidden="true" class="material-icons mdc-deprecated-list-item__graphic">map</i><span class="mdc-deprecated-list-item__text">Map</span></a>
<a class="mdc-deprecated-list-item" href="#"><span class="mdc-deprecated-list-item__ripple"></span><i aria-hidden="true" class="material-icons mdc-deprecated-list-item__graphic">local_shipping</i><span class="mdc-deprecated-list-item__text">Assets</span></a>
<a class="mdc-deprecated-list-item" href="#"><span class="mdc-deprecated-list-item__ripple"></span><i aria-hidden="true" class="material-icons mdc-deprecated-list-item__graphic">person</i><span class="mdc-deprecated-list-item__text">People &amp; Drivers</span></a>
<a class="mdc-deprecated-list-item" href="#"><span class="mdc-deprecated-list-item__ripple"></span><i aria-hidden="true" class="material-icons mdc-deprecated-list-item__graphic">insights</i><span class="mdc-deprecated-list-item__text">Reports</span></a>
</nav>
</div>
</aside>
```

## Do
- Group items by purpose; keep the top level short.
- Show one clear active destination.
- Hide items the user can't access.

## Don't
- Don't make it a flat dump of every feature.
- Don't use brand/codenames as labels — name by job.
- Don't put transient page actions in the drawer.

## Accessibility
- Use a navigation landmark with a list of links; the active item exposes aria-current. Items are keyboard reachable with visible focus; collapsed (icon-only) items keep accessible names via tooltip/label.
