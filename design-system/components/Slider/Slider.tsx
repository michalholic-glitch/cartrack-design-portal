import React from 'react';

export interface SliderProps {
  /** Continuous = any value across the range. Discrete = snaps to steps with tick marks. Range = two thumbs (from–to). */
  variant?: 'continuous' | 'discrete' | 'range';
  /** Accessible label, e.g. "Radius". */
  label: string;
  /** Single value for continuous/discrete; [from, to] for range. */
  value: number | [number, number];
  min?: number;
  max?: number;
  /** Step size; only meaningful for the 'discrete' variant. */
  step?: number;
  disabled?: boolean;
  onChange?: (value: number | [number, number]) => void;
}

/**
 * Slider — MD2 (MDC) Cartrack-themed.
 * Full spec: Slider.doc.json
 * Mirrors the mdc-slider class contract from md2-cartrack-library/components/sliders.html.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main (active track/thumb — set by the mdc-* CSS classes
 *   below, not inline, so nothing here to literally bind yet).
 * - borderWidth: semantic.borderWidth.thin (2px inactive track — added 2026-07-16 to close this
 *   exact gap; set by the mdc-slider__track CSS classes below, not inline).
 * Not yet tokenized: ~12–14px thumb size and ≥40px hit target have no matching tokens.
 */
export function Slider({
  variant = 'continuous',
  label,
  value,
  min = 0,
  max = 100,
  step,
  disabled = false,
  onChange,
}: SliderProps) {
  const isRange = variant === 'range' && Array.isArray(value);
  const [from, to] = isRange ? (value as [number, number]) : [0, 0];
  const single = !isRange ? (value as number) : 0;

  // MDC's slider foundation (JS) normally sizes the root and positions the
  // thumb/active fill at runtime. This repo ships no MDC JS, so the component
  // does that positioning itself from `value` — same JS-less pattern as
  // ProgressIndicator's inline scaleX. Without these inline styles the root
  // collapses to 0px and the thumb sits at the left edge regardless of value.
  const span = Math.max(1, max - min);
  const frac = (v: number) => Math.min(1, Math.max(0, (v - min) / span));
  const rootStyle: React.CSSProperties = { width: '100%', maxWidth: 360, minWidth: 200 };
  const thumbStyle = (v: number): React.CSSProperties => ({ left: `calc(${frac(v) * 100}% - 24px)` });
  // translateX(%) is relative to the fill's own (full-track) width, so
  // translateX(f1) + scaleX(f2-f1) about the left origin spans exactly [f1, f2].
  const fillStyle: React.CSSProperties = isRange
    ? { transform: `translateX(${frac(from) * 100}%) scaleX(${Math.max(0, frac(to) - frac(from))})` }
    : { transform: `scaleX(${frac(single)})` };
  // MDC JS also owns pointer handling and hides the native inputs (0×0);
  // restore native interaction by stretching the inputs over the control.
  // (For range, the supplement stylesheet limits pointer events to the thumbs
  // so the two overlapping inputs don't block each other.)
  const inputStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    opacity: 0,
    pointerEvents: disabled ? 'none' : 'auto',
    cursor: disabled ? 'default' : 'pointer',
  };

  if (isRange) {
    return (
      <div className={`mdc-slider mdc-slider--range${disabled ? ' mdc-slider--disabled' : ''}`} style={rootStyle}>
        <input
          aria-label={`${label} minimum`}
          className="mdc-slider__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={from}
          disabled={disabled}
          style={inputStyle}
          onChange={(e) => onChange?.([Math.min(Number(e.target.value), to), to])}
        />
        <input
          aria-label={`${label} maximum`}
          className="mdc-slider__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={to}
          disabled={disabled}
          style={inputStyle}
          onChange={(e) => onChange?.([from, Math.max(Number(e.target.value), from)])}
        />
        <div className="mdc-slider__track">
          <div className="mdc-slider__track--inactive" />
          <div className="mdc-slider__track--active">
            <div className="mdc-slider__track--active_fill" style={fillStyle} />
          </div>
        </div>
        <div className="mdc-slider__thumb" style={thumbStyle(from)}>
          <div className="mdc-slider__thumb-knob" />
        </div>
        <div className="mdc-slider__thumb" style={thumbStyle(to)}>
          <div className="mdc-slider__thumb-knob" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mdc-slider${variant === 'discrete' ? ' mdc-slider--discrete' : ''}${disabled ? ' mdc-slider--disabled' : ''}`}
      style={rootStyle}
    >
      <input
        aria-label={label}
        className="mdc-slider__input"
        type="range"
        min={min}
        max={max}
        step={step}
        name={label}
        value={single}
        disabled={disabled}
        style={inputStyle}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <div className="mdc-slider__track">
        <div className="mdc-slider__track--inactive" />
        <div className="mdc-slider__track--active">
          <div className="mdc-slider__track--active_fill" style={fillStyle} />
        </div>
      </div>
      <div className="mdc-slider__thumb" style={thumbStyle(single)}>
        <div className="mdc-slider__thumb-knob" />
      </div>
    </div>
  );
}

export default Slider;
