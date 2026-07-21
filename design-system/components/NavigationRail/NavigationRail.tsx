import React from 'react';

export interface NavigationRailItem {
  /** Unique key for the item. */
  id: string;
  /** Accessible name — required even when icon-only. */
  label: string;
  /** Emoji or icon glyph rendered above/before the label. */
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface NavigationRailProps {
  /**
   * The rail's destinations. Must mirror the NavigationDrawer's destinations
   * exactly — the rail is the drawer's collapsed form, not a second nav.
   */
  items: NavigationRailItem[];
  /** The id of the currently active destination. */
  activeId?: string;
  /**
   * Labelled (icon + short label, recommended for clarity) vs Icon-only
   * (maximum density; labels via tooltip on hover) per the spec's Variants.
   */
  showLabels?: boolean;
  /**
   * Renders an expand control that toggles the rail into the full
   * NavigationDrawer and back (the "Expandable" variant).
   */
  onExpand?: () => void;
  /** Optional extra class names to compose with the base `rail` class. */
  className?: string;
}

/**
 * NavigationRail — MD2 (MDC) Cartrack-themed.
 * Full spec: NavigationRail.doc.json
 *
 * NOTE: The navigation rail is a Material 3 concept that MDC Web (v14) does
 * not ship as a stock component. The live Cartrack library
 * (md2-cartrack-library/components/navigation-rail.html) builds it as a
 * custom narrow strip using the `rail` / `it` classes, which this component
 * mirrors.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main (active item, per the spec's "Item active: Primary
 *   icon/label" state).
 * - spacing: semantic.spacing.xxl (48px) matches the spec's "≥48px" item target exactly.
 * - type: semantic.typography.scale.labelSmall (12px/500 — added 2026-07-16 to close this exact
 *   gap, shared with Badge and Chip).
 * Not yet tokenized: the 72–80px rail width and 24px icon size have no matching tokens.
 */
export function NavigationRail({
  items,
  activeId,
  showLabels = true,
  onExpand,
  className,
}: NavigationRailProps) {
  return (
    <nav
      className={['rail', className].filter(Boolean).join(' ')}
      aria-label="Primary"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <a
            key={item.id}
            className={['it', isActive ? 'on' : null].filter(Boolean).join(' ')}
            href={item.href ?? '#'}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            title={!showLabels ? item.label : undefined}
            onClick={
              item.onClick
                ? (e) => {
                    e.preventDefault();
                    item.onClick?.();
                  }
                : undefined
            }
          >
            <span style={{ fontSize: '1.2rem' }} aria-hidden="true">
              {item.icon}
            </span>
            {showLabels ? item.label : null}
          </a>
        );
      })}
      {onExpand ? (
        <button type="button" className="it" onClick={onExpand} aria-label="Expand navigation">
          <span style={{ fontSize: '1.2rem' }} aria-hidden="true">
            »
          </span>
          {showLabels ? 'Expand' : null}
        </button>
      ) : null}
    </nav>
  );
}

export default NavigationRail;
