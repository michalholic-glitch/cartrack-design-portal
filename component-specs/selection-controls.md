# Selection controls

**Status:** stable  
**Category:** Inputs & forms  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Checkbox, Radio, Switch`  
**Source:** `md2-cartrack-library/components/selection-controls.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Selection controls capture choices: checkboxes for multi-select, radio buttons for one-of-many, and switches for instant on/off settings. Choosing the right one tells the operator how the choice behaves.

## Key rule
> Checkbox = select none/some/all and apply on submit. Radio = pick exactly one from a small set. Switch = toggle a setting that takes effect immediately.

## When to use
- **Checkbox** — Independent multi-select (table row selection, opt-in lists). Header checkbox does select-all + indeterminate.
- **Radio button** — One choice from a short, mutually exclusive set (2–5).
- **Switch** — An immediate on/off setting (e.g. enable notifications).

## When NOT to use (and what to do instead)
- Don't use radios for more than ~5 options — use a select.
- Don't use a switch where users expect to Save.
- Don't rely on colour alone to show selection.

## Variants
| Control | Use for |
| --- | --- |
| Checkbox | Independent multi-select (table row selection, opt-in lists). Header checkbox does select-all + indeterminate. |
| Radio button | One choice from a short, mutually exclusive set (2–5). |
| Switch | An immediate on/off setting (e.g. enable notifications). |

## Anatomy
- Control — the box, circle, or track/thumb.
- Selected mark — checkmark, inner dot, or thumb position.
- Indeterminate mark — a dash on a checkbox when a group is partially selected.
- Label — what the choice means; the whole label is a click target.
- State layer — hover/focus ripple around the control.

## Behaviors
- **Indeterminate** — When some-but-not-all of a group is checked, the parent checkbox shows a dash; clicking it selects or clears the whole group.
- **Apply timing** — Checkboxes/radios usually apply when the form is submitted; switches apply instantly. Don't mix the metaphors.
- **Grouping** — Radios share a name so only one is active; provide a group label.

## States
| State | Treatment |
| --- | --- |
| Unselected | Outline only (checkbox/radio) or grey track (switch). |
| Selected | Primary fill + mark; switch track/thumb primary. |
| Hover/focus | State-layer ring around the control. |
| Disabled | 38% opacity, not focusable. |

## Specs
| Property | Value |
| --- | --- |
| Checkbox / radio size | 18px control, 40px touch/click target |
| Switch | ~34×14 track, 20px thumb |
| Default size | small (Cartrack theme sets dense controls) |
| Selected colour | primary (#F47735); mark/thumb contrast handled by the control |
| Label | Roboto 14px / 400, 8px gap from control |

## Correct usage (themed MDC markup)
```html
<div class="mdc-form-field"><div class="mdc-checkbox"><input checked class="mdc-checkbox__native-control" id="m-cb" type="checkbox"/><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" d="M1.73,12.91 8.1,19.28 22.79,4.59" fill="none"></path></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div></div><label for="m-cb">Checkbox</label></div>
<div class="mdc-form-field"><div class="mdc-radio"><input checked class="mdc-radio__native-control" id="m-rd" name="m-r" type="radio"/><div class="mdc-radio__background"><div class="mdc-radio__outer-circle"></div><div class="mdc-radio__inner-circle"></div></div><div class="mdc-radio__ripple"></div></div><label for="m-rd">Radio</label></div>
<button aria-checked="true" class="mdc-switch mdc-switch--selected" id="m-sw" role="switch" type="button"><div class="mdc-switch__track"></div><div class="mdc-switch__handle-track"><div class="mdc-switch__handle"><div class="mdc-switch__shadow"><div class="mdc-elevation-overlay"></div></div><div class="mdc-switch__ripple"></div><div class="mdc-switch__icons"><svg class="mdc-switch__icon mdc-switch__icon--on" viewbox="0 0 24 24"><path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"></path></svg><svg class="mdc-switch__icon mdc-switch__icon--off" viewbox="0 0 24 24"><path d="M20 13H4v-2h16v2z"></path></svg></div></div></div></button><label for="m-sw" style="margin-left:8px">Notify on alert</label>
```

## Do
- Use a switch only for instant-effect settings.
- Use the indeterminate state for partial group selection.
- Make the label clickable.

## Don't
- Don't use radios for more than ~5 options — use a select.
- Don't use a switch where users expect to Save.
- Don't rely on colour alone to show selection.

## Accessibility
- Native inputs with associated labels; groups use fieldset / legend or radiogroup. The indeterminate checkbox sets the indeterminate property. State is conveyed by the mark and to assistive tech, not by colour alone; focus is visible.
