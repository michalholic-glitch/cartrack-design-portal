import React from 'react';
import MuiStepper, { StepperProps as MuiStepperProps } from '@mui/material/Stepper';

export type StepperProps = MuiStepperProps;

/**
 * Stepper — MUI v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: Stepper.doc.json
 *
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Stepper/index.tsx is a pure
 * re-export of @mui/material/Stepper — `export { default as Stepper } from
 * '@mui/material/Stepper'` — with zero prop overrides at the wrapper level, and
 * theme.ts has no MuiStepper entry either, so this renders exactly like stock MUI.
 * The old MDC-modeled Stepper.tsx invented a `steps: StepperStep[]` array prop and
 * derived each step's completed/active/upcoming/error state itself (MDC Web has no
 * stock stepper — that version mirrored the Cartrack-styled custom .stepper2 markup
 * instead of an mdc-* class contract). None of that exists here: the real Stepper
 * takes ordinary React `children` — one @mui/material/Step per step, each usually
 * containing a StepLabel (icon + label; pass `error` here for error styling, there
 * is no separate "error" prop on Stepper or Step) — and Stepper's own `activeStep`
 * index drives which Step renders as active/completed via internal context.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main — active/completed StepIcon fill.
 * - color: semantic.color.border.default — approximates StepConnector's default line colour.
 * - type: semantic.typography.scale.body2 (14px/400, StepLabel's base) and the
 *   14px/500 result MUI applies on top for the active/completed label (a CSS
 *   fontWeight override on body2, not a switch to the subtitle2 variant itself).
 * Dropped: the old doc's semantic.radius.pill for the circular step indicator —
 * the real StepIcon is an SVG circle (MUI's default Step icon), not a CSS
 * border-radius shape, so a radius token doesn't apply to it.
 * Not tokenized: the ~24px StepIcon diameter has no matching dimension token.
 */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(function Stepper(props, ref) {
  return <MuiStepper ref={ref} {...props} />;
});

export default Stepper;
