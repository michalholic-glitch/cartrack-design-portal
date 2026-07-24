# components-mui/ — MUI-accurate rebuild

This folder is a rebuild of `design-system/components/*` against the real underlying library. fleet-web's actual component layer is `@karoo-ui/core` (`libs/shared/js/karoo-ui/core` in the fleetapp-web monorepo), a thin wrapper over Material UI v9 (`@mui/material`) — not Material Components Web (MDC), which `design-system/components/*` modeled. `design-system/components/*` is left untouched; this is a parallel, corrected set.

Each component here follows the same three-file pattern as before:

- **`<Name>.tsx`** — a thin wrapper around the real MUI primitive, mirroring the `@karoo-ui/core` pattern: import the real component from `@mui/material` (or `@mui/x-data-grid` / `@mui/x-date-pickers` for the two MUI X components), forward all of its real props, and override only what the real karoo-ui wrapper actually overrides. No workspace-only imports (`@karoo/utils`, `../forwardRefTyped`, etc.) — just `react` and `@mui/*`, so it's portable outside the fleetapp-web monorepo. Styling comes from `theme.ts` via `<ThemeProvider>`, not hand-rolled CSS classes.
- **`<Name>.doc.json`** — same schema as before (variants, anatomy, behaviors, states, specs, tokens, props, doThis/dontDoThis, accessibility, related), corrected so `library`, `source`, `props`, and `specs` describe the real MUI API instead of an invented MDC one.
- **`index.ts`** — barrel export, unchanged pattern.

## Naming / boundary corrections vs. design-system/components/*

| Old name (`components/`) | New name(s) (`components-mui/`) | Why |
|---|---|---|
| ExpansionPanel | Accordion | Real MUI/karoo-ui name |
| SelectionControl | Checkbox, Radio, Switch | Real library has 3 separate components, not 1 umbrella component |
| ProgressIndicator | CircularProgress, LinearProgress | Real library has 2 separate components |
| DataTable | DataGrid | Real fleet-web tabular data uses MUI X DataGrid, not a plain `<table>` |
| NavigationDrawer, SideSheet | Drawer | Both already confirmed to duplicate-map to the same real component — merged into one |
| Picker | DatePicker | Represents the real MUI X Date/Time Pickers family (DatePicker/TimePicker/DateRangePicker/DateTimePicker) |
| Badge, Breadcrumbs, Button, Card, Chip, Dialog, Divider, ImageList, List, Menu, Pagination, Slider, Snackbar, Stepper, Tabs, TextField, Tooltip | same name | Already 1:1 with the real component |

## Not included in this pass

- **Banner**, **NavigationRail** — confirmed to have no real MUI/karoo-ui backing at all; they stay only in `design-system/components/*`.
- **Icon**, **PageHeader** — already sourced correctly from the real codebase (FontAwesome and fleet-web's own `PageHeader`, respectively — neither is MDC), so there was nothing to correct. Not duplicated here.

## License note — DataGrid & DatePicker

`DataGrid` and `DatePicker` (and its family: TimePicker, DateRangePicker, DateTimePicker) are **MUI X**, and the real fleet-web app uses the Premium/Pro tiers in places. Running these in any environment other than Cartrack's licensed one requires a valid `@mui/x-license` key, or you'll get watermarks / console errors. Each of these two `.doc.json` files repeats this note under `licenseNote`.

## Shared theme

`theme.ts` builds a MUI theme from `tokens.json`'s semantic tier (palette, typography, shape) plus the real default-prop overrides captured in the production `ThemeProvider.tsx` (small-size form controls, body2 default variant, etc.). See the file header for what's intentionally omitted for portability.
