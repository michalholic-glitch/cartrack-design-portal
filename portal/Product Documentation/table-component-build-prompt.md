# Build prompt — DataTable: close the native table-functionality gaps

Paste this whole file as the task for the coding agent. It implements the decisions in `component-specs/table-deep-dive.md` (already reviewed — read it first, it's the source of truth for *why*, this file is the execution checklist for *what/how*). Michal's explicit call: **this ships as a real, coded component change to `DataTable.tsx`** — not a `templates/` composition pattern, not doc-only.

## Context you need before touching anything

- **Repo topology — verify before editing, don't assume.** `DataTable` currently exists in two places: `component-repo/components/DataTable/` and `cartrack-ai-design-system/design-system/components/DataTable/`. Their `.tsx` files are byte-identical today; their `.doc.json` files have already drifted (different `category` value, different JSON formatting, an extra `related` field in the design-system copy). `tokens.json` between the two trees has drifted even further (400+ line diff). Prior build prompts in this repo (`foundations-redesign-build-prompt.md`) explicitly excluded `component-repo/` from edits. Treat **`cartrack-ai-design-system/design-system/`** as canonical and make all real changes there first. Then check whether `component-repo/components/DataTable/` is still meant to be a synced mirror or is legacy/frozen — if you can't tell from git history or timestamps, stop and ask rather than guessing which way to sync.
- **No new dependencies — this is a hard rule in `AGENTS.md`.** Every capability below must be built in plain React + CSS + existing tokens. Do not reach for a table/grid library, virtualization library, or resize/drag library. Fleet-web's real tables use MUI X `DataGridPremium` (see `table-deep-dive.md` §2) — that is reference material for *behavior*, never a dependency to import into this component.
- **Compose existing components, don't invent raw markup.** `AGENTS.md` rule 1: use `<ProgressIndicator>` for the loading state, `<Menu>` for the row-actions overflow, not ad-hoc `<div>`/`<button>` soup. Both already exist in `components/`.
- **Keep the MDC class contract.** `DataTable.tsx` renders `mdc-data-table__*` classes (see its own header comment: "Mirrors the mdc-data-table class contract from `md2-cartrack-library/components/data-table.html`"). New markup (sticky header wrapper, empty-state row, loading row, actions cell) should extend this contract with new `mdc-data-table__*`-style class names, not a parallel naming scheme.
- **There is currently no CSS backing this component at all.** `md2-cartrack-library/build/mdc.cartrack.theme.scss` has zero rules for `data-table`/`mdc-data-table`, and `component-library-preview.html`'s DataTable section uses a completely separate, simplified class set (`.dt`, `.dt-tb`, `.cbx`, `.schip`, `.dt-ft`, defined in that file's own `<style>` block) that doesn't share classes with the real component. You'll need to decide where new visual states (sticky header shadow, scroll boundary, loading bar, empty-state row) actually get styled — most likely inline in `DataTable.tsx` (matching how the component already has zero external CSS dependency) — and separately keep the preview's simplified mockup in sync by hand, since it's explicitly "manually synced, not live-linked" per `CLAUDE.md`.
- **Tokens discipline applies.** Use `tokens.primitive.*` for literal values in `.tsx`, cite `tokens.semantic.*` in `.doc.json`. The component's own header comment already flags: *"Not yet tokenized: row/header/toolbar heights (56/52/40/36/64px) have no matching dimension tokens."* If any new capability needs a new dimension (e.g. a default max-height for the scrollable variant), add it to `tokens.json` under the right primitive tier and log it in `_meta.changelog` — do not hardcode a new magic number if an existing token is close enough to reuse.
- **Two adjacent gaps are already tracked elsewhere — don't duplicate them.** `cartrack-ai-design-system/portal/docs/build_portal.py`'s `COMING_SOON["Messaging"]` already lists **Empty state** as a not-yet-built component ("no 'no data' placeholder component documented, despite DataTable being the most-used component — worth prioritizing") and `COMING_SOON["Text and data display"]` lists **Inline edit** and **Table tree** as separate not-yet-built components. This build prompt's empty-state work is a minimal placeholder *inside* DataTable for now, not that future dedicated component — say so in a code comment. Inline cell editing and hierarchical/nested ("tree") tables are explicitly **not** part of this build — see Phase 2 below.

## Decisions already made (do not re-litigate mid-build)

- **Phase 1 (build now):** sticky header, scrollable/bounded body, loading state, minimal empty state, canonical row-actions column, a generic toolbar-actions slot, and a documentation fix clarifying that server-side pagination is already supported today (no code gap there — see task 6).
- **Phase 2 (explicitly deferred — footnote in docs as future work, do not build):**
  - Column resizing, reordering, and pinning — these are MUI-X/fleet-web extensions, not Material Design–native, and are substantial to build without a library. Flag as future.
  - Column visibility toggle — same reasoning.
  - Export (CSV/Excel/PDF) — significant scope; the new `toolbarActions` slot (task 5) is the intended escape hatch so a consumer can bolt on their own export button without DataTable needing to know about it.
  - Row expansion / detail panel — not part of the MD2 data-table contract either; defer.
  - Inline cell editing — depends on the future dedicated "Inline edit" component per `COMING_SOON`. Until that exists, **remove or clearly footnote** the "Inline-editable" variant/behavior currently listed in `data-table.md` and `DataTable.doc.json` — it's documented today with zero implementation, which is worse than not documenting it.
  - Hierarchical/nested ("table tree") rows — its own future component per `COMING_SOON`; not this component's job, ever.
  - Multi-column sort — stays opt-out per the existing "Don't sort more than one column at once unless multi-sort is explicitly needed" rule. No change.
- If anything below turns out to be wrong once you're in the code (e.g. a prop name collides, or the MDC contract doesn't extend the way I assumed), stop and flag it rather than improvising silently.

## Task list

### 1. Sticky header
Add a `stickyHeader?: boolean` prop (default `false`). When true, `<thead>` stays fixed at the top of the scroll container while `<tbody>` scrolls beneath it. This is already promised at the page-pattern level (`templates/table-page.md:13`, "header sticky on scroll") but never delivered at the component level — this closes that promise.

### 2. Scrollable / bounded body
Add a `maxHeight?: number | string` prop. When set, wrap `.mdc-data-table__table-container` in a bounded, scrollable region (vertical scroll when content exceeds `maxHeight`; horizontal scroll on overflow-x always, regardless of `maxHeight`, since wide tables need this even unbounded). Verify this composes correctly with `stickyHeader` (the header must stay visually attached while the body scrolls) and doesn't break the existing pagination footer (footer stays outside/below the scroll region, not inside it).

### 3. Loading state
Add a `loading?: boolean` prop. When true, render a `<ProgressIndicator>` (indeterminate, linear — check its `doc.json` for the right variant prop) directly under the toolbar. Decide and document whether row interactions (sort clicks, row clicks, selection) are disabled while loading — recommendation: yes, disable, to match the fleet-web convention of overlay-blocking interaction during fetch. Do not build a skeleton-rows variant — that's a distinct, separate future component ("Skeleton" is its own `COMING_SOON` item, don't fold it in here).

### 4. Empty state
When `rows.length === 0` and not `loading`, render a single row spanning all columns (`<td colspan={columnCount}>`) with a centered message, instead of an empty `<tbody>`. Add an `emptyState?: React.ReactNode` prop for a custom message/action; default to a plain "No data" text node. Keep this deliberately minimal — see the `COMING_SOON` note above; add a code comment (`// Minimal placeholder — delegate to the dedicated Empty state component once it exists (see build_portal.py COMING_SOON["Messaging"])`) so the next person doesn't mistake this for the real thing.

### 5. Row actions + toolbar actions slots
- Add `rowActions?: (row: Row) => { label: string; onClick: (row: Row) => void; destructive?: boolean }[]`. When provided, render a trailing "⋮" icon-button cell per row that opens the existing `<Menu>` component with those items — this is the canonical version of the "per-row overflow actions (⋮)" already named in `templates/table-page.md:17`, built once here instead of every consuming module hand-rolling it.
- Add `toolbarActions?: React.ReactNode`, rendered in the default (non-contextual) toolbar alongside the title. This is the escape hatch for search/filter/export controls (composed by the caller from existing components — `TextField`, `Button`, `Menu` — not owned by DataTable). Document clearly in `.doc.json` that this is intentionally generic, not a built-in search/filter/export implementation.

### 6. Documentation-only fix: server pagination already works
`page`/`rowsPerPage`/`totalRows`/`onPageChange` already fully support server-driven pagination — the caller just fetches/slices data per page in `onPageChange` instead of paginating an already-full array client-side. There's no code gap here, only a documentation one (this was flagged in `table-deep-dive.md` §4 as "❌ Pagination (server/cursor)" — that's a doc gap, not a real one). Add a short "Server-driven pagination" note to the Behaviors section of `data-table.md` and to `doc.json`'s pagination prop descriptions clarifying this explicitly, with a one-line guidance on when to prefer it (e.g. "past a few thousand rows, or whenever the full dataset isn't practical to hold client-side").

### 7. Update every doc surface, in this order
1. `cartrack-ai-design-system/design-system/components/DataTable/DataTable.tsx` — the real implementation (tasks 1–6).
2. `cartrack-ai-design-system/design-system/components/DataTable/DataTable.doc.json` — new props, updated variants/behaviors, remove or footnote Inline-editable/Expandable rows (Phase 2), add the Phase 2 items to a clearly-labeled "not yet implemented" note if the schema supports it, otherwise just omit them.
3. `component-specs/data-table.md` — mirror the same prop/behavior/variant changes in prose; fix the header metadata line to state plainly this mirrors MD2 (no M3 data-table spec exists — already established in `table-deep-dive.md` §1).
4. `cartrack-ai-design-system/design-system/component-library-preview.html` — add visual tiles for sticky header + scrollable, loading, empty state, and row actions, using its existing simplified `.dt`/`.dt-tb`/`.schip`-style classes (not the real `mdc-data-table__*` classes — this file has always used its own simplified mockup markup, keep that convention). Remove or clearly re-label the Inline-editable/Expandable-rows tiles per the Phase 2 decision.
5. Portal: check whether `cartrack-ai-design-system/portal/docs/build_portal.py` generates `components/data-table.html` from the `.doc.json` or from hand-written content, and regenerate/update accordingly. If the `COMING_SOON["Messaging"]` "Empty state" note (line ~203, `build_portal.py`) needs rewording now that DataTable has a minimal placeholder, update its text to say so explicitly rather than leaving it implying nothing exists at all.
6. `component-repo/` copy — only touch after resolving the canonical-vs-mirror question in the Context section above.

### 8. Verify before finishing
- [ ] Sticky header actually stays fixed while scrolling a body taller than `maxHeight`, in a real browser render, not just visually plausible JSX.
- [ ] Horizontal scroll works on a table wider than its container, with and without `maxHeight` set.
- [ ] `loading` disables interaction and is announced to assistive tech (`aria-busy` or an `aria-live` region — check `<ProgressIndicator>`'s own accessibility notes for the right pattern).
- [ ] Empty-state row keeps valid `<table>` semantics (real `<tr>`/`<td colspan>`, not a `<div>` replacing the table body).
- [ ] Row-actions menu is keyboard-operable (opens on Enter/Space, closes on Escape) — check `<Menu>`'s own doc.json for what it already guarantees so you're not re-solving something it already handles.
- [ ] No hardcoded colors/spacing/type introduced; every new token path cited exists in `tokens.json`; any new dimension token appended to `_meta.changelog`.
- [ ] `DataTable.doc.json` still matches `DataTable.tsx` prop-for-prop — no more doc/code drift in either direction.
- [ ] `tokens.json` (whichever copy you touched) still parses as valid JSON.
- [ ] Re-run `vibe-tests/` if you materially changed `AGENTS.md` guidance anywhere (you likely won't need to) — otherwise not required for this change.

## Guardrails (repeat because they matter most)

- Do not add a dependency. If a capability seems to require one, stop and say so instead of installing something.
- Do not build Phase 2 items (resize/reorder/pin/visibility/export/expansion/inline-edit/tree). Footnote them, don't implement them.
- Do not edit `component-repo/` until you've resolved whether it's still a live mirror.
- Do not invent a token value — reuse or properly add to `tokens.json`, never a bare hex/px in `.tsx`.
- If `component-library-preview.html`'s markup conventions or `build_portal.py`'s generation logic have changed since this prompt was written, stop and report the discrepancy rather than guessing.
