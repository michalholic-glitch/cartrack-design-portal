# Pickers — date & time

**Status:** stable  
**Category:** Inputs & forms  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `DatePicker, DateRangePicker, TimePicker`  
**Source:** `md2-cartrack-library/components/pickers.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Pickers help operators choose dates and times — a trip window, a report period, a maintenance due date. They pair a typeable field with a calendar or clock surface, and support ranges for from–to selections.

## Key rule
> Offer both: let operators type a date in the field and pick from the calendar. Use a range picker for any from–to selection (reports, trip history), and always respect the user's locale and time zone.

## When to use
- **Date picker** — A single date (due date, start date).
- **Date range picker** — A from–to span (report period, trip history).
- **Time picker** — A time of day (schedule, cut-off).
- **Date-time / date-time range** — When both date and time matter (precise trip windows).
- **Field-only** — Keyboard entry without a popup (power users).
- **Static / inline** — Always-open calendar embedded in a panel.

## When NOT to use (and what to do instead)
- Don't force calendar-only entry for power users.
- Don't ignore time zones on a global fleet.
- Don't use white text on the orange header.

## Variants
| Variant | When to use |
| --- | --- |
| Date picker | A single date (due date, start date). |
| Date range picker | A from–to span (report period, trip history). |
| Time picker | A time of day (schedule, cut-off). |
| Date-time / date-time range | When both date and time matter (precise trip windows). |
| Field-only | Keyboard entry without a popup (power users). |
| Static / inline | Always-open calendar embedded in a panel. |

## Anatomy
- Input field — typeable date/time with a calendar/clock trigger.
- Header — the current selection summary on the surface.
- Calendar grid — selectable days; navigates by month/year.
- Clock dial — hours/minutes for time selection.
- Range highlight — the span between start and end on a range picker.
- Actions — confirm/cancel where selection isn't immediate.

## Behaviors
- **Type or pick** — The field accepts typed input in the locale format; the calendar/clock offers visual selection. Both stay in sync.
- **Ranges** — Selecting a start then an end highlights the span; presets ("Last 7 days", "This month") speed up common choices.
- **Constraints** — Min/max and disabled dates prevent invalid choices (e.g. no future service date in the past); validation shows in the field's supporting text.
- **Locale & time zone** — Formats, first-day-of-week, and time zone follow the operator's settings — important for a global fleet.

## States
| State | Treatment |
| --- | --- |
| Day enabled | Default text in the grid. |
| Day hover/focus | State-layer circle. |
| Day selected | Primary filled circle. |
| In-range | Light primary band between endpoints. |
| Disabled / out-of-range | 38% opacity, not selectable. |

## Specs
| Property | Value |
| --- | --- |
| Surface radius / elevation | 4px, overlay elevation |
| Header | primary background — use dark text or primary-dark; white on #F47735 fails AA |
| Day cell | ~36px, circular selection |
| Selected colour | primary (#F47735) |

## Correct usage (themed MDC markup)
```html
<div class="picker"><div class="ph2"><div style="font-size:.8rem">JUN 2026</div><div class="d">Sat, Jun 20</div></div>
<div class="grid"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span class="on">20</span></div>
</div>
<div class="picker" style="width:220px"><div class="ph2"><div class="d">14:30</div></div><div class="clock"><div class="c"></div><div class="dot"></div></div></div>
<span class="tf outlined"><span class="lbl">Date range</span><div class="f">1 Jun – 30 Jun 📅</div></span>
```

## Do
- Allow typing and picking.
- Offer presets for common ranges.
- Respect locale & time zone.
- Disable invalid dates rather than erroring after.

## Don't
- Don't force calendar-only entry for power users.
- Don't ignore time zones on a global fleet.
- Don't use white text on the orange header.

## Accessibility
- The field is labelled and announces the selected value; the calendar is keyboard navigable (arrows move days, Page changes months) with aria grid semantics. Selected and disabled days are conveyed to assistive tech, not by colour alone.
