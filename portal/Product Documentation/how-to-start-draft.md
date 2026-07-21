# "How to Start" — single-page Guides article (draft)

This replaces the current 3-page split (Getting started / How the system works / Rules for AI & humans) with one long page. Guides section nav would collapse to a single link: **Guides → How to start**.

Below: each content block, its purpose, and drafted copy. Review the blocks/order first — I haven't touched the live HTML yet.

---

## Block 1 — What this is
**Purpose:** one-paragraph pitch, answers "what am I looking at" in 10 seconds.

> **Cartrack AI Design System** is a self-contained, AI-ready component library and token set for the Cartrack Fleet Portal. One folder, no build step, no external dependencies — everything an AI agent or a human developer needs to generate consistent, on-brand, accessible UI lives inside it. It follows the "lean AI-optimized design system" pattern (the Astryx approach): tokens as a single source of truth, per-component documentation colocated with the code, and short root-level instruction files that tell an AI agent how to behave — instead of one giant style guide nobody reads.
>
> Every value is **derived from the real fleetapp-web production codebase** (karoo-ui / MUI theme, MDC 14 components, legacy Sass variables). This documents what actually ships today, not an idealized spec — if something looks inconsistent, that's the current product, flagged rather than hidden.

---

## Block 2 — What's inside the folder
**Purpose:** the folder map, merged from README + how-it-works. Table format, one row per top-level item, "who reads it" column is the useful bit people skip past otherwise.

| Path | What it is | Who reads it |
|---|---|---|
| `CLAUDE.md` | The index — folder map, token model, known issues. Auto-loaded by Claude tools at session start. | AI agents first |
| `AGENTS.md` | The behavior contract — the rules every AI agent must follow, plus a verification checklist. Auto-read by Cursor, Copilot, Codex; imported by `CLAUDE.md` for Claude. | AI agents |
| `README.md` | Human-friendly overview of the whole system. | People |
| `tokens/tokens.json` | Single source of truth for color, spacing, typography, radius, border width. `primitive` / `semantic` / `legacy` tiers, plus `_meta.changelog`. | AI agents + developers |
| `components/<Name>/` | 27 components, 3 files each: `.tsx` implementation, `.doc.json` structured docs (props, variants, do/don't, tokens), `index.ts`. | AI agents + developers |
| `templates/` | 5 page patterns (table, detail, map/tracking, settings, login) — which components compose each screen and the composition rules. | AI agents + designers |
| `brand/` | Cartrack **marketing** brand guidelines — reference only, not a token source (see Block 6). | Designers, occasionally AI |
| `component-library-preview.html` | Every component rendered visually, one static page, no server needed. | People |
| `docs/` | This documentation portal, generated from the sources above by `docs/build_portal.py`. Never hand-edited. | People |

---

## Block 3 — Why it's built this way
**Purpose:** short "philosophy" paragraph — currently missing entirely from the guides. Answers the question a new hire will ask: *why not just a normal Storybook?*

> Most design systems are written for humans to read occasionally. This one is written for an AI agent to read *every session* — so it has to be short, unambiguous, and structurally predictable rather than exhaustive. That's why there's no giant style-guide PDF: instructions live in two small root files (`CLAUDE.md`, `AGENTS.md`), and design judgment lives next to the code it governs (`<Name>.doc.json`), not in a separate wiki that drifts out of sync.
>
> The tradeoff: some things are deliberately **not** included yet — a semantic-token resolver, tests, Storybook, theme packages — because the lean pattern only adds a piece once a concrete pain justifies it. See Block 9 for the current scope line.

---

## Block 4 — Quick start: download & connect
**Purpose:** the mechanical first step, same for every role. Keep this short — it's the part people actually copy-paste.

> **1. Download.** Grab the zip from [Downloads](/resources/downloads.html) and unzip anywhere, or clone it from the team's shared location.
>
> **2. Connect it to your tool** — point the tool at the `cartrack-ai-design-system` folder **itself**, not a parent folder. Rule-loading is guaranteed only from the root of the connected folder.
> - **Claude Cowork:** new session → select the folder.
> - **Claude Code:** open a terminal in the folder, run `claude`.
> - **Cursor / Copilot / Codex:** open the folder as a workspace — they pick up `AGENTS.md` automatically via the agents.md standard.
>
> **Self-test:** ask your tool "what design system rules apply here?" It should recite the `AGENTS.md` rules without you naming a file. If it can't, the folder isn't connected at its root.

---

## Block 5 — Pick your path
**Purpose:** the three role-based tracks that were previously split across pages. Keep as three sub-blocks on the same page (tabs or stacked headers — designer call), each with one worked example so it's not just abstract advice.

### For designers — prototype in product language
> Ask for screens in plain language. No need to mention the design system by name — the rules are already loaded once the folder is connected. Iterate the same way you'd brief a developer: "denser table," "add a selection bar." Check results against the [visual preview](/resources/preview.html).
>
> **Try this first prompt:** *"Build an HTML prototype of a vehicle list page: app bar with search, filter chips, a data table with status chips and pagination, and one primary action 'Add vehicle'."*
> Expected result: a single `.html` file using MDC classes, orange `primary.dark` for the contained button (AA-safe), 14px Roboto body text, 4px-grid spacing throughout.

### For developers — build features on the real values
> Every component is 3 files: `.tsx` (MDC class contract), `.doc.json` (the API and usage contract — **read this first**), `index.ts`. All visual values come from `tokens/tokens.json`.
>
> The one non-obvious rule up front: in inline styles, use `primitive.*` values. Most `semantic.*` entries are alias strings awaiting a build-time resolver this repo doesn't have yet (full explanation in Block 6).

### For AI agents — your rules load automatically
> Claude tools auto-load `CLAUDE.md`, which imports `AGENTS.md`. Other agents read `AGENTS.md` directly. Before using any component, read its `.doc.json`. Before finishing a task, run the verification checklist in Block 8.

---

## Block 6 — Core concepts you need before writing anything
**Purpose:** this is the "how it works" substance — currently buried on its own page and slightly abstract. Pull the four ideas that actually change what code you write, each with a one-line "why" so it's not just a rule to memorize.

> **Tokens have three tiers.** `primitive.*` = raw values (hex, px) — safe to use directly in code. `semantic.*` = named roles (e.g. `semantic.color.brand.primary.main`) — mostly unresolved alias strings (`"{primitive...}"`) meant for a build-time resolver that doesn't exist yet. Paste one into a runtime style and you set the CSS property to that literal placeholder text. **In `.tsx` styles use `primitive.*`; in docs and `.doc.json` files cite `semantic.*`.** Exceptions authored as real literals: `semantic.color.text.*`, `border.default`, `interactive.*`. `legacy.*` = deprecated pre-MUI values (5px grid, bold=600) — don't use in new work.
>
> **Every component is the same 3 files.** `.doc.json` is the source of truth for how to use it — read `doThis` / `dontDoThis` and the `tokens` list before writing any code against a component.
>
> **Templates encode composition, not just layout.** Before inventing a screen structure, check `templates/` for a matching pattern (table page, detail page, map/tracking, settings, login) — the composition rules there exist because someone already made those tradeoffs.
>
> **`brand/` is reference-only.** It documents Cartrack's *marketing* brand (website, ads, print) — not the product. It shares some values with `tokens.json` (brand orange, the Material icon base) and deliberately diverges on others (marketing has a dedicated blue and uses Montserrat + pure black; the product doesn't). Never cite a `brand/*.doc.json` value in a component's tokens list.

---

## Block 7 — The rules everyone follows
**Purpose:** condensed AGENTS.md contract, human-readable. This is the current `rules.html` page content, folded in near-verbatim since it already tested well — just re-leveled as a subsection instead of a whole page.

> 1. **Use the components, never raw HTML.** `<Button>` not `<button>`, `<TextField>` not `<input>`. All 27 live in `components/`.
> 2. **Never hardcode visual values.** Colors, spacing, type, radii always come from `tokens/tokens.json`.
> 3. **In code, use `primitive.*` values** (see Block 6 for why).
> 4. **The `.doc.json` is the source of truth** — read a component's do/don't rules before using it.
> 5. **One primary action per view.** One contained primary button; everything else outlined or text.
> 6. **WCAG AA is not optional.** Never white text on brand orange `#F47735` (~2.79:1 — fails). Filled surfaces with white text use `primary.dark` `#BB4800` (~5.2:1) instead.
> 7. **Don't invent.** Missing component, variant, or token → flag the gap, don't fabricate it.
>
> Hard "do not" list: don't hardcode, don't paste `semantic.*` aliases into runtime styles, don't use `legacy.*` tokens, don't invent APIs, don't edit `tokens.json` structurally without a changelog entry, don't add dependencies.

---

## Block 8 — Verify your work
**Purpose:** currently only exists at the bottom of `AGENTS.md`, invisible to a human skimming the site. Surfacing it here closes the loop — "how it works" → "here's how you check you did it right."

> - [ ] `tokens.json` still parses as valid JSON, if touched
> - [ ] No hardcoded colors/spacing/type introduced
> - [ ] Only existing components, variants, and token paths used — every path cited actually exists in `tokens.json`
> - [ ] No white-on-orange (`#FFFFFF` on `#F47735`)
> - [ ] New/changed components keep the 3-file pattern
> - [ ] Structural `tokens.json` changes have a `_meta.changelog` entry

---

## Block 9 — Scope & limitations
**Purpose:** sets honest expectations, currently only in README, never surfaced in the portal. Prevents someone assuming coverage that doesn't exist yet.

> - **MD2-based** (Material Design 2 / MDC 14), matching current production — not MD3.
> - The HTML preview is **hand-authored and manually synced** to `tokens.json` — not generated, so it can drift if tokens change without a manual re-sync.
> - `semantic.*` alias resolution, tests, Storybook, and theme packages are **deliberately not included yet.**

---

## Block 10 — Where to go next
**Purpose:** the page's exit ramp. One line each into Foundations / Components / Patterns / Resources, so the long page ends by pointing outward instead of just stopping.

> - **[Foundations](/foundations/index.html)** — colour, typography, spacing & shape, accessibility.
> - **[Components](/components/index.html)** — all 27, by category.
> - **[Patterns](/patterns/index.html)** — 5 full-page compositions.
> - **[Resources](/resources/index.html)** — visual preview, changelog, downloads.

---

## Notes on restructuring

- **Guides nav collapses from 3 links to 1** ("How to start"), or you keep "Rules" as a quick-reference sub-anchor if people want to link directly to just the rules (e.g. `#rules` on the single page) without scrolling the whole thing.
- Blocks 1–3 are genuinely new copy (philosophy/why, folder map "who reads it" framing) — everything else is consolidated from the existing three pages with light trimming to avoid repeating the primitive/semantic explanation three times (it appeared in all three current pages).
- Suggested page title: **"How to start"** (matches your ask) or "Start here" — happy to go either way.

Let me know which blocks to cut, reorder, or expand, and whether you want this built as the new `guides/index.html` (replacing the current 3 files) or as a new page with the old ones kept for deep links.
