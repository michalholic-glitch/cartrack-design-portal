import React from 'react';

export interface BannerProps {
  /** The supporting message text. */
  message: string;
  /** Severity controls tint and the live-region politeness (error is assertive). */
  severity?: 'info' | 'warning' | 'error' | 'success';
  /** Secondary (left) text action, e.g. "Dismiss". Omit for a single-action banner. */
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  /** Primary (right) text action, e.g. "Review". */
  primaryActionLabel: string;
  onPrimaryAction?: () => void;
}

/**
 * Banner — MD2 (MDC) Cartrack-themed.
 * Full spec: Banner.doc.json
 * Mirrors the mdc-banner class contract from md2-cartrack-library/components/banners.html.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.status.{success,warning,error,info} — use .light for the tinted
 *   background per severity, .onStatus (or a sufficiently dark text colour) for AA-passing message text.
 * - type: semantic.typography.scale.body2 (14px/400 message text).
 * - spacing: semantic.spacing.md (~16px padding; spec's 14px lower bound has no exact token).
 */
export function Banner({
  message,
  severity = 'warning',
  secondaryActionLabel,
  onSecondaryAction,
  primaryActionLabel,
  onPrimaryAction,
}: BannerProps) {
  return (
    <div className="mdc-banner" role="banner" data-severity={severity}>
      <div
        className="mdc-banner__content"
        role="alertdialog"
        aria-live={severity === 'error' ? 'assertive' : 'polite'}
      >
        <div className="mdc-banner__graphic-text-wrapper">
          <div className="mdc-banner__text">{message}</div>
        </div>
        <div className="mdc-banner__actions">
          {secondaryActionLabel && (
            <button
              type="button"
              className="mdc-banner__secondary-action mdc-button"
              onClick={onSecondaryAction}
            >
              <div className="mdc-button__ripple" />
              <div className="mdc-button__label">{secondaryActionLabel}</div>
            </button>
          )}
          <button
            type="button"
            className="mdc-banner__primary-action mdc-button"
            onClick={onPrimaryAction}
          >
            <div className="mdc-button__ripple" />
            <div className="mdc-button__label">{primaryActionLabel}</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
