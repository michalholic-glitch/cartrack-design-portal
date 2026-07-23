# AGENTS.md — Cartrack Fleet Design System

Rules an AI coding agent must follow when generating or editing UI with this design system. Start with `CLAUDE.md` for the folder map and token model; this file is the behavior contract.

## What this project is

Component library + design tokens for the Cartrack Fleet Portal — a dense, data-heavy web app used by fleet operators. React + TypeScript, Material Design 2 (MDC 14.0.0) class contract, Cartrack-themed. Values are derived from the production fleetapp-web codebase (karoo-ui / MUI theme), so they reflect what actually ships.

## Design system rules (read before generating any UI)

1. **Use our components, never raw HTML elements** when a component exists. Use `<Button>`, not `<button>`; `<TextField>`, not `<input>`; `<Card>`, not a styled `<div>`. All 28 live in `components/`.
2. **Use design tokens, never hardcoded values.** No raw hex, px, or font names. Source: `tokens/tokens.json`.
3. **Primitive vs semantic — the one non-obvious rule:** in `.tsx` inline styles, use `tokens.primitive.*` (concrete literals). Most `tokens.semantic.*` values are unresolved alias strings (`"{primitive...}"`) meant for a build-time resolver this repo doesn't have — using one in a style prop sets the CSS property to that literal placeholder text. Safe semantic exceptions (authored as real literals): `semantic.color.text.*`, `semantic.color.border.default`, `semantic.color.interactive.*`. In `.doc.json` files and documentation, always cite `semantic.*` paths.
4. **Component docs are the source of truth.** Before using a component, read its `<Name>.doc.json` — respect `props`, `variants`, `doThis`/`dontDoThis`, and its `tokens` list.
5. **One primary action per view.** One contained primary button; secondary actions use outlined/text variants.
6. **WCAG AA is not optional.** Never put white text on brand orange `#F47735` (~2.79:1, fails AA) — use `primary.dark` `#BB4800` for filled+white surfaces, or a light surface with dark text. Every interactive element needs an accessible name and visible focus.
7. **Match existing patterns.** Check every file in `templates/` for one that matches what you're building — full-page patterns (table page, detail page, map view, settings, login) and cross-cutting region patterns reused across pages (main navigation, page header) — and follow its structure and composition rules rather than inventing a new layout. Don't rely on this parenthetical staying complete; read the actual folder.

## Hard "do not" list

- Do NOT hardcode colors, spacing, font sizes, or radii.
- Do NOT paste `semantic.*` alias strings into runtime style values (rule 3).
- Do NOT use `legacy.*` tokens (5px grid, bold=600) in new work.
- Do NOT invent new components, variants, props, or tokens — if something is missing, flag it explicitly instead of fabricating it.
- Do NOT edit `tokens.json` structurally without appending an entry to `_meta.changelog`.
- Do NOT add new dependencies.

## Where to find things

- Folder map, token model, known issues: `CLAUDE.md`
- Page patterns (how components compose into screens): `templates/`
- Visual tokens: `tokens/tokens.json` (`_meta` explains structure and sources)
- Per-component documentation: `components/<Name>/<Name>.doc.json`
- Visual reference: `component-library-preview.html` (static — synced manually to tokens.json, not live-linked)

## How to verify your work before finishing

- [ ] `tokens.json` still parses as valid JSON (if you touched it)
- [ ] No hardcoded colors/spacing/type introduced
- [ ] Only existing components, variants, and token paths used (every path you cite exists in `tokens.json`)
- [ ] No white-on-orange (`#FFFFFF` on `#F47735`) combinations
- [ ] New/changed components keep the 3-file pattern: `<Name>.tsx`, `<Name>.doc.json`, `index.ts`

## When unsure

Prefer asking over guessing. If a component, variant, or token doesn't exist, say so explicitly rather than inventing one. Confident-but-wrong output is the failure mode this system exists to avoid.
