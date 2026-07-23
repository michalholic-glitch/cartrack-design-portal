# Progress indicators

**Status:** stable  
**Category:** Data display  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `LinearProgress, CircularProgress`  
**Source:** `md2-cartrack-library/components/progress.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Progress indicators show that the app is working — loading a report, exporting trips, fetching a page of vehicles. They reassure the operator that something is happening and, when possible, how far along it is.

## Key rule
> Use determinate progress when you know the percentage; indeterminate when you don't. For content that's loading into a known layout (tables, cards), prefer skeletons over spinners.

## When to use
- **Linear determinate** — A known-percentage task with a layout to sit above/below (uploads, exports).
- **Linear indeterminate** — Loading where duration is unknown; spans a region's width.
- **Circular determinate** — A compact known-percentage indicator.
- **Circular indeterminate** — A small inline "working" spinner.

## When NOT to use (and what to do instead)
- Don't fake a percentage.
- Don't block the whole screen for a small async action.
- Don't flash a spinner for sub-second waits.

## Variants
| Variant | When to use |
| --- | --- |
| Linear determinate | A known-percentage task with a layout to sit above/below (uploads, exports). |
| Linear indeterminate | Loading where duration is unknown; spans a region's width. |
| Circular determinate | A compact known-percentage indicator. |
| Circular indeterminate | A small inline "working" spinner. |

## Anatomy
- Track — the full extent (linear) or the unfilled ring.
- Active indicator — the filled/animated portion showing progress.
- Optional label — a percentage or status text.

## Behaviors
- **Determinate vs indeterminate** — Switch to determinate as soon as a real percentage is available; don't fake progress.
- **Delay** — For fast operations, delay showing a spinner briefly to avoid a flicker (the portal has delayed-spinner variants for this).
- **Skeletons** — When loading into a known structure, skeleton placeholders feel faster and less jarring than a spinner.

## States
| State | Treatment |
| --- | --- |
| Active | Primary fill/arc; animates for indeterminate. |
| Complete | Hide, or show 100% briefly before dismissing. |

## Specs
| Property | Value |
| --- | --- |
| Linear height | 4px |
| Circular size | ~24–48px; ~4px stroke |
| Colour | primary (#F47735) on a light track |

## Correct usage (themed MDC markup)
```html
<div aria-label="Loading" aria-valuemax="1" aria-valuemin="0" aria-valuenow="0" class="mdc-linear-progress" role="progressbar" style="max-width:300px">
<div class="mdc-linear-progress__buffer"><div class="mdc-linear-progress__buffer-bar"></div><div class="mdc-linear-progress__buffer-dots"></div></div>
<div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"><span class="mdc-linear-progress__bar-inner"></span></div>
<div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div>
</div>
<div aria-label="Loading" aria-valuemax="1" aria-valuemin="0" class="mdc-circular-progress mdc-circular-progress--indeterminate" role="progressbar" style="width:48px;height:48px">
<div class="mdc-circular-progress__indeterminate-container">
<div class="mdc-circular-progress__spinner-layer">
<div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewbox="0 0 48 48"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"></circle></svg></div>
<div class="mdc-circular-progress__gap-patch"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewbox="0 0 48 48"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.2"></circle></svg></div>
<div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewbox="0 0 48 48"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"></circle></svg></div>
</div>
</div>
</div>
```

## Do
- Use determinate progress when you know the percentage.
- Prefer skeletons for content loads.
- Delay spinners on fast operations.

## Don't
- Don't fake a percentage.
- Don't block the whole screen for a small async action.
- Don't flash a spinner for sub-second waits.

## Accessibility
- Use progressbar role with aria-valuenow (determinate) or busy state (indeterminate); give it an accessible label describing what's loading. Don't rely on motion alone.
