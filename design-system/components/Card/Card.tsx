import React from 'react';

// NOTE: most semantic.* entries in tokens.json are alias strings (e.g. "{primitive.color.brand.orange.500}")
// meant for a build-time token resolver this repo doesn't have yet — using them directly as a style value
// would literally set the CSS property to that placeholder text. semantic.color.text.* / .border.default /
// .interactive.* happen to be written as real literals already and ARE safe to use directly; everything
// else below falls back to primitive.* (always a concrete literal). Once a resolver exists, drop the
// primitive.* fallbacks in favor of semantic.* throughout. Requires resolveJsonModule.
import tokens from '../../tokens/tokens.json';

export interface CardAction {
  label: string;
  onClick?: () => void;
}

export interface CardProps {
  /** Card title, rendered as a heading. */
  title: string;
  /** Optional subtitle line under the title (e.g. "Jane Cooper · Active"). */
  subtitle?: string;
  /** Supporting text, KPIs, or a small table — kept to a single subject. */
  content?: React.ReactNode;
  /** Optional media/image/map thumbnail region above the header. */
  media?: React.ReactNode;
  /** Outlined removes the elevation shadow in favor of a divider border. Elevated is the default. */
  variant?: 'elevated' | 'outlined';
  /** Row of low-emphasis actions (usually text buttons). */
  actions?: CardAction[];
  /** Makes the whole card a single clickable target that navigates to detail. */
  actionable?: boolean;
  onClick?: () => void;
}

/**
 * Card — MD2 (MDC) Cartrack-themed.
 * Full spec: Card.doc.json
 * Mirrors the mdc-card class contract from md2-cartrack-library/components/cards.html.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.card (4px).
 * - spacing: semantic.spacing.md (16px content padding), semantic.spacing.sm (8px title→subtitle gap).
 * - color: semantic.color.text.secondary (subtitle/content, "on-surface-medium").
 * - type: semantic.typography.scale.titleMedium (16px/500 — added 2026-07-16 to close this exact
 *   gap; its fontSize is a plain literal so it's safe to read directly, unlike most semantic.*
 *   color/spacing paths elsewhere in this file which need the primitive.* fallback).
 */
export function Card({
  title,
  subtitle,
  content,
  media,
  variant = 'elevated',
  actions = [],
  actionable = false,
  onClick,
}: CardProps) {
  const cardClass = ['mdc-card', variant === 'outlined' ? 'mdc-card--outlined' : ''].filter(Boolean).join(' ');

  const inner = (
    <>
      {media && <div className="mdc-card__media mdc-card__media--16-9">{media}</div>}
      <div style={{ padding: tokens.primitive.spacing['4'] }}>
        <div
          style={{
            fontSize: tokens.semantic.typography.scale.titleMedium.fontSize,
            fontWeight: tokens.primitive.fontWeight.medium,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              color: tokens.semantic.color.text.secondary,
              fontSize: '.85rem',
              marginBottom: tokens.primitive.spacing['2'],
            }}
          >
            {subtitle}
          </div>
        )}
        {content && (
          <div style={{ color: tokens.semantic.color.text.secondary, fontSize: '.86rem' }}>{content}</div>
        )}
      </div>
      {actions.length > 0 && (
        <div className="mdc-card__actions">
          {actions.map((action) => (
            <button
              key={action.label}
              className="mdc-button mdc-card__action"
              onClick={action.onClick}
            >
              <span className="mdc-button__ripple" />
              <span className="mdc-button__label">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );

  if (actionable) {
    return (
      <div
        className={cardClass}
        role="link"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick?.();
        }}
        aria-label={title}
      >
        {inner}
      </div>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}

export default Card;
