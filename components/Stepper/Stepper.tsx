import React from 'react';

export interface StepperStep {
  label: string;
  /** Optional sub-text shown under the label. */
  subLabel?: string;
  /** Explicit per-step state override. If omitted, state is derived from activeStep. */
  state?: 'completed' | 'active' | 'upcoming' | 'error';
}

export interface StepperProps {
  /** Horizontal fits a few short-labelled steps across the top; vertical expands content under each step. */
  orientation?: 'horizontal' | 'vertical';
  /** Linear = steps must be completed in order. Non-linear = operators may jump between steps freely. */
  linear?: boolean;
  steps: StepperStep[];
  /** Zero-based index of the current step. */
  activeStep: number;
  onStepClick?: (index: number) => void;
}

/**
 * Stepper — MD2 (MDC) Cartrack-themed.
 * Full spec: Stepper.doc.json
 * NOTE: MDC Web has no stock stepper component (it's a Material guideline pattern, not a
 * shipped MDC primitive). This mirrors the Cartrack-styled custom markup (.stepper2 / .st / .bar)
 * from md2-cartrack-library/components/steppers.html rather than an mdc-* class contract.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main (active/done indicator — set by the .st CSS classes
 *   below, not inline), semantic.color.border.default (connector line).
 * - radius: semantic.radius.pill (circular indicator).
 * - type: semantic.typography.scale.subtitle2 (14px/500 active label — exact match),
 *   semantic.typography.scale.body2 (14px/400 other labels — exact match).
 * Not yet tokenized: the 24px indicator size has no matching dimension token.
 */
export function Stepper({ orientation = 'horizontal', linear = true, steps, activeStep, onStepClick }: StepperProps) {
  return (
    <div
      className={`stepper2${orientation === 'vertical' ? ' stepper2--vertical' : ''}`}
      role="group"
      aria-label={`Step ${activeStep + 1} of ${steps.length}`}
    >
      {steps.map((step, i) => {
        const derivedState = step.state ?? (i < activeStep ? 'completed' : i === activeStep ? 'active' : 'upcoming');
        const cls =
          derivedState === 'completed'
            ? 'st done'
            : derivedState === 'active'
            ? 'st on'
            : derivedState === 'error'
            ? 'st error'
            : 'st';
        const mark = derivedState === 'completed' ? '✓' : i + 1;

        return (
          <React.Fragment key={step.label}>
            <span
              className={cls}
              aria-current={derivedState === 'active' ? 'step' : undefined}
              onClick={!linear || i <= activeStep ? () => onStepClick?.(i) : undefined}
              style={{ cursor: onStepClick && (!linear || i <= activeStep) ? 'pointer' : undefined }}
            >
              <span className="n">{mark}</span> {step.label}
              {step.subLabel ? <span className="sub">{step.subLabel}</span> : null}
            </span>
            {i < steps.length - 1 ? <span className="bar" /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Stepper;
