# Tooltips

**Status:** stable  
**Category:** Data display  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Tooltip`  
**Source:** `md2-cartrack-library/components/tooltips.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Tooltips reveal a short text label on hover or focus — naming an icon-only button, or showing a value that's been truncated in a dense table. They're especially valuable on desktop, where hover exists.

## Key rule
> Use a tooltip for brief, supplementary text — an icon's name, a truncated cell's full value. Never put essential information or actions only in a tooltip.

## When to use
- **Plain** — A short label naming or clarifying the trigger.
- **Truncation reveal** — Shows the full value when text is clipped in a cell/label.

## When NOT to use (and what to do instead)
- Don't put actions or essential info only in a tooltip.
- Don't write long paragraphs.
- Don't rely on hover alone (touch/keyboard need an alternative).

## Variants
| Variant | When to use |
| --- | --- |
| Plain | A short label naming or clarifying the trigger. |
| Truncation reveal | Shows the full value when text is clipped in a cell/label. |

## Anatomy
- Trigger — the element being described (icon button, truncated text).
- Container — the small dark surface.
- Label — concise text (ideally a few words).

## Behaviors
- **Trigger** — Appears on hover and on keyboard focus; dismisses on blur/mouse-out or Escape.
- **Delay** — A short enter delay avoids tooltip noise as the pointer moves across a toolbar.
- **Positioning** — Flips to stay within the viewport; never covers its own trigger.

## States
| State | Treatment |
| --- | --- |
| Hidden | Not rendered until triggered. |
| Shown | Dark surface, light text, near the trigger. |

## Specs
| Property | Value |
| --- | --- |
| Background | Dark grey (~92% opacity), white text (passes AA) |
| Text | Roboto ~10–12px |
| Padding / radius | ~6px / 4px |
| Enter delay | ~150–500ms |

## Correct usage (themed MDC markup)
```html
<button aria-describedby="m-tt" aria-label="Track vehicle" class="mdc-icon-button material-icons">my_location</button>
<div aria-hidden="true" class="mdc-tooltip" id="m-tt" role="tooltip"><div class="mdc-tooltip__surface mdc-tooltip__surface-animation">Track vehicle</div></div>
```

## Do
- Label every icon-only button with a tooltip.
- Keep text to a few words.
- Trigger on focus too, not just hover.

## Don't
- Don't put actions or essential info only in a tooltip.
- Don't write long paragraphs.
- Don't rely on hover alone (touch/keyboard need an alternative).

## Accessibility
- Associate the tooltip with its trigger (e.g. aria-describedby ); show on focus as well as hover, and allow Escape to dismiss. The icon button still needs its own accessible name.
