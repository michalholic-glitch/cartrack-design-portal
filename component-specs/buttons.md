# Buttons

**Status:** stable  
**Category:** Actions  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Button`  
**Source:** `md2-cartrack-library/components/buttons.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Buttons let operators trigger actions — saving a vehicle, running a report, confirming a change. Emphasis communicates priority: the one most important action on a view is the contained button; everything else steps down.

## Key rule
> Use exactly one contained (high-emphasis) button per view. The floating action button (FAB) is excluded — it's a mobile pattern; on desktop the primary action sits in the page toolbar / app bar.

## When to use
- **Contained** — The single primary action on a view (Save, Add, Run).
- **Outlined** — Important secondary actions, or "Cancel" next to a contained button.
- **Text** — Low-emphasis actions — in toolbars, cards, and dialog dismissals.
- **Toggle button(s)** — Switch between exclusive views (Map / List); 2–5 options, not navigation.

## When NOT to use (and what to do instead)
- Don't stack multiple contained buttons.
- Don't use a button for navigation that's really a link.
- Don't ship white-on-orange for important labels.
- Don't hard-code colours/sizes — use tokens + these specs.

## Variants
| Variant | When to use |
| --- | --- |
| Contained | The single primary action on a view (Save, Add, Run). |
| Outlined | Important secondary actions, or "Cancel" next to a contained button. |
| Text | Low-emphasis actions — in toolbars, cards, and dialog dismissals. |
| Toggle button(s) | Switch between exclusive views (Map / List); 2–5 options, not navigation. |

## Anatomy
- Container — the clickable surface; fill/border depends on emphasis.
- Label — a short, verb-first action (e.g. "Add vehicle"), uppercase in MD2.
- Leading icon — optional, reinforces the action.
- State layer — hover/focus/pressed overlay on the container.

## Behaviors
- **Emphasis** — Use the lowest emphasis that does the job. Multiple contained buttons compete and dilute the primary action.
- **Loading** — For async actions, disable the button and show a small spinner in place of the label; never let it be clicked twice.
- **Icon + label** — Pair a leading icon with the label for frequent actions; keep the label even with an icon (icon-only goes to an icon button with a tooltip).

## States
| State | Treatment |
| --- | --- |
| Enabled | Default fill/border per variant. |
| Hover | Contained darkens to primary-dark; outlined/text show a light primary tint. |
| Focus | Visible focus ring/overlay (keyboard). |
| Disabled | 12% black fill, 38% black label, no shadow, not clickable. |

## Specs
| Property | Value |
| --- | --- |
| Height | 36px (standard) |
| Corner radius | 4px |
| Label | Roboto 14px / 500, uppercase, ~0.05em tracking |
| Padding | 16px sides (8px for text buttons) |
| Contained fill / label | primary / white — use primary-dark (#BB4800) for the fill where white text must pass WCAG AA; white on #F47735 is only ~2.79:1 |

## Correct usage (themed MDC markup)
```html
<button class="mdc-button"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Text</span></button>
<button class="mdc-button mdc-button--outlined"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Outlined</span></button>
<button class="mdc-button mdc-button--raised"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Save vehicle</span></button>
<button class="mdc-button mdc-button--unelevated"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Unelevated</span></button>
<button class="mdc-button mdc-button--raised" disabled><span class="mdc-button__ripple"></span><span class="mdc-button__label">Disabled</span></button>
```

## Do
- Keep one contained action per view.
- Use verb-first labels ("Add vehicle", not "New").
- Pair Cancel (outlined/text) beside the primary.
- Darken the orange fill for legible white text.

## Don't
- Don't stack multiple contained buttons.
- Don't use a button for navigation that's really a link.
- Don't ship white-on-orange for important labels.
- Don't hard-code colours/sizes — use tokens + these specs.

## Accessibility
- Buttons are real `<button>` elements with discernible text; icon-only actions get an aria-label. Focus is always visible. Disabled buttons are conveyed to assistive tech. Labels read as actions, not vague words.
