# Cartrack Fleet Design System (AI-optimized)

AI-optimized design system for the Cartrack Fleet Portal. This file is the index — a pointer, not a reference. Behavior rules live in @AGENTS.md — follow them for all AI work in this folder.

Built on **Material UI v9** (`@mui/material`), mirroring the production fleetapp-web component layer (`@karoo-ui/core` — thin wrappers over MUI) and its theme — these are the values and APIs production actually uses, not idealized specs. (Rebuilt 2026-07-24 from an earlier Material Components Web model; `components/README.md` records the old→new component name mapping.)

## Structure

This folder is the whole package — everything an AI agent or developer needs to generate
UI with this system. It's meant to be connected as a workspace root on its own (see the
note at the bottom of this section).

```
design-system/
├── CLAUDE.md                        # This file — the index (auto-loaded by Claude tools)
├── AGENTS.md                        # Rules AI agents must follow when generating UI
├── README.md                        # Human-friendly overview
├── tokens/
│   └── tokens.json                  # Single source of truth: color, spacing, type, radius, border width
├── components/                      # 30 components, one folder each
│   ├── README.md                    # Rebuild rationale + MDC→MUI name mapping (read once)
│   ├── theme.ts                     # tokens.json semantic tier → MUI createTheme(); every
│   │                                # component assumes <ThemeProvider theme={cartrackTheme}>
│   └── <Name>/
│       ├── <Name>.tsx               # Thin wrapper over the real @mui/material component,
│       │                            # reproducing @karoo-ui/core's actual overrides
│       ├── <Name>.doc.json          # Structured docs — props, variants, doThis/dontDoThis, tokens
│       └── index.ts                 # Export
├── templates/                       # Patterns — full-page (table-page, detail-page, login, etc.) and
│                                    # cross-cutting regions (main-navigation, page-header) — how
│                                    # components compose into screens; read the whole folder, don't
│                                    # assume this list is complete
├── vibe-tests/                      # Tests whether these docs actually produce correct output from a
│                                    # fresh AI agent — see vibe-tests/README.md
└── component-library-preview.html   # Static mockups (predate the MUI rebuild — visual approximation
                                     # only; the portal's live demos render the real components)
```

Four components have no MUI backing and keep their original standalone implementations:
`Banner`, `NavigationRail` (no real MUI/karoo-ui equivalent exists), `Icon` (wraps the
app's real FontAwesome system) and `PageHeader` (a faithful port of fleet-web's own
component). `DataGrid` and `DatePicker` wrap **MUI X** — running them needs an
`@mui/x-license` key (see their `licenseNote` fields).

**Where this folder lives:** in the source repo, `design-system/` sits beside a sibling
`portal/` folder that holds the documentation website, its generator script, and the
Cartrack *marketing* brand guidelines (`portal/brand/` — reference-only, not a token
source; never cite a `brand/*.doc.json` value in a component's tokens list or `.tsx`
styles). None of that is needed to use the system — `design-system/` is the complete,
self-contained deliverable. If you downloaded this as a zip, the folder you're standing
in now is everything; there's nothing above it to worry about.

## Before writing any UI

1. Check `templates/` for a matching page pattern — reuse its structure and composition rules before inventing a layout.
2. Check `components/<Name>/<Name>.doc.json` for every component you plan to use — read `doThis`/`dontDoThis` and `tokens` before writing.
3. Never hardcode colors, spacing, type, or radii — style through the theme (`components/theme.ts`) and `sx` with theme values. See AGENTS.md rule 3.
4. Render everything under `<ThemeProvider theme={cartrackTheme}>` — unthemed MUI is not this design system.

## Tokens — how to read tokens.json

- `primitive.*` — raw values (hex, px).
- `semantic.*` — named roles (e.g. `semantic.color.brand.primary.main`). Mostly alias strings like `"{primitive.color.brand.orange.500}"`; their resolved values are authored into `components/theme.ts`, which is how they reach components at runtime. Cite `semantic.*` paths in docs; don't paste alias strings into style values.
- `legacy.*` — deprecated pre-MUI values (5px spacing grid, bold=600). Don't use in new work.
- Structural changes must be appended to `tokens.json` → `_meta.changelog`.

## Known issues

- White text on brand orange `#F47735` fails WCAG AA (~2.79:1). Use `semantic.color.brand.primary.dark` (`#BB4800`, ~5.2:1) for filled surfaces with white text. Details: `tokens.json` → `accessibility.knownIssues`.

## Testing whether the docs actually work

`vibe-tests/` checks whether `AGENTS.md` + the component `.doc.json` files produce correct
output from a fresh agent, instead of just assuming they do. Modeled on Meta's Astryx
`/vibe-test` harness, scoped down for a docs-only repo (no build, no CI, no screenshot diffing) —
it checks structural correctness: real components/tokens only, `doThis`/`dontDoThis` followed,
gaps flagged instead of fabricated.

To run: spawn a fresh subagent per prompt in `vibe-tests/prompts.json`, give it repo access and
nothing else, have it self-evaluate and write results, then run `node vibe-tests/aggregate.mjs <iteration>`.
Full instructions and result schema: `vibe-tests/README.md`.

Re-run after material changes to `AGENTS.md` or `tokens.json` — a passing run today doesn't mean
the docs still hold up after the next edit.

## Conventions

- Components live in `components/<Name>/` — always the 3-file pattern above.
- Tokens are the only source of visual values; they reach components through `theme.ts`.
- If a needed component doesn't exist, check `dontDoThis` patterns across similar components before inventing a new API shape — and prefer flagging the gap over fabricating. Composing from `@mui/material` primitives is allowed; inventing non-MUI APIs is not.
