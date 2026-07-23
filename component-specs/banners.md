# Banners

**Status:** stable  
**Category:** Feedback  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Alert / banner`  
**Source:** `md2-cartrack-library/components/banners.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
A banner is a prominent message with one or two actions, shown at the top of a region. It surfaces something important but non-blocking — vehicles due for service, a sync issue, a new feature — and stays until the operator acts.

## Key rule
> Use a banner for a persistent, moderate-priority message that needs acknowledgement. For transient confirmation use a snackbar; for a blocking decision use a dialog.

## When to use
- **Informational** — Neutral notice (a new export format, a tip).
- **Warning** — Something needs attention soon (service due).
- **Error** — A problem affecting the data on screen (sync failed).
- **Success** — Confirmation of a longer-running result.

## When NOT to use (and what to do instead)
- Don't use a banner for transient confirmations (use a snackbar).
- Don't stack multiple banners.
- Don't use error styling for non-errors.

## Variants
| Variant | When to use |
| --- | --- |
| Informational | Neutral notice (a new export format, a tip). |
| Warning | Something needs attention soon (service due). |
| Error | A problem affecting the data on screen (sync failed). |
| Success | Confirmation of a longer-running result. |

## Anatomy
- Container — spans the region width, sits at the top.
- Leading icon — optional status/identity icon.
- Message — the supporting text.
- Actions — one or two text buttons (e.g. Dismiss + Review).

## Behaviors
- **Persistence** — A banner stays until dismissed or resolved — unlike a snackbar, it doesn't auto-hide.
- **Placement** — Anchor it at the top of the relevant region (page or section), above the content it concerns.
- **One at a time** — Show a single banner per region; queue or combine rather than stacking several.

## States
| State | Treatment |
| --- | --- |
| Visible | Tinted background per severity; message + actions. |
| Action hover/focus | Button state layers; visible focus. |
| Dismissed | Removed; layout reflows. |

## Specs
| Property | Value |
| --- | --- |
| Padding | 14–16px |
| Message text | Roboto 14px / 400 |
| Severity tint | success/warning/error/info container colours; text meets AA |
| Actions | Text buttons, right-aligned |

## Correct usage (themed MDC markup)
```html
<div class="mdc-banner" id="m-banner" role="banner">
<div aria-live="assertive" class="mdc-banner__content" role="alertdialog">
<div class="mdc-banner__graphic-text-wrapper"><div class="mdc-banner__text">3 vehicles are due for service this week.</div></div>
<div class="mdc-banner__actions">
<button class="mdc-banner__secondary-action mdc-button" type="button"><div class="mdc-button__ripple"></div><div class="mdc-button__label">Dismiss</div></button>
<button class="mdc-banner__primary-action mdc-button" type="button"><div class="mdc-button__ripple"></div><div class="mdc-button__label">Review</div></button>
</div>
</div>
</div>
<div style="padding:16px"><button class="mdc-button mdc-button--outlined" id="m-open-banner"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Show banner</span></button></div>
```

## Do
- Use for persistent, moderate-priority messages.
- Offer a clear action (Review/Retry/Dismiss).
- Match the tint to severity and keep text legible.

## Don't
- Don't use a banner for transient confirmations (use a snackbar).
- Don't stack multiple banners.
- Don't use error styling for non-errors.

## Accessibility
- Expose the banner via an appropriate live region (assertive for errors, polite for info) so it's announced; actions are real buttons with accessible names. Severity is conveyed by icon + text, not colour alone, and tints meet AA contrast.
