# Cartrack Fleet Design System (AI-optimized)

AI-optimized design system for the Cartrack Fleet Portal. This file is the index — a pointer, not a reference. Behavior rules live in @AGENTS.md — follow them for all AI work in this folder.

Derived from the real fleetapp-web codebase (karoo-ui / MUI theme, MDC 14 components, legacy Sass variables) — these are the values production actually uses, not idealized specs.

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
├── components/                      # 27 components, one folder each
│   └── <Name>/
│       ├── <Name>.tsx               # Implementation (React, MDC class contract)
│       ├── <Name>.doc.json          # Structured docs — props, variants, doThis/dontDoThis, tokens
│       └── index.ts                 # Export
├── templates/                       # Page patterns: table-page, detail-page, map-tracking-view,
│                                    # settings-page, login — how components compose into screens
├── vibe-tests/                      # Tests whether these docs actually produce correct output from a
│                                    # fresh AI agent — see vibe-tests/README.md
└── component-library-preview.html   # Static visual preview of all components (open in a browser)
```

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
3. Never hardcode colors, spacing, type, or radii — always reference `tokens/tokens.json`. See AGENTS.md for the primitive-vs-semantic rule.
4. Open `component-library-preview.html` to see what any component should look like.

## Tokens — how to read tokens.json

- `primitive.*` — raw values (hex, px). Concrete literals, safe to use directly in code.
- `semantic.*` — named roles (e.g. `semantic.color.brand.primary.main`). Most are alias strings like `"{primitive.color.brand.orange.500}"` awaiting a build-time resolver — reference them in docs, but don't paste them into style values. Exceptions written as real literals: `semantic.color.text.*`, `semantic.color.border.default`, `semantic.color.interactive.*`.
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
- Tokens are the only source of visual values.
- If a needed component doesn't exist, check `dontDoThis` patterns across similar components before inventing a new API shape — and prefer flagging the gap over fabricating.
