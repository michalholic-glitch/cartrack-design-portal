# Expansion panels

**Status:** stable  
**Category:** Surfaces  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Accordion`  
**Source:** `md2-cartrack-library/components/expansion-panels.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Expansion panels (accordions) let operators reveal detail on demand — collapsing a long record or settings page into named sections that open one at a time, so the screen stays manageable.

## Key rule
> Use expansion panels to tame dense detail (vehicle specs, settings groups). For switching between peer views of one record, prefer tabs.

## When to use
- **Single-open** — Only one section open at a time (guided reading).
- **Multi-open** — Several sections open at once (reference scanning).
- **With summary** — Show a key value on the collapsed header.

## When NOT to use (and what to do instead)
- Don't nest accordions deeply.
- Don't hide critical, always-needed info behind a collapse.
- Don't use accordions where tabs fit better.

## Variants
| Variant | When to use |
| --- | --- |
| Single-open | Only one section open at a time (guided reading). |
| Multi-open | Several sections open at once (reference scanning). |
| With summary | Show a key value on the collapsed header. |

## Anatomy
- Header — the always-visible section title + expand/collapse affordance.
- Expand icon — chevron indicating open/closed.
- Panel body — the content revealed when expanded.
- Summary meta — optional preview value shown on the collapsed header.

## Behaviors
- **Expand/collapse** — Clicking the header toggles the panel; the chevron rotates to reflect state.
- **Single vs multi** — Decide whether opening one closes others; keep it consistent within a group.
- **Deep linking** — A section can open automatically when linked to, so operators land on the right detail.

## States
| State | Treatment |
| --- | --- |
| Collapsed | Header only; chevron pointing right/down. |
| Expanded | Body visible; chevron rotated. |
| Header hover/focus | State layer; visible focus. |

## Specs
| Property | Value |
| --- | --- |
| Header height | ~48px |
| Header title | Roboto 14–16px / 500 |
| Body padding | 16px; divider above body |
| Radius / elevation | 4px; elevation 1 |

## Correct usage (themed MDC markup)
```html
<div class="accordion"><div class="hd"><span style="font-weight:500">Vehicle details</span><span>▾</span></div><div class="bd2">Make, model, VIN, year, fuel type, and registration.</div></div>
<div class="accordion"><div class="hd"><span>Maintenance history</span><span>›</span></div></div>
```

## Do
- Name sections clearly so collapsed headers are scannable.
- Show a summary value where it helps.
- Keep single-vs-multi behavior consistent.

## Don't
- Don't nest accordions deeply.
- Don't hide critical, always-needed info behind a collapse.
- Don't use accordions where tabs fit better.

## Accessibility
- The header is a button exposing aria-expanded and controlling its panel via aria-controls; it's keyboard operable with visible focus. The chevron is decorative — state is conveyed programmatically.
