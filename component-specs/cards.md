# Cards

**Status:** stable  
**Category:** Surfaces  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Card, CardHeader, CardContent`  
**Source:** `md2-cartrack-library/components/cards.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
A card groups related content and actions about a single subject — a vehicle summary, a KPI, an alert. Cards make a dashboard scannable by giving each thing its own contained surface.

## Key rule
> Use a card to collect everything about one entity. If you're listing many comparable records, a data table is usually clearer than a wall of cards.

## When to use
- **Elevated** — Default — a subtle shadow lifts the card off the page.
- **Outlined** — Flatter surfaces / dense dashboards where shadows add noise.
- **With media** — When an image/map adds context (vehicle photo, location).
- **Actionable (whole-card)** — The entire card navigates to detail.

## When NOT to use (and what to do instead)
- Don't replace a comparable-records table with many cards.
- Don't stack multiple contained buttons in a card.
- Don't nest cards within cards.

## Variants
| Variant | When to use |
| --- | --- |
| Elevated | Default — a subtle shadow lifts the card off the page. |
| Outlined | Flatter surfaces / dense dashboards where shadows add noise. |
| With media | When an image/map adds context (vehicle photo, location). |
| Actionable (whole-card) | The entire card navigates to detail. |

## Anatomy
- Container — the elevated/outlined surface (4px radius).
- Media — optional image/map thumbnail.
- Header — title, subtitle, optional avatar and overflow ⋮.
- Content — supporting text, KPIs, or a small table.
- Actions — a row of buttons (usually text/outlined).

## Behaviors
- **Actions** — Keep card actions low-emphasis (text/outlined); reserve the contained button for the page's primary action.
- **Whole-card click** — If the card is clickable, show hover/focus and don't bury separate interactive controls that compete with the card click.
- **Density** — On dashboards, prefer compact cards in a grid; align heights for a tidy grid.

## States
| State | Treatment |
| --- | --- |
| Resting | Elevation 1 (or outline). |
| Hover (actionable) | Raised elevation / overlay. |
| Focus (actionable) | Visible focus ring. |

## Specs
| Property | Value |
| --- | --- |
| Corner radius | 4px |
| Elevation | 1 (resting); raises on hover if actionable |
| Content padding | 16px |
| Title / subtitle | Roboto 16px/500 · 14px/400 on-surface-medium |

## Correct usage (themed MDC markup)
```html
<div class="mdc-card" style="width:280px;padding:16px">
<div style="font-size:1rem;font-weight:500">CA 123-456</div>
<div style="color:rgba(0,0,0,.6);font-size:.85rem;margin-bottom:8px">Jane Cooper · Active</div>
<div style="color:rgba(0,0,0,.6);font-size:.86rem">14 trips · 512 km this week.</div>
<div class="mdc-card__actions"><button class="mdc-button mdc-card__action"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Details</span></button><button class="mdc-button mdc-card__action"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Track</span></button></div>
</div>
```

## Do
- Keep one subject per card.
- Use low-emphasis actions inside cards.
- Align cards into a tidy grid on dashboards.

## Don't
- Don't replace a comparable-records table with many cards.
- Don't stack multiple contained buttons in a card.
- Don't nest cards within cards.

## Accessibility
- The card's title is a heading; an actionable card is a single link/button with an accessible name, or it exposes its inner controls clearly — not both in a confusing way. Focus is visible and order is logical.
