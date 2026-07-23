# Tabs

**Status:** stable  
**Category:** Navigation  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Tabs, Tab`  
**Source:** `md2-cartrack-library/components/tabs.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Tabs switch between related views of the same subject — a vehicle's Overview, Trips, Maintenance, and Alerts — without leaving the page. They keep peer views one click apart.

## Key rule
> Use tabs for peer views of one record or population. They're not top-level navigation (that's the drawer) and not a wizard (that's a stepper).

## When to use
- **Fixed** — A small, known set of tabs that fit the width.
- **Scrollable** — Many tabs that overflow; the bar scrolls.
- **With icon / count** — Reinforce a tab or show a count (e.g. "Alerts 3").

## When NOT to use (and what to do instead)
- Don't use tabs as primary site navigation.
- Don't use tabs for a sequential, must-complete flow (use a stepper).
- Don't overload with too many tabs — consider a different structure.

## Variants
| Variant | When to use |
| --- | --- |
| Fixed | A small, known set of tabs that fit the width. |
| Scrollable | Many tabs that overflow; the bar scrolls. |
| With icon / count | Reinforce a tab or show a count (e.g. "Alerts 3"). |

## Anatomy
- Tab bar — the row of selectable labels.
- Tab — one view label, optionally with an icon or count.
- Active indicator — the underline marking the selected tab.
- Panel — the content for the active tab.

## Behaviors
- **Selection** — Selecting a tab swaps the panel and moves the indicator; one tab is always active.
- **Overflow** — When tabs exceed the width, the bar scrolls rather than wrapping.
- **Deep linking** — The active tab can be reflected in the URL so a view is shareable.

## States
| State | Treatment |
| --- | --- |
| Inactive | On-surface-medium label. |
| Active | Primary label + primary underline indicator. |
| Hover/focus | State layer; visible focus. |

## Specs
| Property | Value |
| --- | --- |
| Tab height | 48px |
| Label | Roboto 14px / 500, uppercase |
| Indicator | 2px primary underline |
| Min tab width | ~90px; padding 16px sides |

## Correct usage (themed MDC markup)
```html
<div class="mdc-tab-bar" role="tablist">
<div class="mdc-tab-scroller"><div class="mdc-tab-scroller__scroll-area"><div class="mdc-tab-scroller__scroll-content">
<button aria-selected="true" class="mdc-tab mdc-tab--active" role="tab" tabindex="0"><span class="mdc-tab__content"><span class="mdc-tab__text-label">Overview</span></span><span class="mdc-tab-indicator mdc-tab-indicator--active"><span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span></span><span class="mdc-tab__ripple"></span></button>
<button aria-selected="false" class="mdc-tab" role="tab" tabindex="-1"><span class="mdc-tab__content"><span class="mdc-tab__text-label">Trips</span></span><span class="mdc-tab-indicator"><span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span></span><span class="mdc-tab__ripple"></span></button>
<button aria-selected="false" class="mdc-tab" role="tab" tabindex="-1"><span class="mdc-tab__content"><span class="mdc-tab__text-label">Maintenance</span></span><span class="mdc-tab-indicator"><span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span></span><span class="mdc-tab__ripple"></span></button>
<button aria-selected="false" class="mdc-tab" role="tab" tabindex="-1"><span class="mdc-tab__content"><span class="mdc-tab__text-label">Alerts</span></span><span class="mdc-tab-indicator"><span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span></span><span class="mdc-tab__ripple"></span></button>
</div></div></div>
</div>
```

## Do
- Use tabs for peer views of one subject.
- Keep labels short and parallel.
- Reflect the active tab in the URL.

## Don't
- Don't use tabs as primary site navigation.
- Don't use tabs for a sequential, must-complete flow (use a stepper).
- Don't overload with too many tabs — consider a different structure.

## Accessibility
- Use the tablist / tab / tabpanel pattern; the active tab exposes aria-selected and arrow keys move between tabs. Each panel is associated with its tab; focus is visible.
