# Page Header (Title + actions row, top of nearly every page)

The horizontal row at the top of almost every authenticated page — title (or a back-link) on the left, page-level actions on the right. Unlike the other patterns here, this one is backed by a real, broadly-reused shared component, not ad-hoc per-page markup.

## Layout

Single row, `justify-content: space-between`: left slot (Title, or a back-link) — right slot (ButtonsContainer). No wrapper chrome — no border, no elevation, no sticky/fixed positioning. It scrolls with the page.

## Components used

- PageHeader — the row itself: `PageHeader.Title` for the left slot, `PageHeader.ButtonsContainer` for the right. Now documented as its own component (see PageHeader) — this pattern is about how to compose it, the component doc is the API.
- Button — one or more primary/secondary actions inside ButtonsContainer (e.g. "Add vehicle"); never a floating action button.
- Menu — overflow actions (⋮) inside ButtonsContainer when there are more actions than fit as buttons.
- Breadcrumbs — repurposed (not a true multi-level trail) on detail/drill-down pages: a back-link (arrow icon + parent label) followed by the current record's name, both inside a plain MUI `Breadcrumbs` wrapper.
- Tabs — placed in their own row *below* the header, never inside it; any border/divider seen near a header belongs to the Tabs row, not the header.

## Structure rules

- Three real variants, by page type:
  - **Simple/settings header** — title only, no actions (e.g. My Profile, Audit, Import Data).
  - **List header** — title + ButtonsContainer holding one or more primary/secondary Buttons (e.g. Vehicles, Drivers, Geofences — "Add X" as the primary action).
  - **Detail/drill-down header** — the left slot becomes a back-link (Breadcrumbs > back arrow + parent label > current record name), right slot is still ButtonsContainer (e.g. a driver's single-infractions or single-score view).
- The right slot is always right-aligned by virtue of the row's `space-between`; multiple actions wrap onto a second line on narrow viewports rather than overflowing.
- Page-level padding and the vertical gap between the header and the content below it come from the page's outer container, not from the header itself.
- Contextual variants (e.g. a selection-count + bulk-action row swapped in when table rows are checked) reuse the same left/right slot shape, just with different content.

## Notes

- Real component: `apps/fleet-web/src/components/_containers/PageHeader/index.tsx`. A compound export — `PageHeader` (the row), `PageHeader.Title` (`Typography variant="h5"`, the app's one page-title scale), `PageHeader.ButtonsContainer` (a wrapping, right-aligned action row). Imported in 43 page files across vehicles, drivers, settings, tachograph, scorecards, geofences, importer, and alerts — confirmed live in the codebase, 2026-07-23. As of 2026-07-23 it's also a fully documented component in `components/PageHeader/` (`.tsx` + `.doc.json`), so it can be imported directly rather than recomposed by hand each time.
- This closes the gap left by AppBar's removal (2026-07-22): AppBar had zero real usage, but `PageHeader` is what fleet-web actually ships and reuses everywhere. Table page, Detail page, and Settings page all reference this pattern by name.
- Two older, unrelated header primitives exist in legacy (pre-MUI) parts of the app — don't confuse them with this pattern: `SectionHeader` (`util-components/section-header.tsx`, in-page section headings, not a top-of-page header) and `AdminHeader` (`util-components/admin-header.tsx`, admin module only, has a genuine multi-crumb `breadcrumbs` prop). Neither backs current MUI-based pages.
- No sticky/elevation/border behaviour exists on the header anywhere it's used — don't add one when applying this pattern unless a specific page has a documented reason to.
