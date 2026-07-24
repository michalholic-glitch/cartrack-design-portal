# portal/reference/ — provenance & research (not shipped, not a build input)

Historical and research material that informed the design system but is **not**
part of the downloadable package (`design-system/`) and is **not** read by the
portal build (`portal/docs/build_portal.py`). Safe to consult; safe to ignore.

## `component-specs/`
Research and decision records. The per-component prose specs that once lived here
were retired when the component `.doc.json` files became the single source of
truth. What remains is worth keeping for context:
- `table-deep-dive.md` — the fleet-web table analysis behind the DataTable →
  DataGrid decision.
- `DESIGN.md`, `README.md` — earlier design rationale.

## `md2-cartrack-library/`
The Material Components Web (MDC 14) reference the component library was
**originally** modeled on, before the 2026-07-24 rebuild onto Material UI v9.
Now legacy provenance:
- `components/*.html` — the MDC markup pages cited in some component `.tsx`
  header comments and `.doc.json` `source` fields (provenance only).
- `build/` — the recipe (`BUILD.md` + theme SCSS) that compiles
  `mdc.cartrack.css`. That CSS is already **prebuilt and committed** to
  `portal/docs/assets/mdc.cartrack.css`, where it styles the three carried-over
  legacy components (Banner, NavigationRail) on their portal pages. You only need
  this folder if you ever recompile that stylesheet.

Nothing here needs to move again for the portal or the download package to work.
