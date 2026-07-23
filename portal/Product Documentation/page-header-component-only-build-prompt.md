# Build prompt — Make PageHeader component-only (remove it as a pattern)

Paste this whole file as the task for the coding agent. Context: PageHeader was added twice on 2026-07-23 — first as a pattern (`design-system/templates/page-header.md`), then also as a full component (`design-system/components/PageHeader/`) with cross-references between the two. Michal has decided it should be a component only. This prompt removes the pattern side and every place that pointed at it, without touching the component (which is correct and stays as-is).

## Context you need before touching anything

- The component is NOT changing. `components/PageHeader/PageHeader.tsx`, `PageHeader.doc.json`, and `index.ts` are correct as written — category "Layout and structure", `library` field honestly says "karoo-ui / MUI Stack — real fleet-web implementation (not an MDC spec)" since no MD2 baseline for this ever existed. Do not edit these three files.
- Patterns live in `design-system/templates/*.md` and are turned into `portal/docs/patterns/*.html` automatically by `portal/docs/build_portal.py` — deleting the `.md` file and re-running the generator is enough to remove the generated page and the nav entry. There is no manual HTML to delete.
- Three other page-pattern templates (`table-page.md`, `settings-page.md`, `detail-page.md`) currently say "the Page header pattern" — that phrase needs to become a direct reference to the PageHeader component, since the pattern file is going away.
- `AGENTS.md` rule 7 and `CLAUDE.md`'s templates folder-map comment both currently list "page header" as an example of a cross-cutting *pattern* — that example needs to come out (main navigation stays; it's still a real pattern).

## Task 1 — Delete the pattern file

Delete `design-system/templates/page-header.md`.

## Task 2 — Remove its wireframe thumbnail from the generator

In `portal/docs/build_portal.py`, remove the `"page-header": (...)` entry from the `PATTERN_WIREFRAMES` dict (currently right before the `"main-navigation"` entry). Leaving it would be dead code — harmless but pointless once there's no `page-header` pattern slug to key off.

## Task 3 — Reword the three templates that reference "the Page header pattern"

Each currently reads the pattern's variant name into its own bullet. Replace the pattern reference with a direct component reference — same factual content, just naming the component instead of a pattern that won't exist anymore:

- `table-page.md`, in the "Page header" bullet: replace `"the list-header variant of the Page header pattern (Title + ButtonsContainer), plus a search field."` with `"built from the PageHeader component (Title + ButtonsContainer), plus a search field."`
- `settings-page.md`, in the "Page header" bullet: replace `"the simple/settings-header variant of the Page header pattern (Title only, no ButtonsContainer)."` with `"built from the PageHeader component (Title only, no ButtonsContainer)."`
- `detail-page.md`, in the "Page header" bullet: replace `"the detail-header variant of the Page header pattern: a back-link"` with `"built from the PageHeader component: a back-link"` (keep the rest of that sentence as-is).

Leave every other "page header" mention in these three files alone (the `## Layout` line's `Page header (...)` and the lowercase prose mentions in Structure rules) — those describe the layout region generically and don't claim a pattern file exists, so they're still accurate.

## Task 4 — Drop the stale pattern example from AGENTS.md and CLAUDE.md

- `AGENTS.md` rule 7 currently reads: `...cross-cutting region patterns reused across pages (main navigation, page header)...` — change the parenthetical to `(main navigation)`.
- `CLAUDE.md`'s templates folder-map comment currently reads: `# cross-cutting regions (main-navigation, page-header) — how` — change to `# cross-cutting regions (main-navigation) — how`.

## Task 5 — Things that do NOT need to change (checked already, listed so you don't re-check them)

- `components/PageHeader/*` — stays exactly as-is (Task list above).
- `Breadcrumbs.doc.json`'s `related` array entry pointing at `PageHeader` — stays; PageHeader is still a real component Breadcrumbs relates to.
- `component-library-preview.html`'s `page-header` demo section and the component count text ("28 components") — stays; the component isn't being removed, only the pattern.
- `vibe-tests/prompts.json`'s two lowercase "page header" mentions — generic prose about page layout, not a claim that a pattern file exists. No change needed.
- `portal/brand/Logo.doc.json`'s "page-header / nav logo placement" mention — same, generic prose, unrelated to the pattern file.

## Task 6 — Regenerate and verify

- Run `python3 portal/docs/build_portal.py` from `portal/docs/`.
- Confirm the run log reports **6** pattern pages (was 7) and still **28** component pages.
- Open `portal/docs/patterns/index.html`: Page Header should no longer be listed. Confirm `portal/docs/patterns/page-header.html` no longer exists on disk (stale file from the previous build, if the generator doesn't clean removed patterns automatically — check and delete by hand if it's still there).
- Open `portal/docs/components/page-header.html`: should still exist, unchanged, with its live 3-variant demo and "Layout and structure" category.
- Grep the repo for `"Page header pattern"` (the literal phrase) — should return zero matches once Task 3 is done.
- Grep for `page-header` inside `AGENTS.md` and `CLAUDE.md` — should return zero matches once Task 4 is done (the component itself isn't referenced by that slug in either file today).

## Guardrails

- This is a removal/rewording task, not a re-design — don't add new props, variants, or content to the component while you're in these files.
- Don't delete or edit anything under `components/PageHeader/` — re-read Task 5 if tempted to "clean up" something there.
- If any other file turns up a "Page header pattern" or `patterns/page-header` reference not listed above, stop and flag it rather than guessing whether it's safe to reword.
