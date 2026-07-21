# Functional Specification — DS Portal IA v2 (Six-Section Restructure)

**Document:** IA restructure proposal for `cartrack-ai-design-system/docs/` (cartrack-ai-design-system.vercel.app)
**Based on:** Michal's proposed six-section structure (2026-07-21) + review against the current 41-page site and the reference systems (Carbon, Polaris, Material 3) used in prior specs.
**Status:** Implemented 2026-07-21 (redirect stubs: yes; 3 derived guides; nav label "Resources").
**Supersedes:** the top-level page list of `ds-portal-ia-restructure-spec.md` §3. Everything below `components/` and `patterns/` is unchanged from that spec.

---

## 1. Purpose

Regroup the portal's top level from today's flat 7-page list into six user-intent sections: **Home / Guides / Foundations / Components / Patterns / Tools & resources**. Same generation model (`build_portal.py`, static HTML, no framework); this is a content re-homing + nav change, not a visual redesign.

## 2. Section map — where every current page goes

| Current | New home | Notes |
|---|---|---|
| `index.html` (hero + getting-started + path cards) | `index.html` — Home, orientation only | Getting-started steps and path-card details move to Guides; Home keeps hero, route line, stat strip, and gains an at-a-glance section-card grid |
| `foundations.html` #inside (folder map) | `guides/how-it-works.html` | It explains the system's mechanics — guide content |
| `foundations.html` #rules (7 rules) | `guides/rules.html` | The AGENTS.md contract, for humans and AI |
| — (currently embedded in Home) | `guides/getting-started.html` | Download → connect → per-role first steps (path cards live here) |
| `tokens.html` (one giant page) | `foundations/` split: `index` (token model + naming grammar + provenance), `colour.html`, `typography.html`, `spacing.html` (spacing + radius + border width) | Split follows tokens.json's own top-level groups |
| `accessibility.html` | `foundations/accessibility.html` | A fundamental, not a resource; content unchanged (AA trap + link table) |
| `components/` (index + 27) | unchanged | |
| `patterns/` (index + 5) | unchanged | |
| `preview.html` | `resources/preview.html` | |
| `changelog.html` | `resources/changelog.html` | |
| `downloads.html` | `resources/downloads.html` | Stays the primary CTA target |

## 3. Target tree

```
docs/
  index.html                      Home — hero + at-a-glance cards (6 sections) + stat strip
  guides/
    index.html                    Guides index (3 guide cards)
    getting-started.html          Download, connect, first prompt per role
    how-it-works.html             Folder map, 3-file component pattern, generation model
    rules.html                    The 7 rules + link to AGENTS.md download
  foundations/
    index.html                    Token model, naming grammar, primitive-vs-semantic rule, provenance
    colour.html                   Brand / status / text / surface / interactive / vehicle swatches
    typography.html               Type scale, base font, weights
    spacing.html                  Spacing scale, radius, border width
    accessibility.html            Policy, AA trap, per-component link table
  components/  (unchanged: index + 27)
  patterns/    (unchanged: index + 5)
  resources/
    index.html                    Small index linking the three below
    preview.html                  Visual preview iframe
    changelog.html                What's new
    downloads.html                Zip + standalone files
  tokens.html, foundations.html,  → redirect stubs (meta-refresh) to new locations
  accessibility.html, preview.html,
  changelog.html, downloads.html
  downloads/   (unchanged assets)
  fonts/       (unchanged)
```

Page count: ~50 generated pages (41 today + new indexes/splits + 6 redirect stubs).

## 4. Navigation (sidebar)

Same collapsible accordion mechanics, new grouping:

```
[ Filter components… ]
  Home
▸ Guides                       3
▸ Foundations                  5
▸ Components                  27   (categories inside, as today)
▸ Patterns                     5
▸ Tools & resources            3
```

- At rest: 6 rows + filter. Guides/Foundations/Resources become collapsible groups like Patterns/Components today.
- Active-branch auto-open, localStorage persistence, mobile drawer: all unchanged.
- The `GUIDE / LIBRARY / RESOURCES` eyebrow labels are replaced by the groups themselves (no more double taxonomy).

## 5. Page specs

### 5.1 Home
Keeps: hero (ink + Montserrat + route line), stat strip, the root-folder warning callout.
Gains: a 6-card "What's here" grid (one card per section: name, one-liner, count where applicable, link).
Loses: the two getting-started step cards and the three path cards (both move to `guides/getting-started.html`).

### 5.2 Guides
- `getting-started.html`: the 2 step cards + the 3 role path cards, verbatim from today's Home.
- `how-it-works.html`: folder map (file → purpose table) + the 3-file component pattern + "regenerate, never hand-edit" model, from today's Foundations + README copy.
- `rules.html`: the 7 rule cards + a pointer to the AGENTS.md download.
- No fourth guide is fabricated. If "Build your first page" is wanted, it's authored separately later.

### 5.3 Foundations
- `index.html`: primitive-vs-semantic model, naming grammar examples, the "never copy hex" warning, provenance list — i.e. today's tokens-page intro.
- `colour.html`: all swatch groups + interaction-state rule + the AA known-issue callout.
- `typography.html`: base font/size, type-scale table with samples, MUI-variant caveat note.
- `spacing.html`: spacing table (4px grid), radius, border width.
- `accessibility.html`: unchanged content from today's accessibility page.
- All content still generated from `tokens.json` / doc.jsons — zero hand-authored values.

### 5.4 Components / Patterns
No changes below their indexes. Component-page "Related"/"Live example" links and the accessibility deep-links (`components/<slug>.html#accessibility`) keep working; the accessibility link-table's relative paths update to the new `foundations/` depth.

### 5.5 Tools & resources
- `resources/index.html`: three cards (Preview / What's new / Downloads).
- The three existing pages move under `resources/` with content unchanged.

### 5.6 Redirect stubs
Each old top-level URL (`tokens.html`, `foundations.html`, `accessibility.html`, `preview.html`, `changelog.html`, `downloads.html`) becomes a ~10-line page: `<meta http-equiv="refresh" content="0; url=...">` + a fallback link. Generated by the same script so they can't rot.

## 6. Implementation notes (build_portal.py)

- `render_nav()`: replace the flat Guide/Reference/Resources sections with three new `<details>` groups (Guides, Foundations, Tools & resources) using the existing group/leaf helpers.
- Split `body_tokens()` into four body functions along its existing section boundaries (the token-group blocks are already independent HTML strings — this is a cut, not a rewrite).
- Split `body_home()` / `body_foundations()` along the section boundaries noted in §2.
- New `write_redirect(old, new)` helper for stubs.
- `prefix` depth handling already exists (components/patterns are one level deep) — guides/foundations/resources reuse it as-is.
- Zip download and its exclusion of `docs/*` unchanged.

## 7. Effort

| Phase | Work | Effort |
|---|---|---|
| 1 | Nav regrouping (3 new groups) | S |
| 2 | Guides: 3 pages + index from existing copy | S |
| 3 | Foundations: split tokens page into 4 + move accessibility | M |
| 4 | Home: at-a-glance card grid | S |
| 5 | Resources: move 3 pages + index | S |
| 6 | Redirect stubs, regenerate, full link check, deploy | S |

## 8. Acceptance criteria

- Sidebar at rest shows exactly: filter, Home, 5 collapsible groups (≤8 rows).
- Every current URL either still serves its content or redirects to the page that does.
- All content still traces to tokens.json / doc.jsons / templates / existing copy — no invented values, no fabricated fourth guide.
- `components/<slug>.html#accessibility` deep links still resolve from the relocated accessibility page.
- One script run regenerates everything; zero hand-edited HTML.

## 9. Open questions (answer before build)

1. **Redirect stubs** at old URLs — include (recommended) or skip?
2. **Guide set** — the 3 derived guides OK, or do you want to author a 4th ("Build your first page") as part of this?
3. **Section name** — "Tools & resources" or just "Resources" in the nav (shorter; recommended)?
