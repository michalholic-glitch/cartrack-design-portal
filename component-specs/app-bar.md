# App bar (top)

**Status:** stable  
**Category:** Navigation  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `AppBar, Toolbar`  
**Source:** `md2-cartrack-library/components/app-bar.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
The top app bar is the page header — it names where the operator is and holds page-level actions: global search, notifications, account, and the page's primary action. On desktop it also hosts the action a phone would put in a FAB.

## Key rule
> Keep the top bar light — most navigation belongs in the left drawer/rail. The bar carries the title, global tools, and the one primary action for the page.

## When to use
- **Standard** — Default page header with title + actions.
- **With primary action** — Hosts the page's contained primary action (the desktop replacement for a FAB).
- **Contextual / selection** — Appears when items are selected; shows count + bulk actions.
- **With search** — Expands an inline global search field.

## When NOT to use (and what to do instead)
- Don't crowd the bar with primary navigation — that's the drawer's job.
- Don't place a FAB on desktop; use the bar's primary action.
- Don't ship an orange bar with white text without checking contrast.

## Variants
| Variant | When to use |
| --- | --- |
| Standard | Default page header with title + actions. |
| With primary action | Hosts the page's contained primary action (the desktop replacement for a FAB). |
| Contextual / selection | Appears when items are selected; shows count + bulk actions. |
| With search | Expands an inline global search field. |

## Anatomy
- Leading element — nav toggle or back arrow.
- Title — the current page/section name.
- Action items — search, notifications, the primary action, and overflow ⋮.
- Contextual bar — a variant that replaces the title with a selection count + bulk actions.

## Behaviors
- **Scroll** — The bar stays fixed while content scrolls beneath it; it may gain a subtle shadow once content scrolls under it.
- **Contextual switch** — Entering a selection mode swaps the standard bar for the contextual bar and back when selection clears.
- **Responsive** — On narrower widths, secondary actions collapse into the overflow menu; the title truncates before the actions do.

## Specs
| Property | Value |
| --- | --- |
| Height | 56–64px |
| Title | Roboto ~20px / 500 |
| Side padding | 16px |
| Background | Often primary; if filled with orange, use dark text/icons or primary-dark — white on #F47735 fails AA. A white bar with dark text is the safer default for dense data screens. |

## Correct usage (themed MDC markup)
```html
<header class="mdc-top-app-bar" style="position:relative">
<div class="mdc-top-app-bar__row">
<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
<button aria-label="Open menu" class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
<span class="mdc-top-app-bar__title">Vehicles</span>
</section>
<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
<button aria-label="Search" class="material-icons mdc-top-app-bar__action-item mdc-icon-button">search</button>
<button aria-label="Notifications" class="material-icons mdc-top-app-bar__action-item mdc-icon-button">notifications</button>
<button aria-label="More" class="material-icons mdc-top-app-bar__action-item mdc-icon-button">more_vert</button>
</section>
</div>
</header>
```

## Do
- Show the current location as the title.
- Host one primary action here per page.
- Switch to the contextual bar during selection.
- Prefer a white bar + dark content for legibility.

## Don't
- Don't crowd the bar with primary navigation — that's the drawer's job.
- Don't place a FAB on desktop; use the bar's primary action.
- Don't ship an orange bar with white text without checking contrast.

## Accessibility
- Use a banner / header landmark; the title is a heading. Icon actions carry aria-label s and visible focus. The contextual bar announces the selection count. Contrast of text/icons on the bar background must meet AA.
