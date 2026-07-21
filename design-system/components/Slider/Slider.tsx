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

  if (isRange) {
    return (
      <div className={`mdc-slider mdc-slider--range${disabled ? ' mdc-slider--disabled' : ''}`} style={{ maxWidth: 360 }}>
        <input
          aria-label={`${label} minimum`}
          className="mdc-slider__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={from}
          disabled={disabled}
          onChange={(e) => onChange?.([Number(e.target.value), to])}
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
          onChange={(e) => onChange?.([from, Number(e.target.value)])}
        />
        <div className="mdc-slider__track">
          <div className="mdc-slider__track--inactive" />
          <div className="mdc-slider__track--active">
            <div className="mdc-slider__track--active_fill" />
          </div>
        </div>
        <div className="mdc-slider__thumb">
          <div className="mdc-slider__thumb-knob" />
        </div>
        <div className="mdc-slider__thumb">
          <div className="mdc-slider__thumb-knob" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mdc-slider${variant === 'discrete' ? ' mdc-slider--discrete' : ''}${disabled ? ' mdc-slider--disabled' : ''}`}
      style={{ maxWidth: 360 }}
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
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <div className="mdc-slider__track">
        <div className="mdc-slider__track--inactive" />
        <div className="mdc-slider__track--active">
          <div className="mdc-slider__track--active_fill" />
        </div>
      </div>
      <div className="mdc-slider__thumb">
        <div className="mdc-slider__thumb-knob" />
      </div>
    </div>
  );
}

export default Slider;
