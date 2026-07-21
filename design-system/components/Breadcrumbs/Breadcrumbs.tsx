import React from 'react';

export interface BreadcrumbItem {
  label: string;
  /** Omit href on the current (last) page — it renders as plain text, not a link. */
  href?: string;
}

export interface BreadcrumbsProps {
  /** Full ancestor path, ending with the current page. */
  items: BreadcrumbItem[];
  /** Separator glyph between crumbs (decorative, hidden from assistive tech). */
  separator?: string;
  /**
   * Collapse middle levels behind "…" for deep paths. When set, only the first
   * and last `maxVisible - 1` items render, with a "…" placeholder in between.
   */
  maxVisible?: number;
}

/**
 * Breadcrumbs — MD2 (MDC) Cartrack-themed.
 * Full spec: Breadcrumbs.doc.json
 * NOTE: MDC Web has no stock breadcrumbs component (see md2-cartrack-library/components/breadcrumbs.html).
 * This mirrors the Cartrack-styled custom approximation from that file: `.crumbsnav` container
 * and `.s` separator — not a real mdc-* class.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.secondary (link, "on-surface-medium"), semantic.color.brand.primary.dark
 *   (hover — matches Button's AA-safe hover treatment, not the raw primary.main orange).
 * - spacing: semantic.spacing.sm (~8px separator spacing each side).
 * - type: semantic.typography.scale.body2 (14px/400).
 */
export function Breadcrumbs({ items, separator = '›', maxVisible }: BreadcrumbsProps) {
  const collapsed =
    maxVisible && items.length > maxVisible
      ? [items[0], { label: '…' } as BreadcrumbItem, ...items.slice(items.length - (maxVisible - 1))]
      : items;

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className="crumbsnav"
        style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}
      >
        {collapsed.map((item, index) => {
          const isLast = index === collapsed.length - 1;
          return (
            <li key={`${item.label}-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
              {!isLast && (
                <span className="s" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
