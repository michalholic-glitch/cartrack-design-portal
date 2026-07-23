# component-specs — research & decision docs (historical layer retired)

This folder used to hold the full prose specification for every component — the layer
the `design-system/components/<Name>/<Name>.doc.json` files were originally distilled
from. That layer was **retired on 2026-07-23**: the per-component `.md` files duplicated
the doc.jsons almost entirely, and keeping two hand-synced copies of the same facts is
how drift happens (see `table-deep-dive.md` §3 for the incident that proved it).

**Where things live now:**
- Per-component truth: `design-system/components/<Name>/<Name>.doc.json` — parity-checked
  against the `.tsx` on every portal build, and rendered live on the portal.
- Markup contract reference: `md2-cartrack-library/components/*.html` (what doc.json
  `source` fields now point to).
- The retired spec files: git history (last present at tag/commit before 2026-07-23 cleanup).

**What stays here:**
- `table-deep-dive.md` — research: fleet-web's real table patterns vs the DS DataTable;
  the analysis behind the 2026-07-23 DataTable build. Future deep-dives belong here too.
- `DESIGN.md`, `site/`, `preview-buttons-and-data-table.html` — historical artifacts from
  the earlier spec-first iteration; superseded by `tokens.json` and the portal. Kept for
  provenance, not guidance — do not cite them in new work.
