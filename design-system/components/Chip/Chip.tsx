import React from 'react';

export interface ChipProps {
  /** The value or option text. Keep labels short. */
  label: string;
  /**
   * input = discrete entered value (usually removable). filter = toggles a list filter.
   * choice = single selection from a small inline set. action = triggers a contextual action.
   * status = read-only record status with a consistent colour mapping (Active/Idle/Offline).
   */
  variant?: 'input' | 'filter' | 'choice' | 'action' | 'status';
  /** Toggled/selected state for filter and choice chips. */
  selected?: boolean;
  /** Status colour mapping — only meaningful when variant="status". */
  status?: 'success' | 'warning' | 'error';
  /** Shows a trailing remove (×) control — typically used on input chips. */
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Chip — MD2 (MDC) Cartrack-themed.
 * Full spec: Chip.doc.json
 * Mirrors the mdc-evolution-chip class contract from md2-cartrack-library/components/chips.html.
 * Status chips (read-only) reuse the same evolution-chip shell but are not interactive.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.chip (16px pill — matches the spec's "pill" corner radius exactly).
 * - spacing: semantic.spacing.sm (8px icon gap; the spec's 12px side padding has no exact token).
 * - color: semantic.color.interactive.primarySelected (selected tint, ~10% — matches the spec's
 *   "primary at ~10%" and DataTable's equivalent "--selected" reference almost exactly).
 * - type: semantic.typography.scale.body2 (14px/400 label).
 * - type: semantic.typography.scale.labelSmall (12px/500 status-chip label — added 2026-07-16 to
 *   close this exact gap, shared with Badge and NavigationRail).
 */
export function Chip({
  label,
  variant = 'action',
  selected = false,
  status,
  removable = false,
  onRemove,
  onClick,
  disabled = false,
}: ChipProps) {
  if (variant === 'status') {
    return (
      <span
        className="mdc-evolution-chip mdc-evolution-chip--status"
        data-status={status ?? 'success'}
        role="status"
      >
        <span className="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary">
          <span className="mdc-evolution-chip__text-label">{label}</span>
        </span>
      </span>
    );
  }

  return (
    <span
      className={[
        'mdc-evolution-chip',
        variant === 'filter' ? 'mdc-evolution-chip--filter' : '',
        // MDC's own selected modifier — part of the evolution-chip class contract this
        // component mirrors; the Cartrack selected tint binds to it (see Chip.doc.json tokens).
        selected ? 'mdc-evolution-chip--selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="row"
      aria-selected={variant === 'filter' || variant === 'choice' ? selected : undefined}
    >
      <span className="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
        <button
          className="mdc-evolution-chip__action mdc-evolution-chip__action--primary"
          type="button"
          disabled={disabled}
          onClick={onClick}
          aria-pressed={variant === 'filter' || variant === 'choice' ? selected : undefined}
        >
          <span className="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary" />
          {selected && <span className="mdc-evolution-chip__checkmark" aria-hidden="true">✓</span>}
          <span className="mdc-evolution-chip__text-label">{label}</span>
        </button>
      </span>
      {removable && (
        <span className="mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing" role="gridcell">
          <button
            className="mdc-evolution-chip__action mdc-evolution-chip__action--trailing"
            type="button"
            aria-label={`Remove ${label}`}
            onClick={onRemove}
          >
            <span className="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--trailing" />
            ×
          </button>
        </span>
      )}
    </span>
  );
}

export default Chip;
