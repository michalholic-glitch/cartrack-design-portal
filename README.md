# Cartrack Fleet Design System — AI-Optimized

A self-contained, AI-ready design system for the Cartrack Fleet Portal. Everything an AI coding agent (or a human developer) needs to generate consistent, on-brand, accessible UI lives in this one folder — no build step, no external dependencies.

It follows the "lean AI-optimized design system" pattern (modeled on Meta's Astryx approach): design tokens as a single source of truth, per-component structured documentation colocated with the code, and short root-level instruction files that tell an AI agent how to behave — instead of one giant style-guide document nobody reads.

All values are **derived from the real fleetapp-web production codebase** (karoo-ui / MUI theme, MDC 14 components, legacy Sass variables) — this documents what actually ships, not an idealized spec.

## What's inside

| Path | What it is | Who reads it |
|---|---|---|
| `README.md` | This file — human-friendly overview | People |
| `CLAUDE.md` | The index: folder map, how the token tiers work, known issues. Auto-loaded by Claude tools (Cowork, Claude Code) when the folder is connected | AI agents first, then people |
| `AGENTS.md` | The behavior contract: rules an AI agent must follow when generating UI (do/don't list, verification checklist) | AI agents |
| `tokens/tokens.json` | Single source of truth for color, spacing, typography, radius, and border width. Two tiers: `primitive` (raw values) and `semantic` (named roles), plus a `legacy` section and a `_meta.changelog` | AI agents + developers |
| `components/` | 27 components, one folder each: `<Name>.tsx` (React implementation), `<Name>.doc.json` (structured docs: props, variants, do/don't rules, token references), `index.ts` (export) | AI agents + developers |
| `templates/` | Page patterns — table page, detail page, map/tracking view, settings, login: which components compose each screen and the composition rules | AI agents + designers |
| `component-library-preview.html` | Static visual preview of every component — open it in any browser, no server needed | People |
| `docs/` | The documentation portal (`docs/index.html`): getting started, rules, token + component reference, patterns, downloads. Generated from the source files by `docs/build_portal.py` — edit the sources and re-run, never hand-edit the HTML | People |

## How to use it

**With an AI agent:** point the agent at this folder and ask it to build UI. Claude tools (Cowork, Claude Code) auto-load `CLAUDE.md`, which imports the rules from `AGENTS.md`; other tools (Cursor, Copilot, Codex) pick up `AGENTS.md` directly via the agents.md standard. Either way, no per-session setup is needed.

**As a developer:** open `component-library-preview.html` to browse the components visually, check a component's `.doc.json` for its API and usage rules, and take all visual values from `tokens/tokens.json`.

## The three rules that matter most

1. **Never hardcode visual values** — colors, spacing, type, radii always come from `tokens/tokens.json`.
2. **In `.tsx` inline styles use `primitive.*` values** — most `semantic.*` entries are alias strings (`"{primitive...}"`) awaiting a build-time resolver this folder deliberately doesn't include. Full explanation in `AGENTS.md`, rule 3.
3. **White text on brand orange `#F47735` fails WCAG AA** (~2.79:1). Filled surfaces with white text use `primary.dark` `#BB4800` instead. See `tokens.json → accessibility.knownIssues`.

## Scope and known limitations

- **MD2-based** (Material Design 2 / MDC 14), matching the current production portal — not MD3.
- The HTML preview is **hand-authored and manually synced** to tokens.json — it is not generated from the components or tokens, so changes to either require a manual re-sync.
- `semantic.*` alias resolution, tests, Storybook, and theme packages are deliberately **not** included yet — the lean pattern adds them only when a concrete pain justifies each.

## Changelog convention

Any structural change to `tokens/tokens.json` must append an entry to its `_meta.changelog` array. Component-level changes are documented in the component's own `.doc.json`.
