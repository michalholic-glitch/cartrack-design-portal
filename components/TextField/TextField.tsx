import React, { useId } from 'react';

export interface TextFieldProps {
  /** Filled suits dense, settings-style lists; outlined is the Cartrack portal's default for forms. */
  variant?: 'filled' | 'outlined';
  label: string;
  value: string;
  onChange?: (value: string) => void;
  /** Helper text below the field; replaced by the error message when error is set. */
  helperText?: string;
  /** Concise, specific error text (e.g. "Enter a value", not "Invalid"). Also flips the field into the error state. */
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Underlying input type for single-line fields; ignored when multiline is true. */
  type?: 'text' | 'password' | 'search' | 'number';
  /** Leading Material icon ligature, e.g. "search". */
  leadingIcon?: string;
  /** Trailing Material icon ligature, e.g. "clear" or a unit like "km". */
  trailingIcon?: string;
  /** Renders a textarea that grows with content instead of a single-line input. */
  multiline?: boolean;
  rows?: number;
}

/**
 * TextField — MD2 (MDC) Cartrack-themed.
 * Full spec: TextField.doc.json
 * Mirrors the mdc-text-field class contract from md2-cartrack-library/components/text-fields.html.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px).
 * - color: semantic.color.brand.primary.dark (focus border/line — .dark, not .main, keeps the
 *   line legible on white per the spec's own note), semantic.color.status.error.main (error state).
 * - type: semantic.typography.scale.body1 (16px/400 input text), semantic.typography.scale.caption
 *   (12px supporting text and floated label — exact matches).
 * Not yet tokenized: ~56px field height and the label's resting size (16px, matching body1) have
 * no dedicated tokens beyond what's already listed.
 */
export function TextField({
  variant = 'outlined',
  label,
  value,
  onChange,
  helperText,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  type = 'text',
  leadingIcon,
  trailingIcon,
  multiline = false,
  rows = 3,
}: TextFieldProps) {
  const labelId = useId();
  const supportingId = useId();
  const isFilled = variant === 'filled';
  const hasError = Boolean(error);

  const fieldClass = [
    'mdc-text-field',
    isFilled ? 'mdc-text-field--filled' : 'mdc-text-field--outlined',
    multiline ? 'mdc-text-field--textarea' : '',
    leadingIcon ? 'mdc-text-field--with-leading-icon' : '',
    trailingIcon ? 'mdc-text-field--with-trailing-icon' : '',
    disabled ? 'mdc-text-field--disabled' : '',
    hasError ? 'mdc-text-field--invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inputProps = {
    className: 'mdc-text-field__input',
    'aria-labelledby': labelId,
    'aria-describedby': helperText || error ? supportingId : undefined,
    'aria-required': required || undefined,
    'aria-invalid': hasError || undefined,
    value,
    disabled,
    readOnly,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value),
  };

  return (
    <div>
      <label className={fieldClass}>
        {isFilled ? <span className="mdc-text-field__ripple" /> : null}
        {leadingIcon ? (
          <span className="mdc-text-field__icon mdc-text-field__icon--leading material-icons">{leadingIcon}</span>
        ) : null}

        {isFilled ? (
          <span className="mdc-floating-label" id={labelId}>
            {label}
          </span>
        ) : (
          <span className="mdc-notched-outline">
            <span className="mdc-notched-outline__leading" />
            <span className="mdc-notched-outline__notch">
              <span className="mdc-floating-label" id={labelId}>
                {label}
              </span>
            </span>
            <span className="mdc-notched-outline__trailing" />
          </span>
        )}

        {multiline ? (
          <textarea rows={rows} {...inputProps} />
        ) : (
          <input type={type} {...inputProps} />
        )}

        {trailingIcon ? (
          <span className="mdc-text-field__icon mdc-text-field__icon--trailing material-icons">{trailingIcon}</span>
        ) : null}

        {isFilled ? <span className="mdc-line-ripple" /> : null}
      </label>

      {helperText || error ? (
        <div className="mdc-text-field-helper-line">
          <div
            id={supportingId}
            className={`mdc-text-field-helper-text${hasError ? ' mdc-text-field-helper-text--validation-msg' : ''}`}
          >
            {error ?? helperText}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TextField;
