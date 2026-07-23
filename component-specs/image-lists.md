# Image lists

**Status:** stable  
**Category:** Data display  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `ImageList`  
**Source:** `md2-cartrack-library/components/image-lists.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Image lists arrange images in a grid — vehicle photos, inspection snapshots, document scans, map thumbnails. They make a set of visuals scannable at a glance.

## Key rule
> Use an image list when the visual is the content. If text matters more than the picture, a list or table with a small thumbnail is usually better.

## When to use
- **Standard** — Equal-size tiles in a uniform grid.
- **Quilted / woven** — Emphasize some images with varied tile sizes.
- **With text overlay** — When each image needs a short caption or action.
- **Masonry** — Images of differing aspect ratios.

## When NOT to use (and what to do instead)
- Don't use an image list for text-heavy records.
- Don't load hundreds of full-size images at once.
- Don't put essential info only in an overlay that may be hard to read.

## Variants
| Variant | When to use |
| --- | --- |
| Standard | Equal-size tiles in a uniform grid. |
| Quilted / woven | Emphasize some images with varied tile sizes. |
| With text overlay | When each image needs a short caption or action. |
| Masonry | Images of differing aspect ratios. |

## Anatomy
- Grid — the arrangement of tiles (equal or varied sizes).
- Image tile — one image, optionally clickable.
- Label overlay — optional caption/title bar on a tile.
- Action — optional icon on a tile (e.g. favourite, info).

## Behaviors
- **Activation** — A tile can open a larger view or detail; show hover/focus affordance.
- **Responsive columns** — Column count adapts to width; tiles keep their aspect ratio.
- **Loading** — Show placeholders while images load; lazy-load long grids.

## States
| State | Treatment |
| --- | --- |
| Enabled | Image tile. |
| Hover/focus | Overlay/scale affordance. |
| Loading | Placeholder/skeleton tile. |

## Specs
| Property | Value |
| --- | --- |
| Gap | 4–8px between tiles |
| Tile radius | 2–4px |
| Overlay label | Roboto 12–14px on a scrim |
| Columns | Responsive to container width |

## Correct usage (themed MDC markup)
```html
<ul class="mdc-image-list" style="max-width:360px">
<li class="mdc-image-list__item" style="width:calc(100% / 3 - 4px);margin:2px"><div class="mdc-image-list__image-aspect-container"><div class="mdc-image-list__image" style="background:linear-gradient(135deg,#FFA863,#F47735);height:80px;border-radius:2px"></div></div></li>
<li class="mdc-image-list__item" style="width:calc(100% / 3 - 4px);margin:2px"><div class="mdc-image-list__image-aspect-container"><div class="mdc-image-list__image" style="background:linear-gradient(135deg,#FFA863,#BB4800);height:80px;border-radius:2px"></div></div></li>
<li class="mdc-image-list__item" style="width:calc(100% / 3 - 4px);margin:2px"><div class="mdc-image-list__image-aspect-container"><div class="mdc-image-list__image" style="background:linear-gradient(135deg,#F47735,#333);height:80px;border-radius:2px"></div></div></li>
</ul>
```

## Do
- Use when the image is the primary content.
- Keep gaps consistent.
- Provide alt text and a larger view.

## Don't
- Don't use an image list for text-heavy records.
- Don't load hundreds of full-size images at once.
- Don't put essential info only in an overlay that may be hard to read.

## Accessibility
- Every image has meaningful alt text; clickable tiles are buttons/links with accessible names and visible focus. Overlay text meets contrast against the scrim.
