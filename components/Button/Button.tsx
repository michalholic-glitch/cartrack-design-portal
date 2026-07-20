import React from 'react';

export interface ButtonProps {
  /** Short, verb-first action label (e.g. "Add vehicle"). Rendered uppercase per MD2. */
  label: string;
  /**
   * Contained = single primary action per view (mdc-button--raised in the MDC markup).
   * Outlined = important secondary actions. Text = low-emphasis actions.
   */
  variant?: 'contained' | 'outlined' | 'text';
  /** Optional leading icon (material-icons ligature name). Keep the label even with an icon. */
  leadingIcon?: string;
  disabled?: boolean;
  /** Disables the button and shows a spinner in place of the label for async actions. */
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

/**
 * Button — MD2 (MDC) Cartrack-themed.
 * Full spec: Button.doc.json
 * Mirrors the mdc-button class contract from md2-cartrack-library/components/buttons.html.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.{main,dark,onPrimary} — contained fill/label; use .dark
 *   (not .main) where white text must pass WCAG AA (see tokens.json's accessibility.knownIssues).
 * - radius: semantic.radius.button (4px).
 * - spacing: semantic.spacing.md (16px sides), semantic.spacing.sm (8px, text-button sides).
 * - type: semantic.typography.scale.button (14px/500, uppercase — matches the label spec exactly).
 * Not yet tokenized: 36px button height has no matching dimension token.
 */
export function Button({
  label,
  variant = 'contained',
  leadingIcon,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const variantClass =
    variant === 'contained' ? 'mdc-button--raised' : variant === 'outlined' ? 'mdc-button--outlined' : '';

  return (
    <button
      type={type}
      className={['mdc-button', variantClass].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading || undefined}
    >
      <span className="mdc-button__ripple" />
      {leadingIcon && !loading && (
        <i className="material-icons mdc-button__icon" aria-hidden="true">
          {leadingIcon}
        </i>
      )}
      {loading && <span className="mdc-button__icon mdc-circular-progress" aria-hidden="true" />}
      <span className="mdc-button__label">{label}</span>
    </button>
  );
}

export default Button;
