#!/usr/bin/env python3
"""Generate the multi-page ds-portal site under portal/docs/ from the real
design-system/ package files.

One URL per page: Home, Foundations, Tokens, Accessibility, a Patterns index +
one page per pattern, a Components index + one page per component, plus Preview,
Changelog and Downloads. All pages share one shell (render_shell) so the sidebar
stays consistent; CSS is inline in the shell so there are no external asset paths
to break when files live in components/ and patterns/ subfolders.

No framework, no build step, no server — same generation model as before, it just
writes many files instead of one. Re-run after any doc.json/tokens.json/template
change; never hand-edit the emitted HTML.

Repo layout (since the 2026-07-21 package/portal split):
  cartrack-ai-design-system/
  ├── design-system/   ← the downloadable package (CLAUDE.md, AGENTS.md, tokens/,
  │                        components/, templates/, vibe-tests/, the preview HTML)
  └── portal/
      └── docs/        ← this script + its generated output (deployed to Vercel)
This script reads from design-system/ (DS) and writes into its own folder (DOCS).
It also mirrors component-library-preview.html and the standalone download files
from design-system/ into DOCS so the deployed site — which only serves files under
portal/docs/ — doesn't need to reach outside its own output directory.
"""
import json, html, os, re, shutil, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent            # .../cartrack-ai-design-system/portal/docs
REPO_ROOT = HERE.parent.parent                     # .../cartrack-ai-design-system
DS = REPO_ROOT / "design-system"                   # the package this site documents
DOCS = HERE                                         # output root for the generated site

tokens = json.load(open(DS / "tokens" / "tokens.json"))

# ---------- mirror package files the deployed site needs to serve locally ----------
# The live site only serves what's under portal/docs/, so anything it links to
# (the visual preview, the standalone downloads) needs a local copy here, synced
# from the actual package on every generation rather than hand-copied.
shutil.copy2(DS / "component-library-preview.html", DOCS / "component-library-preview.html")

DOWNLOADS_DIR = DOCS / "downloads"
DOWNLOADS_DIR.mkdir(exist_ok=True)
for name in ("AGENTS.md", "CLAUDE.md", "README.md"):
    shutil.copy2(DS / name, DOWNLOADS_DIR / name)
shutil.copy2(DS / "tokens" / "tokens.json", DOWNLOADS_DIR / "tokens.json")

zip_target = DOWNLOADS_DIR / "cartrack-ai-design-system.zip"
with zipfile.ZipFile(zip_target, "w", zipfile.ZIP_DEFLATED) as zf:
    for path in sorted(DS.rglob("*")):
        rel = path.relative_to(DS)
        if "vibe-tests" + os.sep + "results" in str(rel):
            continue  # test-run output, not part of the package
        if path.is_file():
            zf.write(path, Path("cartrack-ai-design-system") / rel)

def resolve(v):
    """Resolve '{path.to.value}' alias strings against the tokens JSON."""
    seen = 0
    while isinstance(v, str) and re.fullmatch(r"\{[^}]+\}", v) and seen < 10:
        node = tokens
        for part in v[1:-1].split("."):
            node = node[part]
        v = node
        seen += 1
    return v

def esc(s):
    return html.escape(str(s), quote=True)

def slug(name):
    """kebab-case slug — matches the anchor IDs already used in
    component-library-preview.html, so live-example links keep working."""
    return re.sub(r'(?<!^)(?=[A-Z])', '-', name).lower()

# ---------- hand-drawn inline icon set (home page visual-modules pass) ----------
# No icon font, no CDN, nothing to self-host or subset — each icon is plain inline
# SVG path data, same "no external dependency" posture as the rest of this generator.
# fill/stroke both read `currentColor`, which resolves from the `color` CSS property
# set inline per call, so one path set works in any of the three role colours.
ICON_PATHS = {
    "download": '<path d="M12 4v10"/><path d="M8 11l4 4 4-4"/><path d="M5 19h14"/>',
    "plug": '<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4"/>',
    "checklist": ('<rect x="4" y="4" width="16" height="16" rx="2"/>'
                   '<path d="M7.5 9l1.2 1.2L10.5 8"/><path d="M13 9h4"/><path d="M7.5 15h9"/>'),
    "file": ('<path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>'
              '<path d="M14 3v4h4"/><path d="M9 13h6"/><path d="M9 16h6"/>'),
    "tokens": ('<circle cx="12" cy="12" r="8"/>'
               '<circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none"/>'
               '<circle cx="12" cy="8" r="1.2" fill="currentColor" stroke="none"/>'
               '<circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none"/>'
               '<circle cx="10" cy="14" r="1.2" fill="currentColor" stroke="none"/>'),
    "box": '<path d="M4 8l8-4 8 4-8 4-8-4z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M12 12v8"/>',
    "grid": ('<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/>'
             '<rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>'),
    "eye": '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    "flask": ('<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/>'
              '<path d="M8 16h8"/>'),
    "table": '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18"/><path d="M9 9v11"/>',
    "nav": '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5l-2 5-3 1.5 2-5z"/>',
    "forms": '<rect x="4" y="5" width="16" height="4" rx="1"/><rect x="4" y="15" width="16" height="4" rx="1"/><path d="M4 11h10"/>',
    "layers": '<rect x="5" y="3" width="14" height="9" rx="1.5"/><rect x="7" y="12" width="14" height="9" rx="1.5"/>',
    "message": '<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8"/><path d="M8 12h5"/>',
    "toggle": '<rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="15" cy="12" r="3" fill="currentColor" stroke="none"/>',
    # foundations overview card icons
    "a11y": ('<circle cx="12" cy="5" r="2"/>'
             '<path d="M4.5 9.5c2.5.7 5 1 7.5 1s5-.3 7.5-1"/>'
             '<path d="M12 10.5V14"/><path d="M12 14l-2.5 6"/><path d="M12 14l2.5 6"/>'),
    "droplet": '<path d="M12 3.5s6 6.7 6 10.7a6 6 0 0 1-12 0c0-4 6-10.7 6-10.7z"/><path d="M9.5 14a2.5 2.5 0 0 0 2 2.4"/>',
    "type": '<path d="M5 7V5h14v2"/><path d="M12 5v14"/><path d="M9 19h6"/>',
    "ruler": ('<path d="M4 4v16"/><path d="M20 4v16"/><path d="M8 12h8"/>'
              '<path d="M10 9.5L7.5 12l2.5 2.5"/><path d="M14 9.5l2.5 2.5-2.5 2.5"/>'),
    "star": '<path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"/>',
    # sidebar nav icons
    "home": '<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5.5h4V20"/>',
    "flag": '<path d="M6 21V4"/><path d="M6 4h11l-2.5 4L17 12H6"/>',
}

def icon(name, color="currentColor", size=22):
    return (f'<svg viewBox="0 0 24 24" width="{size}" height="{size}" fill="none" stroke="currentColor" '
            f'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="color:{color}" '
            f'aria-hidden="true">{ICON_PATHS[name]}</svg>')

# category → icon (component-library section) — Atlassian-modeled categories
CAT_ICONS = {"Forms and inputs": "forms", "Images and icons": "eye", "Labels": "star",
             "Layout and structure": "grid", "Loading": "tokens", "Messaging": "message",
             "Navigation": "nav", "Overlays and layering": "layers",
             "Status indicators": "checklist", "Text and data display": "table"}

# pattern slug → hand-built wireframe thumbnail (patterns section). Kept as literal
# markup, not generated from the .md body, because the whole point is a recognizable
# layout *shape* per pattern — that's a design decision per pattern, not derivable data.
PATTERN_WIREFRAMES = {
    "table-page": ('<div style="position:absolute;top:0;left:0;right:0;height:8px;background:var(--ink)"></div>'
                    '<div style="position:absolute;top:16px;left:8px;right:8px;height:5px;background:#d8d4cc"></div>'
                    '<div style="position:absolute;top:26px;left:8px;right:8px;height:5px;background:#d8d4cc"></div>'
                    '<div style="position:absolute;top:36px;left:8px;right:8px;height:5px;background:#d8d4cc"></div>'),
    "login": '<div style="position:absolute;top:18px;left:20px;right:20px;height:28px;border-radius:4px;background:#fff;border:1px solid var(--line)"></div>',
    "map-tracking-view": ('<div style="position:absolute;top:0;left:0;right:0;height:8px;background:var(--ink)"></div>'
                           '<div style="position:absolute;top:32px;left:44px;width:8px;height:8px;border-radius:50%;background:var(--accent-d)"></div>'),
    "detail-page": ('<div style="position:absolute;top:0;left:0;right:0;height:10px;background:var(--ink)"></div>'
                     '<div style="position:absolute;top:16px;left:8px;width:24px;height:5px;background:var(--accent-d)"></div>'
                     '<div style="position:absolute;top:26px;left:8px;right:8px;bottom:8px;background:#e6e2da"></div>'),
    "settings-page": "".join(
        f'<div style="position:absolute;top:{8+i*12}px;left:8px;right:8px;height:6px;background:#d8d4cc"></div>'
        f'<div style="position:absolute;top:{8+i*12}px;right:8px;width:10px;height:6px;border-radius:3px;'
        f'background:{"var(--accent-d)" if i == 0 else "#e6e2da"}"></div>'
        for i in range(3)),
}
PATTERN_WIREFRAME_BG = {"map-tracking-view": "#dbe6ee"}

# ---------- load all component docs ----------
comps = []
for d in sorted((DS / "components").iterdir()):
    if d.is_dir():
        doc = json.load(open(d / f"{d.name}.doc.json"))
        comps.append(doc)

categories = {}
for c in comps:
    categories.setdefault(c.get("category", "Other"), []).append(c)

# Atlassian-modeled category order (component-library-redesign-build-prompt).
# Categories are still derived live from doc.json "category" fields; this only
# fixes their display order. Iteration guards against empty categories so the
# generator can't crash if the set shifts later.
CATEGORY_ORDER = [
    "Forms and inputs", "Images and icons", "Labels", "Layout and structure",
    "Loading", "Messaging", "Navigation", "Overlays and layering",
    "Status indicators", "Text and data display",
]

# "Coming soon" gaps per category — names + one-line notes taken verbatim from
# component-library-vs-atlassian-gap-analysis.md §4 (the per-category tables;
# note its §5 summary miscounts Images and icons as 4 — the tables list 5).
# Index cards only, deliberately no pages: most of these have no content beyond
# "doesn't exist yet", and a page would imply design work that hasn't happened.
COMING_SOON = {
    "Images and icons": [
        ("Avatar", "No equivalent — driver/user avatar isn't documented as a component."),
        ("Avatar group", "Depends on Avatar existing first."),
        ("Icon", "FontAwesome is confirmed as the icon system, but there's no Icon component doc and no icon-size/color token layer."),
        ("Image", "ImageList exists (a layout for multiple images) but there's no single-Image component doc."),
        ("Tile", "No tile/card-icon pattern currently documented."),
    ],
    "Labels": [
        ("Date label", "No dedicated date-status label component."),
        ("Tag group", "No wrapper/layout component for grouped chips — chips are used individually today."),
    ],
    "Layout and structure": [
        ("Page header", "Was partially AppBar's role; AppBar was removed for having zero real usage — a confirmed, deliberate gap."),
    ],
    "Loading": [
        ("Skeleton", "No skeleton-loading component documented."),
    ],
    "Messaging": [
        ("Empty state", "No \"no data\" placeholder component documented, despite DataTable being the most-used component — worth prioritizing."),
        ("Inline message", "Banner is page/region-level; nothing smaller and inline exists."),
        ("Section message", "Possibly coverable by a Banner variant, but not currently documented as one — flagged rather than assumed."),
        ("Spotlight", "No onboarding/feature-tour component."),
    ],
    "Overlays and layering": [
        ("Blanket", "The modal scrim likely exists inside Dialog/SideSheet's implementation but isn't separately documented."),
        ("Inline dialog", "No small anchored-popover component distinct from Menu."),
        ("Popup", "Same gap as Inline dialog — Menu covers action lists, not arbitrary popup content."),
    ],
    "Text and data display": [
        ("Code", "No inline/block code-display component — low priority for this product."),
        ("Inline edit", "No click-to-edit-in-place component."),
        ("Table tree", "No expandable/hierarchical table variant."),
        ("Visually hidden", "Accessibility utility, not currently documented as a reusable component."),
    ],
}

comp_names = sorted((c["name"] for c in comps), key=len, reverse=True)

# ---------- preview demo extraction (component-detail-page spec §5) ----------
# The hand-authored preview file is the single source of real demo markup.
# Everything below is a read-only string operation over it — the component
# repo stays untouched, and a missing fragment degrades to text-only.
PREVIEW_HTML = (DS / "component-library-preview.html").read_text(encoding="utf-8")
PREVIEW_CSS = re.search(r'<style>(.*?)</style>', PREVIEW_HTML, re.S).group(1)

def _scope_css(css, scope=".demo-embed"):
    """Prefix every selector with the scope class so preview styles can't
    collide with the portal's own. html/body/:root map to the scope itself;
    @keyframes pass through; @media recurse."""
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    out, i, n = [], 0, len(css)
    def block_end(start):
        depth = 0
        for j in range(start, n):
            if css[j] == '{': depth += 1
            elif css[j] == '}':
                depth -= 1
                if depth == 0: return j + 1
        return n
    while i < n:
        b = css.find('{', i)
        if b == -1: break
        sel = css[i:b].strip()
        e = block_end(b)
        body = css[b:e]
        if sel.startswith('@keyframes') or (sel.startswith('@') and not sel.startswith('@media')):
            out.append(sel + body)
        elif sel.startswith('@media'):
            out.append(sel + '{' + _scope_css(body[1:-1], scope) + '}')
        else:
            parts = []
            for p_ in sel.split(','):
                p_ = p_.strip()
                if not p_: continue
                if p_ in ('html', 'body', ':root'):
                    parts.append(scope)
                elif p_ == '*':
                    parts.append(scope + ' *')
                else:
                    parts.append(scope + ' ' + p_)
            out.append(', '.join(parts) + body)
        i = e
    return '\n'.join(out)

DEMO_CSS = _scope_css(PREVIEW_CSS)

def _balanced_div_inner(text, open_idx):
    """Given the index of a '<div ...>' opening tag, return its inner HTML."""
    start = text.index('>', open_idx) + 1
    depth, i = 1, start
    while depth and i < len(text):
        no, nc = text.find('<div', i), text.find('</div>', i)
        if nc == -1: return text[start:].strip()
        if no != -1 and no < nc:
            depth += 1; i = no + 4
        else:
            depth -= 1; i = nc + 6
    return text[start:i - 6].strip()

def _extract_demos():
    """slug -> [{'label': variant name, 'html': demo fragment}, ...]"""
    demos = {}
    for m in re.finditer(r'<section id="([a-z-]+)">', PREVIEW_HTML):
        sid = m.group(1)
        end = PREVIEW_HTML.find('</section>', m.end())
        sec = PREVIEW_HTML[m.end():end]
        items = []
        for im in re.finditer(r'<div class="variant-item">', sec):
            after = sec[im.end():]
            dm = re.search(r'<div class="variant-demo">', after)
            lm = re.search(r'<div class="variant-label"><b>(.*?)</b>', after, re.S)
            if not dm or not lm: continue
            frag = _balanced_div_inner(after, dm.start())
            # cut anything from the label onward (balanced scan can't overrun
            # into it because variant-demo closes before variant-label opens)
            label = re.sub(r'<[^>]+>', '', lm.group(1)).strip()
            frag = re.sub(r'\s+id="[^"]*"', '', frag)  # avoid duplicate ids on the page
            items.append({"label": label, "html": frag})
        demos[sid] = items
    return demos

DEMOS = _extract_demos()

def demo_for_variant(comp_slug, variant_name, index):
    """Match by exact label text (spec §5.3), fall back to order, else None."""
    items = DEMOS.get(comp_slug, [])
    for it in items:
        if it["label"] == variant_name:
            return it["html"]
    if index < len(items):
        return items[index]["html"]
    return None

# state-toggle hooks (spec §7): a state is interactive only if the preview
# stylesheet already has a class/attribute rule for it on the demo's root.
_HOOK_COMBOS = set()
for _selm in re.finditer(r'([^{}]+)\{', PREVIEW_CSS):
    _sel = _selm.group(1)
    for _hm in re.finditer(r'\.([\w-]+)\.(on|focus)\b', _sel):
        _HOOK_COMBOS.add((_hm.group(1), _hm.group(2)))
    for _hm in re.finditer(r'\.([\w-]+)\[disabled\]', _sel):
        _HOOK_COMBOS.add((_hm.group(1), 'disabled'))

_STATE_KEYWORDS = {"disabled": "disabled", "selected": "on", "checked": "on",
                   "active": "on", "on": "on", "focus": "focus", "focused": "focus"}

def _root_classes(frag):
    m = re.match(r'\s*<\w+[^>]*class="([^"]+)"', frag or "")
    return m.group(1).split() if m else []

def _hook_for_state(state_name, root_classes):
    """Return the CSS hook ('on'/'focus'/'disabled') if the preview stylesheet
    defines it for this demo's root element, else None."""
    words = re.split(r'[\s/,-]+', state_name.lower())
    for w in words:
        hook = _STATE_KEYWORDS.get(w)
        if hook and any((cls, hook) in _HOOK_COMBOS for cls in root_classes):
            return hook
    return None

# usage snippets (spec §8) — generated documentation aid, not tested code
def _variant_value(name):
    return re.sub(r'[^a-z0-9]+', '-', name.split('(')[0].strip().lower()).strip('-')

def _example_value(p):
    t, n = p.get("type", ""), p.get("name", "").lower()
    if t.startswith("'"):
        m = re.match(r"'([^']*)'", t)
        return f'"{m.group(1)}"' if m else '"…"'
    if "boolean" in t: return "{true}"
    if "number" in t: return "{1}"
    if "=>" in t or "()" in t: return "{() => {}}"
    if "string" in t:
        return '"Save"' if n in ("label", "title", "text") else '"…"'
    return "{…}"

def usage_snippet(c, v):
    bits = [c["name"]]
    prop_names = {p.get("name") for p in c.get("props", [])}
    if "variant" in prop_names:
        bits.append(f'variant="{_variant_value(v.get("name", ""))}"')
    for p in c.get("props", []):
        if p.get("required") and p.get("name") != "variant":
            bits.append(f'{p["name"]}={_example_value(p)}')
    return "<" + " ".join(bits) + " />"

# ---------- token display helpers ----------
def swatch_group(title, items, note=None):
    cells = ""
    for name, hexval in items:
        border = "border:1px solid #e3e0da;" if str(hexval).upper() in ("#FFFFFF", "#F9F9F9", "#FAFAFA") else ""
        cells += f'<div class="sw"><div class="chipc" style="background:{esc(hexval)};{border}"></div><div class="swn">{esc(name)}</div><div class="swv">{esc(hexval)}</div></div>'
    n = f'<p class="tnote">{esc(note)}</p>' if note else ""
    return f'<div class="tokgroup"><h4>{esc(title)}</h4><div class="swgrid">{cells}</div>{n}</div>'

tok_html = ""

# brand colors (semantic, resolved)
brand = []
for role in ("primary", "secondary"):
    for k, v in tokens["semantic"]["color"]["brand"][role].items():
        if k.startswith("_") or k == "note": continue
        rv = resolve(v)
        if isinstance(rv, str) and rv.startswith("#"):
            brand.append((f"{role}.{k}", rv))
tok_html += swatch_group("Brand", brand, tokens["semantic"]["color"]["brand"].get("note"))

# status
status = []
for role, obj in tokens["semantic"]["color"]["status"].items():
    if role.startswith("_") or not isinstance(obj, dict): continue
    for k, v in obj.items():
        if k.startswith("_") or k == "note": continue
        rv = resolve(v)
        if isinstance(rv, str) and rv.startswith("#"):
            status.append((f"{role}.{k}", rv))
tok_html += swatch_group("Status", status, tokens["semantic"]["color"]["status"].get("note"))

# text (rgba literals)
textc = [(k, v) for k, v in tokens["semantic"]["color"]["text"].items() if not k.startswith("_") and isinstance(v, str)]
tok_html += swatch_group("Text on light surfaces", textc, tokens["semantic"]["color"]["text"].get("note"))

# surfaces
surf = []
for k, v in tokens["semantic"]["color"]["surface"].items():
    if k.startswith("_") or k == "note": continue
    rv = resolve(v)
    if isinstance(rv, str) and (rv.startswith("#") or rv.startswith("rgba")):
        surf.append((k, rv))
tok_html += swatch_group("Surfaces", surf, tokens["semantic"]["color"]["surface"].get("note"))

# interactive
inter = [(k, v) for k, v in tokens["semantic"]["color"]["interactive"].items() if not k.startswith("_") and k != "note" and isinstance(v, str) and not v.startswith("{")]
tok_html += swatch_group("Interactive state layers", inter, "Overlay colours for hover / selected / focus states.")

# vehicle status
veh = [(k, v) for k, v in tokens["semantic"]["color"]["vehicleStatus"].items() if not k.startswith("_") and k != "note" and isinstance(v, str) and v.startswith("#")]
tok_html += swatch_group("Vehicle status (fleet-specific)", veh, tokens["semantic"]["color"]["vehicleStatus"].get("note"))

# spacing scale
sp_rows = ""
for k, v in tokens["primitive"]["spacing"].items():
    if k in ("note", "unit") or k.startswith("_"): continue
    px = int(v.replace("px", "")) if v.endswith("px") else 0
    sp_rows += f'<tr><td><code>primitive.spacing.{esc(k)}</code></td><td>{esc(v)}</td><td><div class="bar" style="width:{max(px,2)}px"></div></td></tr>'
sem_sp = ""
for k, v in tokens["semantic"]["spacing"].items():
    if k.startswith("_") or k == "note": continue
    sem_sp += f'<tr><td><code>semantic.spacing.{esc(k)}</code></td><td>{esc(resolve(v))}</td><td></td></tr>'

# radius
rad_rows = ""
for k, v in tokens["semantic"]["radius"].items():
    if k.startswith("_") or k == "note": continue
    rv = resolve(v)
    rad_rows += f'<tr><td><code>semantic.radius.{esc(k)}</code></td><td>{esc(rv)}</td><td><div class="radbox" style="border-radius:{esc(rv)}"></div></td></tr>'

# border width
bw_rows = ""
for k, v in tokens["semantic"]["borderWidth"].items():
    if k.startswith("_") or k == "note": continue
    bw_rows += f'<tr><td><code>semantic.borderWidth.{esc(k)}</code></td><td>{esc(resolve(v))}</td><td></td></tr>'

# typography
ty_rows = ""
scale = tokens["semantic"]["typography"]["scale"]
for k, v in scale.items():
    if k.startswith("_"): continue
    fs = v.get("fontSize", "—"); fw = resolve(v.get("fontWeight", "—")); lh = v.get("lineHeight", "—")
    extra = " ⚠" if "note" in v else ""
    ty_rows += f'<tr><td><code>{esc(k)}</code>{extra}</td><td>{esc(fs)}</td><td>{esc(fw)}</td><td>{esc(lh)}</td><td style="font-size:{esc(fs)};font-weight:{esc(fw)};white-space:nowrap">Fleet 42 is idling</td></tr>'

base_font = resolve(tokens["semantic"]["typography"]["fontFamily"])
base_size = tokens["semantic"]["typography"]["baseFontSize"]

# ---------- tiny markdown -> html (for templates/*.md patterns) ----------
def md_inline(s):
    s = esc(s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', s)
    return s

def md_to_html(text):
    out, in_ul = [], False
    for line in text.splitlines():
        line = line.rstrip()
        if line.startswith("- "):
            if not in_ul: out.append("<ul>"); in_ul = True
            out.append(f"<li>{md_inline(line[2:])}</li>")
            continue
        if in_ul: out.append("</ul>"); in_ul = False
        if line.startswith("## "): out.append(f"<h5>{md_inline(line[3:])}</h5>")
        elif line.startswith("# "): pass  # title handled separately
        elif line: out.append(f"<p>{md_inline(line)}</p>")
    if in_ul: out.append("</ul>")
    return "\n".join(out)

def link_components(body_html, prefix):
    """Link a component name to its page when it starts a list item
    (covers the 'Components used' bullets in the pattern templates)."""
    if not comp_names:
        return body_html
    pat = re.compile(r'(<li>)(\s*(?:<b>)?\s*)(' + '|'.join(map(re.escape, comp_names)) + r')\b')
    def repl(m):
        return f'{m.group(1)}{m.group(2)}<a href="{prefix}components/{slug(m.group(3))}.html">{m.group(3)}</a>'
    return pat.sub(repl, body_html)

# ---------- load patterns from templates/*.md ----------
patterns = []
tpl_dir = DS / "templates"
if tpl_dir.is_dir():
    for f in sorted(tpl_dir.glob("*.md")):
        text = f.read_text(encoding="utf-8")
        lines = text.splitlines()
        first = next((l for l in lines if l.startswith("# ")), f.stem)
        title = first.lstrip("# ").strip()
        # one-line blurb: the first non-empty, non-heading line after the title
        # (every templates/*.md file has this as the italic sentence under the H1) —
        # reused by the home page (v2 explainer spec §3/§4.6) so its copy can't drift
        # from the source file.
        title_idx = lines.index(first) if first in lines else -1
        blurb = next((l.strip() for l in lines[title_idx + 1:] if l.strip() and not l.startswith("#")), "")
        patterns.append({
            "slug": f.stem,
            "file": f.name,
            "title": title,
            "navtitle": title.split("(")[0].strip(),
            "blurb": blurb,
            "body": text,
        })

n_comps = len(comps)
n_patterns = len(patterns)

# ---------- meta-driven bits (changelog, provenance, zip size) ----------
changelog_items = ""
for entry in reversed(tokens.get("_meta", {}).get("changelog", [])):
    date, _, rest = entry.partition(": ")
    changelog_items += f'<div class="logi"><span class="logd">{esc(date)}</span><p>{esc(rest or entry)}</p></div>'

prov_items = "".join(f'<li><code>{esc(p)}</code></li>' for p in tokens.get("_meta", {}).get("generatedFrom", []))
zip_path = DOCS / "downloads" / "cartrack-ai-design-system.zip"
zip_kb = round(os.path.getsize(zip_path) / 1024) if zip_path.exists() else 0

# ================================================================
# Shell + navigation
# ================================================================
def cat_slug(cat):
    return re.sub(r'[^a-z0-9]+', '-', cat.lower()).strip('-')

def render_nav(active, prefix):
    """Collapsible accordion nav. Long lists (Patterns, Components) live inside
    <details> groups that are closed at rest; the branch holding the current
    page is emitted `open` so it works with JS disabled, and a small script
    (NAV_JS) handles filtering, localStorage persistence and the mobile drawer."""
    def flat(href, label, key, ic=None):
        cur = ' aria-current="page"' if key == active else ''
        acls = ' active' if key == active else ''
        icn = icon(ic, size=17) if ic else ''
        return f'<a href="{prefix}{href}" class="navtop{acls}"{cur}>{icn}<span class="navlabel">{label}</span></a>'
    def leaf(href, label, key):
        cur = ' aria-current="page"' if key == active else ''
        acls = ' active' if key == active else ''
        return f'<a href="{prefix}{href}" class="navcomp{acls}" data-leaf{cur}>{label}</a>'
    def group(gid, label, count, is_open, inner, ic=None):
        oa = " open" if is_open else ""
        ha = " has-active" if is_open else ""
        icn = icon(ic, size=17) if ic else ''
        return (f'<details class="navgrp{ha}" id="{gid}" data-defopen="{1 if is_open else 0}"{oa}>'
                f'<summary>{icn}<span class="navlabel">{label}</span>'
                f'<span class="navcount">{count}</span><span class="chev"></span></summary>{inner}</details>')

    parts = ['<div class="navfilter"><input type="search" id="navfilter" '
             'placeholder="Filter components…" aria-label="Filter components" '
             'oninput="filterNav(this.value)"></div>']

    # Area 1 — orientation: home + the intro article
    parts.append('<div class="sect">Get started</div>')
    parts.append(flat("index.html", "Home", "home", ic="home"))
    parts.append(flat("guides/index.html", "How to start", "guides", ic="flag"))

    parts.append('<div class="sect">Library</div>')

    # Foundations group
    f_open = active == "foundations" or active.startswith("found:")
    finner = leaf("foundations/index.html", "Overview", "foundations")
    finner += leaf("foundations/tokens.html", "Design tokens", "found:tokens")
    finner += leaf("foundations/colour.html", "Colour", "found:colour")
    finner += leaf("foundations/typography.html", "Typography", "found:typography")
    finner += leaf("foundations/spacing.html", "Spacing &amp; shape", "found:spacing")
    finner += leaf("foundations/iconography.html", "Iconography", "found:iconography")
    finner += leaf("foundations/grid.html", "Grid", "found:grid")
    finner += leaf("foundations/elevation.html", "Elevation", "found:elevation")
    finner += leaf("foundations/accessibility.html", "Accessibility", "found:accessibility")
    parts.append(group("grp-foundations", "Foundations", 8, f_open, finner, ic="tokens"))

    # Components group, with a collapsible sub-group per category
    comp_open = active == "components" or active.startswith("comp:")
    cinner = leaf("components/index.html", "Overview", "components")
    for cat in [c for c in CATEGORY_ORDER if c in categories] + sorted(c for c in categories if c not in CATEGORY_ORDER):
        cat_comps = sorted(categories[cat], key=lambda x: x["name"])
        cat_active = any(active == f"comp:{slug(c['name'])}" for c in cat_comps)
        sub_links = ""
        for c in cat_comps:
            st = c.get("status", "stable")
            badge = "" if st == "stable" else f' <span class="navbadge">{esc(st)}</span>'
            s = slug(c["name"])
            sub_links += leaf(f"components/{s}.html", f'{esc(c["name"])}{badge}', f"comp:{s}")
        ha = " has-active" if cat_active else ""
        oa = " open" if cat_active else ""
        cinner += (f'<details class="navsub{ha}" id="cat-{cat_slug(cat)}" '
                   f'data-defopen="{1 if cat_active else 0}"{oa}>'
                   f'<summary><span class="navlabel">{esc(cat)}</span>'
                   f'<span class="navcount">{len(cat_comps)}</span><span class="chev"></span></summary>{sub_links}</details>')
    parts.append(group("grp-components", "Components", n_comps, comp_open, cinner, ic="box"))

    # Patterns group
    pat_open = active == "patterns" or active.startswith("pat:")
    pinner = leaf("patterns/index.html", "Overview", "patterns")
    for p in patterns:
        pinner += leaf(f"patterns/{p['slug']}.html", esc(p["navtitle"]), f"pat:{p['slug']}")
    parts.append(group("grp-patterns", "Patterns", n_patterns, pat_open, pinner, ic="grid"))

    # Area 3 — resources, all visible (no group to open)
    parts.append('<div class="sect">Resources</div>')
    parts.append(flat("resources/preview.html", "Visual preview", "res:preview", ic="eye"))
    parts.append(flat("resources/changelog.html", "What's new", "res:changelog", ic="message"))
    parts.append(flat("resources/downloads.html", "Downloads", "res:downloads", ic="download"))

    return "\n    ".join(parts)

NAV_JS = r'''
(function(){
  var KEY='dsnav-v2';
  function load(){ try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};} }
  function save(s){ try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){} }
  var store=load();
  var groups=Array.prototype.slice.call(document.querySelectorAll('nav details'));
  var act=document.querySelector('nav a.active');
  function openActiveBranch(){
    if(!act) return;
    var p=act.parentElement;
    while(p && p!==document){ if(p.tagName==='DETAILS') p.open=true; p=p.parentElement; }
  }
  // apply persisted open/closed state over the server defaults, then always reveal
  // the branch holding the current page
  groups.forEach(function(d){ if(d.id in store) d.open=store[d.id]; });
  openActiveBranch();
  // Persist ONLY genuine user interaction. The <details> "toggle" event fires
  // asynchronously, so it can't distinguish a user click from the programmatic
  // opens above — a summary click (which also fires on keyboard activation) can.
  // setTimeout defers the read until after the browser has flipped d.open.
  groups.forEach(function(d){
    var sm=d.querySelector(':scope > summary');
    if(!sm) return;
    sm.addEventListener('click',function(){ setTimeout(function(){ store[d.id]=d.open; save(store); },0); });
  });

  window.filterNav=function(q){
    q=(q||'').trim().toLowerCase();
    var leaves=document.querySelectorAll('nav a[data-leaf]');
    if(!q){
      leaves.forEach(function(a){ a.classList.remove('hidden'); });
      groups.forEach(function(d){
        d.classList.remove('hidden');
        d.open=(d.id in store)?store[d.id]:(d.getAttribute('data-defopen')==='1');
      });
      openActiveBranch();
      return;
    }
    leaves.forEach(function(a){ a.classList.toggle('hidden', a.textContent.toLowerCase().indexOf(q)===-1); });
    groups.forEach(function(d){
      var vis=d.querySelectorAll('a[data-leaf]:not(.hidden)').length>0;
      d.classList.toggle('hidden', !vis);
      d.open=vis;
    });
  };

  window.toggleNav=function(){
    var open=document.body.classList.toggle('navopen');
    var b=document.querySelector('.navtoggle'); if(b) b.setAttribute('aria-expanded', open?'true':'false');
  };
  window.closeNav=function(){
    document.body.classList.remove('navopen');
    var b=document.querySelector('.navtoggle'); if(b) b.setAttribute('aria-expanded','false');
  };
  // choosing a destination closes the mobile drawer
  document.querySelectorAll('nav a[href]').forEach(function(a){
    a.addEventListener('click', window.closeNav);
  });

  // component detail: state toggles (spec §7) — only rendered where the
  // preview stylesheet has a real hook, so no capability is faked here
  document.querySelectorAll('[data-state-toggle]').forEach(function(b){
    b.addEventListener('click', function(){
      var d=document.getElementById(b.getAttribute('data-target'));
      var el=d&&d.firstElementChild; if(!el) return;
      var k=b.getAttribute('data-state-toggle');
      if(k==='disabled'){
        if(el.hasAttribute('disabled')) el.removeAttribute('disabled');
        else el.setAttribute('disabled','');
      } else {
        el.classList.toggle(k);
      }
      b.classList.toggle('active');
      b.setAttribute('aria-pressed', b.classList.contains('active')?'true':'false');
    });
  });

  // home trip-log: the route rail traces scroll progress; waypoints light up
  // as the reader "drives" past them
  var journey=document.querySelector('.journey'), trace=document.getElementById('jtrace');
  if(journey && trace){
    var wps=Array.prototype.slice.call(journey.querySelectorAll('.eyebrow'));
    var update=function(){
      var r=journey.getBoundingClientRect();
      var probe=window.innerHeight*0.45;            // the "vehicle position" line
      var y=Math.max(0, Math.min(probe-r.top, r.height-16));
      trace.style.height=y+'px';
      wps.forEach(function(e){
        e.parentElement.classList.toggle('wp-passed', e.getBoundingClientRect().top < probe);
      });
    };
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    update();
  }
})();'''

def render_shell(active, body, prefix="", page_title="Cartrack AI Design System — Documentation Portal", extra_css=""):
    nav = render_nav(active, prefix)
    body_cls = "p-home" if active == "home" else ""
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{page_title}</title>
<style>
  :root{{
    /* colours sourced from tokens.json (see home-page-visual-redesign-spec §3.1):
       ink=brand.charcoal.900, accent=brand.orange.500, accent-d=brand.orange.700,
       line=border.default, chrome=hue.gray.10, route-blue=hue.blue.base */
    --ink:#0C0C0C; --ink2:#4a5364; --mute:#7d8593; --bg:#ffffff; --chrome:#F9F9F9; --card:#fff;
    --accent:#F47735; --accent-d:#BB4800; --line:rgba(0,0,0,.12); --good:#1a7f4e; --bad:#b3261e;
    --route-blue:#5390BC;
    --r:10px; --r-lg:14px;               /* radius system: standard / feature (pills use 999px) */
    --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
    --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    --display:'Montserrat',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }}
  /* Self-hosted Montserrat (latin subset, variable weight) — no external requests.
     {prefix} keeps the path correct at every folder depth. */
  @font-face{{font-family:'Montserrat';font-style:normal;font-weight:100 900;font-display:swap;src:url('{prefix}fonts/montserrat.woff2') format('woff2')}}
  *{{margin:0;padding:0;box-sizing:border-box}}
  html{{scroll-behavior:smooth;scroll-padding-top:24px}}
  body{{font-family:var(--sans);background:var(--bg);color:var(--ink);line-height:1.6}}
  a{{color:var(--accent-d);text-decoration:none}} a:hover{{text-decoration:underline}}
  code{{font-family:var(--mono);font-size:.86em;background:#f1eee9;border-radius:4px;padding:1px 6px}}

  .layout{{display:grid;grid-template-columns:250px 1fr;min-height:100vh}}
  /* ------- sidebar (three-area layout: Get started / Library / Resources) ------- */
  aside{{border-right:1px solid var(--line);background:var(--chrome);padding:24px 0 28px;position:sticky;top:0;height:100vh;overflow-y:auto}}
  .brand{{padding:0 22px 18px;margin:0 0 4px;border-bottom:1px solid var(--line)}}
  .brand b{{font-family:var(--display);font-size:14.5px;letter-spacing:-.01em;display:block}}
  .brand span{{font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;color:var(--mute)}}
  .brandlink{{color:inherit}} .brandlink:hover{{text-decoration:none}}
  nav{{padding:10px 10px 16px}}
  /* every row — link or group summary — is the same rounded pill on one grid */
  nav a,nav details > summary{{display:flex;align-items:center;gap:9px;padding:6px 10px;margin:1px 0;border-radius:8px;font-size:13.5px;color:var(--ink2);line-height:1.45}}
  nav a:hover,nav details > summary:hover{{background:#fff;box-shadow:0 0 0 1px var(--line);text-decoration:none;color:var(--ink)}}
  nav a.active{{background:#fdf3ec;color:var(--accent-d);font-weight:600}}
  nav a.active:hover{{box-shadow:none}}
  nav a svg,nav summary svg{{flex:none;opacity:.75}}
  nav a.active svg{{opacity:1}}
  /* mono area labels — the telemetry voice, same as the home page eyebrows */
  nav .sect{{font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--mute);padding:20px 10px 6px}}
  nav .sect:first-of-type{{padding-top:8px}}
  nav .navcomp{{font-size:13px;padding-left:36px}}

  /* collapsible groups */
  .navfilter{{padding:2px 10px 10px}}
  .navfilter input{{width:100%;padding:8px 12px;font-size:13px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink)}}
  .navfilter input:focus{{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px #f4713a22}}
  nav details{{overflow:hidden}}
  nav details > summary{{list-style:none;cursor:pointer;font-weight:600;user-select:none}}
  nav details > summary::-webkit-details-marker{{display:none}}
  nav .navlabel{{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
  nav .navcount{{font-family:var(--mono);font-size:10.5px;color:var(--mute);min-width:20px;text-align:right}}
  nav .chev{{flex:none;width:12px;font-size:9px;color:var(--mute);text-align:center;transition:transform .15s}}
  nav .chev::before{{content:"\\25B8"}}
  nav details[open] > summary .chev{{transform:rotate(90deg)}}
  nav details.has-active > summary .navlabel{{color:var(--accent-d)}}
  /* nesting aligns text under the parent label (icon 17px + gap 9px) */
  nav .navgrp > .navcomp{{padding-left:36px}}
  nav .navsub > summary{{padding-left:36px;font-weight:500;font-size:13px}}
  nav .navsub > .navcomp{{padding-left:50px}}
  @media (prefers-reduced-motion:reduce){{nav .chev{{transition:none}}}}

  /* ------- mobile top bar + drawer ------- */
  .topbar{{display:none;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--line);background:#fff;position:sticky;top:0;z-index:40}}
  .navtoggle{{font-size:18px;line-height:1;background:none;border:1px solid var(--line);border-radius:var(--r);padding:5px 11px;cursor:pointer;color:var(--ink)}}
  .topbar-title{{font-size:14px;font-weight:700}}
  .navscrim{{display:none}}

  /* ------- main ------- */
  main{{padding:0 0 100px;min-width:0}}
  .inner{{max-width:880px;margin:0 auto;padding:0 40px}}
  .pagetop{{padding-top:48px}}
  .backlink{{display:inline-block;margin-bottom:20px;font-size:13px;color:var(--ink2)}}
  header.top{{background:var(--ink);color:#fff;padding:72px 0 60px;margin-bottom:56px;position:relative;overflow:hidden}}
  /* map graticule — the hero is a tracking scene, not a flat block */
  header.top::before{{content:"";position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.075) 1px,transparent 1.5px);background-size:24px 24px;pointer-events:none}}
  header.top .inner{{max-width:880px;position:relative;z-index:1}}
  header.top h1{{font-family:var(--display);font-size:clamp(30px,4.2vw,45px);line-height:1.06;font-weight:900;letter-spacing:-.03em;text-wrap:balance}}
  header.top p{{margin-top:16px;color:#c9cdd2;font-size:16.5px;max-width:60ch;line-height:1.55}}
  header.top p.tagline{{color:#c9cdd2;font-size:14.5px;margin-top:10px;font-style:italic}}

  /* signature route line (hero) — a fleet-tracking route metaphor, drawn from the
     product's subject matter. Generic waypoint dots (NOT the Cartrack logomark). */
  .route{{display:flex;align-items:center;gap:16px;margin:32px 0 4px;max-width:580px}}
  .route .wp{{display:flex;align-items:center;gap:9px;font-family:var(--display);font-weight:700;font-size:13px;letter-spacing:.02em;color:#fff;white-space:nowrap}}
  .route .dot{{width:12px;height:12px;border-radius:999px;background:var(--accent);box-shadow:0 0 0 4px #f4773533;flex:none}}
  .route .track{{flex:1;height:2px;transform-origin:left;background:repeating-linear-gradient(90deg,rgba(255,255,255,.45) 0 6px,transparent 6px 13px);animation:routedraw .9s ease .15s both}}
  @keyframes routedraw{{from{{transform:scaleX(0)}}to{{transform:scaleX(1)}}}}
  @media (prefers-reduced-motion:reduce){{.route .track{{animation:none}}}}

  /* de-chromed stat strip (was glass pills) */
  .statstrip{{margin-top:28px;display:flex;flex-wrap:wrap;gap:14px 30px}}
  .statstrip .stat b{{font-family:var(--display);font-weight:800;font-size:24px;line-height:1;color:#fff;display:block}}
  .statstrip .stat span{{font-size:12.5px;color:#aeb3b9}}

  /* telemetry readout — mono is the data voice of a tracking console */
  .telemetry{{margin-top:30px;font-family:var(--mono);font-size:12.5px;color:#9aa0a8;display:flex;flex-wrap:wrap;gap:6px 0;align-items:center}}
  .telemetry b{{color:#fff;font-weight:600}}
  .telemetry .sep{{color:var(--accent);padding:0 12px}}

  /* trip-log journey rail — the page is a route; the reader is the vehicle */
  .journey{{position:relative;padding-left:38px}}
  .journey::before{{content:"";position:absolute;left:7px;top:8px;bottom:8px;width:2px;background:repeating-linear-gradient(180deg,rgba(12,12,12,.22) 0 6px,transparent 6px 13px)}}
  .jtrace{{position:absolute;left:7px;top:8px;width:2px;background:var(--accent);max-height:calc(100% - 16px);height:0}}
  .eyebrow{{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute);position:relative;margin-bottom:6px}}
  .eyebrow::before{{content:"";position:absolute;left:-38px;top:1px;width:12px;height:12px;border-radius:999px;background:var(--bg);border:2px solid rgba(12,12,12,.35);box-shadow:0 0 0 4px var(--bg);transition:background .25s,border-color .25s}}
  .wp-passed .eyebrow::before{{background:var(--accent);border-color:var(--accent)}}
  .wp-passed .eyebrow{{color:var(--accent-d)}}
  .eyebrow.dest::before{{border-radius:3px}}
  @media (prefers-reduced-motion:reduce){{.eyebrow::before{{transition:none}}}}
  .statstrip .stat.tech b{{font-size:15px;letter-spacing:.01em}}

  section{{margin-bottom:56px}}
  h2{{font-size:26px;font-weight:700;letter-spacing:-.01em;margin-bottom:6px;padding-top:8px}}
  .sub{{color:var(--ink2);margin-bottom:26px;max-width:66ch}}
  h5{{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin:20px 0 8px}}

  .steps{{position:relative;display:grid;gap:12px;padding-left:40px}}
  .steps::before{{content:"";position:absolute;left:7px;top:16px;bottom:16px;width:2px;background:repeating-linear-gradient(180deg,rgba(244,119,53,.5) 0 5px,transparent 5px 11px)}}
  .stepc{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:20px 22px;position:relative}}
  .stepc::before{{content:"";position:absolute;left:-40px;top:22px;width:15px;height:15px;border-radius:999px;background:var(--accent);box-shadow:0 0 0 4px var(--bg)}}
  .stepc b{{display:block;margin-bottom:4px;font-size:15px}}
  .stepc p{{font-size:14px;color:var(--ink2)}}
  .stepc code{{white-space:nowrap}}
  .tip{{background:#f0f7f3;border:1px solid #cfe5d8;border-radius:var(--r);padding:16px 20px;font-size:14px;color:#14532d;margin-top:14px}}
  .warn{{background:#fdf1ea;border:1px solid #f3d3c0;border-radius:var(--r);padding:16px 20px;font-size:14px;color:#8a3a10;margin-top:14px}}

  .filemap{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;margin-top:8px}}
  .filemap .fr{{display:grid;grid-template-columns:280px 1fr;border-top:1px solid var(--line)}}
  .filemap .fr:first-child{{border-top:none}}
  .filemap .fp{{padding:14px 20px;font-family:var(--mono);font-size:13px;background:#fbf8f4;border-right:1px solid var(--line)}}
  .filemap .fd{{padding:14px 20px;font-size:14px;color:var(--ink2)}}

  /* icon step row — home "how it works" (visual-modules pass). Circle + connecting
     line replaces the three text step-cards; copy moves to a link-out, not the card. */
  .iconsteps{{position:relative;display:flex;justify-content:space-between;gap:8px;margin-top:6px}}
  .iconsteps::before{{content:"";position:absolute;top:22px;left:60px;right:60px;height:2px;
    background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 6px,transparent 6px 12px)}}
  .iconsteps .istep{{flex:1;text-align:center;position:relative}}
  .iconsteps .ic{{width:44px;height:44px;border-radius:999px;background:var(--ink);color:#fff;
    display:flex;align-items:center;justify-content:center;margin:0 auto 10px}}
  .iconsteps b{{display:block;font-size:13px;color:var(--ink)}}
  .iconsteps span{{display:block;font-size:12px;color:var(--ink2);margin-top:2px}}

  /* icon tiles — "what's inside" (colour-coded by role) and "component library"
     (icon + count badge per category). One shared tile shape, two uses. */
  .ictilegrid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:10px;margin-top:8px}}
  .ictile{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:16px 14px;
    text-align:center;position:relative}}
  .ictile svg{{display:block;margin:0 auto 8px}}
  .ictile .iclabel{{font-family:var(--mono);font-size:12px;color:var(--ink)}}
  .ictile .icbadge{{position:absolute;top:10px;right:10px;font-size:10.5px;font-weight:700;
    background:#f1eee9;color:var(--mute);border-radius:999px;padding:1px 8px}}
  .iclegend{{display:flex;gap:16px;margin-top:12px;font-size:11.5px;color:var(--mute)}}
  .iclegend .dot{{width:9px;height:9px;border-radius:999px;display:inline-block;margin-right:5px;vertical-align:-1px}}

  /* token swatches — "tokens & foundations", real values, no describing-in-prose */
  .swrow{{display:flex;gap:10px;margin-bottom:16px}}
  .swrow .swchip{{flex:1;text-align:center}}
  .swrow .swchip .sw{{height:44px;border-radius:8px}}
  .swrow .swchip span{{display:block;font-family:var(--mono);font-size:10.5px;color:var(--mute);margin-top:6px}}
  .spbars{{display:flex;align-items:flex-end;gap:10px;margin-bottom:16px}}
  .spbars .spcol{{display:flex;flex-direction:column;align-items:center}}
  .spbars .spcol div{{width:20px;background:var(--mute)}}
  .spbars .spcol span{{font-size:10px;color:var(--mute);margin-top:4px}}
  .typesamples{{display:flex;align-items:baseline;gap:20px;margin-bottom:14px}}
  .typesamples .tsl{{display:block;font-size:11px;color:var(--mute);margin-top:4px}}

  /* pattern wireframe thumbnails — layout *shape*, not a one-line description */
  .wfgrid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:12px;margin-top:8px}}
  .wf{{text-align:center}}
  .wf .wfframe{{position:relative;height:64px;border:1px solid var(--line);border-radius:6px;
    background:var(--chrome);overflow:hidden}}
  .wf .wflabel{{font-size:11px;color:var(--ink);margin-top:6px}}

  .rules{{display:grid;gap:10px}}
  .rule{{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--accent-d);border-radius:var(--r);padding:14px 18px;font-size:14.5px}}
  .rule b{{color:var(--ink)}}

  /* long-form guide article */
  .article h3{{font-size:19px;letter-spacing:-.01em;margin:44px 0 12px;padding-top:22px;border-top:1px dashed var(--line)}}
  .article .toc{{font-size:13px;color:var(--ink2);margin:16px 0 0}}

  /* component detail v2: inline variant demos + state toggles */
  .vrow{{display:grid;grid-template-columns:300px 1fr;gap:16px;margin-top:12px;align-items:start}}
  .demo-embed{{border:1px solid var(--line);border-radius:var(--r);padding:22px;display:flex;align-items:center;justify-content:center;overflow-x:auto;min-height:64px}}
  .vinfo b{{font-size:14.5px}}
  .vinfo p{{font-size:13.5px;color:var(--ink2);margin-top:2px}}
  pre.usage{{margin-top:10px;background:#f6f3ee;border:1px solid var(--line);border-radius:var(--r);padding:8px 12px;font-size:12px;overflow-x:auto}}
  pre.usage code{{background:none;padding:0;font-size:12px}}
  .statetry{{display:grid;grid-template-columns:300px 1fr;gap:16px;margin-top:12px;align-items:center}}
  .statebtns{{display:flex;flex-wrap:wrap;gap:8px}}
  .statebtn{{font-family:var(--sans);font-size:12.5px;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:5px 14px;cursor:pointer;color:var(--ink2)}}
  .statebtn:hover{{border-color:var(--accent-d);color:var(--accent-d)}}
  .statebtn:focus-visible{{outline:2px solid var(--accent-d);outline-offset:2px}}
  .statebtn.active{{background:#fdf3ec;border-color:var(--accent-d);color:var(--accent-d);font-weight:600}}

  /* tokens */
  .tokgroup{{margin-bottom:34px}}
  .tokgroup h4{{font-size:15px;margin-bottom:12px}}
  .swgrid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:10px}}
  .sw{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:10px}}
  .chipc{{height:44px;border-radius:7px}}
  .swn{{font-size:12px;font-weight:600;margin-top:8px}}
  .swv{{font-family:var(--mono);font-size:11px;color:var(--mute)}}
  .tnote{{font-size:12.5px;color:var(--mute);margin-top:8px}}
  table.tok{{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;font-size:13.5px}}
  table.tok th{{text-align:left;padding:10px 16px;background:#f4f1ec;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
  table.tok td{{padding:9px 16px;border-top:1px solid var(--line);vertical-align:middle}}
  .bar{{height:12px;background:var(--accent);border-radius:3px}}
  .radbox{{width:44px;height:28px;background:#fff;border:2px solid var(--accent-d)}}

  /* components */
  .cathead{{font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute);margin:44px 0 14px;padding-top:10px;border-top:1px dashed var(--line)}}
  .comp{{background:var(--card);border:1px solid var(--line);border-radius:var(--r-lg);padding:28px 30px;margin-bottom:22px}}
  .comphead{{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap}}
  .comphead h3{{font-size:22px;letter-spacing:-.01em}}
  .pill{{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:#f4ece4;color:var(--accent-d);border-radius:999px;padding:3px 10px}}
  .pill.soft{{background:#eef1f4;color:var(--ink2)}}
  .cdesc{{font-size:14.5px;color:var(--ink2)}}
  .keyrule{{margin-top:12px;background:#fbf6ef;border:1px solid #efe3d2;border-radius:var(--r);padding:12px 16px;font-size:14px}}
  .keyrule::before{{content:"Key rule — ";font-weight:700;color:var(--accent-d)}}
  table.mini{{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:4px}}
  table.mini td,table.mini th{{padding:7px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}}
  table.mini th{{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
  table.mini td.c,table.mini th.c{{text-align:center;width:40px}}
  code.typ{{background:#eef1f4}}
  .dodont{{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}}
  .do,.dont{{border-radius:var(--r);padding:14px 18px;font-size:13.5px}}
  .do{{background:#f0f7f3;border:1px solid #cfe5d8}} .dont{{background:#fbf0ef;border:1px solid #eed2cf}}
  .do h5{{color:var(--good);margin-top:0}} .dont h5{{color:var(--bad);margin-top:0}}
  .do ul,.dont ul{{padding-left:18px;display:grid;gap:4px}}
  .tokpaths{{display:flex;flex-wrap:wrap;gap:6px}}
  .tokpath{{font-size:11.5px}}
  details{{margin-top:16px;font-size:13.5px}}
  summary{{cursor:pointer;color:var(--accent-d);font-weight:600;font-size:13px}}
  ul.plain{{padding-left:18px;margin-top:8px;color:var(--ink2);display:grid;gap:5px}}

  .livelink{{display:inline-block;font-size:13.5px;font-weight:600;white-space:nowrap;background:#f4ece4;border-radius:var(--r);padding:8px 16px;margin-top:4px}}
  .livelink:hover{{text-decoration:none;filter:brightness(.97)}}
  .checks{{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}}
  .chk{{font-size:12px;border:1px solid var(--line);border-radius:999px;padding:4px 12px;color:var(--mute);background:var(--card)}}
  .chk.on{{color:var(--good);border-color:#cfe5d8;background:#f0f7f3}}
  details.research{{margin-top:14px}}
  details.research summary{{color:var(--mute);font-weight:600;font-size:12.5px}}
  .pattern p{{font-size:14px;color:var(--ink2);margin-top:8px}}
  .pattern ul{{padding-left:20px;font-size:13.5px;color:var(--ink2);display:grid;gap:5px;margin-top:6px}}
  .pattern ul b, .pattern p b{{color:var(--ink)}}

  .paths{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px}}
  .path{{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--line);border-radius:var(--r-lg);padding:24px 22px}}
  .path.p-designers{{border-left-color:var(--accent)}}
  .path.p-developers{{border-left-color:var(--ink)}}
  .path.p-agents{{border-left-color:var(--route-blue)}}
  .path .who{{font-family:var(--display);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-d);font-weight:700;margin-bottom:10px}}
  /* Montserrat display headings are a home-page-only signature (spec §7) */
  body.p-home h2{{font-family:var(--display);font-weight:800;letter-spacing:-.01em}}
  .path h4{{font-size:16px;margin-bottom:8px}}
  .path p{{font-size:13.5px;color:var(--ink2)}}
  .prompt{{margin-top:14px;background:#f6f3ee;border:1px solid var(--line);border-radius:var(--r);padding:12px 14px;font-size:12.5px;color:var(--ink2)}}
  .prompt .expect{{display:block;margin-top:8px;font-size:11.5px;color:var(--mute)}}
  .whens{{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}}
  .whenuse,.whennot{{border-radius:var(--r);padding:14px 18px;font-size:13.5px;background:#f6f8fa;border:1px solid #dfe5ea}}
  .whenuse h5,.whennot h5{{margin-top:0}}
  .whenuse ul,.whennot ul{{padding-left:18px;display:grid;gap:4px}}
  .pill.aa{{background:#e7f2ec;color:var(--good)}}
  .idxgrid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:26px}}
  .idxcard{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:16px 18px;color:var(--ink);display:flex;flex-direction:column;gap:4px}}
  .idxcard:hover{{border-color:var(--accent);text-decoration:none}}
  .idxcard b{{font-size:14.5px}}
  .idxcard .idxmeta{{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:2px}}
  .idxcard .idxcat{{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
  .idxcard .idxstatus{{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:#eef1f4;color:var(--ink2);border-radius:999px;padding:1px 8px}}
  .idxcard p{{font-size:12.5px;color:var(--ink2);margin-top:4px}}
  .idxcard.soon{{opacity:.55;filter:grayscale(.4);cursor:default}}
  .idxcard.soon:hover{{border-color:var(--line)}}
  .patgrid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}}
  .grammar{{display:grid;gap:8px;margin:10px 0}}
  .gex{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:12px 16px;font-size:13px}}
  .gex span{{display:block;margin-top:4px;color:var(--mute);font-size:12.5px}}

  .navbadge{{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:#fdeee2;color:var(--accent-d);border-radius:999px;padding:1px 7px;vertical-align:middle}}
  ol.anatomy{{padding-left:22px;font-size:13.5px;color:var(--ink2);display:grid;gap:4px;margin-top:4px}}
  ol.anatomy b{{color:var(--ink)}}
  .prov{{margin-top:6px;font-size:12px;color:var(--mute)}}
  .cfoot{{margin-top:22px;padding-top:14px;border-top:1px dashed var(--line);font-size:12px;color:var(--mute)}}
  .cfoot code{{font-size:11px}}
  .logi{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:18px 22px;margin-bottom:12px}}
  .logi .logd{{font-family:var(--mono);font-size:12px;color:var(--accent-d);font-weight:600}}
  .logi p{{font-size:14px;color:var(--ink2);margin-top:6px}}
  ul.provlist{{padding-left:20px;font-size:13px;color:var(--ink2);display:grid;gap:6px;margin-top:10px}}

  /* downloads */
  .dl{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
  .dlc{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:22px;display:flex;flex-direction:column;gap:6px}}
  .dlc.primary{{grid-column:1/-1;border:2px solid var(--accent-d);background:#fffaf6}}
  .dlc b{{font-size:15px}}
  .dlc span{{font-size:13.5px;color:var(--ink2)}}
  .dlbtn{{margin-top:10px;align-self:flex-start;background:var(--accent-d);color:#fff !important;border-radius:var(--r);padding:9px 18px;font-size:13.5px;font-weight:600}}
  .dlbtn:hover{{text-decoration:none;filter:brightness(.92)}}
  .dlbtn.ghost{{background:transparent;color:var(--accent-d) !important;border:1px solid var(--accent-d)}}
  .dlbtn.lg{{padding:13px 26px;font-size:15px;display:inline-block}}
  .ctaend{{text-align:center;background:var(--chrome);border:1px solid var(--line);border-radius:var(--r-lg);padding:36px 24px;margin-top:8px}}
  .ctaend p{{font-size:15px;color:var(--ink2);margin-bottom:14px}}

  /* preview */
  .prevframe{{width:100%;height:720px;border:1px solid var(--line);border-radius:var(--r);background:#fff}}
  .searchbox{{width:100%;padding:11px 16px;font-size:14px;border:1px solid var(--line);border-radius:var(--r);margin-bottom:18px;background:#fff}}
  .hidden{{display:none !important}}

  @media (max-width:900px){{
    .topbar{{display:flex}}
    .layout{{grid-template-columns:1fr}}
    aside{{position:fixed;top:0;left:0;width:280px;max-width:85vw;height:100vh;z-index:50;transform:translateX(-100%);transition:transform .2s ease}}
    body.navopen aside{{transform:translateX(0);box-shadow:0 0 40px rgba(0,0,0,.25)}}
    body.navopen .navscrim{{display:block;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:45}}
    .dodont,.dl,.paths,.whens,.vrow,.statetry{{grid-template-columns:1fr}} .filemap .fr{{grid-template-columns:1fr}} .filemap .fp{{border-right:none}}
  }}
{extra_css}
</style>
</head>
<body class="{body_cls}">
<div class="topbar">
  <button class="navtoggle" aria-label="Toggle navigation" aria-expanded="false" onclick="toggleNav()">☰</button>
  <span class="topbar-title">Cartrack AI Design System</span>
</div>
<div class="layout">
<aside>
  <div class="brand"><a class="brandlink" href="{prefix}index.html"><b>Cartrack AI Design System</b></a><span>Documentation portal · v1</span></div>
  <nav>
    {nav}
  </nav>
</aside>

<main>
{body}
</main>
</div>
<div class="navscrim" onclick="closeNav()"></div>
<script>{NAV_JS}</script>
</body>
</html>'''

# ================================================================
# Page bodies
# ================================================================
def body_home():
    cat_items = "".join(
        f'<div class="ictile"><span class="icbadge">{len(items)}</span>{icon(CAT_ICONS.get(cat, "box"), "var(--accent-d)")}'
        f'<div class="iclabel" style="font-family:var(--sans)">{esc(cat)}</div></div>'
        for cat, items in sorted(categories.items(), key=lambda kv: -len(kv[1]))
    )
    pattern_item_parts = []
    for p in patterns:
        bg = PATTERN_WIREFRAME_BG.get(p["slug"])
        bg_style = f' style="background:{bg}"' if bg else ""
        wf_inner = PATTERN_WIREFRAMES.get(p["slug"], "")
        pattern_item_parts.append(
            f'<div class="wf" title="{esc(p["blurb"])}">'
            f'<div class="wfframe"{bg_style}>{wf_inner}</div>'
            f'<div class="wflabel">{esc(p["navtitle"])}</div></div>'
        )
    pattern_items = "".join(pattern_item_parts)
    return f'''<header class="top">
  <div class="inner">
    <h1>The AI-optimized design system<br>for Cartrack Fleet.</h1>
    <p>Real Fleet Portal tokens and components — {n_comps} components, one tokens source of truth, {n_patterns} page patterns — packaged into one folder so an AI coding tool (Claude, Cursor, Copilot) can build on-brand UI without ever touching production code.</p>
    <p class="tagline">Start by downloading the package, then connect the folder to your AI tool of choice.</p>
    <a class="dlbtn lg" href="downloads/cartrack-ai-design-system.zip" download>Download the system</a>
    <div class="telemetry" aria-label="System stats">
      <span><b>{n_comps}</b> components</span><span class="sep">·</span>
      <span><b>{n_patterns}</b> patterns</span><span class="sep">·</span>
      <span><b>1</b> tokens source</span><span class="sep">·</span>
      <span><b>0</b> setup steps</span><span class="sep">·</span>
      <span>MD2 / MDC 14 / React</span>
    </div>
  </div>
</header>

<div class="inner">
<div class="journey"><div class="jtrace" id="jtrace"></div>
<section id="how">
  <p class="eyebrow">WP·01 — Setup</p>
  <h2>How it works</h2>
  <p class="sub">Three steps from zero to a production-optimized UI prototype.</p>
  <div class="iconsteps">
    <div class="istep"><div class="ic">{icon("download", "#fff")}</div><b>Download</b><span>Unzip the package anywhere</span></div>
    <div class="istep"><div class="ic">{icon("plug", "#fff")}</div><b>Connect</b><span>Point your AI tool at the folder</span></div>
    <div class="istep"><div class="ic">{icon("checklist", "#fff")}</div><b>Rules load</b><span>CLAUDE.md / AGENTS.md read automatically</span></div>
  </div>
  <p class="tnote" style="margin-top:16px"><a href="guides/index.html#quick-start">Full quick start, incl. Cursor/Copilot/Codex setup →</a></p>
</section>

<section id="inside">
  <p class="eyebrow">WP·02 — Payload</p>
  <h2>What's inside the download</h2>
  <p class="sub">One folder — every tile below maps to a section further down this page.</p>
  <div class="ictilegrid">
    <div class="ictile">{icon("file", "var(--ink)")}<div class="iclabel">CLAUDE.md</div></div>
    <div class="ictile">{icon("file", "var(--ink)")}<div class="iclabel">AGENTS.md</div></div>
    <div class="ictile">{icon("file", "var(--ink)")}<div class="iclabel">README.md</div></div>
    <div class="ictile">{icon("tokens", "var(--accent-d)")}<div class="iclabel">tokens.json</div></div>
    <div class="ictile">{icon("box", "var(--accent-d)")}<div class="iclabel">components/</div></div>
    <div class="ictile">{icon("grid", "var(--accent-d)")}<div class="iclabel">templates/</div></div>
    <div class="ictile">{icon("eye", "var(--route-blue)")}<div class="iclabel">preview.html</div></div>
    <div class="ictile">{icon("flask", "var(--route-blue)")}<div class="iclabel">vibe-tests/</div></div>
  </div>
  <div class="iclegend">
    <span><span class="dot" style="background:var(--ink)"></span>instructions</span>
    <span><span class="dot" style="background:var(--accent-d)"></span>content</span>
    <span><span class="dot" style="background:var(--route-blue)"></span>verification</span>
  </div>
  <p class="tnote" style="margin-top:12px">Every rule above is enforced, not just written down: WCAG AA contrast is checked, values are pulled from the real production codebase rather than invented, and a missing component or token gets flagged instead of fabricated. <a href="guides/index.html#inside">Full folder map →</a></p>
</section>

<section id="tokens">
  <p class="eyebrow">WP·03 — Foundations</p>
  <h2>Tokens &amp; foundations</h2>
  <p class="sub">Every colour, spacing, type and radius value in <code>tokens/tokens.json</code> — derived from the real fleetapp-web codebase, not invented.</p>
  <div class="swrow">
    <div class="swchip"><div class="sw" style="background:#F47735"></div><span>orange.500</span></div>
    <div class="swchip"><div class="sw" style="background:#BB4800"></div><span>orange.700</span></div>
    <div class="swchip"><div class="sw" style="background:#0C0C0C"></div><span>charcoal.900</span></div>
    <div class="swchip"><div class="sw" style="background:var(--route-blue)"></div><span>blue.base</span></div>
  </div>
  <div class="spbars">
    <div class="spcol"><div style="height:4px"></div><span>4</span></div>
    <div class="spcol"><div style="height:8px"></div><span>8</span></div>
    <div class="spcol"><div style="height:16px"></div><span>16</span></div>
    <div class="spcol"><div style="height:24px"></div><span>24</span></div>
    <div class="spcol"><div style="height:32px"></div><span>32</span></div>
  </div>
  <div class="typesamples">
    <div><span style="font-weight:300;font-size:26px">Aa</span><span class="tsl">light 300</span></div>
    <div><span style="font-weight:400;font-size:26px">Aa</span><span class="tsl">regular 400</span></div>
    <div><span style="font-weight:700;font-size:26px">Aa</span><span class="tsl">bold 700</span></div>
    <div style="color:var(--mute);font-size:12px">Roboto, 14px base</div>
  </div>
  <div style="display:flex;gap:8px">
    <span class="pill soft">primitive</span><span class="pill soft">semantic</span><span class="pill soft">legacy</span>
  </div>
  <p class="tnote" style="margin-top:12px"><a href="foundations/index.html">Full foundations reference →</a></p>
</section>

<section id="components">
  <p class="eyebrow">WP·04 — Inventory</p>
  <h2>Component library</h2>
  <p class="sub"><b>{n_comps} components</b>, each mapped prop-for-prop against the real production source — not designed from scratch.</p>
  <div class="ictilegrid">{cat_items}</div>
  <p class="tnote" style="margin-top:10px"><a href="components/index.html">Full component reference →</a></p>
</section>

<section id="patterns">
  <p class="eyebrow">WP·05 — Compositions</p>
  <h2>Patterns</h2>
  <p class="sub"><b>{n_patterns} page patterns</b> — how components compose into whole screens, not just isolated pieces. Hover a shape for what it's for.</p>
  <div class="wfgrid">{pattern_items}</div>
  <p class="tnote" style="margin-top:10px"><a href="patterns/index.html">Full patterns reference →</a></p>
</section>

<section id="cta-end">
  <p class="eyebrow dest">Destination — ship UI</p>
  <div class="ctaend">
    <p>Ready to start?</p>
    <a class="dlbtn lg" href="downloads/cartrack-ai-design-system.zip" download>Download the system</a>
  </div>
</section>
</div>

<section id="whats-here">
  <h5>More in this portal</h5>
  <p class="sub">Five sections. Start with the guide if you're new; jump straight to the reference if you're not.</p>
  <div class="idxgrid">
    <a class="idxcard" href="guides/index.html">
      <b>How to start</b>
      <span class="idxmeta"><span class="idxcat">Guide</span></span>
      <p>One page: setup, how the system works, the rules, and how to verify your work.</p></a>
    <a class="idxcard" href="foundations/index.html">
      <b>Foundations</b>
      <span class="idxmeta"><span class="idxcat">Colour · type · spacing · accessibility</span></span>
      <p>The design fundamentals, generated straight from <code>tokens.json</code>.</p></a>
    <a class="idxcard" href="components/index.html">
      <b>Components</b>
      <span class="idxmeta"><span class="idxcat">{n_comps} components</span></span>
      <p>Full reference: props, variants, do/don't rules, tokens and accessibility per component.</p></a>
    <a class="idxcard" href="patterns/index.html">
      <b>Patterns</b>
      <span class="idxmeta"><span class="idxcat">{n_patterns} page patterns</span></span>
      <p>How components compose into whole screens — table pages, detail pages, maps, settings, login.</p></a>
    <a class="idxcard" href="resources/index.html">
      <b>Resources</b>
      <span class="idxmeta"><span class="idxcat">Preview · changelog · downloads</span></span>
      <p>The visual preview, what's new, and everything to take away — including the full system zip.</p></a>
  </div>
  <div class="warn"><b>Important:</b> connect the package folder itself as the workspace root — not a parent folder. Unzip the download and you're already there; if you instead clone the source repo, that's <code>design-system/</code>, not the repo root (the repo also holds this docs site, in a sibling <code>portal/</code> folder). The automatic rule-loading (CLAUDE.md / AGENTS.md) is guaranteed only from the root of the connected folder.</div>
</section>
</div>'''

def body_guides():
    """Single long-form 'How to start' article (how-to-start-draft.md, blocks 1-10)."""
    return f'''<div class="inner pagetop">
<article class="article">
<section>
  <h2>How to start</h2>
  <p class="sub"><b>Cartrack AI Design System</b> is a self-contained, AI-ready component library and token set for the Cartrack Fleet Portal. One folder, no build step, no external dependencies — everything an AI agent or a human developer needs to generate consistent, on-brand, accessible UI lives inside it. It follows the "lean AI-optimized design system" pattern (the Astryx approach): tokens as a single source of truth, per-component documentation colocated with the code, and short root-level instruction files that tell an AI agent how to behave — instead of one giant style guide nobody reads.</p>
  <p class="sub">Every value is <b>derived from the real fleetapp-web production codebase</b> (karoo-ui / MUI theme, MDC 14 components, legacy Sass variables). This documents what actually ships today, not an idealized spec — if something looks inconsistent, that's the current product, flagged rather than hidden.</p>
  <p class="toc">On this page: <a href="#inside">What's inside</a> · <a href="#why">Why it's built this way</a> · <a href="#quick-start">Quick start</a> · <a href="#paths">Pick your path</a> · <a href="#concepts">Core concepts</a> · <a href="#rules">The rules</a> · <a href="#verify">Verify your work</a> · <a href="#scope">Scope &amp; limitations</a> · <a href="#next">Where to go next</a></p>

  <h3 id="inside">What's inside the folder</h3>
  <table class="mini"><thead><tr><th>Path</th><th>What it is</th><th style="width:150px">Who reads it</th></tr></thead><tbody>
    <tr><td><code>CLAUDE.md</code></td><td>The index — folder map, token model, known issues. Auto-loaded by Claude tools at session start.</td><td>AI agents first</td></tr>
    <tr><td><code>AGENTS.md</code></td><td>The behavior contract — the rules every AI agent must follow, plus a verification checklist. Auto-read by Cursor, Copilot, Codex; imported by <code>CLAUDE.md</code> for Claude.</td><td>AI agents</td></tr>
    <tr><td><code>README.md</code></td><td>Human-friendly overview of the whole system.</td><td>People</td></tr>
    <tr><td><code>tokens/tokens.json</code></td><td>Single source of truth for color, spacing, typography, radius, border width. <code>primitive</code> / <code>semantic</code> / <code>legacy</code> tiers, plus <code>_meta.changelog</code>.</td><td>AI agents + developers</td></tr>
    <tr><td><code>components/&lt;Name&gt;/</code></td><td>{n_comps} components, 3 files each: <code>.tsx</code> implementation, <code>.doc.json</code> structured docs (props, variants, do/don't, tokens), <code>index.ts</code>.</td><td>AI agents + developers</td></tr>
    <tr><td><code>templates/</code></td><td>{n_patterns} page patterns (table, detail, map/tracking, settings, login) — which components compose each screen and the composition rules.</td><td>AI agents + designers</td></tr>
    <tr><td><code>component-library-preview.html</code></td><td>Every component rendered visually, one static page, no server needed.</td><td>People</td></tr>
    <tr><td><code>vibe-tests/</code></td><td>Tests whether these docs actually produce correct output from a fresh AI agent — stratified prompts, a subagent-driven run, and an aggregate pass-rate script.</td><td>Whoever maintains this package</td></tr>
  </tbody></table>
  <p class="tnote" style="margin-top:8px">This table is the package: everything above lives in <code>design-system/</code> and is exactly what the zip download contains. The docs site you're reading now, and the marketing <code>brand/</code> guidelines, live in a sibling <code>portal/</code> folder in the source repo — useful context, not something you need to download to use the system.</p>

  <h3 id="why">Why it's built this way</h3>
  <p class="sub">Most design systems are written for humans to read occasionally. This one is written for an AI agent to read <i>every session</i> — so it has to be short, unambiguous, and structurally predictable rather than exhaustive. That's why there's no giant style-guide PDF: instructions live in two small root files (<code>CLAUDE.md</code>, <code>AGENTS.md</code>), and design judgment lives next to the code it governs (<code>&lt;Name&gt;.doc.json</code>), not in a separate wiki that drifts out of sync.</p>
  <p class="sub">The tradeoff: some things are deliberately <b>not</b> included yet — a semantic-token resolver, tests, Storybook, theme packages — because the lean pattern only adds a piece once a concrete pain justifies it. See <a href="#scope">scope &amp; limitations</a>.</p>

  <h3 id="quick-start">Quick start: download &amp; connect</h3>
  <div class="steps" style="margin-top:14px">
    <div class="stepc"><b>Download the system</b><p>Grab the zip from <a href="../resources/downloads.html">Downloads</a> and unzip anywhere — the zip's top-level folder is the whole package. Or clone the source repo and use its <code>design-system/</code> folder (the repo also holds this docs site, in a sibling <code>portal/</code> folder you don't need).</p></div>
    <div class="stepc"><b>Connect it to your tool</b><p>Point the tool at the package folder <b>itself</b> (the unzipped folder, or <code>design-system/</code> if you cloned the repo) — not a parent folder. Rule-loading is guaranteed only from the root of the connected folder.</p><p style="margin-top:6px"><b>Claude Cowork:</b> new session → select the folder. &nbsp;<b>Claude Code:</b> open a terminal in the folder, run <code>claude</code>. &nbsp;<b>Cursor / Copilot / Codex:</b> open the folder as a workspace — they pick up <code>AGENTS.md</code> automatically via the agents.md standard.</p></div>
  </div>
  <div class="tip"><b>Self-test:</b> ask your tool "what design system rules apply here?" It should recite the <code>AGENTS.md</code> rules without you naming a file. If it can't, the folder isn't connected at its root.</div>

  <h3 id="paths">Pick your path</h3>
  <div class="paths" style="margin-top:14px">
    <div class="path p-designers">
      <div class="who">For designers</div>
      <h4>Prototype in product language</h4>
      <p>Ask for screens in plain language — no need to mention the design system by name, the rules are already loaded once the folder is connected. Iterate the same way you'd brief a developer: "denser table", "add a selection bar". Check results against the <a href="../resources/preview.html">visual preview</a>.</p>
      <div class="prompt"><b>Try this first prompt:</b><br><i>"Build an HTML prototype of a vehicle list page: app bar with search, filter chips, a data table with status chips and pagination, and one primary action 'Add vehicle'."</i><br><span class="expect">Expected result: a single .html file using the MDC classes, orange <code>primary.dark</code> for the contained button (AA-safe), 14px Roboto body text, and 4px-grid spacing throughout.</span></div>
    </div>
    <div class="path p-developers">
      <div class="who">For developers</div>
      <h4>Build features on the real values</h4>
      <p>Every component is 3 files: <code>.tsx</code> (MDC class contract), <code>.doc.json</code> (the API and usage contract — <b>read this first</b>), <code>index.ts</code>. All visual values come from <code>tokens/tokens.json</code>.</p>
      <p style="margin-top:8px">The one non-obvious rule up front: in inline styles, use <code>primitive.*</code> values. Most <code>semantic.*</code> entries are alias strings awaiting a build-time resolver this repo doesn't have yet — full explanation in <a href="#concepts">core concepts</a>.</p>
    </div>
    <div class="path p-agents">
      <div class="who">For AI agents</div>
      <h4>Your rules load automatically</h4>
      <p>Claude tools auto-load <code>CLAUDE.md</code>, which imports <code>AGENTS.md</code>. Other agents read <code>AGENTS.md</code> directly via the agents.md standard. Before using any component, read its <code>.doc.json</code>. Before finishing a task, run the <a href="#verify">verification checklist</a>.</p>
      <div class="prompt"><b>Self-test:</b> if a human asks "what design system rules apply here?", you should be able to recite the AGENTS.md rules without any file being mentioned. If you can't, the folder isn't connected at its root.</div>
    </div>
  </div>

  <h3 id="concepts">Core concepts you need before writing anything</h3>
  <div class="rules" style="margin-top:14px">
    <div class="rule"><b>Tokens have three tiers.</b> <code>primitive.*</code> = raw values (hex, px) — safe to use directly in code. <code>semantic.*</code> = named roles (e.g. <code>semantic.color.brand.primary.main</code>) — mostly unresolved alias strings (<code>"{{primitive...}}"</code>) meant for a build-time resolver that doesn't exist yet; paste one into a runtime style and you set the CSS property to that literal placeholder text. <b>In <code>.tsx</code> styles use <code>primitive.*</code>; in docs and <code>.doc.json</code> files cite <code>semantic.*</code>.</b> Exceptions authored as real literals: <code>semantic.color.text.*</code>, <code>border.default</code>, <code>interactive.*</code>. <code>legacy.*</code> = deprecated pre-MUI values (5px grid, bold=600) — don't use in new work.</div>
    <div class="rule"><b>Every component is the same 3 files.</b> <code>.doc.json</code> is the source of truth for how to use it — read <code>doThis</code> / <code>dontDoThis</code> and the <code>tokens</code> list before writing any code against a component.</div>
    <div class="rule"><b>Templates encode composition, not just layout.</b> Before inventing a screen structure, check <a href="../patterns/index.html">the patterns</a> (table page, detail page, map/tracking, settings, login) — the composition rules there exist because someone already made those tradeoffs.</div>
    <div class="rule"><b><code>brand/</code> is reference-only.</b> It documents Cartrack's <i>marketing</i> brand (website, ads, print) — not the product. It shares some values with <code>tokens.json</code> (brand orange, the Material icon base) and deliberately diverges on others (marketing has a dedicated blue and uses Montserrat + pure black; the product doesn't). Never cite a <code>brand/*.doc.json</code> value in a component's tokens list.</div>
  </div>

  <h3 id="rules">The rules everyone follows</h3>
  <p class="sub">The condensed <code>AGENTS.md</code> contract, human-readable — it applies to everyone producing UI, not just machines.</p>
  <div class="rules">
    <div class="rule"><b>Use the components, never raw HTML.</b> <code>&lt;Button&gt;</code> not <code>&lt;button&gt;</code>, <code>&lt;TextField&gt;</code> not <code>&lt;input&gt;</code>. All {n_comps} live in <code>components/</code>.</div>
    <div class="rule"><b>Never hardcode visual values.</b> Colours, spacing, type and radii always come from <code>tokens/tokens.json</code>.</div>
    <div class="rule"><b>In code, use <code>primitive.*</code> values</b> — see <a href="#concepts">core concepts</a> for why.</div>
    <div class="rule"><b>The doc.json is the source of truth.</b> Read a component's do/don't rules before using it — that's where the design judgment lives.</div>
    <div class="rule"><b>One primary action per view.</b> One contained primary button; everything else is outlined or text.</div>
    <div class="rule"><b>WCAG AA is not optional.</b> Never white text on brand orange <code>#F47735</code> (~2.79:1 — fails). Filled surfaces with white text use <code>primary.dark</code> <code>#BB4800</code> (~5.2:1) instead.</div>
    <div class="rule"><b>Don't invent.</b> Missing component, variant or token → flag the gap, don't fabricate it.</div>
  </div>
  <div class="warn"><b>Hard "do not" list:</b> don't hardcode, don't paste <code>semantic.*</code> aliases into runtime styles, don't use <code>legacy.*</code> tokens, don't invent APIs, don't edit <code>tokens.json</code> structurally without a changelog entry, don't add dependencies.</div>
  <p class="tnote" style="margin-top:12px">Need the machine-readable version? <a href="../resources/downloads.html">Download AGENTS.md</a> — the standalone contract file AI agents read.</p>

  <h3 id="verify">Verify your work</h3>
  <p class="sub">The same checklist <code>AGENTS.md</code> gives AI agents — it closes the loop for humans too.</p>
  <div class="tip"><ul class="plain" style="list-style:none;padding-left:4px;margin:0;color:inherit">
    <li>☐ <code>tokens.json</code> still parses as valid JSON, if touched</li>
    <li>☐ No hardcoded colors/spacing/type introduced</li>
    <li>☐ Only existing components, variants, and token paths used — every path cited actually exists in <code>tokens.json</code></li>
    <li>☐ No white-on-orange (<code>#FFFFFF</code> on <code>#F47735</code>)</li>
    <li>☐ New/changed components keep the 3-file pattern</li>
    <li>☐ Structural <code>tokens.json</code> changes have a <code>_meta.changelog</code> entry</li>
  </ul></div>

  <h3 id="scope">Scope &amp; limitations</h3>
  <ul class="plain" style="margin-top:10px">
    <li><b>MD2-based</b> (Material Design 2 / MDC 14), matching current production — not MD3.</li>
    <li>The HTML preview is <b>hand-authored and manually synced</b> to <code>tokens.json</code> — not generated, so it can drift if tokens change without a manual re-sync.</li>
    <li><code>semantic.*</code> alias resolution, tests, Storybook, and theme packages are <b>deliberately not included yet</b>.</li>
  </ul>

  <h3 id="next">Where to go next</h3>
  <div class="idxgrid" style="margin-top:14px">
    <a class="idxcard" href="../foundations/index.html"><b>Foundations</b><p>Colour, typography, spacing &amp; shape, accessibility.</p></a>
    <a class="idxcard" href="../components/index.html"><b>Components</b><p>All {n_comps}, by category.</p></a>
    <a class="idxcard" href="../patterns/index.html"><b>Patterns</b><p>{n_patterns} full-page compositions.</p></a>
    <a class="idxcard" href="../resources/index.html"><b>Resources</b><p>Visual preview, changelog, downloads.</p></a>
  </div>
</section>
</article>
</div>'''

# ---------- foundations redesign data (foundations-section-redesign spec) ----------
# Everything below is read live from tokens.json / doc.jsons — never hand-typed.

# data-visualization palette — semantic.color.dataViz (10 hues × 4 roles)
_dv = tokens["semantic"]["color"].get("dataViz", {})
dv_note = _dv.get("note", "")
dv_rows = ""
for _hue, _obj in _dv.items():
    if _hue.startswith("_") or _hue == "note" or not isinstance(_obj, dict):
        continue
    _cells = ""
    for _role in ("background", "border", "icon", "text"):
        _v = resolve(_obj.get(_role, ""))
        if isinstance(_v, str) and (_v.startswith("#") or _v.startswith("rgba")):
            _b = "border:1px solid #e3e0da;" if str(_v).upper() in ("#FFFFFF", "#F9F9F9", "#FAFAFA") else ""
            _cells += f'<td><div class="chipc" style="height:20px;{_b}background:{esc(_v)}"></div><div class="swv">{esc(_v)}</div></td>'
        else:
            _cells += "<td>—</td>"
    _n = f'<div class="tnote">{esc(_obj["note"])}</div>' if _obj.get("note") else ""
    dv_rows += f'<tr><td><code>dataViz.{esc(_hue)}</code>{_n}</td>{_cells}</tr>'

# neutral ramp — primitive.color.hue.gray, surfaced as its own palette
_gray = tokens["primitive"]["color"]["hue"]["gray"]
_gray_items = [(k, v) for k, v in _gray.items()
               if not k.startswith("_") and k != "note" and isinstance(v, str)]
neutral_html = swatch_group(
    "Neutral palette (primitive.color.hue.gray)", _gray_items,
    f"Raw neutral primitives. Caveat: gray.10 ({_gray.get('10', '')}) is the value "
    f"semantic.color.surface.appBackground resolves to — read it as that surface role, "
    f"not a competing background colour.")

# real spacing consumers, from component doc.jsons (cited, never invented)
spacing_consumers = {}
for _c in comps:
    for _tok in _c.get("tokens", []):
        if _tok.startswith("semantic.spacing."):
            spacing_consumers.setdefault(_tok.rsplit(".", 1)[1], []).append(_c["name"])

def spacing_bucket_rows():
    out = ""
    for k in ("xs", "sm", "md", "lg", "xl", "xxl"):
        if k not in tokens["semantic"]["spacing"]:
            continue
        val = resolve(tokens["semantic"]["spacing"][k])
        names = sorted(set(spacing_consumers.get(k, [])))
        if names:
            who = "Cited by: " + ", ".join(names) + "."
        else:
            who = "No component doc.json cites this step today — flagged rather than given an invented example."
        out += (f'<div class="rule"><b><code>semantic.spacing.{k}</code> — {esc(val)}</b> — {esc(who)}</div>')
    return out

sem_sp_note = tokens["semantic"]["spacing"].get("note", "")
prim_sp_note = tokens["primitive"]["spacing"].get("note", "")
bp_note = tokens.get("legacy", {}).get("breakpoints", {}).get("note", "")
bp_keys = [k for k in tokens.get("legacy", {}).get("breakpoints", {}) if k != "note"]
fa_value = tokens["primitive"]["fontFamily"].get("fontAwesome", "")
default_variant = tokens["semantic"]["typography"].get("defaultVariant", "")
ty_note = tokens["semantic"]["typography"].get("note", "")

def body_found_index():
    return f'''<div class="inner pagetop">
<section id="tokens">
  <h2>Foundations</h2>
  <p class="sub">The design fundamentals, generated from <code>tokens/tokens.json</code>. Two tiers: <b>primitive</b> (raw values) and <b>semantic</b> (named roles that alias primitives). Reference semantic names in docs; use primitive values in code.</p>
  <div class="warn"><b>Never copy hex values out of these pages.</b> Reference the token — the values shown here are for verification only. Copied hex numbers can't be updated when the system changes; token references can.</div>

  <h5 style="margin-top:30px">Design tokens</h5>
  <div class="idxgrid">
    <a class="idxcard" href="tokens.html">{icon("tokens", "var(--accent-d)")}<b>Design tokens</b><span class="idxmeta"><span class="idxcat">Mechanism</span></span><p>What a token is, how names compose, which tier to use where, and where every value comes from.</p></a>
  </div>

  <h5 style="margin-top:26px">Guidelines</h5>
  <div class="idxgrid">
    <a class="idxcard" href="accessibility.html">{icon("a11y", "var(--accent-d)")}<b>Accessibility</b><span class="idxmeta"><span class="idxcat">Guideline</span></span><p>The AA policy, the one contrast trap, and per-component requirements.</p></a>
  </div>

  <h5 style="margin-top:26px">Styles</h5>
  <div class="idxgrid">
    <a class="idxcard" href="colour.html">{icon("droplet", "var(--accent-d)")}<b>Colour</b><span class="idxmeta"><span class="idxcat">Style</span></span><p>Brand, status, text, surface, interactive-state, fleet-specific, data-viz and neutral palettes.</p></a>
    <a class="idxcard" href="typography.html">{icon("type", "var(--accent-d)")}<b>Typography</b><span class="idxmeta"><span class="idxcat">Style</span></span><p>Base font, weights, and the full type scale with live samples.</p></a>
    <a class="idxcard" href="spacing.html">{icon("ruler", "var(--accent-d)")}<b>Spacing &amp; shape</b><span class="idxmeta"><span class="idxcat">Style</span></span><p>The 4px spacing grid with real usage buckets, plus corner radii and border widths.</p></a>
    <a class="idxcard" href="iconography.html">{icon("star", "var(--mute)")}<b>Iconography</b><span class="idxmeta"><span class="idxcat">Style</span><span class="idxstatus">stub</span></span><p>What's known (FontAwesome) and what token work is still missing.</p></a>
    <a class="idxcard" href="grid.html">{icon("grid", "var(--mute)")}<b>Grid</b><span class="idxmeta"><span class="idxcat">Style</span><span class="idxstatus">stub</span></span><p>Not yet defined in tokens — only flagged legacy breakpoints exist.</p></a>
    <a class="idxcard" href="elevation.html">{icon("layers", "var(--mute)")}<b>Elevation</b><span class="idxmeta"><span class="idxcat">Style</span><span class="idxstatus">stub</span></span><p>No shadow/z-index tokens yet — MUI defaults used unoverridden.</p></a>
  </div>

  <p class="tnote" style="margin-top:22px">Looking for the token naming grammar or the provenance list? Both moved to the <a href="tokens.html">Design tokens</a> page.</p>
</section>
</div>'''

def body_found_tokens():
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Foundations</a>
<section id="tokens-explained">
  <h2>Design tokens</h2>
  <p class="sub">A design token is a named value: <code>semantic.color.brand.primary.dark</code> instead of <code>#BB4800</code>. The name says what the value is <i>for</i>, so when the underlying value changes in <code>tokens/tokens.json</code>, everything that cites the name follows automatically — while a copied raw hex is frozen the moment you paste it. Tokens are the mechanism that lets an AI agent (or a person) build UI that stays correct when the system moves.</p>

  <div class="tokgroup" style="margin-top:30px"><h4>How token names work</h4>
    <p class="tnote" style="font-size:13.5px">Names are compositional — you can predict a token's name without looking it up:</p>
    <div class="grammar">
      <div class="gex"><code>semantic.color.brand.primary.dark</code><span><b>tier</b> (semantic) → <b>category</b> (color) → <b>group</b> (brand) → <b>role</b> (primary) → <b>variant</b> (dark)</span></div>
      <div class="gex"><code>primitive.spacing.4</code><span><b>tier</b> (primitive) → <b>category</b> (spacing) → <b>step</b> (4 × 4px grid = 16px)</span></div>
      <div class="gex"><code>semantic.typography.scale.labelSmall</code><span><b>tier</b> → <b>category</b> → <b>group</b> (scale) → <b>style name</b> (MD3-style role naming)</span></div>
    </div>
    <p class="tnote">Which tier to use where: <b>docs and doc.json files cite <code>semantic.*</code></b> (the intent); <b>code uses <code>primitive.*</code></b> (the concrete value) — see <a href="../guides/index.html#rules">the rules</a>.</p>
  </div>
  <div class="tokgroup" style="margin-top:34px"><h4>Where these values come from</h4>
    <p class="tnote" style="font-size:13.5px">Every value was extracted from the production fleetapp-web codebase — nothing was invented:</p>
    <ul class="provlist">{prov_items}</ul>
  </div>
</section>
</div>'''

def body_found_iconography():
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Foundations</a>
<section id="iconography">
  <h2>Iconography</h2>
  <p class="sub">This page will cover the icon system: which icon set the product uses, the size and colour tokens icons should reference, and the usage rules (when an icon needs a label, minimum touch targets, decorative vs. meaningful icons).</p>
  <p class="sub">What's confirmed today: the icon font is <b>{esc(fa_value)}</b>, documented as <code>primitive.fontFamily.fontAwesome</code> in tokens.json. That's the whole token story so far.</p>
  <div class="warn"><b>Not yet defined:</b> there is no icon size or icon colour token layer in <code>tokens.json</code>, and Icon is not one of the {n_comps} documented components. Completing this page needs that token extraction to happen first — until then this stub states what's known rather than inventing sizes that don't exist in the source.</div>
</section>
</div>'''

def body_found_grid():
    bp_list = ", ".join(f"<code>{esc(k)}</code>" for k in bp_keys)
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Foundations</a>
<section id="grid">
  <h2>Grid</h2>
  <p class="sub">This page will cover layout structure: breakpoints, columns, gutters and page margins — the values that decide how screens reflow between desktop and mobile.</p>
  <p class="sub">What exists today: a <code>legacy.breakpoints</code> group ({bp_list}), and nothing else.</p>
  <div class="warn"><b>Not yet defined:</b> those legacy breakpoints are explicitly flagged in their own tokens.json note — <i>"{esc(bp_note)}"</i> — so they are not documented here as if they were the real grid. Real breakpoint/column tokens need to be extracted from the production codebase before this page gets content.</div>
</section>
</div>'''

def body_found_elevation():
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Foundations</a>
<section id="elevation">
  <h2>Elevation</h2>
  <p class="sub">This page will cover surface depth: the shadow scale, when a surface raises (menus, dialogs, snackbars), and the z-index layering rules.</p>
  <div class="warn"><b>Not yet defined:</b> <code>tokens.json</code> contains no shadow or z-index tokens — the product uses MUI's default shadow scale, unoverridden. That's the same situation <code>fontFamily.muiDefault</code> was in before it was documented, and extracting the shadow scale the same way is the logical next step — but it's a token-extraction task, not a docs task, so this page stays a stub until it happens.</div>
</section>
</div>'''

def body_found_colour():
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Foundations</a>
<section id="colour">
  <h2>Colour</h2>
  <p class="sub">Generated from <code>tokens/tokens.json</code>. Reference the token, never the hex — the values shown are for verification only.</p>
  {tok_html}
  <div class="tokgroup"><h4>Data visualization (semantic.color.dataViz)</h4>
    <p class="tnote" style="font-size:13.5px">{esc(dv_note)}</p>
    <table class="tok"><thead><tr><th>Hue</th><th>background</th><th>border</th><th>icon</th><th>text</th></tr></thead><tbody>{dv_rows}</tbody></table>
    <p class="tnote">Per-hue notes above come straight from tokens.json — where a hue has no 70 step in the source, the token says so rather than papering over it.</p>
  </div>
  {neutral_html}
  <div class="tokgroup"><h4>Interaction states — the rule, not just the list</h4>
    <p class="tnote" style="font-size:13.5px">State-layer colours aren't hand-picked — they're computed: <b>hover = 4% overlay</b> of the base colour, <b>selected = 8%</b>, <b>focus = 12%</b> (in production: <code>alpha(brandColor, opacity)</code> in karoo-ui's ThemeProvider). Need a state colour that isn't listed? Derive it with this rule — never invent a new alpha value.</p>
  </div>
  <div class="warn"><b>Known issue (from tokens.json):</b> white on brand orange <code>#F47735</code> fails WCAG AA at ~2.79:1. Use <code>primary.dark</code> <code>#BB4800</code> for filled surfaces with white text. Details: <a href="accessibility.html">Accessibility</a>.</div>
</section>
</div>'''

def body_found_typography():
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Foundations</a>
<section id="typography">
  <h2>Typography</h2>
  <p class="sub">Base font: <code>{esc(base_font)}</code> at <code>{esc(base_size)}</code>. Styles reference <code>semantic.typography.scale.*</code>.</p>
  <div class="tokgroup"><h4>Principles</h4>
    <div class="rules">
      <div class="rule"><b>One face, one base.</b> Roboto at a {esc(base_size)} base via MUI's unoverridden default stack (<code>fontFamily</code> aliases <code>primitive.fontFamily.muiDefault</code>) — no second typeface exists in the product.</div>
      <div class="rule"><b><code>{esc(default_variant)}</code> is the default.</b> <code>semantic.typography.defaultVariant</code> names it explicitly — body text you don't specify a variant for is this, app-wide.</div>
      <div class="rule"><b>Flag, don't hide.</b> <code>labelSmall</code> and <code>titleMedium</code> exist as tokens but aren't registered MUI variants yet — their own notes say so, and so does this page, rather than presenting them as fully usable.</div>
    </div>
  </div>
  <div class="tokgroup"><h4>Type scale</h4>
    <table class="tok"><thead><tr><th>Style</th><th>Size</th><th>Weight</th><th>Line</th><th>Sample</th></tr></thead><tbody>{ty_rows}</tbody></table>
    <p class="tnote">⚠ <code>labelSmall</code> and <code>titleMedium</code> exist as tokens but are not yet registered MUI variants in karoo-ui — see their notes in tokens.json.</p>
  </div>
</section>
</div>'''

def body_found_spacing():
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Foundations</a>
<section id="spacing">
  <h2>Spacing &amp; shape</h2>
  <p class="sub">The 4px spacing grid, corner radii and border widths — all from <code>tokens/tokens.json</code>.</p>
  <div class="tokgroup"><h4>Spacing (4px grid)</h4>
    <table class="tok"><thead><tr><th>Token</th><th>Value</th><th></th></tr></thead><tbody>{sp_rows}{sem_sp}</tbody></table>
  </div>

  <div class="tokgroup"><h4>Usage guidance — which step, where</h4>
    <p class="tnote" style="font-size:13.5px">Each bucket lists the components whose <code>doc.json</code> actually cites that token — real consumers from the component library, not invented examples.</p>
    <div class="rules">{spacing_bucket_rows()}</div>
  </div>

  <div class="dodont">
    <div class="do"><h5>Do</h5><ul>
      <li>{esc(sem_sp_note)}</li>
      <li>{esc(prim_sp_note)}</li>
    </ul></div>
    <div class="dont"><h5>Don&#39;t</h5><ul>
      <li>Don't hard-code arbitrary px values — the spacing token's own note ends with exactly that warning.</li>
      <li>Don't confuse the two grids: primitive steps are 4px, MUI's <code>theme.spacing(n)</code> is 8px — the mapping in the note above is the bridge.</li>
    </ul></div>
  </div>

  <h5 style="margin-top:34px">Shape</h5>
  <p class="tnote" style="margin-bottom:10px">Radius and border width live here rather than on their own pages — five radius values and two border widths don't justify standalone pages.</p>
  <div class="tokgroup"><h4>Radius</h4>
    <table class="tok"><thead><tr><th>Token</th><th>Value</th><th></th></tr></thead><tbody>{rad_rows}</tbody></table>
  </div>
  <div class="tokgroup"><h4>Border width</h4>
    <table class="tok"><thead><tr><th>Token</th><th>Value</th><th></th></tr></thead><tbody>{bw_rows}</tbody></table>
  </div>
</section>
</div>'''

def body_accessibility():
    rows = ""
    for c in sorted(comps, key=lambda x: x["name"]):
        items = c.get("accessibility", [])
        if not items: continue
        summary = items[0]
        if len(summary) > 100:
            summary = summary[:100].rsplit(" ", 1)[0] + "…"
        s = slug(c["name"])
        extra = "" if len(items) <= 1 else f' <span class="tnote" style="display:inline">(+{len(items)-1} more)</span>'
        rows += f'<tr><td><a href="../components/{s}.html#accessibility"><b>{esc(c["name"])}</b></a></td><td>{esc(summary)}{extra}</td></tr>'
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Foundations</a>
<section id="accessibility">
  <h2>Accessibility</h2>
  <p class="sub">WCAG AA is enforced by the system, not by vigilance: the tokens are AA-safe when used as documented, and every component carries its own accessibility requirements (from its doc.json) on its own page.</p>
  <div class="tokgroup"><h4>Principles</h4>
    <div class="rules">
      <div class="rule"><b>AA is the floor, and the tokens carry it.</b> Use the palette as documented and the contrast maths is already done — vigilance is a fallback, not the mechanism.</div>
      <div class="rule"><b>Baseline beyond contrast.</b> Visible focus states, full keyboard operability and accessible names are required on every interactive element, on every component, always.</div>
      <div class="rule"><b>Per-component requirements add, never replace.</b> A component's own accessibility list extends the baseline — nothing on it grants an exemption.</div>
      <div class="rule"><b>Known issues get named, not buried.</b> The one documented trap lives in <code>tokens.json → accessibility.knownIssues</code> and is repeated below, on the Colour page, and in the rules.</div>
    </div>
  </div>
  <div class="warn"><b>The one trap:</b> white text on brand orange <code>#F47735</code> fails AA at ~2.79:1. Filled surfaces with white text must use <code>primary.dark</code> <code>#BB4800</code> (~5.2:1). This single rule was behind all 5 contrast bugs found and fixed in the 2026-07-16 audit.</div>
  <div class="tip"><b>Baseline for every component:</b> visible focus states, full keyboard operability, accessible names on all interactive elements, and AA contrast — the per-component requirements add to this, never replace it.</div>
  <h5 style="margin-top:30px">Per-component requirements</h5>
  <p class="sub" style="margin-bottom:14px">One line each — the full list lives on the component's own page.</p>
  <table class="mini"><thead><tr><th style="width:180px">Component</th><th>Accessibility summary</th></tr></thead><tbody>{rows}</tbody></table>
</section>
</div>'''

def body_patterns_index():
    cards = ""
    for p in patterns:
        cards += f'''<a class="idxcard" href="{p['slug']}.html">
      <b>{esc(p['navtitle'])}</b>
      <span class="idxcat">Pattern</span></a>'''
    return f'''<div class="inner pagetop">
<section id="patterns">
  <h2>Patterns</h2>
  <p class="sub">How components compose into whole screens — generated from <code>templates/</code>. When building a page, start from the matching pattern; only invent a new layout when none fits.</p>
  <div class="patgrid">{cards}</div>
</section>
</div>'''

def body_pattern(p):
    body = link_components(md_to_html(p["body"]), "../")
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← All patterns</a>
<article class="comp pattern">
  <div class="comphead"><h3>{esc(p['title'])}</h3><span class="pill">Pattern</span></div>
  {body}
  <div class="cfoot">Improve this pattern — edit <code>templates/{esc(p['file'])}</code> and regenerate the portal.</div>
</article>
</div>'''

def body_components_index():
    sections = ""
    order = [c for c in CATEGORY_ORDER if c in categories or COMING_SOON.get(c)] \
            + sorted(c for c in categories if c not in CATEGORY_ORDER)
    for cat in order:
        cards = ""
        for c in sorted(categories.get(cat, []), key=lambda x: x["name"]):
            desc = c.get("description", "")
            short = desc[:110].rsplit(" ", 1)[0] + "…" if len(desc) > 110 else desc
            st = c.get("status", "stable")
            cards += f'''<a class="idxcard" href="{slug(c['name'])}.html">
      <b>{esc(c['name'])}</b>
      <span class="idxmeta"><span class="idxcat">{esc(cat)}</span><span class="idxstatus">{esc(st)}</span></span>
      <p>{esc(short)}</p></a>'''
        for name, note in COMING_SOON.get(cat, []):
            cards += f'''<div class="idxcard soon" aria-disabled="true">
      <b>{esc(name)}</b>
      <span class="idxmeta"><span class="idxcat">{esc(cat)}</span><span class="idxstatus">Coming soon</span></span>
      <p>{esc(note)}</p></div>'''
        if not cards:
            continue
        sections += f'<div class="cathead">{esc(cat)}</div><div class="idxgrid">{cards}</div>'
    return f'''<div class="inner pagetop">
<section id="components">
  <h2>Component reference</h2>
  <p class="sub">All {n_comps} components, generated directly from their <code>doc.json</code> files — this index can never drift from the source. Grouped into the 10 Atlassian-modeled categories; greyed cards are confirmed gaps, not yet built.</p>
  <input class="searchbox" id="csearch" type="search" placeholder="Filter components… (e.g. table, chip, dialog)" oninput="filterIdx(this.value)">
  <div id="idxgrid">{sections}</div>
</section>
</div>''' + SEARCH_SCRIPT

def body_component(c):
    name = c["name"]
    s = slug(name)

    # header meta
    prov = ""
    if c.get("library") or c.get("source"):
        bits = [esc(x) for x in (c.get("library"), c.get("source")) if x]
        prov = f'<div class="prov">Source: {" · ".join(bits)}</div>'
    keyrule = f'<div class="keyrule">{esc(c["keyRule"])}</div>' if c.get("keyRule") else ""

    # when to use / when not to use
    whento = "".join(f'<li>{esc(v.get("whenToUse",""))}</li>' for v in c.get("variants", []) if v.get("whenToUse"))
    all_donts = list(c.get("dontDoThis", []))
    whennot_items = [x for x in all_donts if x.lower().startswith(("don't use", "don’t use"))]
    if not whennot_items and all_donts:
        whennot_items = [all_donts[0]]
    whennot = "".join(f'<li>{esc(x)}</li>' for x in whennot_items)
    remaining_donts = [x for x in all_donts if x not in whennot_items]
    whenblock = ""
    if whento or whennot:
        whenblock = f'''<div class="whens">
      <div class="whenuse"><h5>When to use</h5><ul>{whento}</ul></div>
      <div class="whennot"><h5>When not to use</h5><ul>{whennot}</ul></div>
    </div>'''

    # anatomy
    anat = ""
    if c.get("anatomy"):
        rows = "".join(f'<li><b>{esc(a.get("name",""))}</b> — {esc(a.get("description",""))}</li>' for a in c["anatomy"])
        anat = f'<h5>Anatomy</h5><ol class="anatomy">{rows}</ol>'

    # variants — demo tile + text + generated usage snippet (spec §4.4, §8);
    # a variant with no preview fragment degrades to text-only (spec §5)
    vrows = ""
    for i, v in enumerate(c.get("variants", [])):
        frag = demo_for_variant(s, v.get("name", ""), i)
        tile = f'<div class="demo-embed vtile">{frag}</div>' if frag else ""
        snippet = f'<pre class="usage"><code>{esc(usage_snippet(c, v))}</code></pre>'
        info = (f'<div class="vinfo"><b>{esc(v.get("name",""))}</b>'
                f'<p>{esc(v.get("whenToUse",""))}</p>{snippet}</div>')
        vrows += f'<div class="vrow">{tile}{info}</div>' if tile else f'<div class="vrow" style="grid-template-columns:1fr">{info}</div>'
    vt = ""
    if vrows:
        vt = (f'<h5>Variants</h5>'
              f'<p class="tnote">Demos are the real preview markup, inlined at build time. '
              f'"Example usage" lines are generated from doc.json — a documentation aid, not tested code.</p>'
              f'{vrows}')

    # states & behaviors — text table plus, where the preview stylesheet has a
    # real CSS hook for a state, one interactive demo instance (spec §4.6, §7)
    states = ""
    if c.get("states"):
        rows = "".join(f'<tr><td><b>{esc(s2.get("state",""))}</b></td><td>{esc(s2.get("treatment",""))}</td></tr>' for s2 in c["states"])
        states = f'<h5>States</h5><table class="mini"><tbody>{rows}</tbody></table>'
        # pick the first variant fragment whose root element has a hook for any state
        state_frag, chips = None, ""
        for it in DEMOS.get(s, []):
            roots = _root_classes(it["html"])
            hooked = [(s2.get("state",""), _hook_for_state(s2.get("state",""), roots))
                      for s2 in c["states"]]
            hooked = [(nm, hk) for nm, hk in hooked if hk]
            if hooked:
                state_frag = it["html"]
                seen = set()
                for nm, hk in hooked:
                    if hk in seen: continue
                    seen.add(hk)
                    chips += (f'<button class="statebtn" type="button" aria-pressed="false" '
                              f'data-state-toggle="{hk}" data-target="sd-{s}">{esc(nm)}</button>')
                break
        if state_frag and chips:
            states += (f'<div class="statetry"><div class="demo-embed" id="sd-{s}">{state_frag}</div>'
                       f'<div><div class="statebtns">{chips}</div>'
                       f'<p class="tnote" style="margin-top:8px">Click to toggle. Only states with a real hook in the preview stylesheet are interactive; the rest are documented above.</p></div></div>')
    beh = ""
    if c.get("behaviors"):
        rows = "".join(f'<tr><td><b>{esc(b.get("name",""))}</b></td><td>{esc(b.get("description",""))}</td></tr>' for b in c["behaviors"])
        beh = f'<h5>Behaviors</h5><table class="mini"><tbody>{rows}</tbody></table>'

    # do / don't
    dos = "".join(f'<li>{esc(x)}</li>' for x in c.get("doThis", []))
    donts = "".join(f'<li>{esc(x)}</li>' for x in remaining_donts)

    # props — Default column is additive/optional (spec §6): renders the field
    # when a doc.json has it, an em-dash when it doesn't; no backfill required
    props = ""
    for p in c.get("props", []):
        req = "✓" if p.get("required") else ""
        default = f'<code>{esc(p["default"])}</code>' if p.get("default") not in (None, "") else "—"
        props += f'<tr><td><code>{esc(p.get("name",""))}</code></td><td><code class="typ">{esc(p.get("type",""))}</code></td><td>{default}</td><td class="c">{req}</td><td>{esc(p.get("description",""))}</td></tr>'
    pt = f'<h5>Props</h5><table class="mini props"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th class="c">Req</th><th>Description</th></tr></thead><tbody>{props}</tbody></table>' if props else ""

    # tokens used
    toks = "".join(f'<code class="tokpath">{esc(t)}</code>' for t in c.get("tokens", []))
    tokblock = f'<h5>Tokens used</h5><div class="tokpaths">{toks}</div>' if toks else ""

    # specs (kept, collapsed)
    specs = "".join(f'<tr><td>{esc(s2.get("property",""))}</td><td>{esc(s2.get("value",""))}</td></tr>' for s2 in c.get("specs", []))
    specblock = f'<details><summary>Visual specs</summary><table class="mini"><tbody>{specs}</tbody></table></details>' if specs else ""

    # accessibility (full list — anchor target from accessibility.html)
    a11y = "".join(f'<li>{esc(x)}</li>' for x in c.get("accessibility", []))
    a11yblock = f'<h5 id="accessibility">Accessibility</h5><ul class="plain">{a11y}</ul>' if a11y else '<h5 id="accessibility">Accessibility</h5><p class="tnote">No component-specific requirements beyond the system baseline.</p>'

    # related
    rel = ""
    if c.get("related"):
        items = "".join(f'<tr><td><a href="{slug(r["name"])}.html"><b>{esc(r["name"])}</b></a></td><td>{esc(r.get("why",""))}</td></tr>' for r in c["related"])
        rel = f'<h5>Related components</h5><table class="mini"><tbody>{items}</tbody></table>'

    # design checklist
    has_doc = all(c.get(k) for k in ("anatomy", "props", "doThis", "dontDoThis", "accessibility"))
    def chk(done, label):
        return f'<span class="chk {"on" if done else ""}">{"✓" if done else "○"} {label}</span>'
    checklist = ('<h5>Design checklist</h5><div class="checks">'
        + chk(bool(c.get("tokens")), "Tokens wired")
        + chk(has_doc, "Docs complete")
        + chk(True, "AA reviewed (2026-07-16)")
        + chk(True, "Preview synced")
        + chk(False, "Validated in a production prototype")
        + '</div>')

    research = '<details class="research"><summary>Research &amp; findings</summary><p class="tnote">No usage findings logged yet. When research or prototype feedback exists for this component, add a <code>research</code> field to its doc.json and regenerate the portal.</p></details>'

    # full-page link — variants now render inline above, so this link's job is
    # composition context, not the only demo (spec §4.12)
    live = f'<h5>Full page</h5><a class="livelink" href="../component-library-preview.html#{s}" target="_blank">See this component in a full page layout ↗</a>'

    feedback = f'<div class="cfoot">Improve this component — edit <code>components/{esc(name)}/{esc(name)}.doc.json</code> and regenerate the portal.</div>'

    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← All components</a>
<article class="comp">
  <div class="comphead">
    <h3>{esc(name)}</h3>
    <span class="pill">{esc(c.get("category",""))}</span>
    <span class="pill soft">{esc(c.get("status",""))}</span>
    <span class="pill aa" title="Reviewed against WCAG AA during the 2026-07-16 preview audit">AA reviewed</span>
  </div>
  <p class="cdesc">{esc(c.get("description",""))}</p>
  {prov}
  {keyrule}
  {whenblock}
  {anat}
  {vt}
  {states}
  {beh}
  <div class="dodont">
    <div class="do"><h5>Do</h5><ul>{dos}</ul></div>
    <div class="dont"><h5>Don&#39;t</h5><ul>{donts}</ul></div>
  </div>
  {pt}
  {tokblock}
  {specblock}
  {a11yblock}
  {rel}
  {checklist}
  {research}
  {live}
  {feedback}
</article>
</div>'''

def body_resources_index():
    return '''<div class="inner pagetop">
<section id="resources">
  <h2>Resources</h2>
  <p class="sub">The visual preview, the changelog, and everything to take away.</p>
  <div class="idxgrid">
    <a class="idxcard" href="preview.html"><b>Visual preview</b><span class="idxmeta"><span class="idxcat">Resource</span></span><p>Every component rendered visually on one static page.</p></a>
    <a class="idxcard" href="changelog.html"><b>What's new</b><span class="idxmeta"><span class="idxcat">Resource</span></span><p>Every structural change to the system, most recent first.</p></a>
    <a class="idxcard" href="downloads.html"><b>Downloads</b><span class="idxmeta"><span class="idxcat">Resource</span></span><p>The complete system zip, plus the standalone rule and token files.</p></a>
  </div>
</section>
</div>'''

def body_preview():
    return '''<div class="inner pagetop">
<a class="backlink" href="index.html">← Resources</a>
<section id="preview">
  <h2>Visual preview</h2>
  <p class="sub">The full component library rendered as static HTML — synced to tokens.json. <a href="../component-library-preview.html" target="_blank">Open full-screen ↗</a></p>
  <iframe class="prevframe" src="../component-library-preview.html" title="Component library preview" loading="lazy"></iframe>
</section>
</div>'''

def body_changelog():
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Resources</a>
<section id="changelog">
  <h2>What's new</h2>
  <p class="sub">Generated from <code>tokens.json → _meta.changelog</code>. Every structural change to the system is logged there — most recent first.</p>
  {changelog_items}
</section>
</div>'''

def body_downloads():
    return f'''<div class="inner pagetop">
<a class="backlink" href="index.html">← Resources</a>
<section id="downloads">
  <h2>Downloads</h2>
  <p class="sub">Everything needed to start. The zip is the recommended download — it contains the complete, self-contained system.</p>
  <div class="dl">
    <div class="dlc primary"><b>Complete design system (.zip)</b><span>The full folder: rules, tokens, all {n_comps} components with docs, and the visual preview. Unzip → connect to your AI tool → done. ({zip_kb} KB)</span><a class="dlbtn" href="../downloads/cartrack-ai-design-system.zip" download>Download the system</a></div>
    <div class="dlc"><b>tokens.json</b><span>Just the design tokens — for tooling integrations or a quick look.</span><a class="dlbtn ghost" href="../downloads/tokens.json" download>Download</a></div>
    <div class="dlc"><b>AGENTS.md</b><span>The behavior contract for AI agents, standalone.</span><a class="dlbtn ghost" href="../downloads/AGENTS.md" download>Download</a></div>
    <div class="dlc"><b>CLAUDE.md</b><span>The auto-loading index for Claude tools, standalone.</span><a class="dlbtn ghost" href="../downloads/CLAUDE.md" download>Download</a></div>
    <div class="dlc"><b>README.md</b><span>The human-friendly overview, standalone.</span><a class="dlbtn ghost" href="../downloads/README.md" download>Download</a></div>
  </div>
</section>
</div>'''

SEARCH_SCRIPT = '''
<script>
function filterIdx(q){
  q = q.trim().toLowerCase();
  document.querySelectorAll('#idxgrid .idxcard').forEach(function(el){
    // match name + description + category, NOT the status badge ("stable" contains "table")
    var b=el.querySelector('b'), p=el.querySelector('p'), c=el.querySelector('.idxcat');
    var hay=((b?b.textContent:'')+' '+(p?p.textContent:'')+' '+(c?c.textContent:'')).toLowerCase();
    el.classList.toggle('hidden', q !== '' && hay.indexOf(q) === -1);
  });
  // hide a category heading (and its grid) when every card in it is filtered out
  document.querySelectorAll('#idxgrid .cathead').forEach(function(h){
    var grid = h.nextElementSibling;
    var any = grid && grid.querySelector('.idxcard:not(.hidden)');
    h.classList.toggle('hidden', !any);
    if (grid) grid.classList.toggle('hidden', !any);
  });
}
</script>'''

# ================================================================
# Write all pages
# ================================================================
def write(relpath, active, body, prefix, page_title, extra_css=""):
    p = DOCS / relpath
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(render_shell(active, body, prefix, page_title, extra_css), encoding="utf-8")
    return p

def write_redirect(old, new):
    """Static meta-refresh stub so previously published URLs keep working."""
    p = DOCS / old
    p.write_text(f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url={new}">
<link rel="canonical" href="{new}">
<title>Moved — Cartrack AI Design System</title>
</head><body style="font-family:sans-serif;padding:40px">
<p>This page has moved to <a href="{new}">{new}</a>.</p>
</body></html>''', encoding="utf-8")
    return p

SITE = "Cartrack AI Design System"
written = []
written.append(write("index.html", "home", body_home(), "", f"{SITE} — Documentation Portal"))

# guides — single "How to start" article
written.append(write("guides/index.html", "guides", body_guides(), "../", f"How to start — {SITE}"))

# foundations
written.append(write("foundations/index.html", "foundations", body_found_index(), "../", f"Foundations — {SITE}"))
written.append(write("foundations/tokens.html", "found:tokens", body_found_tokens(), "../", f"Design tokens — {SITE}"))
written.append(write("foundations/iconography.html", "found:iconography", body_found_iconography(), "../", f"Iconography — {SITE}"))
written.append(write("foundations/grid.html", "found:grid", body_found_grid(), "../", f"Grid — {SITE}"))
written.append(write("foundations/elevation.html", "found:elevation", body_found_elevation(), "../", f"Elevation — {SITE}"))
written.append(write("foundations/colour.html", "found:colour", body_found_colour(), "../", f"Colour — {SITE}"))
written.append(write("foundations/typography.html", "found:typography", body_found_typography(), "../", f"Typography — {SITE}"))
written.append(write("foundations/spacing.html", "found:spacing", body_found_spacing(), "../", f"Spacing & shape — {SITE}"))
written.append(write("foundations/accessibility.html", "found:accessibility", body_accessibility(), "../", f"Accessibility — {SITE}"))

# resources
written.append(write("resources/index.html", "resources", body_resources_index(), "../", f"Resources — {SITE}"))
written.append(write("resources/preview.html", "res:preview", body_preview(), "../", f"Visual preview — {SITE}"))
written.append(write("resources/changelog.html", "res:changelog", body_changelog(), "../", f"What's new — {SITE}"))
written.append(write("resources/downloads.html", "res:downloads", body_downloads(), "../", f"Downloads — {SITE}"))

# redirect stubs at the old top-level URLs (IA v1 → v2)
redirects = [
    ("tokens.html", "foundations/index.html"),
    ("foundations.html", "guides/index.html#concepts"),
    ("accessibility.html", "foundations/accessibility.html"),
    # IA v2.1: the 3 guide pages consolidated into one article
    ("guides/getting-started.html", "index.html#quick-start"),
    ("guides/how-it-works.html", "index.html#concepts"),
    ("guides/rules.html", "index.html#rules"),
    ("preview.html", "resources/preview.html"),
    ("changelog.html", "resources/changelog.html"),
    ("downloads.html", "resources/downloads.html"),
]
for old, new in redirects:
    written.append(write_redirect(old, new))

# patterns
written.append(write("patterns/index.html", "patterns", body_patterns_index(), "../", "Patterns — Cartrack AI Design System"))
for p in patterns:
    written.append(write(f"patterns/{p['slug']}.html", f"pat:{p['slug']}", body_pattern(p), "../",
                         f"{p['navtitle']} — Patterns — Cartrack AI Design System"))

# components
written.append(write("components/index.html", "components", body_components_index(), "../", "Components — Cartrack AI Design System"))
for c in comps:
    s = slug(c["name"])
    written.append(write(f"components/{s}.html", f"comp:{s}", body_component(c), "../",
                         f"{c['name']} — Cartrack AI Design System", extra_css=DEMO_CSS))

total_kb = round(sum(os.path.getsize(p) for p in written) / 1024)
print(f"Wrote {len(written)} pages to {DOCS} — {total_kb} KB total")
print(f"  {n_comps} component pages, {n_patterns} pattern pages, "
      f"{len(written) - n_comps - n_patterns} top-level pages")
