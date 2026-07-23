# Steppers

**Status:** stable  
**Category:** Navigation  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Stepper, Step`  
**Source:** `md2-cartrack-library/components/steppers.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
A stepper guides an operator through a task in ordered steps — onboarding a new vehicle, building a report, running a bulk assignment. It shows progress and what's left to do.

## Key rule
> Use a stepper for a sequence that benefits from being broken up and tracked. For peer views with no order, use tabs instead.

## When to use
- **Horizontal** — A few steps with short labels; fits across the top.
- **Vertical** — Steps with more content; content expands under each.
- **Linear** — Steps must be completed in order.
- **Non-linear** — Operators may jump between steps freely.

## When NOT to use (and what to do instead)
- Don't use a stepper for unordered, peer views.
- Don't bury errors — surface them on the relevant step.
- Don't create long, dozen-step flows; split the task.

## Variants
| Variant | When to use |
| --- | --- |
| Horizontal | A few steps with short labels; fits across the top. |
| Vertical | Steps with more content; content expands under each. |
| Linear | Steps must be completed in order. |
| Non-linear | Operators may jump between steps freely. |

## Anatomy
- Step indicator — a numbered/checked circle per step.
- Step label — the step's name (and optional sub-text).
- Connector — the line linking steps.
- Step content — the fields/actions for the active step.
- Navigation — Back / Next (and Finish) controls.

## Behaviors
- **Progress** — Completed steps show a check; the active step is highlighted; upcoming steps are muted.
- **Validation** — In a linear stepper, a step must be valid before Next; show errors on the step that needs attention.
- **Back/skip** — Allow going back; mark optional steps as skippable where appropriate.

## States
| State | Treatment |
| --- | --- |
| Completed | Primary circle with a check. |
| Active | Primary circle with the step number; bold label. |
| Upcoming | Muted circle/label. |
| Error | Error-colour indicator on the affected step. |

## Specs
| Property | Value |
| --- | --- |
| Indicator | 24px circle; primary when active/done |
| Label | Roboto 14px / 500 (active) / 400 (other) |
| Connector | 1px divider line |

## Correct usage (themed MDC markup)
```html
<div class="stepper2">
<span class="st done"><span class="n">✓</span> Details</span><span class="bar"></span>
<span class="st on"><span class="n">2</span> Assign driver</span><span class="bar"></span>
<span class="st"><span class="n">3</span> Confirm</span>
</div>
```

## Do
- Keep steps few and clearly named.
- Validate before advancing in a linear flow.
- Let users go back.

## Don't
- Don't use a stepper for unordered, peer views.
- Don't bury errors — surface them on the relevant step.
- Don't create long, dozen-step flows; split the task.

## Accessibility
- Convey the current step and total ("Step 2 of 3") to assistive tech; the active step uses aria-current="step". Steps are keyboard reachable (where navigable) with visible focus; errors are announced on their step.
