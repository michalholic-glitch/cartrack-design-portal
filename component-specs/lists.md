# Lists

**Status:** stable  
**Category:** Data display  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `List, ListItem`  
**Source:** `md2-cartrack-library/components/lists.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Lists present a vertical run of related records — drivers, notifications, recent vehicles. Each row pairs a primary line with optional supporting text, a leading avatar/icon, and trailing actions.

## Key rule
> Use a list for simple, scannable records. The moment you need columns, sorting, selection, or pagination, switch to a data table.

## When to use
- **Single-line** — Short records (names, options).
- **Two-line** — A title plus one supporting detail (most common).
- **Three-line** — Title plus two lines of context.
- **With controls** — Leading checkbox (multi-select) or trailing switch/action.

## When NOT to use (and what to do instead)
- Don't cram tabular data into a list.
- Don't nest lists deeply.
- Don't hide the only action in a hover-only control without a focus path.

## Variants
| Variant | When to use |
| --- | --- |
| Single-line | Short records (names, options). |
| Two-line | A title plus one supporting detail (most common). |
| Three-line | Title plus two lines of context. |
| With controls | Leading checkbox (multi-select) or trailing switch/action. |

## Anatomy
- List container — holds the items; may be divided or grouped.
- List item — one record (a row target).
- Leading element — avatar, icon, or checkbox.
- Primary & secondary text — the title and supporting line.
- Trailing element — a meta value, action, or overflow ⋮.
- Subheader / divider — optional group label or separator.

## Behaviors
- **Activation** — A clickable row navigates or opens detail; show hover and focus so it reads as interactive.
- **Selection** — For multi-select, use leading checkboxes (and consider whether a data table is the better tool).
- **Grouping** — Use subheaders + dividers to group long lists; avoid deep nesting.

## States
| State | Treatment |
| --- | --- |
| Enabled | Default row. |
| Hover/focus | 4% overlay. |
| Selected | Primary tint. |
| Disabled | 38% opacity. |

## Specs
| Property | Value |
| --- | --- |
| Row height | 48px (1-line), 64px (2-line), 88px (3-line) |
| Primary text | Roboto 14–16px / 400 |
| Secondary text | 14px, on-surface-medium |
| Side padding | 16px; 16px gap to leading element |

## Correct usage (themed MDC markup)
```html
<ul class="mdc-deprecated-list mdc-deprecated-list--two-line" style="border:1px solid rgba(0,0,0,.12);border-radius:4px;max-width:360px">
<li class="mdc-deprecated-list-item" tabindex="0"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text"><span class="mdc-deprecated-list-item__primary-text">Jane Cooper</span><span class="mdc-deprecated-list-item__secondary-text">CA 123-456 · Active</span></span></li>
<li class="mdc-deprecated-list-item"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text"><span class="mdc-deprecated-list-item__primary-text">Frank Kim</span><span class="mdc-deprecated-list-item__secondary-text">CA 789-012 · Idle</span></span></li>
<li class="mdc-deprecated-list-item"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text"><span class="mdc-deprecated-list-item__primary-text">Lena Ortiz</span><span class="mdc-deprecated-list-item__secondary-text">CA 345-678 · Offline</span></span></li>
</ul>
```

## Do
- Keep the primary line scannable.
- Use two-line items for record + context.
- Switch to a data table when columns/sorting appear.

## Don't
- Don't cram tabular data into a list.
- Don't nest lists deeply.
- Don't hide the only action in a hover-only control without a focus path.

## Accessibility
- Use real list semantics ( ul/li or role=list ); interactive rows are links/buttons with accessible names and visible focus. Leading checkboxes are labelled by the item text.
