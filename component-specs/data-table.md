# Data table

**Status:** stable  
**Category:** Data display  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`). This mirrors **Material Design 2** deliberately: Google never republished a data-table spec for Material Design 3, so there is no M3 source to follow (see `table-deep-dive.md` §1).  
**MDC reference:** `DataGrid from @karoo-ui/core`  
**Source:** `md2-cartrack-library/components/data-table.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Data tables present sets of records across rows and columns — the primary way operators scan, sort, select, and act on fleet data (vehicles, trips, drivers, alerts). This is the most-used component in the portal, so it carries the most behaviour.

## Key rule
> When a dataset is large, server-paginated, sortable, or selectable, use the data table — not a basic Table. Reserve the basic table for small, static key/value layouts.

## When to use
- **With toolbar** — Almost always — gives the table a title plus search/filter/export entry points (compose them into the `toolbarActions` slot).
- **Selectable (checkboxes)** — When users perform bulk actions (assign, export, delete) on multiple records.
- **Paginated** — Any dataset beyond a single screen; desktop tables paginate (rows-per-page + range), they don't infinite-scroll.
- **Dense** — High-volume operator screens where maximizing visible rows matters; reduces row height.
- **Sticky header + bounded height** — Tall tables inside a fixed layout: `maxHeight` bounds the body, `stickyHeader` keeps column labels visible while scrolling.
- **Loading** — While a page of data is fetching: indeterminate linear bar under the toolbar, interactions disabled.
- **Empty state** — Zero rows and not loading: a single full-width centered message row (`emptyState` to customise).
- **Row actions** — Secondary per-record actions behind a trailing ⋮ menu (`rowActions`).

## When NOT to use (and what to do instead)
- Don't put the primary action inside a row's overflow menu if it's used constantly.
- Don't sort more than one column at once unless multi-sort is explicitly needed.
- Don't encode status by colour alone — keep the text label on the chip.
- Don't infinite-scroll a desktop data table; use pagination.
- Don't hard-code colours/sizes — use the theme tokens and these specs.

## Variants
| Variant | When to use |
| --- | --- |
| With toolbar | Almost always — gives the table a title plus search/filter/export entry points (composed into `toolbarActions`). |
| Selectable (checkboxes) | When users perform bulk actions (assign, export, delete) on multiple records. |
| Paginated | Any dataset beyond a single screen; desktop tables paginate (rows-per-page + range), they don't infinite-scroll. |
| Dense | High-volume operator screens where maximizing visible rows matters; reduces row height. |
| Sticky header + bounded height | Tall tables inside a fixed layout — `maxHeight` + `stickyHeader` keep labels visible while rows scroll. |
| Loading | While data fetches — indeterminate linear bar, interactions disabled. |
| Empty state | Zero rows, not loading — centered full-width message row. |
| Row actions | Per-row secondary actions behind a trailing ⋮ Menu. |

> **Removed from this spec (previously documented, never implemented):** *Inline-editable* and *Expandable rows*. Inline editing waits on the dedicated **Inline edit** component; hierarchical rows are the future **Table tree** component. See "Deferred" below.

## Anatomy
- Toolbar — table title + the `toolbarActions` slot for table-level controls (search, filter, more). Becomes the contextual toolbar when rows are selected.
- Loading bar — indeterminate linear ProgressIndicator directly under the toolbar while `loading`.
- Column header — the label for each column; sortable headers show a direction arrow and an active state.
- Sort indicator — arrow showing ascending/descending on the active sort column.
- Selection column — optional leading checkboxes; the header checkbox selects/clears all (indeterminate when partial).
- Row — one record; supports hover, selected, and (optionally) clickable states.
- Cell — one value; text left-aligned, numbers right-aligned with tabular figures.
- Row actions column — optional trailing ⋮ icon-button per row opening a Menu of secondary actions (destructive in error colour).
- Empty state row — zero rows + not loading: one real `<td colspan>` row with a centered message.
- Pagination footer — rows-per-page, the visible range, and previous/next controls. Sits below the scroll region, never inside it.
- Contextual toolbar — replaces the title bar while rows are selected, showing the count and bulk actions.

## Behaviors
- **Sorting** — Clicking a sortable header sorts by that column; clicking again reverses direction. The active column shows a filled label and a direction arrow; only one column sorts at a time (unless multi-sort is explicitly enabled).
- **Selection** — Row checkboxes select individual records; the header checkbox selects all on the page and shows an indeterminate state when the selection is partial. While anything is selected, the toolbar switches to the contextual toolbar — showing the count and bulk actions (e.g. Export, Delete) — and selected rows take the selected background.
- **Pagination** — The footer shows rows-per-page, the current range, and prev/next.
- **Server-driven pagination** — Already supported with the same props, no special mode: pass the current page's slice as `rows`, the server's full count as `totalRows`, and fetch the next slice in `onPageChange` instead of slicing a client-side array. Prefer it past a few thousand rows, or whenever the full dataset isn't practical to hold client-side.
- **Scrolling** — Horizontal scroll is always available when columns exceed the container. `maxHeight` bounds the body vertically; with `stickyHeader` the header row stays pinned (surface fill + divider boundary line) while rows scroll beneath. Toolbar and pagination stay outside the scroll region.
- **Loading** — `loading` renders an indeterminate linear ProgressIndicator under the toolbar, sets `aria-busy`, and disables sort, selection, row click, row actions, and paging until data arrives.
- **Empty state** — Zero rows (not loading) renders a single centered "No data" row spanning all columns; `emptyState` accepts a tailored message/action. Minimal placeholder until the dedicated Empty state component exists.
- **Row actions** — `rowActions` renders a trailing ⋮ button per row (Enter/Space opens; Escape or outside click closes) showing a Menu of the returned items; destructive items use the error colour. Row click handlers don't fire from inside the actions cell.
- **Filtering & search** — Not built into DataTable. Compose a quick-search `TextField` / filter `Button` into `toolbarActions`; applied filters show as removable filter chips above or within the toolbar.

## Specs
| Property | Standard | Dense |
| --- | --- | --- |
| Header row height | 56px | 40px |
| Data row height | 52px | 36px |
| Column padding | 16px (first/last 24px) | 16px (first/last 24px) |
| Toolbar height | 64px | 64px |
| Header label | Roboto 14px / 500, color on-surface-medium (full on-surface when sorted) |  |
| Cell text | Roboto 14px / 400, color on-surface; numbers right-aligned, tabular figures |  |
| Row divider | 1px, divider color (rgba(0,0,0,.12)) |  |
| Selected background | primary at ~10% (token --selected ) |  |
| Sticky header boundary | surface fill + 1px divider-colour line while pinned |  |
| Empty-state padding | 24px, centered, secondary text colour |  |

## Deferred (explicitly not in this component)
Future work, tracked elsewhere — footnoted here so the omission reads as a decision, not a gap:
- **Column resizing / reordering / pinning / visibility toggle** — MUI-X DataGrid extensions in fleet-web, not MD2-native; use the real DataGrid pattern if a screen needs them today.
- **Export (CSV/Excel/PDF)** — compose an export control into `toolbarActions`; DataTable intentionally doesn't own export.
- **Row expansion / detail panel** — hierarchical rows are the future *Table tree* component.
- **Inline cell editing** — waits on the future dedicated *Inline edit* component.
- **Multi-column sort** — stays opt-out per the existing don't rule.

## Correct usage (themed MDC markup)
```html
<div class="mdc-data-table">
<div class="mdc-data-table__table-container">
<table aria-label="Vehicles" class="mdc-data-table__table">
<thead><tr class="mdc-data-table__header-row">
<th class="mdc-data-table__header-cell" role="columnheader" scope="col">Registration</th>
<th class="mdc-data-table__header-cell" role="columnheader" scope="col">Driver</th>
<th class="mdc-data-table__header-cell" role="columnheader" scope="col">Status</th>
<th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Odometer (km)</th>
<th class="mdc-data-table__header-cell" role="columnheader" scope="col">Last trip</th>
</tr></thead>
<tbody class="mdc-data-table__content">
<tr class="mdc-data-table__row"><th class="mdc-data-table__cell" scope="row">CA 123-456</th><td class="mdc-data-table__cell">Jane Cooper</td><td class="mdc-data-table__cell">Active</td><td class="mdc-data-table__cell mdc-data-table__cell--numeric">84,210</td><td class="mdc-data-table__cell">2 min ago</td></tr>
<tr class="mdc-data-table__row"><th class="mdc-data-table__cell" scope="row">CA 789-012</th><td class="mdc-data-table__cell">Frank Kim</td><td class="mdc-data-table__cell">Idle</td><td class="mdc-data-table__cell mdc-data-table__cell--numeric">120,540</td><td class="mdc-data-table__cell">1 h ago</td></tr>
<tr class="mdc-data-table__row"><th class="mdc-data-table__cell" scope="row">CA 345-678</th><td class="mdc-data-table__cell">Lena Ortiz</td><td class="mdc-data-table__cell">Offline</td><td class="mdc-data-table__cell mdc-data-table__cell--numeric">58,900</td><td class="mdc-data-table__cell">3 d ago</td></tr>
</tbody>
</table>
</div>
</div>
```

## Do
- Use the data table (not a basic table) for any sortable, selectable, or large dataset.
- Right-align numeric columns and use tabular figures so digits line up.
- Switch to the contextual toolbar when rows are selected, showing the count + bulk actions.
- Map status to the consistent colour chips (Active/Idle/Offline).
- Paginate; fetch per page for large/server data.

## Don't
- Don't put the primary action inside a row's overflow menu if it's used constantly.
- Don't sort more than one column at once unless multi-sort is explicitly needed.
- Don't encode status by colour alone — keep the text label on the chip.
- Don't infinite-scroll a desktop data table; use pagination.
- Don't hard-code colours/sizes — use the theme tokens and these specs.

## Accessibility
- Use real `<table>` semantics with `<th>` headers; sortable headers expose aria-sort. The select-all checkbox announces its indeterminate state. Selection changes and the contextual toolbar are announced to assistive tech. Rows and controls are keyboard navigable; visible focus is preserved. Status is never colour-only — the chip carries a text label.
- `loading` sets `aria-busy` on the table and renders a `role="progressbar"` with an accessible label; disabled controls leave the tab order.
- The empty state keeps valid table semantics (a real `<tr>`/`<td colspan>`, not a replacement `<div>`).
- The row-actions trigger is a real `<button>` (Enter/Space) with `aria-haspopup`/`aria-expanded`; its menu closes on Escape or outside click.
