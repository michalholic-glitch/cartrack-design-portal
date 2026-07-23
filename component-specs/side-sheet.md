# Side sheet

**Status:** stable  
**Category:** Surfaces  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Drawer (right)`  
**Source:** `md2-cartrack-library/components/side-sheet.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
A side sheet is a surface anchored to the right edge that shows contextual detail beside the main content — the selected vehicle's summary next to the list, or a filters panel — without navigating away.

## Key rule
> Use a side sheet to keep context: the operator sees a record's detail while the list stays visible. (Bottom sheets are a mobile pattern and are excluded from this desktop set.)

## When to use
- **Standard (pushes content)** — Detail beside a list where keeping context matters; content reflows.
- **Modal (over a scrim)** — When the sheet's task should hold focus (e.g. an editing flow).
- **Filters panel** — Hosts the advanced filters for a data table.

## When NOT to use (and what to do instead)
- Don't use a bottom sheet on desktop.
- Don't stuff a full multi-step task into a narrow sheet — use a page.
- Don't block the page with a modal sheet for read-only detail.

## Variants
| Variant | When to use |
| --- | --- |
| Standard (pushes content) | Detail beside a list where keeping context matters; content reflows. |
| Modal (over a scrim) | When the sheet's task should hold focus (e.g. an editing flow). |
| Filters panel | Hosts the advanced filters for a data table. |

## Anatomy
- Container — the panel docked to the right edge.
- Header — the subject/title + close affordance.
- Content — detail, tabs, or a form.
- Optional footer — actions for the sheet's content.

## Behaviors
- **Open with context** — Selecting a record opens the sheet with its detail; the list stays visible and the selection is highlighted.
- **Persistent vs modal** — A standard sheet coexists with the page; a modal sheet dims and blocks until dismissed.
- **Dismiss** — Close via the header control or Escape (modal); the standard sheet can stay docked.

## States
| State | Treatment |
| --- | --- |
| Closed | Off-canvas; content full width. |
| Open (standard) | Docked; content reflows to make room. |
| Open (modal) | Over a scrim; focus trapped. |

## Specs
| Property | Value |
| --- | --- |
| Width | ~320–400px (content-dependent) |
| Elevation | Raised (modal) / flush with a divider (standard) |
| Header title | Roboto 16–20px / 500 |
| Padding | 16px |

## Correct usage (themed MDC markup)
```html
<aside class="mdc-drawer" style="position:relative;height:300px;border-radius:4px">
<div class="mdc-drawer__header"><h3 class="mdc-drawer__title">CA 123-456</h3><h6 class="mdc-drawer__subtitle">Jane Cooper · Active</h6></div>
<div class="mdc-drawer__content">
<nav class="mdc-deprecated-list">
<a aria-current="page" class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">Overview</span></a>
<a class="mdc-deprecated-list-item" href="#"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">Recent trips</span></a>
<a class="mdc-deprecated-list-item" href="#"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">Maintenance</span></a>
</nav>
</div>
</aside>
```

## Do
- Use it to keep list context while viewing detail.
- Highlight the selected record in the list.
- Give it a clear close control.

## Don't
- Don't use a bottom sheet on desktop.
- Don't stuff a full multi-step task into a narrow sheet — use a page.
- Don't block the page with a modal sheet for read-only detail.

## Accessibility
- A modal side sheet uses role=dialog + aria-modal, traps focus, and restores it on close; a standard sheet is a labelled complementary region. The close control has an accessible name; Escape closes modal sheets.
