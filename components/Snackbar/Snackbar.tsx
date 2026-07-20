import React from 'react';

export interface SnackbarProps {
  /** Message only = simple confirmation. With action = one quick follow-up (Undo, View). Error toast = brief failure notice. */
  variant?: 'message' | 'action' | 'error';
  open: boolean;
  /** One concise line of text, e.g. "Vehicle saved". */
  message: string;
  /** At most one action label, e.g. "Undo". */
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

/**
 * Snackbar — MD2 (MDC) Cartrack-themed.
 * Full spec: Snackbar.doc.json
 * Mirrors the mdc-snackbar class contract from md2-cartrack-library/components/snackbars.html.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.light (#FFA863 action colour — exact match).
 * - type: semantic.typography.scale.body2 (14px message text).
 * - color: semantic.color.surface.inverse / .onInverse (the #323232 dark surface + white text pair
 *   — added 2026-07-16 to close this exact gap, shared with Tooltip.tsx's dark background; this
 *   component's own literal spec value became the canonical inverse-surface token).
 */
export function Snackbar({ variant = 'message', open, message, actionLabel, onAction, onClose }: SnackbarProps) {
  if (!open) return null;

  return (
    <aside className={`mdc-snackbar mdc-snackbar--open${variant === 'error' ? ' mdc-snackbar--error' : ''}`}>
      <div className="mdc-snackbar__surface" role="status" aria-relevant="additions">
        <div className="mdc-snackbar__label" aria-atomic="false">
          {message}
        </div>
        <div className="mdc-snackbar__actions" aria-atomic="true">
          {actionLabel ? (
            <button type="button" className="mdc-button mdc-snackbar__action" onClick={onAction}>
              <div className="mdc-button__ripple" />
              <span className="mdc-button__label">{actionLabel}</span>
            </button>
          ) : null}
          {onClose ? (
            <button
              type="button"
              className="mdc-icon-button mdc-snackbar__dismiss material-icons"
              aria-label="Dismiss"
              onClick={onClose}
            >
              close
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export default Snackbar;
