# Snackbars

**Status:** stable  
**Category:** Feedback  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Snackbar (notistack)`  
**Source:** `md2-cartrack-library/components/snackbars.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
A snackbar gives brief, low-priority feedback about an action just taken — "Vehicle saved", "Export started" — usually with a single optional action like Undo. It appears briefly and dismisses on its own.

## Key rule
> Use a snackbar for transient confirmation that doesn't need acknowledgement. For a message that must persist until acted on, use a banner; for a blocking choice, a dialog.

## When to use
- **Message only** — Simple confirmation ("Changes saved").
- **With action** — Offer a quick follow-up (Undo, View).
- **Error toast** — A brief failure notice; pair persistent errors with a banner instead.

## When NOT to use (and what to do instead)
- Don't use a snackbar for errors that need action — use a banner/dialog.
- Don't stack multiple snackbars.
- Don't auto-dismiss something the user must act on.

## Variants
| Variant | When to use |
| --- | --- |
| Message only | Simple confirmation ("Changes saved"). |
| With action | Offer a quick follow-up (Undo, View). |
| Error toast | A brief failure notice; pair persistent errors with a banner instead. |

## Anatomy
- Container — dark surface, low elevation.
- Message — one concise line of text.
- Action — at most one (e.g. Undo).
- Dismiss — optional close; otherwise auto-hides.

## Behaviors
- **Auto-dismiss** — Auto-hides after a few seconds; an action or hover can pause/extend it so it isn't missed.
- **One at a time** — Show a single snackbar; queue subsequent ones rather than stacking.
- **Single action** — At most one action; don't put critical, irreversible choices in a transient surface.

## States
| State | Treatment |
| --- | --- |
| Shown | Dark surface, light text, optional action. |
| Action hover/focus | Highlighted action; visible focus. |
| Hidden | Slides/fades out after the timeout. |

## Specs
| Property | Value |
| --- | --- |
| Background / text | Dark grey (#323232) / white (passes AA) |
| Action colour | primary-light (#FFA863) — light enough to read on the dark surface |
| Message text | Roboto 14px |
| Duration | ~4–6s (longer if there's an action) |
| Position | Bottom-left or bottom-center |

## Correct usage (themed MDC markup)
```html
<button class="mdc-button mdc-button--raised" id="m-open-snack"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Show snackbar</span></button>
<aside class="mdc-snackbar" id="m-snackbar"><div aria-relevant="additions" class="mdc-snackbar__surface" role="status"><div aria-atomic="false" class="mdc-snackbar__label">Vehicle saved</div><div aria-atomic="true" class="mdc-snackbar__actions"><button class="mdc-button mdc-snackbar__action" type="button"><div class="mdc-button__ripple"></div><span class="mdc-button__label">Undo</span></button></div></div></aside>
```

## Do
- Keep the message to one short line.
- Offer at most one action (e.g. Undo).
- Queue snackbars; show one at a time.

## Don't
- Don't use a snackbar for errors that need action — use a banner/dialog.
- Don't stack multiple snackbars.
- Don't auto-dismiss something the user must act on.

## Accessibility
- Announce via a polite live region (assertive only for important messages); if there's an action, give enough time or pause on hover/focus so it's reachable. The action is a real button with an accessible name.
