# Build prompt — Component library redesign (Atlassian-modeled categories)

Paste this whole file as the task for the coding agent. It implements `component-library-vs-atlassian-gap-analysis.md` (already reviewed) against the real `portal/docs/components/` section. Read that file first — it is the source of truth for which components map where and which "Coming soon" items belong in which category. This prompt is the execution checklist derived from it, plus one correction to that analysis found while preparing this prompt (see below).

## Correction to the gap analysis before you start

The gap analysis matrix walked *Atlassian's* component list and marked Have/Coming soon/N/A for each entry — it never checked the reverse direction, so 5 of our real components have no Atlassian counterpart and never appear in that matrix at all: **Divider, List, Card, ImageList, ExpansionPanel**. They still need a category home in the new structure. Assignments below (Layout and structure for Card/ExpansionPanel, Images and icons for ImageList, Text and data display for List/Divider) are best-fit judgment calls, not sourced from the matrix — flag if any look wrong before proceeding.

## Context you need before touching anything

- Categories are **not** a hardcoded list today. `categories.setdefault(c.get("category", "Other"), []).append(c)` in `build_portal.py` (~line 156) builds the category groupings live from whatever string sits in each component's `<Name>.doc.json` under `"category"`. Both the sidebar nav (`render_nav()`, the Components group around line 514–532, currently `for cat in sorted(categories)`) and the flat index page (`body_components_index()`, ~line 1535) read from this same derived dict.
- Today's index page (`components/index.html`) is a **single flat grid**, alphabetical by component name, with category shown only as a small badge on each card — it is not grouped into category sections. This is the main structural change requested: introduce real per-category sections, in a fixed order, on both the index page and the sidebar.
- Component page URLs are generated from `slug(c["name"])`, independent of category — changing a component's category will not change its URL or break any existing links. Confirm this holds before/after.
- Every real component's content (props, variants, do/don't, accessibility) comes from its own `doc.json` and must not change as part of this task — this task only touches the `"category"` field on existing files, plus the generator code that renders categories and coming-soon cards. Never edit anything under `component-repo/` or fleet-web source.

## Task 1 — Reassign categories (edit `"category"` field only, in each doc.json)

Apply exactly this mapping. Where a component covers more than one Atlassian slot (documented in the gap analysis §3), it gets ONE primary category below — matching either Atlassian's own placement of the equivalent component, or its dominant real usage per its own doc.json description.

| New category | Components (category field → this value) |
|---|---|
| Forms and inputs | Button, Picker, SelectionControl, Slider, TextField |
| Images and icons | ImageList |
| Labels | Badge, Chip |
| Layout and structure | SideSheet, Card, ExpansionPanel |
| Loading | ProgressIndicator |
| Messaging | Banner, Snackbar, Dialog |
| Navigation | Breadcrumbs, Menu, NavigationDrawer, NavigationRail, Pagination, Tabs |
| Overlays and layering | Tooltip |
| Status indicators | Stepper |
| Text and data display | DataTable, List, Divider |

Sanity check before moving on: every one of the 26 current components appears exactly once across this table. If your count differs, stop and reconcile before editing any files.

## Task 2 — Introduce a fixed category order

Add a `CATEGORY_ORDER` constant near the top of `build_portal.py` (next to wherever `categories`/`comps` are loaded):

```python
CATEGORY_ORDER = [
    "Forms and inputs", "Images and icons", "Labels", "Layout and structure",
    "Loading", "Messaging", "Navigation", "Overlays and layering",
    "Status indicators", "Text and data display",
]
```

Replace every `for cat in sorted(categories)` (nav) and any alphabetical category iteration in `body_components_index()` with iteration over `CATEGORY_ORDER`, skipping a category only if it has zero real components AND zero coming-soon entries (shouldn't happen here since all 10 have at least one real component, but guard for it anyway so the code doesn't break if categories shift later).

## Task 3 — Restructure `body_components_index()` into grouped sections

Replace the single flat `idxgrid` with one section per category, in `CATEGORY_ORDER`. Reuse the existing `.cathead` class (already defined in the stylesheet and used elsewhere for category grouping) for the section heading, and keep `.idxgrid`/`.idxcard` for the cards inside each section — no new CSS needed. Structure per category:

```
<div class="cathead">Forms and inputs</div>
<div class="idxgrid">
  ...real component cards for this category (existing card markup, unchanged)...
  ...coming-soon cards for this category (task 4)...
</div>
```

Keep the existing search/filter box and `filterIdx()` behavior working across the now-sectioned grid — check it after this change, since the current filter script may assume a single flat grid.

## Task 4 — Add "Coming soon" cards (index only — no new pages)

For each category, after its real component cards, add one non-linking card per "Coming soon" row from the gap analysis's §4 tables for that category. Pull the exact list from that document — don't re-derive it. Card markup: same `.idxcard` shape as real cards, but:
- No `href` (or a non-navigating `href="#"` with `aria-disabled="true"` — match whichever the existing `.idxcard` CSS handles better without new styles)
- `.idxstatus` badge reads "Coming soon" instead of a stability tag
- One-line description taken from the gap analysis's "note" column for that row (e.g. Icon: "FontAwesome confirmed as the icon system, but no dedicated component or size/color tokens yet")
- Visually muted — if `.idxcard` doesn't already support a disabled/muted look, add a `.idxcard.soon` modifier (opacity/grayscale) rather than new markup patterns

Do **not** create an HTML file for any coming-soon item. This is a deliberate difference from the Foundations redesign's stub pages: there, a token-level note existed worth putting on a page; here, most of these have no real content beyond "doesn't exist yet," so the index card alone is the honest amount of documentation. If a coming-soon item is later designed and built for real, it gets a real page and real doc.json at that point — same as any other component.

N/A items from the gap analysis (Comment, Focus ring, Form, Logo, Object, Link, Heading, Page) do not appear anywhere in the index — not as cards, not as a footnote. Excluded, not forgotten, same as the Foundations spec's skip list.

## Task 5 — Update sidebar nav to match

In `render_nav()`, the Components group's per-category `<details class="navsub">` sub-groups should iterate `CATEGORY_ORDER` (task 2) instead of `sorted(categories)`, so the sidebar order matches the index page order exactly. Coming-soon items do **not** get nav entries (no page to link to) — the sidebar only ever lists real, buildable components, same as today.

## Task 6 — Regenerate and verify

- Run the generator. Confirm it doesn't error on any category that might legitimately have zero real components (shouldn't occur given the mapping in task 1, but the code should not crash if it did).
- Open `components/index.html`: confirm 10 category sections appear in the specified order, each real component still links to its existing page, coming-soon cards render but don't navigate anywhere, and the search/filter box still works across all sections.
- Spot-check the sidebar on 3–4 component pages: category sub-groups should be in the same order as the index, and the active-page highlighting should still open the correct branch.
- Diff a sample of the edited `doc.json` files to confirm only the `"category"` field changed — no other content should differ.

## Guardrails (repeat because they matter most)

- Category reassignment is cosmetic regrouping only. Nothing about a component's props, variants, accessibility notes, or tokens changes in this task.
- Never invent props, variants, or descriptions for a coming-soon item beyond the one-line note already written in the gap analysis.
- Never create a new component `.html` page or `doc.json` as part of this task — that's future work, triggered separately when a specific coming-soon component actually gets designed.
- If the doc.json category-reassignment count in task 1 doesn't add up to 26, or a component's best-fit category is genuinely ambiguous, stop and ask rather than guessing.
