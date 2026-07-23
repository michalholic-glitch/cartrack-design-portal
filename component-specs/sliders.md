# Sliders

**Status:** stable  
**Category:** Inputs & forms  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Slider`  
**Source:** `md2-cartrack-library/components/sliders.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Sliders let an operator choose a value, or a range, by dragging along a track — useful for soft, approximate settings like a geofence radius or a map's time window. When precision matters, prefer a number field.

## Key rule
> Use a slider when the exact number is less important than the relative position, or when immediate visual feedback helps. For exact entry (e.g. an odometer), use a text field.

## When to use
- **Continuous** — Any value across the range (e.g. opacity, radius).
- **Discrete** — Snaps to steps with tick marks (e.g. 5/10/15 km).
- **Range (two thumbs)** — Select a from–to span (e.g. a date/time window).

## When NOT to use (and what to do instead)
- Don't use a slider for precise or wide-range numeric entry.
- Don't hide the value.
- Don't make the thumb hard to grab (keep a generous hit area).

## Variants
| Variant | When to use |
| --- | --- |
| Continuous | Any value across the range (e.g. opacity, radius). |
| Discrete | Snaps to steps with tick marks (e.g. 5/10/15 km). |
| Range (two thumbs) | Select a from–to span (e.g. a date/time window). |

## Anatomy
- Track — the full range (inactive portion).
- Active track — the filled portion from start to the thumb.
- Thumb — the draggable handle at the current value.
- Value indicator — optional bubble showing the value while dragging.
- Tick marks — optional stops on a discrete slider.

## Behaviors
- **Dragging & keys** — Drag the thumb, click the track to jump, or use arrow keys for fine steps and Page keys for larger ones.
- **Value feedback** — Show the current value (bubble or adjacent text) so the operator isn't guessing.
- **Pairing** — For values that also need exact entry, pair the slider with a synced number field.

## States
| State | Treatment |
| --- | --- |
| Enabled | Primary active track + thumb; grey inactive track. |
| Hover/focus | State-layer halo around the thumb. |
| Dragging | Enlarged thumb / value bubble. |
| Disabled | 38% opacity, not interactive. |

## Specs
| Property | Value |
| --- | --- |
| Track height | 2px (inactive), active emphasized |
| Thumb | ~12–14px (grows on interaction) |
| Active colour | primary (#F47735) |
| Hit target | ≥40px tall interaction area |

## Correct usage (themed MDC markup)
```html
<div class="mdc-slider" style="max-width:360px">
<input aria-label="Radius" class="mdc-slider__input" max="100" min="0" name="radius" type="range" value="55"/>
<div class="mdc-slider__track"><div class="mdc-slider__track--inactive"></div><div class="mdc-slider__track--active"><div class="mdc-slider__track--active_fill"></div></div></div>
<div class="mdc-slider__thumb"><div class="mdc-slider__thumb-knob"></div></div>
</div>
```

## Do
- Show the current value.
- Use discrete steps when only certain values are valid.
- Pair with a field when exact entry is needed.

## Don't
- Don't use a slider for precise or wide-range numeric entry.
- Don't hide the value.
- Don't make the thumb hard to grab (keep a generous hit area).

## Accessibility
- Use a slider role with aria-valuemin/max/now (and text for ranges). Fully keyboard operable with visible focus; the value is announced as it changes.
