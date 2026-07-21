import React, { useId } from 'react';

export interface TooltipProps {
  /** Plain = a short label naming/clarifying the trigger. Truncation reveal = shows the full value when text is clipped. */
  variant?: 'plain' | 'truncation';
  /** Concise text (ideally a few words). */
  label: string;
  /** The trigger element being described (icon button, truncated text). Cloned to receive aria-describedby. */
  children: React.ReactElement;
}

/**
 * Tooltip — MD2 (MDC) Cartrack-themed.
 * Full spec: Tooltip.doc.json
 * Mirrors the mdc-tooltip class contract from md2-cartrack-library/components/tooltips.html.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px — exact match).
 * - color: semantic.color.surface.inverse / .onInverse (added 2026-07-16, shared with Snackbar.tsx
 *   — use the same solid #323232 rather than this component's own separate "~92% opacity" grey;
 *   apply opacity on top of the token, e.g. via a CSS alpha layer, if the translucent look matters).
 * - spacing: the vague "~6px" padding resolves cleanly to the real MD2 tooltip spec once split by
 *   axis — semantic.spacing.xs (4px) block, semantic.spacing.sm (8px) inline — no new token needed.
 * Not yet tokenized: ~10px text (below caption's 12px) is still outside the scale; that's normal
 * design tolerance, not a gap worth a new token for.
 */
export function Tooltip({ variant = 'plain', label, children }: TooltipProps) {
  const tooltipId = useId();

  const trigger = React.cloneElement(children, {
    'aria-describedby': tooltipId,
  });

  return (
    <>
      {trigger}
      <div
        id={tooltipId}
        className={`mdc-tooltip${variant === 'truncation' ? ' mdc-tooltip--truncation' : ''}`}
        role="tooltip"
        aria-hidden="true"
      >
        <div className="mdc-tooltip__surface mdc-tooltip__surface-animation">{label}</div>
      </div>
    </>
  );
}

export default Tooltip;
