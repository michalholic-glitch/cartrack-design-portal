import React from 'react';

// See Badge.tsx/Card.tsx for why this reads primitive.* directly rather than semantic.* (the latter
// are mostly unresolved alias strings — safe only once a build-time token resolver exists).
import tokens from '../../tokens/tokens.json';

export interface DividerProps {
  /**
   * Full-width — separate major sections edge to edge.
   * Inset — between list items, aligned past the leading element.
   * Middle — indented on both sides for a lighter separation.
   * Vertical — separate inline items in a toolbar.
   */
  variant?: 'full-width' | 'inset' | 'middle' | 'vertical';
  /** Optional extra class names to compose with the base `divider` class. */
  className?: string;
}

/**
 * Divider — MD2 (MDC) Cartrack-themed.
 * Full spec: Divider.doc.json
 *
 * NOTE: MDC Web has no dedicated standalone divider component — it only ships
 * a list divider (`mdc-deprecated-list-divider`). The live Cartrack library
 * (md2-cartrack-library/components/dividers.html) draws a 1px rule using the
 * `divider` class and the divider colour token, which is what this component
 * mirrors.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.border.default — literally the same rgba(0,0,0,.12) value the spec calls out.
 * - spacing: semantic.spacing.md (16px inset).
 * - borderWidth: semantic.borderWidth.hairline (1px — added 2026-07-16 to close this exact gap;
 *   split out from spacing rather than crammed into the 4px grid, see tokens.json's note).
 * Not yet tokenized: the 72px "past an avatar" inset is component-specific, not systemic.
 */
export function Divider({ variant = 'full-width', className }: DividerProps) {
  const classes = ['divider', className].filter(Boolean).join(' ');

  if (variant === 'vertical') {
    // Vertical rule to separate inline items in a toolbar.
    return (
      <div
        className={classes}
        role="separator"
        aria-orientation="vertical"
        style={{ width: tokens.primitive.borderWidth.hairline, height: '100%', marginLeft: 0, marginRight: 0 }}
      />
    );
  }

  const inset = Number(tokens.primitive.spacing['4'].replace('px', ''));
  const style: React.CSSProperties = {
    marginLeft: variant === 'full-width' ? 0 : inset,
    marginRight: variant === 'middle' ? inset : 0,
  };

  return <div className={classes} role="separator" style={style} />;
}

export default Divider;
