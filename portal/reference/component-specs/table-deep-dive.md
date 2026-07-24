# Table — deep dive: fleet-web patterns & native functionality review

**Status:** draft — awaiting review
**Date:** 2026-07-23
**Scope:** `component-repo/components/DataTable/` (+ mirror in `cartrack-ai-design-system/design-system/components/DataTable/`), `component-specs/data-table.md`, `cartrack-ai-design-system/design-system/templates/table-page.md`

## Why this doc

The current Table docs are thin relative to how much this component actually does in production. This is a research pass: (1) what fleet-web's *real* tables do, (2) what the DS currently documents vs. implements, (3) whether we're missing native data-table functionality, before deciding what to change.

## 1. Material Design has no current spec to lean on

Material Design 2 had an official "Data tables" page. **Material Design 3 dropped it** — there is no `m3.material.io/components/data-tables` page. This isn't a research gap on our side; Google never republished data tables for M3. Every M3-based table implementation (MUI, Angular Material) is extrapolating M2 patterns onto M3 tokens.

Our own `DataTable.tsx` already says this explicitly in its header comment: it "Mirrors the mdc-data-table class contract from `md2-cartrack-library/components/data-table.html`" — i.e. it's intentionally MD2-shaped. That's a reasonable choice given there's no M3 alternative, but `data-table.md`'s header line ("Library: Material Components Web (MDC) 14.0.0") should say so plainly rather than imply an M3 source that doesn't exist. Minor doc-honesty fix, not a redesign.

## 2. What fleet-web actually does (real patterns worth formalizing)

Fleet-web's real table story is **cleaner than expected**: one sanctioned primitive, not fragmented ad-hoc tables.

- **DataGrid over Table.** The old `util-components/table.tsx` and `advanced-table.tsx` (react-table v6 wrappers) are explicitly `@deprecated` in their own JSDoc, pointing to `DataGrid from @karoo-ui/core`. Only one straggler module (`modules/engine/refrigerator-table.tsx`) still uses the legacy react-table path. Everything else — 100+ files across vision, tachograph, scorecards, routes, mifleet, settings, alerts — renders through `@karoo-ui/core`'s `DataGrid`, a thin wrapper around **MUI X `DataGridPremium`**.
- **Persisted-preferences wrapper as the real default.** Most feature tables don't render `DataGrid` directly — they render `UserDataGridWithSavedSettingsOnIDB` (`modules/components/connected/UserDataGridWithSavedSettingsOnIDB/index.tsx`), which namespaces column order/visibility/sort/density per user in IndexedDB. Seen in `manage-users/index.tsx`, `VehicleCustomFieldsTable.tsx`, `VehiclesTable.tsx`, `manage-roles/index.tsx`.
- **Column-helper factory.** Columns are declared via `useDataGridColumnHelper<Row>()` (`.string()/.number()/.boolean()/.singleSelect()/.date()/.dateTime()`), modeled deliberately on TanStack's `createColumnHelper`. Pre-wires consistent truncation + tooltip behavior via `OverflowTypography`. Older standalone `createDataGridTextColumn`/`createDataGridNumberColumn` helpers are themselves marked deprecated in favor of this.
- **KarooToolbar slot recipe.** A shared toolbar (`shared/data-grid/KarooToolbar/index.tsx`) composes quick-search, filter button, a settings popover (density + column visibility, not MUI-X's default column panel), and optional date-range picker — all as opt-in slots, reused rather than rebuilt per module.
- **Standard empty/loading slot pair.** `loadingOverlay: LinearProgress` + `noRowsOverlay: () => <DataStatePlaceholder label="No data available" />` repeats near-verbatim across modules. This pairing has no equivalent in our `DataTable.tsx` or `data-table.md` today.
- **Bulk-selection action pattern.** `DataGridDeleteButtonWithCounter` (count-badged action button, disabled at zero) + `DeleteMultipleItemsDialog` (confirm step) form a reusable "select → count-badged action → confirm" flow, generalizable beyond delete.
- **Server cursor-pagination contract.** `shared/data-grid/server-client/cursor-based-pagination-types.ts` defines a shared FE/BE cursor pagination shape for datasets too large for client paging (used in delivery jobs). Client-side pagination is still the default even for large datasets (e.g. the full vehicle fleet) — the switch to server mode is a per-module judgment call today, not a documented threshold.
- **Actions-column: two competing conventions.** Native `type: 'actions'` + `GridActionsCellItem` in some modules, manual `renderCell` with `IconButton` stacks in others (`VehicleCustomFieldsTable.tsx`). Worth picking one canonical pattern — the native one has better keyboard/a11y support built in.
- **Layout shell requirement.** `PageWithMainTable/index.tsx` exists purely because DataGrid has no intrinsic height — every full-page table needs a sized flex/overflow parent. Undocumented outside this one file's own code comment.
- **Column pinning + export.** Right-pinned actions columns (`pinnedColumns: { right: ['actions'] }`) survive horizontal scroll; a custom toolbar export menu supports CSV/Excel/Print and a genuinely elaborate custom PDF export (multi-language font embedding, multi-page layout) — far beyond a thin MUI wrapper.
- **Gap fleet-web has too:** no mobile/responsive collapse pattern (columns just scroll horizontally; nothing collapses to cards below a breakpoint). Worth deciding deliberately rather than inheriting silently.

## 3. Current DS Table docs vs. reality — three separate things describing three different components

| Artifact | What it actually is |
| --- | --- |
| `DataTable.tsx` / `.doc.json` | A from-scratch MD2-styled `<table>` React component: sort, single/bulk selection with contextual toolbar, dense mode, pagination footer. ~16 props. No resizing, no loading/empty state, no row-action prop, no sticky header, no filtering — despite `data-table.md` and `doc.json` describing some of these. |
| `component-specs/data-table.md` | The richest of the three docs — full anatomy/behaviors/specs/a11y — but describes **Inline-editable** and **Expandable rows** variants and **Filtering & search** / **Inline editing** behaviors that don't exist in `DataTable.tsx`. Documented-but-not-implemented. |
| Real fleet-web tables | MUI X `DataGridPremium` via `@karoo-ui/core`, with the toolbar/persistence/column-helper patterns above. This is what operators actually use every day — and it's a materially different component from `DataTable.tsx`. |

This is the core finding: **the DS component and doc describe an idealized MD2 table that isn't what fleet-web runs.** That's not automatically wrong (a DS can define a target pattern rather than mirror legacy code — see `[[project_token_structure_best_practice]]`-style precedent of not just copying old docs), but right now nobody has made that choice explicitly — the doc just drifted from both the code and the app.

## 4. Native functionality checklist

Status legend: ✅ documented + implemented in `DataTable.tsx` · 📄 documented only (doc/code mismatch) · ⚙️ implemented in real fleet-web DataGrid, absent from DS docs+component · ❌ missing everywhere

| Capability | `DataTable.tsx` | `data-table.md` | fleet-web `DataGrid` |
| --- | --- | --- | --- |
| Sortable columns (single) | ✅ | ✅ | ✅ |
| Multi-column sort | ❌ | mentioned, opt-out only | ✅ native |
| Pagination (client) | ✅ | ✅ | ✅ |
| Pagination (server/cursor) | ❌ | ❌ | ✅ (`cursor-based-pagination-types.ts`) |
| Row selection (single/bulk + contextual toolbar) | ✅ | ✅ | ✅ (+ count-badged bulk action pattern) |
| Density option | ✅ (`dense` prop) | ✅ | ✅ (toolbar toggle) |
| Sticky/fixed header on scroll | ❌ | ❌ in component doc; mentioned only in `table-page.md` pattern doc | ✅ native |
| Horizontal/vertical scrolling for wide/tall tables | ❌ (no overflow handling) | ❌ | ✅ native + virtualized |
| Column resizing | ❌ | ❌ | ✅ native |
| Column reordering | ❌ | ❌ | ✅ native |
| Column visibility toggle | ❌ | ❌ | ✅ (custom settings popover) |
| Row actions (dedicated column/prop) | ❌ | mentioned only as separate composed "Menu" in `table-page.md` | ✅ (two competing conventions — see §2) |
| Row expansion / detail panel | ❌ | 📄 "Expandable rows" variant listed, no implementation | ✅ native (`getDetailPanelContent`) |
| Inline cell editing | ❌ | 📄 "Inline-editable" variant + behavior listed, no implementation | not observed in sample |
| Empty state | ❌ (component just renders zero `<tr>`s) | ❌ for the component; page-level guidance only in `table-page.md` | ✅ standardized `noRowsOverlay` slot |
| Loading state | ❌ | ❌ anywhere | ✅ standardized `loadingOverlay` slot |
| Search/filter toolbar | ❌ | 📄 mentioned, no props | ✅ (`KarooToolbar` quick-filter + filter button) |
| Export (CSV/Excel/PDF/Print) | ❌ | ❌ | ✅ (elaborate custom implementation) |
| Column pinning | ❌ | ❌ | ✅ (`pinnedColumns`) |
| Mobile/responsive collapse | ❌ | ❌ | ❌ (gap in fleet-web too — see §2) |

Nine capabilities real fleet-web tables rely on daily have **zero DS documentation footprint**: sticky header, resizing, reordering, column visibility, empty/loading states, search/filter toolbar, export, column pinning, row expansion.

## 5. Recommendations (for review, not yet applied)

1. **Decide what `DataTable.tsx` is for.** Either (a) explicitly scope it as a lightweight/static table pattern for small key-value or non-interactive lists (its current `data-table.md` "Key rule" line already gestures at this: *"Reserve the basic table for small, static key/value layouts"*), and point everything else at documenting the real `DataGrid`/`@karoo-ui/core` pattern instead; or (b) extend `DataTable.tsx` toward the missing capabilities. Given fleet-web has already standardized on `DataGrid`, (a) is very likely the right call — but it's a decision, not a doc fix, so flagging for your call rather than assuming it.
2. **Strip or clearly footnote the doc/code mismatches** in `data-table.md` and `doc.json`: "Inline-editable" and "Expandable rows" variants, and "Filtering & search"/"Inline editing" behaviors, until either implemented or explicitly reclassified as "DataGrid-only, not available in the basic DataTable."
3. **Write the missing DataGrid-pattern doc.** A new component-spec (or a clearly-labeled second section of this one) documenting the real, sanctioned table: `UserDataGridWithSavedSettingsOnIDB` as the default entry point, the column-helper API, `KarooToolbar` slot recipe, the empty/loading slot pair, the bulk-selection pattern, server cursor-pagination guidance, and — pick one — the canonical actions-column convention.
4. **Add sticky header + scroll behavior to whichever table doc ends up owning it.** It's already promised at the page-pattern level (`table-page.md:13`) but not delivered at the component level anywhere.
5. **Name a threshold for client vs. server pagination** (e.g. "switch to server/cursor pagination past N rows or when the dataset isn't bounded") since fleet-web itself doesn't have one and is inconsistent as a result.
6. **Decide on mobile/responsive table behavior deliberately** — currently absent both in fleet-web and in the DS; worth a stated position (horizontal scroll is acceptable / column priority-hiding required / etc.) rather than leaving it implicit.
7. **Fix the M3 framing** in `data-table.md`'s header metadata to state plainly that this mirrors MD2 (there is no M3 data-table spec), rather than leaving that unstated.

## 6. Open questions for you

- Should `DataTable.tsx` stay a small/static-table component, or grow to match `DataGrid`? (Recommendation above leans "stay small," but this changes what the rest of this doc should propose.)
- Which actions-column convention should be canonical — native `GridActionsCellItem` or manual `IconButton` stack?
- Is there an appetite for a documented client-vs-server-pagination row-count threshold, or should that stay a per-team judgment call?

## 7. Decision (2026-07-23)

Michal's call: build this as a **proper component** — extend `DataTable.tsx` itself to close the real gaps, not a `templates/` composition pattern. Execution checklist handed to Claude Code: `table-component-build-prompt.md` (repo root). That file is the source of truth for build scope/phasing going forward; treat the open questions above as answered by it rather than re-litigating here.
