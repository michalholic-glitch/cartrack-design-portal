# Dialogs

**Status:** stable  
**Category:** Surfaces  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Dialog, DialogTitle, DialogActions`  
**Source:** `md2-cartrack-library/components/dialogs.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
A dialog is a modal window for a focused task or decision that interrupts the operator on purpose — confirming a deletion, capturing a few fields, or surfacing something that needs a choice before continuing.

## Key rule
> Use a dialog only when the task genuinely needs to interrupt. For routine detail, prefer a side sheet or a detail page. For transient confirmation, prefer a snackbar.

## When to use
- **Alert / confirmation** — Confirm a consequential action (delete, discard).
- **Form dialog** — Capture a few fields without leaving the page.
- **Full-screen (rare on desktop)** — A larger task that benefits from focus; usually a page is better.

## When NOT to use (and what to do instead)
- Don't use a dialog for routine detail — use a side sheet/page.
- Don't stack dialogs.
- Don't let the scrim dismiss a destructive, unsaved action silently.

## Variants
| Variant | When to use |
| --- | --- |
| Alert / confirmation | Confirm a consequential action (delete, discard). |
| Form dialog | Capture a few fields without leaving the page. |
| Full-screen (rare on desktop) | A larger task that benefits from focus; usually a page is better. |

## Anatomy
- Scrim — dimmed overlay that blocks the page behind.
- Container — the dialog surface (4px radius, high elevation).
- Title — a short, specific question or task name.
- Content — supporting text and/or fields.
- Actions — confirm + dismiss, right-aligned; confirm last.

## Behaviors
- **Modality** — The dialog traps focus and blocks the page; Escape and the scrim dismiss non-destructive dialogs.
- **Action order** — Dismiss on the left, confirm on the right; destructive confirms use the error colour and clear labels ("Remove", not "OK").
- **Keep it short** — One decision or a handful of fields; longer tasks belong on a page.

## States
| State | Treatment |
| --- | --- |
| Open | Surface over scrim; focus trapped inside. |
| Action hover/focus | Button state layers; visible focus. |
| Closing | Returns focus to the trigger. |

## Specs
| Property | Value |
| --- | --- |
| Corner radius | 4px |
| Elevation | High (overlay) |
| Title | Roboto ~20px / 500 |
| Width | ~320–560px; content scrolls if long |
| Destructive action | error colour (#F44336) |

## Correct usage (themed MDC markup)
```html
<button class="mdc-button mdc-button--raised" id="m-open-dialog"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Remove vehicle…</span></button>
<div class="mdc-dialog" id="m-dialog">
<div class="mdc-dialog__container"><div aria-describedby="m-dc" aria-labelledby="m-dt" aria-modal="true" class="mdc-dialog__surface" role="alertdialog">
<h2 class="mdc-dialog__title" id="m-dt">Remove vehicle?</h2>
<div class="mdc-dialog__content" id="m-dc">This removes CA 123-456 from the active fleet. This action can't be undone.</div>
<div class="mdc-dialog__actions">
<button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Cancel</span></button>
<button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Remove</span></button>
</div>
</div></div>
<div class="mdc-dialog__scrim"></div>
</div>
```

## Do
- Use a specific title that states the decision.
- Label actions with verbs (Remove/Save), not OK.
- Trap focus and return it on close.

## Don't
- Don't use a dialog for routine detail — use a side sheet/page.
- Don't stack dialogs.
- Don't let the scrim dismiss a destructive, unsaved action silently.

## Accessibility
- Use role=dialog with aria-modal and a labelled title; trap focus while open and restore it to the trigger on close. Escape closes non-destructive dialogs. Action buttons have clear, discernible names.
