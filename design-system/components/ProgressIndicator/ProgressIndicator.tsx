import React from 'react';

export interface ProgressIndicatorProps {
  /** Linear spans a region's width; circular is a compact/inline indicator. */
  type?: 'linear' | 'circular';
  /** Determinate shows a known percentage; indeterminate animates for unknown duration. */
  variant?: 'determinate' | 'indeterminate';
  /** 0-100. Only used when variant is 'determinate'. */
  value?: number;
  /** Accessible label describing what's loading (required by the a11y spec). */
  label: string;
  /** Circular size in px (MDC default demo uses 48). Ignored for linear. */
  size?: number;
  /** Max width in px for the linear track (MDC demo uses 300). Ignored for circular. */
  maxWidth?: number;
}

/**
 * ProgressIndicator — MD2 (MDC) Cartrack-themed.
 * Full spec: ProgressIndicator.doc.json
 * Mirrors the mdc-linear-progress / mdc-circular-progress class contract from
 * md2-cartrack-library/components/progress.html.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main (the active fill/arc — currently set entirely by the
 *   mdc-* CSS classes below, not inline, so there's nothing in this file to literally bind yet).
 * Not yet tokenized: "light track" has no defined colour token; the 4px linear height and 4px SVG
 * strokeWidth conceptually match primitive.spacing['1'] (4px) but aren't bound to it — SVG
 * strokeWidth takes unitless user-units, and primitive.spacing values are "4px" strings, so
 * substituting one for the other here would silently break rendering rather than help.
 */
export function ProgressIndicator({
  type = 'linear',
  variant = 'indeterminate',
  value = 0,
  label,
  size = 48,
  maxWidth = 300,
}: ProgressIndicatorProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const fraction = clamped / 100;

  if (type === 'linear') {
    const isDeterminate = variant === 'determinate';
    return (
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={isDeterminate ? fraction : undefined}
        className="mdc-linear-progress"
        style={{ maxWidth }}
      >
        <div className="mdc-linear-progress__buffer">
          <div className="mdc-linear-progress__buffer-bar" />
          <div className="mdc-linear-progress__buffer-dots" />
        </div>
        <div
          className="mdc-linear-progress__bar mdc-linear-progress__primary-bar"
          style={isDeterminate ? { transform: `scaleX(${fraction})` } : undefined}
        >
          <span className="mdc-linear-progress__bar-inner" />
        </div>
        <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span className="mdc-linear-progress__bar-inner" />
        </div>
      </div>
    );
  }

  // Circular
  const isDeterminate = variant === 'determinate';
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = isDeterminate ? circumference * (1 - fraction) : circumference / 2;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={isDeterminate ? fraction : undefined}
      className={`mdc-circular-progress${isDeterminate ? '' : ' mdc-circular-progress--indeterminate'}`}
      style={{ width: size, height: size }}
    >
      {isDeterminate ? (
        <div className="mdc-circular-progress__determinate-container">
          <svg className="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48">
            <circle
              className="mdc-circular-progress__determinate-track"
              cx="24"
              cy="24"
              r={radius}
              strokeWidth="4"
            />
            <circle
              className="mdc-circular-progress__determinate-circle"
              cx="24"
              cy="24"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeWidth="4"
            />
          </svg>
        </div>
      ) : (
        <div className="mdc-circular-progress__indeterminate-container">
          <div className="mdc-circular-progress__spinner-layer">
            <div className="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
              <svg className="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r={radius} strokeDasharray="113.097" strokeDashoffset="56.549" strokeWidth="4" />
              </svg>
            </div>
            <div className="mdc-circular-progress__gap-patch">
              <svg className="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r={radius} strokeDasharray="113.097" strokeDashoffset="56.549" strokeWidth="3.2" />
              </svg>
            </div>
            <div className="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
              <svg className="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r={radius} strokeDasharray="113.097" strokeDashoffset="56.549" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressIndicator;
