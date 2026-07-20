import React from 'react';

// NOTE: semantic.* paths in tokens.json are alias strings (e.g. "{primitive.spacing.2}") meant to
// be resolved by a build-time token pipeline, not consumed directly at runtime. Since this repo has
// no such pipeline yet (no tsconfig/bundler), inline styles below read primitive.* concrete values
// instead — switch to semantic.spacing.sm once a resolver exists. Requires resolveJsonModule.
import tokens from '../../tokens/tokens.json';

export interface BadgeProps {
  /** The host element (icon/button) the badge is anchored to. */
  children: React.ReactNode;
  /** Accessible label for the host, e.g. "Notifications". Badge meaning is appended automatically. */
  hostLabel: string;
  /**
   * Numeric count. Omit (or pass 0 with showZero=false) to render a dot-only badge.
   * Counts above 99 are capped and rendered as "99+".
   */
  count?: number;
  /** Renders a dot badge (no number) instead of a numeric pill. */
  dot?: boolean;
  /** Show the badge even when count is 0. Default false — badge hides at zero. */
  showZero?: boolean;
}

/**
 * Badge — MD2 (MDC) Cartrack-themed.
 * Full spec: Badge.doc.json
 * NOTE: MDC Web 14.0.0 has no stock badge component (see md2-cartrack-library/components/badges.html).
 * This mirrors the Cartrack-styled custom approximation from that file: `.badge` host wrapper,
 * `.icb` icon button, and `.d` count/dot element — not a real mdc-* class.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.status.error.{main,onStatus} (error-colour pill, white text — passes AA).
 * - spacing: semantic.spacing.sm (8px) sizes the dot variant below.
 * - type: semantic.typography.scale.labelSmall (12px/500 — added 2026-07-16 to close this exact
 *   gap; note its caveat before using it as a real MUI `variant` prop, it isn't one yet).
 */
export function Badge({ children, hostLabel, count, dot = false, showZero = false }: BadgeProps) {
  const hasCount = typeof count === 'number';
  const visible = dot ? hasCount ? count! > 0 || showZero : true : hasCount ? count! > 0 || showZero : false;
  const displayValue = hasCount ? (count! > 99 ? '99+' : String(count)) : '';
  const accessibleSuffix = dot
    ? visible
      ? ', has notification'
      : ''
    : visible
    ? `, ${displayValue} unread`
    : '';

  return (
    <span className="badge">
      <button className="icb" aria-label={`${hostLabel}${accessibleSuffix}`}>
        {children}
      </button>
      {visible && (
        <span
          className="d"
          style={dot ? { minWidth: tokens.primitive.spacing['2'], height: tokens.primitive.spacing['2'], padding: 0 } : undefined}
          aria-hidden="true"
        >
          {dot ? '' : displayValue}
        </span>
      )}
    </span>
  );
}

export default Badge;
