#!/usr/bin/env python3
"""Generate the multi-page ds-portal site under docs/ from the real
cartrack-ai-design-system files.

One URL per page: Home, Foundations, Tokens, Accessibility, a Patterns index +
one page per pattern, a Components index + one page per component, plus Preview,
Changelog and Downloads. All pages share one shell (render_shell) so the sidebar
stays consistent; CSS is inline in the shell so there are no external asset paths
to break when files live in components/ and patterns/ subfolders.

No framework, no build step, no server — same generation model as before, it just
writes many files instead of one. Re-run after any doc.json/tokens.json/template
change; never hand-edit the emitted HTML.
"""
import json, html, os, re
from pathlib import Path

HERE = Path(__file__).resolve().parent      # .../cartrack-ai-design-system/docs
DS = HERE.parent                            # .../cartrack-ai-design-system
DOCS = HERE                                 # output root for the generated site

tokens = json.load(open(DS / "tokens" / "tokens.json"))

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

# ---------- load all component docs ----------
comps = []
for d in sorted((DS / "components").iterdir()):
    if d.is_dir():
        doc = json.load(open(d / f"{d.name}.doc.json"))
        comps.append(doc)

categories = {}
for c in comps:
    categories.setdefault(c.get("category", "Other"), []).append(c)

comp_names = sorted((c["name"] for c in comps), key=len, reverse=True)

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
        first = next((l for l in text.splitlines() if l.startswith("# ")), f.stem)
        title = first.lstrip("# ").strip()
        patterns.append({
            "slug": f.stem,
            "file": f.name,
            "title": title,
            "navtitle": title.split("(")[0].strip(),
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
def render_nav(active, prefix):
    def link(href, label, key, cls="navtop"):
        cur = ' aria-current="page"' if key == active else ''
        acls = ' active' if key == active else ''
        return f'<a href="{prefix}{href}" class="{cls}{acls}"{cur}>{label}</a>'
    out = ['<div class="sect">Guide</div>',
           link("index.html", "Home", "home"),
           link("foundations.html", "Foundations", "foundations"),
           '<div class="sect">Reference</div>',
           link("tokens.html", "Design tokens", "tokens"),
           link("accessibility.html", "Accessibility", "accessibility"),
           link("patterns/index.html", f"Patterns ({n_patterns})", "patterns")]
    for p in patterns:
        out.append(link(f"patterns/{p['slug']}.html", esc(p["navtitle"]), f"pat:{p['slug']}", cls="navcomp"))
    out.append(link("components/index.html", f"Components ({n_comps})", "components"))
    for cat in sorted(categories):
        out.append(f'<div class="navcat">{esc(cat)}</div>')
        for c in sorted(categories[cat], key=lambda x: x["name"]):
            st = c.get("status", "stable")
            badge = "" if st == "stable" else f' <span class="navbadge">{esc(st)}</span>'
            s = slug(c["name"])
            out.append(link(f"components/{s}.html", f'{esc(c["name"])}{badge}', f"comp:{s}", cls="navcomp"))
    out += ['<div class="sect">Resources</div>',
            link("preview.html", "Visual preview", "preview"),
            link("changelog.html", "What's new", "changelog"),
            link("downloads.html", "Downloads", "downloads")]
    return "\n    ".join(out)

def render_shell(active, body, prefix="", page_title="Cartrack AI Design System — Documentation Portal"):
    nav = render_nav(active, prefix)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{page_title}</title>
<style>
  :root{{
    --ink:#141a24; --ink2:#4a5364; --mute:#7d8593; --bg:#faf9f7; --card:#fff;
    --accent:#f4713a; --accent-d:#bb4800; --line:#e7e3dd; --good:#1a7f4e; --bad:#b3261e;
    --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
    --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }}
  *{{margin:0;padding:0;box-sizing:border-box}}
  html{{scroll-behavior:smooth;scroll-padding-top:24px}}
  body{{font-family:var(--sans);background:var(--bg);color:var(--ink);line-height:1.6}}
  a{{color:var(--accent-d);text-decoration:none}} a:hover{{text-decoration:underline}}
  code{{font-family:var(--mono);font-size:.86em;background:#f1eee9;border-radius:4px;padding:1px 6px}}

  .layout{{display:grid;grid-template-columns:250px 1fr;min-height:100vh}}
  /* ------- sidebar ------- */
  aside{{border-right:1px solid var(--line);background:#fff;padding:28px 0;position:sticky;top:0;height:100vh;overflow-y:auto}}
  .brand{{padding:0 24px 20px;border-bottom:1px solid var(--line)}}
  .brand b{{font-size:15px;display:block}}
  .brand span{{font-size:12px;color:var(--mute)}}
  .brandlink{{color:inherit}} .brandlink:hover{{text-decoration:none}}
  nav{{padding:16px 0}}
  nav a{{display:block;padding:6px 24px;font-size:13.5px;color:var(--ink2)}}
  nav a:hover{{background:#faf5f0;text-decoration:none;color:var(--accent-d)}}
  nav a.active{{background:#fdf3ec;color:var(--accent-d);font-weight:600;box-shadow:inset 3px 0 0 var(--accent-d)}}
  nav .sect{{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);font-weight:700;padding:18px 24px 6px}}
  nav .navcat{{font-size:11px;color:var(--mute);padding:10px 24px 2px;font-weight:600}}
  nav .navcomp{{padding:3.5px 24px 3.5px 34px;font-size:13px}}

  /* ------- main ------- */
  main{{padding:0 0 100px;min-width:0}}
  .inner{{max-width:880px;margin:0 auto;padding:0 40px}}
  .pagetop{{padding-top:48px}}
  .backlink{{display:inline-block;margin-bottom:20px;font-size:13px;color:var(--ink2)}}
  header.top{{background:linear-gradient(150deg,#161d2b,#243147);color:#fff;padding:64px 0 56px;margin-bottom:56px}}
  header.top .inner{{max-width:880px}}
  header.top h1{{font-size:clamp(28px,4vw,40px);line-height:1.15;font-weight:700;letter-spacing:-.01em}}
  header.top p{{margin-top:14px;color:#c3cad6;font-size:16.5px;max-width:62ch}}
  .badges{{margin-top:24px;display:flex;gap:10px;flex-wrap:wrap}}
  .badge{{font-size:12.5px;border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:5px 14px;color:#e6eaf0}}
  .badge b{{color:#f9a173}}

  section{{margin-bottom:56px}}
  h2{{font-size:26px;font-weight:700;letter-spacing:-.01em;margin-bottom:6px;padding-top:8px}}
  .sub{{color:var(--ink2);margin-bottom:26px;max-width:66ch}}
  h5{{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin:20px 0 8px}}

  .steps{{counter-reset:s;display:grid;gap:12px}}
  .stepc{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px 22px 20px 62px;position:relative;counter-increment:s}}
  .stepc::before{{content:counter(s);position:absolute;left:20px;top:20px;width:26px;height:26px;border-radius:50%;background:var(--accent-d);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center}}
  .stepc b{{display:block;margin-bottom:4px;font-size:15px}}
  .stepc p{{font-size:14px;color:var(--ink2)}}
  .stepc code{{white-space:nowrap}}
  .tip{{background:#f0f7f3;border:1px solid #cfe5d8;border-radius:12px;padding:16px 20px;font-size:14px;color:#14532d;margin-top:14px}}
  .warn{{background:#fdf1ea;border:1px solid #f3d3c0;border-radius:12px;padding:16px 20px;font-size:14px;color:#8a3a10;margin-top:14px}}

  .filemap{{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-top:8px}}
  .filemap .fr{{display:grid;grid-template-columns:280px 1fr;border-top:1px solid var(--line)}}
  .filemap .fr:first-child{{border-top:none}}
  .filemap .fp{{padding:14px 20px;font-family:var(--mono);font-size:13px;background:#fbf8f4;border-right:1px solid var(--line)}}
  .filemap .fd{{padding:14px 20px;font-size:14px;color:var(--ink2)}}

  .rules{{display:grid;gap:10px}}
  .rule{{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--accent-d);border-radius:10px;padding:14px 18px;font-size:14.5px}}
  .rule b{{color:var(--ink)}}

  /* tokens */
  .tokgroup{{margin-bottom:34px}}
  .tokgroup h4{{font-size:15px;margin-bottom:12px}}
  .swgrid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:10px}}
  .sw{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px}}
  .chipc{{height:44px;border-radius:7px}}
  .swn{{font-size:12px;font-weight:600;margin-top:8px}}
  .swv{{font-family:var(--mono);font-size:11px;color:var(--mute)}}
  .tnote{{font-size:12.5px;color:var(--mute);margin-top:8px}}
  table.tok{{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:13.5px}}
  table.tok th{{text-align:left;padding:10px 16px;background:#f4f1ec;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
  table.tok td{{padding:9px 16px;border-top:1px solid var(--line);vertical-align:middle}}
  .bar{{height:12px;background:var(--accent);border-radius:3px}}
  .radbox{{width:44px;height:28px;background:#fff;border:2px solid var(--accent-d)}}

  /* components */
  .cathead{{font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute);margin:44px 0 14px;padding-top:10px;border-top:1px dashed var(--line)}}
  .comp{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:28px 30px;margin-bottom:22px}}
  .comphead{{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap}}
  .comphead h3{{font-size:22px;letter-spacing:-.01em}}
  .pill{{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:#f4ece4;color:var(--accent-d);border-radius:999px;padding:3px 10px}}
  .pill.soft{{background:#eef1f4;color:var(--ink2)}}
  .cdesc{{font-size:14.5px;color:var(--ink2)}}
  .keyrule{{margin-top:12px;background:#fbf6ef;border:1px solid #efe3d2;border-radius:10px;padding:12px 16px;font-size:14px}}
  .keyrule::before{{content:"Key rule — ";font-weight:700;color:var(--accent-d)}}
  table.mini{{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:4px}}
  table.mini td,table.mini th{{padding:7px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}}
  table.mini th{{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
  table.mini td.c,table.mini th.c{{text-align:center;width:40px}}
  code.typ{{background:#eef1f4}}
  .dodont{{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}}
  .do,.dont{{border-radius:10px;padding:14px 18px;font-size:13.5px}}
  .do{{background:#f0f7f3;border:1px solid #cfe5d8}} .dont{{background:#fbf0ef;border:1px solid #eed2cf}}
  .do h5{{color:var(--good);margin-top:0}} .dont h5{{color:var(--bad);margin-top:0}}
  .do ul,.dont ul{{padding-left:18px;display:grid;gap:4px}}
  .tokpaths{{display:flex;flex-wrap:wrap;gap:6px}}
  .tokpath{{font-size:11.5px}}
  details{{margin-top:16px;font-size:13.5px}}
  summary{{cursor:pointer;color:var(--accent-d);font-weight:600;font-size:13px}}
  ul.plain{{padding-left:18px;margin-top:8px;color:var(--ink2);display:grid;gap:5px}}

  .livelink{{display:inline-block;font-size:13.5px;font-weight:600;white-space:nowrap;background:#f4ece4;border-radius:8px;padding:8px 16px;margin-top:4px}}
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
  .path{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:24px 22px}}
  .path .who{{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-d);font-weight:700;margin-bottom:10px}}
  .path h4{{font-size:16px;margin-bottom:8px}}
  .path p{{font-size:13.5px;color:var(--ink2)}}
  .prompt{{margin-top:14px;background:#f6f3ee;border:1px solid var(--line);border-radius:10px;padding:12px 14px;font-size:12.5px;color:var(--ink2)}}
  .prompt .expect{{display:block;margin-top:8px;font-size:11.5px;color:var(--mute)}}
  .whens{{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}}
  .whenuse,.whennot{{border-radius:10px;padding:14px 18px;font-size:13.5px;background:#f6f8fa;border:1px solid #dfe5ea}}
  .whenuse h5,.whennot h5{{margin-top:0}}
  .whenuse ul,.whennot ul{{padding-left:18px;display:grid;gap:4px}}
  .pill.aa{{background:#e7f2ec;color:var(--good)}}
  .idxgrid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:26px}}
  .idxcard{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 18px;color:var(--ink);display:flex;flex-direction:column;gap:4px}}
  .idxcard:hover{{border-color:var(--accent);text-decoration:none}}
  .idxcard b{{font-size:14.5px}}
  .idxcard .idxmeta{{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:2px}}
  .idxcard .idxcat{{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
  .idxcard .idxstatus{{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:#eef1f4;color:var(--ink2);border-radius:999px;padding:1px 8px}}
  .idxcard p{{font-size:12.5px;color:var(--ink2);margin-top:4px}}
  .patgrid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}}
  .grammar{{display:grid;gap:8px;margin:10px 0}}
  .gex{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;font-size:13px}}
  .gex span{{display:block;margin-top:4px;color:var(--mute);font-size:12.5px}}

  .navbadge{{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:#fdeee2;color:var(--accent-d);border-radius:999px;padding:1px 7px;vertical-align:middle}}
  ol.anatomy{{padding-left:22px;font-size:13.5px;color:var(--ink2);display:grid;gap:4px;margin-top:4px}}
  ol.anatomy b{{color:var(--ink)}}
  .prov{{margin-top:6px;font-size:12px;color:var(--mute)}}
  .cfoot{{margin-top:22px;padding-top:14px;border-top:1px dashed var(--line);font-size:12px;color:var(--mute)}}
  .cfoot code{{font-size:11px}}
  .logi{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 22px;margin-bottom:12px}}
  .logi .logd{{font-family:var(--mono);font-size:12px;color:var(--accent-d);font-weight:600}}
  .logi p{{font-size:14px;color:var(--ink2);margin-top:6px}}
  ul.provlist{{padding-left:20px;font-size:13px;color:var(--ink2);display:grid;gap:6px;margin-top:10px}}

  /* downloads */
  .dl{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
  .dlc{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:22px;display:flex;flex-direction:column;gap:6px}}
  .dlc.primary{{grid-column:1/-1;border:2px solid var(--accent-d);background:#fffaf6}}
  .dlc b{{font-size:15px}}
  .dlc span{{font-size:13.5px;color:var(--ink2)}}
  .dlbtn{{margin-top:10px;align-self:flex-start;background:var(--accent-d);color:#fff !important;border-radius:8px;padding:9px 18px;font-size:13.5px;font-weight:600}}
  .dlbtn:hover{{text-decoration:none;filter:brightness(.92)}}
  .dlbtn.ghost{{background:transparent;color:var(--accent-d) !important;border:1px solid var(--accent-d)}}

  /* preview */
  .prevframe{{width:100%;height:720px;border:1px solid var(--line);border-radius:12px;background:#fff}}
  .searchbox{{width:100%;padding:11px 16px;font-size:14px;border:1px solid var(--line);border-radius:10px;margin-bottom:18px;background:#fff}}
  .hidden{{display:none !important}}

  @media (max-width:900px){{
    .layout{{grid-template-columns:1fr}} aside{{position:static;height:auto;border-right:none;border-bottom:1px solid var(--line)}}
    .dodont,.dl,.paths,.whens{{grid-template-columns:1fr}} .filemap .fr{{grid-template-columns:1fr}} .filemap .fp{{border-right:none}}
  }}
</style>
</head>
<body>
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
</body>
</html>'''

# ================================================================
# Page bodies
# ================================================================
def body_home():
    return f'''<header class="top">
  <div class="inner">
    <h1>Build on-system UI with AI.<br>Start in two minutes.</h1>
    <p>This portal documents the Cartrack Fleet AI-ready design system: a self-contained folder that lets any AI coding agent — Claude, Cursor, Copilot — generate prototypes and UI that match our production Fleet Portal. Everything here is derived from the real fleetapp-web codebase.</p>
    <div class="badges">
      <span class="badge"><b>{n_comps}</b> documented components</span>
      <span class="badge"><b>1</b> tokens source of truth</span>
      <span class="badge"><b>0</b> setup steps per session</span>
      <span class="badge">MD2 · MDC 14 · React</span>
    </div>
  </div>
</header>

<div class="inner">
<section id="start">
  <h2>Getting started</h2>
  <p class="sub">Everyone starts the same way — download the folder, connect it to your tool. Then pick your path.</p>
  <div class="steps" style="margin-bottom:26px">
    <div class="stepc"><b>Download the system</b><p>Grab <a href="downloads.html">cartrack-ai-design-system.zip</a> and unzip it anywhere on your computer (or clone it from the team's shared location).</p></div>
    <div class="stepc"><b>Connect the folder to your AI tool</b><p><b>Claude Cowork:</b> new session → select the <code>cartrack-ai-design-system</code> folder. &nbsp;<b>Claude Code:</b> open a terminal in the folder and run <code>claude</code>. &nbsp;<b>Cursor / Copilot:</b> open the folder as a workspace — they pick up <code>AGENTS.md</code> automatically.</p></div>
  </div>

  <div class="paths">
    <div class="path">
      <div class="who">For designers</div>
      <h4>Prototype in product language</h4>
      <p>Ask for screens in plain language — no need to mention the design system, the rules are already loaded. Iterate the same way ("denser table", "add a selection bar"). Verify against the <a href="preview.html">visual preview</a>.</p>
      <div class="prompt"><b>Try this first prompt:</b><br><i>"Build an HTML prototype of a vehicle list page: app bar with search, filter chips, a data table with status chips and pagination, and one primary action 'Add vehicle'."</i><br><span class="expect">Expected result: a single .html file using the MDC classes, orange <code>primary.dark</code> for the contained button (AA-safe), 14px Roboto body text, and 4px-grid spacing throughout.</span></div>
    </div>
    <div class="path">
      <div class="who">For developers</div>
      <h4>Build features on the real values</h4>
      <p>Each component is 3 files: <code>.tsx</code> (MDC class contract), <code>.doc.json</code> (the API and usage contract — read it first), <code>index.ts</code>. All visual values come from <code>tokens/tokens.json</code>.</p>
      <p style="margin-top:8px">The one non-obvious rule: in inline styles use <code>primitive.*</code> values — most <code>semantic.*</code> entries are alias strings awaiting a resolver. See <a href="foundations.html#rules">the rules</a> and the <a href="tokens.html">naming grammar</a>.</p>
    </div>
    <div class="path">
      <div class="who">For AI agents</div>
      <h4>Your rules load automatically</h4>
      <p>Claude tools auto-load <code>CLAUDE.md</code> (the index) which imports <code>AGENTS.md</code> (the contract). Other agents read <code>AGENTS.md</code> directly via the agents.md standard. Consult <code>components/&lt;Name&gt;/&lt;Name&gt;.doc.json</code> before using any component; verify work against the checklist at the end of AGENTS.md.</p>
      <div class="prompt"><b>Self-test:</b> if a human asks "what design system rules apply here?", you should be able to recite the AGENTS.md rules without any file being mentioned. If you can't, the folder isn't connected at its root.</div>
    </div>
  </div>
  <div class="warn"><b>Important:</b> connect the <code>cartrack-ai-design-system</code> folder itself as the workspace root — not a parent folder. The automatic rule-loading (CLAUDE.md / AGENTS.md) is guaranteed from the root of the connected folder.</div>
</section>
</div>'''

def body_foundations():
    return f'''<div class="inner pagetop">
<section id="inside">
  <h2>What's in the folder</h2>
  <p class="sub">Six things. Each file's name tells the AI (or you) when to read it.</p>
  <div class="filemap">
    <div class="fr"><div class="fp">CLAUDE.md</div><div class="fd">The index — auto-loaded by Claude tools at session start. Folder map, token model, known issues.</div></div>
    <div class="fr"><div class="fp">AGENTS.md</div><div class="fd">The behavior contract — rules every AI agent must follow. Auto-read by Cursor, Copilot, Codex; imported by CLAUDE.md for Claude.</div></div>
    <div class="fr"><div class="fp">README.md</div><div class="fd">Human-friendly overview of the whole system.</div></div>
    <div class="fr"><div class="fp">tokens/tokens.json</div><div class="fd">Single source of truth for every colour, spacing, type, radius and border-width value — extracted from the production codebase.</div></div>
    <div class="fr"><div class="fp">components/&lt;Name&gt;/</div><div class="fd">{n_comps} components, 3 files each: <code>.tsx</code> implementation, <code>.doc.json</code> structured documentation (what this portal's reference is generated from), <code>index.ts</code> export.</div></div>
    <div class="fr"><div class="fp">templates/</div><div class="fd">{n_patterns} page patterns (table page, detail page, map view, settings, login) — which components compose each screen, and the composition rules. The <a href="patterns/index.html">Patterns</a> section is generated from these.</div></div>
    <div class="fr"><div class="fp">component-library-preview.html</div><div class="fd">Every component rendered visually in one static page — open in any browser.</div></div>
  </div>
</section>

<section id="rules">
  <h2>The rules</h2>
  <p class="sub">The full contract lives in <code>AGENTS.md</code> and loads automatically — but these are the ones humans should know too, because they apply to everyone producing UI, not just machines.</p>
  <div class="rules">
    <div class="rule"><b>Use the components, never raw HTML.</b> <code>&lt;Button&gt;</code> not <code>&lt;button&gt;</code>, <code>&lt;TextField&gt;</code> not <code>&lt;input&gt;</code>. All {n_comps} live in <code>components/</code>.</div>
    <div class="rule"><b>Never hardcode visual values.</b> Colours, spacing, type and radii always come from <code>tokens/tokens.json</code>.</div>
    <div class="rule"><b>In code, use <code>primitive.*</code> values.</b> Most <code>semantic.*</code> entries are alias strings awaiting a build-time resolver — pasting one into a style sets the CSS to literal placeholder text. Exceptions (real literals): <code>semantic.color.text.*</code>, <code>border.default</code>, <code>interactive.*</code>.</div>
    <div class="rule"><b>The doc.json is the source of truth.</b> Read a component's do/don't rules before using it — that's where the design judgment lives.</div>
    <div class="rule"><b>One primary action per view.</b> One contained primary button; everything else is outlined or text.</div>
    <div class="rule"><b>WCAG AA always.</b> Never white text on brand orange <code>#F47735</code> (~2.79:1 — fails). Filled surfaces with white text use <code>primary.dark</code> <code>#BB4800</code> (~5.2:1).</div>
    <div class="rule"><b>Don't invent.</b> If a component, variant or token doesn't exist — flag the gap. Never fabricate.</div>
  </div>
</section>
</div>'''

def body_tokens():
    return f'''<div class="inner pagetop">
<section id="tokens">
  <h2>Design tokens</h2>
  <p class="sub">Generated from <code>tokens/tokens.json</code>. Two tiers: <b>primitive</b> (raw values) and <b>semantic</b> (named roles that alias primitives). Reference semantic names in docs; use primitive values in code. Base font: <code>{esc(base_font)}</code> at <code>{esc(base_size)}</code>.</p>
  <div class="warn"><b>Never copy hex values out of this page.</b> Reference the token — the values shown here are for verification only. Copied hex numbers can't be updated when the system changes; token references can.</div>

  <div class="tokgroup"><h4>How token names work</h4>
    <p class="tnote" style="font-size:13.5px">Names are compositional — you can predict a token's name without looking it up:</p>
    <div class="grammar">
      <div class="gex"><code>semantic.color.brand.primary.dark</code><span><b>tier</b> (semantic) → <b>category</b> (color) → <b>group</b> (brand) → <b>role</b> (primary) → <b>variant</b> (dark)</span></div>
      <div class="gex"><code>primitive.spacing.4</code><span><b>tier</b> (primitive) → <b>category</b> (spacing) → <b>step</b> (4 × 4px grid = 16px)</span></div>
      <div class="gex"><code>semantic.typography.scale.labelSmall</code><span><b>tier</b> → <b>category</b> → <b>group</b> (scale) → <b>style name</b> (MD3-style role naming)</span></div>
    </div>
    <p class="tnote">Which tier to use where: <b>docs and doc.json files cite <code>semantic.*</code></b> (the intent); <b>code uses <code>primitive.*</code></b> (the concrete value) — see the rule above.</p>
  </div>
  {tok_html}
  <div class="tokgroup"><h4>Interaction states — the rule, not just the list</h4>
    <p class="tnote" style="font-size:13.5px">State-layer colours aren't hand-picked — they're computed: <b>hover = 4% overlay</b> of the base colour, <b>selected = 8%</b>, <b>focus = 12%</b> (in production: <code>alpha(brandColor, opacity)</code> in karoo-ui's ThemeProvider). Need a state colour that isn't listed? Derive it with this rule — never invent a new alpha value.</p>
  </div>
  <div class="tokgroup"><h4>Spacing (4px grid)</h4>
    <table class="tok"><thead><tr><th>Token</th><th>Value</th><th></th></tr></thead><tbody>{sp_rows}{sem_sp}</tbody></table>
  </div>
  <div class="tokgroup"><h4>Radius</h4>
    <table class="tok"><thead><tr><th>Token</th><th>Value</th><th></th></tr></thead><tbody>{rad_rows}</tbody></table>
  </div>
  <div class="tokgroup"><h4>Border width</h4>
    <table class="tok"><thead><tr><th>Token</th><th>Value</th><th></th></tr></thead><tbody>{bw_rows}</tbody></table>
  </div>
  <div class="tokgroup"><h4>Type scale</h4>
    <table class="tok"><thead><tr><th>Style</th><th>Size</th><th>Weight</th><th>Line</th><th>Sample</th></tr></thead><tbody>{ty_rows}</tbody></table>
    <p class="tnote">⚠ <code>labelSmall</code> and <code>titleMedium</code> exist as tokens but are not yet registered MUI variants in karoo-ui — see their notes in tokens.json.</p>
  </div>
  <div class="warn"><b>Known issue (from tokens.json):</b> white on brand orange <code>#F47735</code> fails WCAG AA at ~2.79:1. Use <code>primary.dark</code> <code>#BB4800</code> for filled surfaces with white text.</div>
  <div class="tokgroup" style="margin-top:34px"><h4>Where these values come from</h4>
    <p class="tnote" style="font-size:13.5px">Every value was extracted from the production fleetapp-web codebase — nothing was invented:</p>
    <ul class="provlist">{prov_items}</ul>
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
        rows += f'<tr><td><a href="components/{s}.html#accessibility"><b>{esc(c["name"])}</b></a></td><td>{esc(summary)}{extra}</td></tr>'
    return f'''<div class="inner pagetop">
<section id="accessibility">
  <h2>Accessibility</h2>
  <p class="sub">WCAG AA is enforced by the system, not by vigilance: the tokens are AA-safe when used as documented, and every component carries its own accessibility requirements (from its doc.json) on its own page.</p>
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
    cards = ""
    for c in sorted(comps, key=lambda x: x["name"]):
        desc = c.get("description", "")
        short = desc[:110].rsplit(" ", 1)[0] + "…" if len(desc) > 110 else desc
        st = c.get("status", "stable")
        cards += f'''<a class="idxcard" href="{slug(c['name'])}.html">
      <b>{esc(c['name'])}</b>
      <span class="idxmeta"><span class="idxcat">{esc(c.get('category',''))}</span><span class="idxstatus">{esc(st)}</span></span>
      <p>{esc(short)}</p></a>'''
    return f'''<div class="inner pagetop">
<section id="components">
  <h2>Component reference</h2>
  <p class="sub">All {n_comps} components, generated directly from their <code>doc.json</code> files — this index can never drift from the source. Each has its own page with full API, do/don't rules, tokens and accessibility.</p>
  <input class="searchbox" id="csearch" type="search" placeholder="Filter components… (e.g. table, chip, dialog)" oninput="filterIdx(this.value)">
  <div class="idxgrid" id="idxgrid">{cards}</div>
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

    # variants
    variants = "".join(f'<tr><td><b>{esc(v.get("name",""))}</b></td><td>{esc(v.get("whenToUse",""))}</td></tr>' for v in c.get("variants", []))
    vt = f'<h5>Variants</h5><table class="mini"><tbody>{variants}</tbody></table>' if variants else ""

    # states & behaviors
    states = ""
    if c.get("states"):
        rows = "".join(f'<tr><td><b>{esc(s2.get("state",""))}</b></td><td>{esc(s2.get("treatment",""))}</td></tr>' for s2 in c["states"])
        states = f'<h5>States</h5><table class="mini"><tbody>{rows}</tbody></table>'
    beh = ""
    if c.get("behaviors"):
        rows = "".join(f'<tr><td><b>{esc(b.get("name",""))}</b></td><td>{esc(b.get("description",""))}</td></tr>' for b in c["behaviors"])
        beh = f'<h5>Behaviors</h5><table class="mini"><tbody>{rows}</tbody></table>'

    # do / don't
    dos = "".join(f'<li>{esc(x)}</li>' for x in c.get("doThis", []))
    donts = "".join(f'<li>{esc(x)}</li>' for x in remaining_donts)

    # props
    props = ""
    for p in c.get("props", []):
        req = "✓" if p.get("required") else ""
        props += f'<tr><td><code>{esc(p.get("name",""))}</code></td><td><code class="typ">{esc(p.get("type",""))}</code></td><td class="c">{req}</td><td>{esc(p.get("description",""))}</td></tr>'
    pt = f'<h5>Props</h5><table class="mini props"><thead><tr><th>Prop</th><th>Type</th><th class="c">Req</th><th>Description</th></tr></thead><tbody>{props}</tbody></table>' if props else ""

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

    # live example — anchor into the shared preview file (slug == preview anchor id)
    live = f'<h5>Live example</h5><a class="livelink" href="../component-library-preview.html#{s}" target="_blank">See {esc(name)} in the visual preview ↗</a>'

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

def body_preview():
    return '''<div class="inner pagetop">
<section id="preview">
  <h2>Visual preview</h2>
  <p class="sub">The full component library rendered as static HTML — synced to tokens.json. <a href="component-library-preview.html" target="_blank">Open full-screen ↗</a></p>
  <iframe class="prevframe" src="component-library-preview.html" title="Component library preview" loading="lazy"></iframe>
</section>
</div>'''

def body_changelog():
    return f'''<div class="inner pagetop">
<section id="changelog">
  <h2>What's new</h2>
  <p class="sub">Generated from <code>tokens.json → _meta.changelog</code>. Every structural change to the system is logged there — most recent first.</p>
  {changelog_items}
</section>
</div>'''

def body_downloads():
    return f'''<div class="inner pagetop">
<section id="downloads">
  <h2>Downloads</h2>
  <p class="sub">Everything needed to start. The zip is the recommended download — it contains the complete, self-contained system.</p>
  <div class="dl">
    <div class="dlc primary"><b>Complete design system (.zip)</b><span>The full folder: rules, tokens, all {n_comps} components with docs, and the visual preview. Unzip → connect to your AI tool → done. ({zip_kb} KB)</span><a class="dlbtn" href="downloads/cartrack-ai-design-system.zip" download>Download the system</a></div>
    <div class="dlc"><b>tokens.json</b><span>Just the design tokens — for tooling integrations or a quick look.</span><a class="dlbtn ghost" href="downloads/tokens.json" download>Download</a></div>
    <div class="dlc"><b>AGENTS.md</b><span>The behavior contract for AI agents, standalone.</span><a class="dlbtn ghost" href="downloads/AGENTS.md" download>Download</a></div>
    <div class="dlc"><b>CLAUDE.md</b><span>The auto-loading index for Claude tools, standalone.</span><a class="dlbtn ghost" href="downloads/CLAUDE.md" download>Download</a></div>
    <div class="dlc"><b>README.md</b><span>The human-friendly overview, standalone.</span><a class="dlbtn ghost" href="downloads/README.md" download>Download</a></div>
  </div>
</section>
</div>'''

SEARCH_SCRIPT = '''
<script>
function filterIdx(q){
  q = q.trim().toLowerCase();
  document.querySelectorAll('#idxgrid .idxcard').forEach(function(el){
    el.classList.toggle('hidden', q !== '' && el.textContent.toLowerCase().indexOf(q) === -1);
  });
}
</script>'''

# ================================================================
# Write all pages
# ================================================================
def write(relpath, active, body, prefix, page_title):
    p = DOCS / relpath
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(render_shell(active, body, prefix, page_title), encoding="utf-8")
    return p

written = []
written.append(write("index.html", "home", body_home(), "", "Cartrack AI Design System — Documentation Portal"))
written.append(write("foundations.html", "foundations", body_foundations(), "", "Foundations — Cartrack AI Design System"))
written.append(write("tokens.html", "tokens", body_tokens(), "", "Design tokens — Cartrack AI Design System"))
written.append(write("accessibility.html", "accessibility", body_accessibility(), "", "Accessibility — Cartrack AI Design System"))
written.append(write("preview.html", "preview", body_preview(), "", "Visual preview — Cartrack AI Design System"))
written.append(write("changelog.html", "changelog", body_changelog(), "", "What's new — Cartrack AI Design System"))
written.append(write("downloads.html", "downloads", body_downloads(), "", "Downloads — Cartrack AI Design System"))

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
                         f"{c['name']} — Cartrack AI Design System"))

total_kb = round(sum(os.path.getsize(p) for p in written) / 1024)
print(f"Wrote {len(written)} pages to {DOCS} — {total_kb} KB total")
print(f"  {n_comps} component pages, {n_patterns} pattern pages, "
      f"{len(written) - n_comps - n_patterns} top-level pages")
