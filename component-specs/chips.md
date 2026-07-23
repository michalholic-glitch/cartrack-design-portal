# Chips

**Status:** stable  
**Category:** Inputs & forms  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Chip`  
**Source:** `md2-cartrack-library/components/chips.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Chips are compact elements that represent an input, a filter, or a choice — a selected driver, an active filter on a vehicle list, a quick action. They pack a lot of interaction into a small footprint.

## Key rule
> Use chips for selections and filters the operator manipulates. For read-only status (Active/Idle/Offline) use a status chip with a consistent colour mapping.

## When to use
- **Input chip** — Represents a discrete entered value (selected drivers, tags) — usually removable.
- **Filter chip** — Toggles a filter on a list; shows a selected state.
- **Choice chip** — Single selection from a small inline set.
- **Action chip** — Triggers a contextual action.
- **Status chip (read-only)** — Conveys record status with the consistent colour mapping.

## When NOT to use (and what to do instead)
- Don't use a chip as a primary button.
- Don't encode status by colour alone.
- Don't cram long text into a chip — keep labels short.

## Variants
| Variant | When to use |
| --- | --- |
| Input chip | Represents a discrete entered value (selected drivers, tags) — usually removable. |
| Filter chip | Toggles a filter on a list; shows a selected state. |
| Choice chip | Single selection from a small inline set. |
| Action chip | Triggers a contextual action. |
| Status chip (read-only) | Conveys record status with the consistent colour mapping. |

## Anatomy
- Container — pill-shaped surface; filled or outlined.
- Label — the value or option text.
- Leading icon / avatar — optional (e.g. a driver avatar).
- Trailing action — optional remove (×) or dropdown affordance.
- Selected state — check/tint indicating the chip is on.

## Behaviors
- **Selection & removal** — Filter/choice chips toggle on click; input chips can be removed via the trailing × or Backspace when focused.
- **Overflow** — When many chips are present, wrap to multiple lines or provide a "+N more" affordance.
- **Status mapping** — Status chips map state to colour consistently (Active=success, Idle=warning, Offline=error) and always keep the text label.

## States
| State | Treatment |
| --- | --- |
| Enabled | Filled grey or outlined. |
| Hover/focus | State-layer overlay. |
| Selected | Primary tint + check. |
| Disabled | 38% opacity. |

## Specs
| Property | Value |
| --- | --- |
| Height | 32px |
| Corner radius | 16px (pill) |
| Label | Roboto 14px / 400 (status chip 12px / 500) |
| Padding | 12px sides; 8px gap to icons |
| Selected tint | primary at ~10% |

## Correct usage (themed MDC markup)
```html
<span class="mdc-evolution-chip-set" role="grid"><span class="mdc-evolution-chip-set__chips" role="presentation">
<span class="mdc-evolution-chip" role="row"><span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell"><button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button"><span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span><span class="mdc-evolution-chip__text-label">Active</span></button></span></span>
<span class="mdc-evolution-chip" role="row"><span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell"><button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button"><span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span><span class="mdc-evolution-chip__text-label">Idle</span></button></span></span>
<span class="mdc-evolution-chip" role="row"><span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell"><button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button"><span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span><span class="mdc-evolution-chip__text-label">Offline</span></button></span></span>
</span></span>
```

## Do
- Use chips for filters/selections the user controls.
- Keep status chips read-only with consistent colours + labels.
- Make removable chips clearly removable.

## Don't
- Don't use a chip as a primary button.
- Don't encode status by colour alone.
- Don't cram long text into a chip — keep labels short.

## Accessibility
- Interactive chips are focusable with clear roles; selected state is exposed (e.g. aria-pressed ) and removal is keyboard-operable. Status chips include text, never colour alone. Targets meet minimum size.
