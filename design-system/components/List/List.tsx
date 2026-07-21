import React from 'react';

export interface ListItemData {
  /** Unique key for the row. */
  id: string;
  /** The title / primary line. */
  primaryText: string;
  /** Supporting detail line (Two-line variant). */
  secondaryText?: string;
  /** A second line of context (Three-line variant). */
  tertiaryText?: string;
  /** Avatar, icon, or checkbox rendered before the text ("With controls" variant). */
  leading?: React.ReactNode;
  /** A meta value, action, or overflow control rendered after the text. */
  trailing?: React.ReactNode;
  /** Selected row — shows the primary tint. */
  selected?: boolean;
  /** Disabled row — shows at 38% opacity and isn't interactive. */
  disabled?: boolean;
  /** Makes the row a clickable/activatable target (navigates or opens detail). */
  onClick?: () => void;
}

export interface ListProps {
  /** The records rendered as list items. */
  items: ListItemData[];
  /**
   * Single-line / two-line / three-line per the spec's Variants table.
   * Two-line is the most common and is the default.
   */
  lines?: 1 | 2 | 3;
  /** Optional group label rendered above the list (Subheader / divider anatomy). */
  subheader?: string;
  /** Optional extra class names to compose with the base mdc-deprecated-list class. */
  className?: string;
}

const LINE_MODIFIER: Record<1 | 2 | 3, string | null> = {
  1: null,
  2: 'mdc-deprecated-list--two-line',
  3: 'mdc-deprecated-list--two-line',
};

/**
 * List — MD2 (MDC) Cartrack-themed.
 * Full spec: List.doc.json
 * Mirrors the mdc-deprecated-list / mdc-deprecated-list-item class contract
 * from md2-cartrack-library/components/lists.html.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.primary (primary line), semantic.color.text.secondary
 *   (secondary/tertiary line, "on-surface-medium").
 * - spacing: semantic.spacing.md (16px side padding and leading-element gap).
 * - type: semantic.typography.scale.body2 (14px/400 — the spec's "14–16px" primary text range
 *   only has an exact match at its low end; 16px/400 is body1 if a row needs the larger size).
 * Not yet tokenized: row heights (48/64/88px) have no matching dimension tokens.
 */
export function List({ items, lines = 2, subheader, className }: ListProps) {
  const lineClass = LINE_MODIFIER[lines];

  return (
    <>
      {subheader ? <h3 className="mdc-deprecated-list-group__subheader">{subheader}</h3> : null}
      <ul
        className={['mdc-deprecated-list', lineClass, className].filter(Boolean).join(' ')}
        role="list"
      >
        {items.map((item) => {
          const interactive = Boolean(item.onClick) && !item.disabled;
          return (
            <li
              key={item.id}
              className={[
                'mdc-deprecated-list-item',
                item.selected ? 'mdc-deprecated-list-item--selected' : null,
                item.disabled ? 'mdc-deprecated-list-item--disabled' : null,
              ]
                .filter(Boolean)
                .join(' ')}
              tabIndex={interactive ? 0 : undefined}
              aria-disabled={item.disabled || undefined}
              aria-selected={item.selected || undefined}
              onClick={interactive ? item.onClick : undefined}
              onKeyDown={
                interactive
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.onClick?.();
                      }
                    }
                  : undefined
              }
            >
              <span className="mdc-deprecated-list-item__ripple" />
              {item.leading ? (
                <span className="mdc-deprecated-list-item__graphic">{item.leading}</span>
              ) : null}
              <span className="mdc-deprecated-list-item__text">
                <span className="mdc-deprecated-list-item__primary-text">{item.primaryText}</span>
                {lines >= 2 && item.secondaryText ? (
                  <span className="mdc-deprecated-list-item__secondary-text">{item.secondaryText}</span>
                ) : null}
                {lines >= 3 && item.tertiaryText ? (
                  <span className="mdc-deprecated-list-item__secondary-text">{item.tertiaryText}</span>
                ) : null}
              </span>
              {item.trailing ? (
                <span className="mdc-deprecated-list-item__meta">{item.trailing}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default List;
