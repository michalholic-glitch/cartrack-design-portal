import React from 'react';

// NOTE: this previously referenced `var(--error)`, a CSS custom property that isn't defined
// anywhere in this repo — a dead reference. tokens.json is the real source now; semantic.color.status.error.main
// is an alias string ("{primitive.color.status.error.500}") meant for a build-time resolver this repo
// doesn't have yet, so we read the concrete literal from primitive.* directly. Requires resolveJsonModule.
import tokens from '../../tokens/tokens.json';

export interface DialogProps {
  open: boolean;
  /** Short, specific question or task name (e.g. "Remove vehicle?"), not a generic title. */
  title: string;
  /** Supporting text and/or fields. */
  content: React.ReactNode;
  /** Right-aligned, rendered last. Verb-first label (e.g. "Remove"), not "OK". */
  confirmLabel: string;
  onConfirm?: () => void;
  /** Left-aligned dismiss action. */
  cancelLabel?: string;
  onCancel?: () => void;
  /**
   * Destructive confirms use the error colour and clear labels ("Remove", not "OK").
   * Also disables scrim/Escape dismissal so an unsaved destructive action isn't lost silently.
   */
  destructive?: boolean;
  /** Called on Escape / scrim click for non-destructive dialogs. Defaults to onCancel. */
  onClose?: () => void;
}

/**
 * Dialog — MD2 (MDC) Cartrack-themed.
 * Full spec: Dialog.doc.json
 * Mirrors the mdc-dialog class contract from md2-cartrack-library/components/dialogs.html.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px).
 * - color: semantic.color.status.error.main (destructive confirm — was a dead `var(--error)`
 *   reference before this fix; see the import note below).
 * - type: semantic.typography.scale.h6 (~20px/500 title — exact match).
 * Not yet tokenized: dialog width (~320–560px) and elevation have no matching tokens.
 */
export function Dialog({
  open,
  title,
  content,
  confirmLabel,
  onConfirm,
  cancelLabel = 'Cancel',
  onCancel,
  destructive = false,
  onClose,
}: DialogProps) {
  if (!open) return null;

  const handleScrimClick = () => {
    if (!destructive) (onClose ?? onCancel)?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !destructive) (onClose ?? onCancel)?.();
  };

  return (
    <div className="mdc-dialog mdc-dialog--open" onKeyDown={handleKeyDown}>
      <div className="mdc-dialog__container">
        <div
          className="mdc-dialog__surface"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="mdc-dialog-title"
          aria-describedby="mdc-dialog-content"
        >
          <h2 className="mdc-dialog__title" id="mdc-dialog-title">
            {title}
          </h2>
          <div className="mdc-dialog__content" id="mdc-dialog-content">
            {content}
          </div>
          <div className="mdc-dialog__actions">
            <button
              className="mdc-button mdc-dialog__button"
              data-mdc-dialog-action="cancel"
              onClick={onCancel}
            >
              <span className="mdc-button__ripple" />
              <span className="mdc-button__label">{cancelLabel}</span>
            </button>
            <button
              className="mdc-button mdc-dialog__button"
              data-mdc-dialog-action="accept"
              style={destructive ? { color: tokens.primitive.color.status.error['500'] } : undefined}
              onClick={onConfirm}
            >
              <span className="mdc-button__ripple" />
              <span className="mdc-button__label">{confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mdc-dialog__scrim" onClick={handleScrimClick} />
    </div>
  );
}

export default Dialog;
