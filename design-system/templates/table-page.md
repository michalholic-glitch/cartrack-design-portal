# Table Page (e.g. Vehicle list, Driver list, Trip history)

The workhorse screen of the Fleet Portal: a filterable, paginated collection of records.

## Layout

Page header (title + search + one primary action) > filter row (Chips) > DataGrid > Pagination

## Components used

- Page header — page title, global search, ONE contained primary action (e.g. "Add vehicle"), overflow menu — the list-header variant of the Page header pattern (Title + ButtonsContainer), plus a search field.
- Chip — filter chips in a single row below the bar; selected state uses the 8% primary overlay
- DataGrid — the main content; row height 52px, header sticky on scroll
- Chip (status) — status values inside cells use small status chips (12px/500 labelSmall), never plain coloured text
- Pagination — always present below the table; never render more than 50 rows unpaginated
- Contextual page header — swaps in when rows are selected: count + bulk actions
- Menu — per-row overflow actions (⋮), destructive actions in error colour with confirmation Dialog

## Structure rules

- One primary action per page, hosted in the page header — never a FAB on desktop.
- Filters live between the bar and the table, not in a sidebar, unless there are more than ~8 filters (then a Drawer-based side panel).
- Empty state: centered message + the primary action repeated; never an empty table skeleton.
- Column alignment: text left, numbers right, status chips left; sortable columns show the sort arrow only on the active column.
- Row click opens the detail page; row checkbox enters selection mode (contextual page header).

## Notes

- Density matters more than whitespace here — fleet operators scan hundreds of rows. Use body2 (14px) in cells.
- Vehicle/driver status colours come from `semantic.color.vehicleStatus` — never approximate them with status.success/error.
