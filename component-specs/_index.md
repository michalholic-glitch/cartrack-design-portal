# Cartrack Component Specs — index

AI-readable specs for the Material 2 (MDC) Cartrack component library. One file per component. Read the relevant spec **before** generating UI; read `DESIGN.md` for tokens and `AGENTS.md` for the rules.

**29 components.** Source of truth: `md2-cartrack-library/`.

## Actions

| Component | Spec | What it is |
| --- | --- | --- |
| Buttons | [`buttons.md`](./buttons.md) | Buttons let operators trigger actions — saving a vehicle, running a report, confirming a change. Emphasis… |
| Menus | [`menus.md`](./menus.md) | Menus show a temporary list of choices on a surface — overflow actions behind a ⋮ button, row actions in a… |

## Inputs & forms

| Component | Spec | What it is |
| --- | --- | --- |
| Chips | [`chips.md`](./chips.md) | Chips are compact elements that represent an input, a filter, or a choice — a selected driver, an active… |
| Pickers — date & time | [`pickers.md`](./pickers.md) | Pickers help operators choose dates and times — a trip window, a report period, a maintenance due date.… |
| Selection controls | [`selection-controls.md`](./selection-controls.md) | Selection controls capture choices: checkboxes for multi-select, radio buttons for one-of-many, and… |
| Sliders | [`sliders.md`](./sliders.md) | Sliders let an operator choose a value, or a range, by dragging along a track — useful for soft,… |
| Text fields | [`text-fields.md`](./text-fields.md) | Text fields let operators enter and edit text — a registration number, a driver's name, an odometer… |

## Navigation

| Component | Spec | What it is |
| --- | --- | --- |
| App bar (top) | [`app-bar.md`](./app-bar.md) | The top app bar is the page header — it names where the operator is and holds page-level actions: global… |
| Breadcrumbs | [`breadcrumbs.md`](./breadcrumbs.md) | Breadcrumbs show where the operator is within the portal's hierarchy and let them step back up it — from a… |
| Navigation drawer | [`navigation-drawer.md`](./navigation-drawer.md) | The navigation drawer is the portal's primary, persistent navigation — anchored to the left edge and… |
| Navigation rail | [`navigation-rail.md`](./navigation-rail.md) | The navigation rail is a compact, icon-first side navigation. It's the collapsed form of the drawer — used… |
| Steppers | [`steppers.md`](./steppers.md) | A stepper guides an operator through a task in ordered steps — onboarding a new vehicle, building a… |
| Tabs | [`tabs.md`](./tabs.md) | Tabs switch between related views of the same subject — a vehicle's Overview, Trips, Maintenance, and… |

## Data display

| Component | Spec | What it is |
| --- | --- | --- |
| Badges | [`badges.md`](./badges.md) | A badge is a small indicator placed on another element to show a count or status — the number of unread… |
| Data table | [`data-table.md`](./data-table.md) | Data tables present sets of records across rows and columns — the primary way operators scan, sort,… |
| Dividers | [`dividers.md`](./dividers.md) | A divider is a thin line that separates and groups content — between list items, sections of a form, or… |
| Image lists | [`image-lists.md`](./image-lists.md) | Image lists arrange images in a grid — vehicle photos, inspection snapshots, document scans, map… |
| Lists | [`lists.md`](./lists.md) | Lists present a vertical run of related records — drivers, notifications, recent vehicles. Each row pairs… |
| Pagination | [`pagination.md`](./pagination.md) | Pagination breaks a large dataset into pages an operator can move through — the standard way to navigate… |
| Progress indicators | [`progress.md`](./progress.md) | Progress indicators show that the app is working — loading a report, exporting trips, fetching a page of… |
| Tooltips | [`tooltips.md`](./tooltips.md) | Tooltips reveal a short text label on hover or focus — naming an icon-only button, or showing a value… |

## Other

| Component | Spec | What it is |
| --- | --- | --- |
| AGENTS.md — Cartrack Portal UI (Material 2 / MDC) | [`AGENTS.md`](./AGENTS.md) |  |
| AGENTS.md — Cartrack Portal UI (Material 2 / MDC) | [`CLAUDE.md`](./CLAUDE.md) |  |

## Feedback

| Component | Spec | What it is |
| --- | --- | --- |
| Banners | [`banners.md`](./banners.md) | A banner is a prominent message with one or two actions, shown at the top of a region. It surfaces… |
| Snackbars | [`snackbars.md`](./snackbars.md) | A snackbar gives brief, low-priority feedback about an action just taken — "Vehicle saved", "Export… |

## Surfaces

| Component | Spec | What it is |
| --- | --- | --- |
| Cards | [`cards.md`](./cards.md) | A card groups related content and actions about a single subject — a vehicle summary, a KPI, an alert.… |
| Dialogs | [`dialogs.md`](./dialogs.md) | A dialog is a modal window for a focused task or decision that interrupts the operator on purpose —… |
| Expansion panels | [`expansion-panels.md`](./expansion-panels.md) | Expansion panels (accordions) let operators reveal detail on demand — collapsing a long record or settings… |
| Side sheet | [`side-sheet.md`](./side-sheet.md) | A side sheet is a surface anchored to the right edge that shows contextual detail beside the main content… |
