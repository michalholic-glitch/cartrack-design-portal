# AGENTS.md — Cartrack Portal UI (Material 2 / MDC)

This folder is the machine-readable source of truth for generating UI that
matches the Cartrack fleet portal. Read it before producing or editing any
markup, styles, or components.

## What this is
A desktop, data-first fleet-management portal. UI is **Material Design 2**,
Cartrack-themed, built on **Material Components Web (MDC) 14.0.0**. Operators are
fleet managers scanning and acting on vehicle/driver records.

## Files (read in this order)
1. `DESIGN.md` — design tokens (colours, type, spacing, radius, elevation) + intent. The visual source of truth.
2. `_index.md` — the catalogue of components, grouped by category.
3. `<component>.md` — the spec for the component you're about to use. **Read it before using the component.**

Underlying source library: `../md2-cartrack-library/` (themed CSS in
`assets/ds.css`, MDC Sass theme in `build/mdc.cartrack.theme.scss`).

## Rules for generating UI
1. **Use MDC components, not raw HTML, when one exists.** Buttons → `mdc-button`, inputs → `mdc-text-field`, etc. Each spec shows the correct themed markup.
2. **Use tokens, never literals.** Reference `DESIGN.md` token names / CSS custom properties (`var(--primary)`). Never write raw hex, px, fonts, or shadows.
3. **The component spec is authoritative.** Respect its variants, states, "when to use", and "when NOT to use". Don't invent variants or props that aren't documented.
4. **One high-emphasis action per view.** Exactly one contained button; everything else is outlined/text.
5. **Match existing patterns.** Follow a similar existing screen's structure rather than inventing layout.
6. **Accessibility is required.** Discernible text or `aria-label` on every interactive element; visible focus; meet WCAG AA contrast.

## Hard "do not" list
- Do NOT hard-code colours, spacing, font sizes, radii, or shadows — use tokens.
- Do NOT use a raw element when an MDC component exists.
- Do NOT ship **white text on base `--primary` (#F47735)** for important labels — it fails AA. Use `--primary-dark` (#BB4800).
- Do NOT use the FAB on desktop — the primary action goes in the toolbar / app bar.
- Do NOT encode status by colour alone — always include a text label.
- Do NOT invent components or variants. If something is missing, say so; don't fabricate it.

## Verify before finishing
- [ ] Only documented components/variants used
- [ ] No hard-coded colours/spacing/shadows introduced
- [ ] White-on-primary AA check passed (use `--primary-dark` where needed)
- [ ] One contained button per view
- [ ] Every interactive element has an accessible label and visible focus

## When unsure
Prefer asking over guessing. Confident-but-wrong, off-brand output is the exact
failure mode this system exists to prevent.
