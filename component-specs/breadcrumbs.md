# Breadcrumbs

**Status:** stable  
**Category:** Navigation  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Breadcrumbs`  
**Source:** `md2-cartrack-library/components/breadcrumbs.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Breadcrumbs show where the operator is within the portal's hierarchy and let them step back up it — from a single vehicle, to the vehicle list, to the fleet. They orient users in deep desktop navigation.

## Key rule
> Use breadcrumbs when content sits more than one level deep. They complement — not replace — the left navigation drawer.

## When to use
- **Standard** — Show the full path for shallow hierarchies.
- **Collapsed** — Hide middle levels behind "…" for deep paths.
- **With menu crumb** — A crumb opens a menu of sibling pages.

## When NOT to use (and what to do instead)
- Don't use breadcrumbs as the primary navigation.
- Don't show a one-level trail (no value).
- Don't make the current page a link to itself.

## Variants
| Variant | When to use |
| --- | --- |
| Standard | Show the full path for shallow hierarchies. |
| Collapsed | Hide middle levels behind "…" for deep paths. |
| With menu crumb | A crumb opens a menu of sibling pages. |

## Anatomy
- Crumb link — an ancestor level (navigates up).
- Separator — a divider glyph between crumbs.
- Current page — the last crumb, not a link.
- Overflow — optional collapse ("…") for very deep paths.

## Behaviors
- **Navigation** — Each crumb except the last navigates to that ancestor; the current page is plain text.
- **Truncation** — Long labels truncate with a tooltip; deep paths collapse the middle.

## States
| State | Treatment |
| --- | --- |
| Link | On-surface-medium; underlines on hover. |
| Current | On-surface, not a link. |
| Focus | Visible focus on each link. |

## Specs
| Property | Value |
| --- | --- |
| Text | Roboto 14px / 400 |
| Separator spacing | ~8px each side |
| Link colour | on-surface-medium → primary-dark on hover |

## Correct usage (themed MDC markup)
```html
<div class="crumbsnav"><a href="#">Fleet</a><span class="s">›</span><a href="#">Vehicles</a><span class="s">›</span>CA 123-456</div>
```

## Do
- Make the current page the non-link last crumb.
- Collapse very deep paths.
- Mirror the real IA hierarchy.

## Don't
- Don't use breadcrumbs as the primary navigation.
- Don't show a one-level trail (no value).
- Don't make the current page a link to itself.

## Accessibility
- Wrap in a nav labelled "Breadcrumb" with an ordered list; the current page uses aria-current="page". Separators are decorative (hidden from assistive tech). Links are keyboard reachable with visible focus.
