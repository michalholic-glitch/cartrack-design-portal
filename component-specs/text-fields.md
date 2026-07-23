# Text fields

**Status:** stable  
**Category:** Inputs & forms  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `TextField`  
**Source:** `md2-cartrack-library/components/text-fields.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Text fields let operators enter and edit text — a registration number, a driver's name, an odometer reading, a note. They come in filled and outlined styles and always carry a label so the field's purpose stays visible once filled.

## Key rule
> Pick one style and use it consistently across a form. In the Cartrack portal, outlined is the default for forms; filled suits dense, list-like settings.

## When to use
- **Filled** — Dense, settings-style lists; strong visual grouping.
- **Outlined** — Default for forms; clear field boundaries.
- **With adornments** — Search (leading magnifier + trailing clear), password (visibility toggle), units (trailing "km").
- **Select / dropdown field** — A field that opens a menu to choose one value.
- **Multiline / textarea** — Longer notes; grows with content.

## When NOT to use (and what to do instead)
- Don't use placeholder text as the only label.
- Don't mix filled and outlined in the same form.
- Don't rely on colour alone for errors — include text.

## Variants
| Variant | When to use |
| --- | --- |
| Filled | Dense, settings-style lists; strong visual grouping. |
| Outlined | Default for forms; clear field boundaries. |
| With adornments | Search (leading magnifier + trailing clear), password (visibility toggle), units (trailing "km"). |
| Select / dropdown field | A field that opens a menu to choose one value. |
| Multiline / textarea | Longer notes; grows with content. |

## Anatomy
- Container — filled (shaded box, bottom line) or outlined (border box).
- Label — floats above the value; stays visible when filled.
- Input text — the value the operator types.
- Supporting text — helper or error message below the field.
- Leading / trailing icon — optional adornment (search, clear, visibility, unit).
- Activation line / border — turns primary on focus, error on invalid.

## Behaviors
- **Label float** — The label sits in the field when empty and floats up on focus or when a value is present, so it never hides the content.
- **Validation** — Validate on blur or submit; show a concise error in the supporting text and turn the field's line/border to the error colour. Keep the label.
- **Read-only & disabled** — Read-only shows a value that can't be edited but can be copied; disabled dims the whole field and removes it from tab order.

## States
| State | Treatment |
| --- | --- |
| Enabled | Default container; medium-emphasis label. |
| Hover | Border/line darkens slightly. |
| Focused | Primary 2px border (outlined) or 2px underline (filled); primary label. |
| Error | Error colour border/line, label, and supporting text. |
| Disabled | 38% opacity; not focusable. |

## Specs
| Property | Value |
| --- | --- |
| Height | ~56px (filled), ~56px (outlined) standard |
| Input text | Roboto 16px / 400 |
| Label (resting / floated) | 16px → 12px |
| Supporting text | 12px |
| Corner radius | 4px |
| Focus / error colour | primary-dark (#BB4800) / error (#F44336) — primary-dark keeps the focus line legible on white |

## Correct usage (themed MDC markup)
```html
<label class="mdc-text-field mdc-text-field--filled"><span class="mdc-text-field__ripple"></span><span class="mdc-floating-label" id="m-tf1">Registration</span><input aria-labelledby="m-tf1" class="mdc-text-field__input" type="text" value="CA 123-456"/><span class="mdc-line-ripple"></span></label>
<label class="mdc-text-field mdc-text-field--outlined"><span class="mdc-notched-outline"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"><span class="mdc-floating-label" id="m-tf2">Driver</span></span><span class="mdc-notched-outline__trailing"></span></span><input aria-labelledby="m-tf2" class="mdc-text-field__input" type="text"/></label>
```

## Do
- Always show a label; keep it visible when filled.
- Write specific, helpful error text ("Enter a value", not "Invalid").
- Use one field style per form.
- Right-size width to the expected content.

## Don't
- Don't use placeholder text as the only label.
- Don't mix filled and outlined in the same form.
- Don't rely on colour alone for errors — include text.

## Accessibility
- Every field has a programmatic `<label>`; errors are linked via aria-describedby and announced. Focus is clearly visible. Required and invalid states use aria-required / aria-invalid, not colour alone.
