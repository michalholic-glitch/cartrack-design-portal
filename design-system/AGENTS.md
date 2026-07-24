# AGENTS.md — Cartrack Fleet Design System

Rules an AI coding agent must follow when generating or editing UI with this design system. Start with `CLAUDE.md` for the folder map and token model; this file is the behavior contract.

## What this project is

Component library + design tokens for the Cartrack Fleet Portal — a dense, data-heavy web app used by fleet operators. React + TypeScript on **Material UI v9** (`@mui/material`), mirroring the production `@karoo-ui/core` wrapper layer from fleetapp-web and themed by `components/theme.ts`. Values are derived from the production codebase, so they reflect what actually ships. (The library was rebuilt 2026-07-24 from an earlier Material Components Web (MDC) model — see `components/README.md` for the naming/boundary corrections; the MDC set lives only in git history.)

## Design system rules (read before generating any UI)

1. **Use our components, never raw HTML elements** when a component exists. Use `<Button>`, not `<button>`; `<TextField>`, not `<input>`; `<Card>`, not a styled `<div>`. All 30 live in `components/`. Compose missing sub-primitives (e.g. `FormControlLabel`, `Step`, `MenuItem`) from `@mui/material` directly — our components forward the real MUI API, and MUI primitives are part of this system's contract.
2. **Use design tokens, never hardcoded values.** No raw hex, px, or font names. Source: `tokens/tokens.json`.
3. **Styling flows through the theme, not inline styles.** Every component must render under `<ThemeProvider theme={cartrackTheme}>` (`components/theme.ts`, built from tokens.json's semantic tier). Style variations use component props and `sx` with theme values (`theme.palette.primary.dark`, `theme.spacing(2)`) — never pasted literals. In `.doc.json` files and documentation, cite `semantic.*` token paths. (`tokens.semantic.*` values are mostly alias strings resolved by authorship into theme.ts — don't paste them into runtime styles.)
4. **Component docs are the source of truth.** Before using a component, read its `<Name>.doc.json` — respect `props`, `variants`, `doThis`/`dontDoThis`, and its `tokens` list. Wrappers forward the full MUI prop surface; the doc.json documents the subset that matters here plus every Cartrack-specific default.
5. **One primary action per view.** One contained primary button; secondary actions use outlined/text variants. Note the real MUI default `variant` is `"text"` — pass `variant="contained"` explicitly for the primary action.
6. **WCAG AA is not optional.** Never put white text on brand orange `#F47735` (~2.79:1, fails AA) — use `primary.dark` `#BB4800` for filled+white surfaces, or a light surface with dark text. Every interactive element needs an accessible name and visible focus.
7. **Match existing patterns.** Check every file in `templates/` for one that matches what you're building — full-page patterns (table page, detail page, map view, settings, login) and cross-cutting region patterns reused across pages (main navigation, page header) — and follow its structure and composition rules rather than inventing a new layout. Don't rely on this parenthetical staying complete; read the actual folder.

## Hard "do not" list

- Do NOT hardcode colors, spacing, font sizes, or radii — style via theme values and `sx`.
- Do NOT render components outside `<ThemeProvider theme={cartrackTheme}>` — unthemed MUI is not this design system.
- Do NOT use `legacy.*` tokens (5px grid, bold=600) in new work.
- Do NOT invent new components, variants, props, or tokens — if something is missing, flag it explicitly instead of fabricating it.
- Do NOT edit `tokens.json` structurally without appending an entry to `_meta.changelog`.
- Do NOT add dependencies beyond the system's declared ones: `react`, `@mui/material` (+ `@emotion/react`/`@emotion/styled` as its peers), and — license permitting — `@mui/x-data-grid` / `@mui/x-date-pickers` for DataGrid and DatePicker only.
- Do NOT use MUI X Premium/Pro features (DataGrid, DatePicker family) without a valid `@mui/x-license` key — see those components' `licenseNote` fields.

## Where to find things

- Folder map, token model, known issues: `CLAUDE.md`
- Library rebuild rationale + old→new component name mapping: `components/README.md`
- The theme (tokens → MUI): `components/theme.ts`
- Page patterns (how components compose into screens): `templates/`
- Visual tokens: `tokens/tokens.json` (`_meta` explains structure and sources)
- Per-component documentation: `components/<Name>/<Name>.doc.json`
- Visual reference: `component-library-preview.html` (static mockups — predates the MUI rebuild, kept as a visual approximation; the portal's live demos render the real components)

## How to verify your work before finishing

- [ ] `tokens.json` still parses as valid JSON (if you touched it)
- [ ] No hardcoded colors/spacing/type introduced — styling goes through theme/`sx`
- [ ] Only existing components, variants, and token paths used (every path you cite exists in `tokens.json`)
- [ ] Everything renders under `<ThemeProvider theme={cartrackTheme}>`
- [ ] No white-on-orange (`#FFFFFF` on `#F47735`) combinations
- [ ] New/changed components keep the 3-file pattern: `<Name>.tsx`, `<Name>.doc.json`, `index.ts`

## When unsure

Prefer asking over guessing. If a component, variant, or token doesn't exist, say so explicitly rather than inventing one. Confident-but-wrong output is the failure mode this system exists to avoid.
