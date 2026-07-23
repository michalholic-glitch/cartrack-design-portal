# Badges

**Status:** stable  
**Category:** Data display  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Badge`  
**Source:** `md2-cartrack-library/components/badges.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
A badge is a small indicator placed on another element to show a count or status — the number of unread alerts on the notifications bell, or a dot marking a vehicle that needs attention.

## Key rule
> Use a badge to draw attention to a count or new state on an icon or item. Keep it glanceable — for detailed status use a status chip instead.

## When to use
- **Numeric** — Show a count (unread alerts, pending tasks).
- **Dot** — Indicate "new"/attention without a number.
- **Capped** — Large counts shown as "99+".

## When NOT to use (and what to do instead)
- Don't put long text in a badge.
- Don't show "0" unless it matters.
- Don't rely on the badge alone to convey critical detail.

## Variants
| Variant | When to use |
| --- | --- |
| Numeric | Show a count (unread alerts, pending tasks). |
| Dot | Indicate "new"/attention without a number. |
| Capped | Large counts shown as "99+". |

## Anatomy
- Host — the icon/element the badge sits on.
- Badge — the small count or dot indicator (usually top-right).
- Content — a number, capped value ("99+"), or empty dot.

## Behaviors
- **Capping** — Cap large counts (e.g. 99+) so the badge stays small and readable.
- **Zero** — Hide the badge at zero unless "0" is meaningful.
- **Live updates** — When the count changes, update it promptly and announce it to assistive tech.

## States
| State | Treatment |
| --- | --- |
| Visible | Error-colour pill/dot on the host. |
| Empty (dot) | Small filled dot, no number. |
| Hidden | Removed at zero/none. |

## Specs
| Property | Value |
| --- | --- |
| Numeric badge | ~16–18px tall pill |
| Dot | ~8px |
| Colour | error (#F44336) with white text (passes AA) |
| Text | Roboto ~11–12px / 500 |

## Correct usage (themed MDC markup)
```html
<span class="badge"><button class="icb">🔔</button><span class="d">4</span></span>
<span class="badge"><button class="icb">✉</button><span class="d">99+</span></span>
<span class="badge"><button class="icb">🚚</button><span class="d" style="min-width:8px;height:8px;padding:0"></span></span>
```

## Do
- Cap large counts (99+).
- Use a dot when a number isn't needed.
- Announce count changes.

## Don't
- Don't put long text in a badge.
- Don't show "0" unless it matters.
- Don't rely on the badge alone to convey critical detail.

## Accessibility
- The host's accessible name includes the badge meaning (e.g. "Notifications, 4 unread"); changes are announced via a live region. The dot/number is not the only signal of an important state.
