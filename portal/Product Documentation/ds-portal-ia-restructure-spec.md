# Functional Specification — DS Portal Multi-Page Restructure

**Document:** Restructure proposal for `cartrack-ai-design-system/docs/` (the site behind cartrack-design-portal.vercel.app)
**Based on:** Comparative analysis of IBM Carbon, Shopify Polaris, Adobe Spectrum, Google Material 3, Atlassian Design System, GOV.UK Design System (same research base as `ds-portal-improvement-spec.md`, July 2026)
**Status:** Approved for implementation — to be built in Claude Code
**Supersedes:** `ds-portal-improvement-spec.md` §5 "Out of scope" line — "Multi-page site generator ... revisit when the folder lives in a git repo with CI." That condition is being waived; this spec is the revisit.

---

## 1. Purpose

Replace the single scrolling `index.html` with a real multi-page site: one URL per component, one per pattern, and an Accessibility section that stops repeating itself. Same generation model as today (`build_portal.py` reads doc.json/tokens.json/templates and writes static HTML — no framework, no build step, no server) — it just needs to write many files instead of one.

## 2. Current state (problem)

`docs/index.html` is a single file with 10 anchor-linked `<section>`s: `#start #inside #rules #tokens #patterns #components #accessibility #preview #changelog #downloads`. All 27 components render inline inside `#components`, and — the specific complaint that triggered this spec — `#accessibility` concatenates the `accessibility[]` array from all 27 doc.jsons into one flat section below the policy statement. That single section is why the page reads as endless scroll: it duplicates content that also exists (collapsed) inside each component's own card.

## 3. Target information architecture

Every reference system in the research base (all six, no exceptions) is a real multi-page site, and every one handles accessibility the same two-layered way: a short top-level Accessibility page (policy, standard, testing approach, known gotchas) plus per-component accessibility notes living on that component's own page (Carbon and Spectrum literally call it an "Accessibility" tab). This spec applies that pattern.

```
docs/
  index.html                     Home — role-based entry (Designers / Developers / AI agents)
  foundations.html               Folder map ("what's in the folder") + the 7 rules
  tokens.html                    Design tokens (unchanged content, own page)
  accessibility.html             Overview + policy + AA trap + testing checklist + link table → each component's #accessibility
  patterns/
    index.html                   Patterns index (grid, same content as today's #patterns intro)
    table-page.html
    detail-page.html
    map-tracking-view.html
    settings-page.html
    login.html
  components/
    index.html                   All-components sitemap grid (the A4 index: name, one-liner, category, status → link)
    button.html
    text-field.html
    ...                          one file per component, 27 total
  preview.html                   (rename of component-library-preview.html, or keep filename + link to it)
  changelog.html
  downloads.html
```

Decision on file granularity: **one file per component** (not grouped by category) — matches the reference systems exactly and gives every component a real, shareable, bookmarkable URL.

## 4. Shared shell

All pages reuse one sidebar/header render function so nav stays consistent without duplicating markup per file.

- `render_shell(active_page, body_html) -> full HTML string`. `active_page` drives the "current page" highlight in the sidebar.
- Sidebar links become real relative paths instead of `#anchor`s: `foundations.html`, `tokens.html`, `accessibility.html`, `patterns/index.html`, `components/index.html`, etc. Component and pattern sub-lists in the sidebar link to `components/<slug>.html` / `patterns/<slug>.html`.
- Relative path depth changes once files move into `components/` and `patterns/` subfolders — asset links (CSS, downloads, preview) need a `../` prefix computed per page depth. Simplest fix: keep all CSS inline in the shell template (already the case) so there's no external asset path to break; only the `downloads/` and `preview.html` links need depth-aware prefixes.
- Slugs: kebab-case from component/pattern name, consistent with the existing anchor IDs already used in `component-library-preview.html` (so live-example anchors keep working unchanged).

## 5. Page specs

### 5.1 `index.html` (Home)
Content unchanged from today's `#start` — role-based entry cards (Designers/Developers/AI agents). Drop the getting-started content that belongs in Foundations.

### 5.2 `foundations.html`
Merge of today's `#inside` (file map) and `#rules` (the 7 rules). One page — both are "orientation" content, not big enough alone to justify separate pages yet.

### 5.3 `tokens.html`
Direct move of today's `#tokens` section, no content change.

### 5.4 `accessibility.html` (the core fix)
- Keep: policy statement, the white-on-orange AA-trap callout, the "baseline for every component" tip block.
- Remove: the flat per-component `accessibility[]` dump.
- Add: a compact table — Component | one-line accessibility summary | link to `components/<slug>.html#accessibility`. Summary = first item of that component's `accessibility[]` array, truncated; full list lives on the component page.

### 5.5 `patterns/index.html` + one page per pattern
Index page: today's `#patterns` intro + grid linking to the 5 pattern pages. Each pattern page: layout skeleton, components used (linked to `components/<slug>.html`), composition rules — same content as the current inline pattern cards, just split one-per-file.

### 5.6 `components/index.html`
The A4 sitemap grid, already speced but never split out: name, one-line description, category, status badge, link to the component's own page.

### 5.7 `components/<slug>.html` (one per component, 27 total)
Section order per page (all sourced from that component's doc.json, no new authoring required):
1. Header — name, category, status badge, source/library provenance line
2. When to use / when not to use
3. Anatomy (numbered list)
4. Variants
5. States & behaviors (State|Treatment and Behavior|Description tables)
6. Do / Don't
7. Props table
8. Tokens used (paths + resolved values)
9. **Accessibility** (`id="accessibility"` — this is what `accessibility.html`'s table links into) — full `accessibility[]` list, not truncated
10. Related components (with reasons)
11. Live example — anchor into `preview.html#<slug>`
12. Footer — "Improve this component → components/<Name>/<Name>.doc.json"

### 5.8 `changelog.html`, `downloads.html`
Direct moves, no content change.

## 6. Implementation notes for `build_portal.py`

- Refactor the current monolithic `page = f'''...'''` string build into: one `render_shell(active, body)` helper, and one `render_<section>()` function per page (most of this logic already exists as the per-section string-building blocks — it's a split, not a rewrite).
- Replace the single `OUT.write_text(...)` at the end with a loop that writes each page to its path, creating `components/` and `patterns/` subdirectories.
- The component-loop that currently appends to `comp_body` (one big string) instead calls `render_component_page(c)` per component and writes it to `components/{slug(c)}.html`.
- `n_comps`/`n_patterns` counts and nav generation logic can stay as-is; only the emitted `<a href>` targets change from `#id` to real paths.
- Keep everything static-file-only — no server, no client routing, consistent with the lean-system principle already established for this project.

## 7. Migration / effort

| Phase | Work | Effort |
|---|---|---|
| 1 | Shell extraction (`render_shell`), path-aware nav | S |
| 2 | Split Home / Foundations / Tokens / Changelog / Downloads into standalone pages | S |
| 3 | Components: index page + 27 individual pages, accessibility subsection moved in | M |
| 4 | Patterns: index page + 5 individual pages | S |
| 5 | Accessibility page rewritten as overview + link table | S |
| 6 | Regenerate, re-zip downloads (exclude `docs/*` as before), spot-check every internal link | S |

## 8. Acceptance criteria

- No page requires scrolling past content the visitor didn't navigate to — specifically, `accessibility.html` no longer contains all 27 components' requirement lists.
- Every component and pattern has its own URL, linkable and bookmarkable.
- Sidebar nav present and consistent across all pages, with current-page highlighting.
- Live-example anchors into `preview.html` keep working unchanged (same slugs as today).
- Regenerating after any doc.json/tokens.json/template change is still one script run — zero hand-edited HTML.
- Zip download still builds correctly and still excludes `docs/*`.

## 9. Open question to resolve during build

Whether `preview.html`'s single big iframe-per-page embed (today: one iframe of the whole preview file per component, scrolled to anchor) should instead become 27 separate scoped embeds, or stay as one shared preview file linked by anchor from each component page. Recommend leaving as-is (anchor-linked, shared file) — no reference system duplicates the live-render markup per page either.
