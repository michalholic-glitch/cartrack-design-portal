# Pagination

**Status:** stable  
**Category:** Data display  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `TablePagination, Pagination`  
**Source:** `md2-cartrack-library/components/pagination.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Pagination breaks a large dataset into pages an operator can move through — the standard way to navigate the thousands of vehicles, trips, and alerts in the portal's data tables.

## Key rule
> Desktop tables paginate — they don't infinite-scroll. For large or server-driven data, fetch one page at a time rather than loading everything.

## When to use
- **Table footer (range + prev/next)** — Default for data tables; compact, shows totals.
- **Numbered pages** — When operators jump around (page 1, 2, 3…); good for moderate counts.
- **Rows-per-page only** — When the dataset fits a couple of pages.

## When NOT to use (and what to do instead)
- Don't infinite-scroll a desktop data table.
- Don't lose selection or sort when paging.
- Don't load 100k rows into the browser at once.

## Variants
| Variant | When to use |
| --- | --- |
| Table footer (range + prev/next) | Default for data tables; compact, shows totals. |
| Numbered pages | When operators jump around (page 1, 2, 3…); good for moderate counts. |
| Rows-per-page only | When the dataset fits a couple of pages. |

## Anatomy
- Rows-per-page — a select for page size (e.g. 25/50/100).
- Range label — the visible window and total ("1–100 of 100,000").
- Previous / next — step one page at a time.
- Page numbers — optional direct jumps with the current page highlighted.

## Behaviors
- **Server vs client** — For small sets, paginate in the browser; for large/remote data, request each page from the server and show a loading state while fetching.
- **Selection across pages** — When rows are selected, keep the selection as the operator pages (and make it clear how many are selected in total).
- **Resetting** — Changing filters or page size resets to page one; preserve sort.

## States
| State | Treatment |
| --- | --- |
| Page enabled | Default text button. |
| Current page | Primary-tint highlight. |
| Prev/next at bounds | Disabled (38% opacity) at first/last page. |

## Specs
| Property | Value |
| --- | --- |
| Control height | ~32px |
| Footer height | ~52px |
| Text | Roboto 12–14px, on-surface-medium |
| Current page | primary tint (~10%) |

## Correct usage (themed MDC markup)
```html
<div class="pgn"><span class="lbl">Rows per page: 100 ▾</span><span class="lbl">1–100 of 100,000</span><span class="p">‹</span><span class="p on">1</span><span class="p">2</span><span class="p">3</span><span class="p">…</span><span class="p">›</span></div>
```

## Do
- Show the total and current range.
- Offer sensible page sizes (25/50/100).
- Fetch per page for large data.

## Don't
- Don't infinite-scroll a desktop data table.
- Don't lose selection or sort when paging.
- Don't load 100k rows into the browser at once.

## Accessibility
- Pagination is a labelled navigation region; the current page exposes aria-current, and prev/next convey their disabled state. Page-size is a labelled select. Controls are keyboard operable with visible focus.
