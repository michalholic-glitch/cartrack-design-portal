# Dividers

**Status:** stable  
**Category:** Data display  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Divider`  
**Source:** `md2-cartrack-library/components/dividers.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
A divider is a thin line that separates and groups content — between list items, sections of a form, or regions of a dense layout. Used sparingly, it brings order without adding weight.

## Key rule
> Reach for whitespace and grouping first; add a divider only where a clear boundary helps. Too many lines make a layout feel busy.

## When to use
- **Full-width** — Separate major sections edge to edge.
- **Inset** — Between list items, aligned past the leading element.
- **Middle** — Indented on both sides for a lighter separation.
- **Vertical** — Separate inline items in a toolbar.

## When NOT to use (and what to do instead)
- Don't put a divider between every list row.
- Don't use heavy or coloured rules for plain separation.
- Don't rely on a divider to convey meaning by itself.

## Variants
| Variant | When to use |
| --- | --- |
| Full-width | Separate major sections edge to edge. |
| Inset | Between list items, aligned past the leading element. |
| Middle | Indented on both sides for a lighter separation. |
| Vertical | Separate inline items in a toolbar. |

## Anatomy
- Line — 1px rule in the divider colour.
- Inset — optional left/right indentation to align with content (e.g. past an avatar).

## Behaviors
- **Grouping** — Use a divider to mark a real boundary between groups, not between every item — rows already separate visually.
- **Inset alignment** — Inset dividers align with the text column so the eye reads a clean left edge.

## States
| State | Treatment |
| --- | --- |
| Default | 1px line at the divider colour (rgba(0,0,0,.12)). |

## Specs
| Property | Value |
| --- | --- |
| Thickness | 1px |
| Colour | rgba(0,0,0,.12) (divider token) |
| Inset | 16px (or aligned to content, e.g. 72px past an avatar) |

## Correct usage (themed MDC markup)
```html
<span>Vehicle details</span>
<div class="divider"></div>
<span>Maintenance history</span>
```

## Do
- Use dividers to mark real group boundaries.
- Inset to align with the content column.
- Prefer spacing where it reads clearly without a line.

## Don't
- Don't put a divider between every list row.
- Don't use heavy or coloured rules for plain separation.
- Don't rely on a divider to convey meaning by itself.

## Accessibility
- Decorative dividers are hidden from assistive tech; a divider that genuinely separates groups can use a separator role. Never use a line as the only way to convey structure — pair with headings/labels.
