import React, { useEffect, useRef } from 'react';

// See Badge.tsx/Card.tsx for why this reads primitive.* directly rather than semantic.* (the latter
// are mostly unresolved alias strings — safe only once a build-time token resolver exists).
import tokens from '../../tokens/tokens.json';

export interface SelectionControlProps {
  /** Checkbox = select none/some/all and apply on submit. Radio = pick exactly one from a small set. Switch = toggle a setting that takes effect immediately. */
  type: 'checkbox' | 'radio' | 'switch';
  /** What the choice means; the whole label is a click target. */
  label: string;
  /** Selected state. For switches this maps to aria-checked / mdc-switch--selected. */
  checked?: boolean;
  /** Checkbox-only: shows a dash when some-but-not-all of a group is checked. */
  indeterminate?: boolean;
  /** Required for radio groups so only one is active; also used to associate a checkbox/switch input with its id. */
  name?: string;
  id?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

/**
 * SelectionControl — MD2 (MDC) Cartrack-themed.
 * Full spec: SelectionControl.doc.json
 * Mirrors the mdc-checkbox / mdc-radio / mdc-switch class contract from
 * md2-cartrack-library/components/selection-controls.html.
 * Covers Checkbox, Radio, and Switch behind a single `type` discriminator, per the
 * combined "Selection controls" spec (Checkbox, Radio, Switch documented together).
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main (selected fill — set by the mdc-* CSS classes, not
 *   inline, so nothing to literally bind here).
 * - spacing: semantic.spacing.sm (8px switch label gap, wired below).
 * - type: semantic.typography.scale.body2 (14px/400 label).
 * Not yet tokenized: 18px control size, 40px touch target, and the 34×14/20px switch dimensions
 * have no matching tokens.
 */
export function SelectionControl({
  type,
  label,
  checked = false,
  indeterminate = false,
  name,
  id,
  disabled = false,
  onChange,
}: SelectionControlProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autoId = useRef(`sel-${Math.random().toString(36).slice(2, 9)}`);
  const controlId = id ?? autoId.current;

  useEffect(() => {
    if (type === 'checkbox' && inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [type, indeterminate]);

  if (type === 'checkbox') {
    return (
      <div className="mdc-form-field">
        <div className="mdc-checkbox">
          <input
            ref={inputRef}
            type="checkbox"
            className="mdc-checkbox__native-control"
            id={controlId}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
          />
          <div className="mdc-checkbox__background">
            <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
              <path className="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
            </svg>
            <div className="mdc-checkbox__mixedmark" />
          </div>
          <div className="mdc-checkbox__ripple" />
        </div>
        <label htmlFor={controlId}>{label}</label>
      </div>
    );
  }

  if (type === 'radio') {
    return (
      <div className="mdc-form-field">
        <div className="mdc-radio">
          <input
            type="radio"
            className="mdc-radio__native-control"
            id={controlId}
            name={name}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
          />
          <div className="mdc-radio__background">
            <div className="mdc-radio__outer-circle" />
            <div className="mdc-radio__inner-circle" />
          </div>
          <div className="mdc-radio__ripple" />
        </div>
        <label htmlFor={controlId}>{label}</label>
      </div>
    );
  }

  // switch
  return (
    <>
      <button
        id={controlId}
        className={`mdc-switch${checked ? ' mdc-switch--selected' : ' mdc-switch--unselected'}`}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
      >
        <div className="mdc-switch__track" />
        <div className="mdc-switch__handle-track">
          <div className="mdc-switch__handle">
            <div className="mdc-switch__shadow">
              <div className="mdc-elevation-overlay" />
            </div>
            <div className="mdc-switch__ripple" />
            <div className="mdc-switch__icons">
              <svg className="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24">
                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
              </svg>
              <svg className="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24">
                <path d="M20 13H4v-2h16v2z" />
              </svg>
            </div>
          </div>
        </div>
      </button>
      <label htmlFor={controlId} style={{ marginLeft: Number(tokens.primitive.spacing['2'].replace('px', '')) }}>
        {label}
      </label>
    </>
  );
}

export default SelectionControl;
