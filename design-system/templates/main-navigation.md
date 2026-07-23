# Main Navigation (Persistent left sidebar / app shell nav)

The vertical rail that's present on every authenticated page — the single way an operator moves between fleet modules (Map, Dashboard, Reports, Settings, …).

## Layout

Fixed-height flex column, full viewport height: Header (logo + collapse toggle) > scrollable primary item list > optional AI Chat entry > Footer (utility icon row + Account + Powered-by). 220px wide expanded, 68px collapsed, width animates on toggle.

## Components used

- Tooltip — flyout sub-item panel when the rail is collapsed (or when a row is momentarily closed while expanded); also wraps truncated item labels so the full text is available on hover.
- Chip — "Beta" / "New" badges on a row's label; a numeric Badge on the Alerts / Engine Faults / Help footer icons shows outstanding counts.
- No dedicated Icon component exists yet (tracked gap, see Components — Images and icons) — each row's icon is an individual MUI icon wrapped in a plain SvgIcon, not a shared Icon component.
- Not built from NavigationDrawer or NavigationRail — this pattern is its own implementation on top of the third-party `react-pro-sidebar` library. Those two documented components have zero real usage elsewhere in the app (confirmed 2026-07-20 gap analysis) and should not be assumed to back this pattern.

## Structure rules

- One row per top-level module (Dashboard, Map, Costs, Reports, etc.); a row either navigates directly or expands a sub-menu — never both from the same click target.
- Every row is permission-gated (a permission selector and/or a feature flag); rows for modules the current user or tenant can't access are not rendered, not just disabled.
- Sub-items render as a flyout Tooltip panel when the rail is collapsed, or when a row is expanded but its own sub-menu happens to be closed; when both the rail and the row's sub-menu are open, sub-items render inline instead.
- Exactly one row (or sub-item) is marked active at a time, matched against the current route — including parameterized routes (e.g. `/vehicles/:id`) via prefix comparison, not exact string match alone.
- A loading spinner replaces a row's expand icon while its data is still resolving (e.g. the Vision row, while checking available camera terminals) instead of showing an empty or incorrect state.
- The rail auto-collapses and hides the Header's collapse toggle on the fullscreen map view and the shared/public map view — those pages get no persistent chrome.
- Collapse state is a per-user preference, persisted to IndexedDB and synced to Redux, not a page-level default.

## Notes

- Rail and text colours are not fixed design tokens — they resolve at runtime from per-tenant white-label settings (navbar colour, active/hover colours for menu and sub-menu), so two customers can see differently coloured navigation from the same code. Don't hardcode nav colours from `tokens.json` when referencing this pattern.
- The data behind every row lives beside its routes, not in one central config file: each module (its own `routes/*` file) exports its own tab/sub-tab definitions — id, icon, path, permission selector, optional sub-menu — and the sidebar just concatenates them in display order.
- Footer icons (Settings, Privacy, Help, Engine Faults, Alerts) are a separate, always-icon-only row, not additional primary rows — treat "utility" and "primary navigation" as two distinct groups when adding a new module.
- Extracted from the real FleetWeb codebase (`modules/app/components/MainSideNavbar`), not the idealized MD3 baseline — this is what's actually shipped and used on every page.
