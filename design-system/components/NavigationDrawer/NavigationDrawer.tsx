import React from 'react';

// See Badge.tsx/Card.tsx for why this reads primitive.* directly rather than semantic.* (the latter
// are mostly unresolved alias strings — safe only once a build-time token resolver exists).
import tokens from '../../tokens/tokens.json';

export interface NavigationDrawerItem {
  /** Unique key for the item. */
  id: string;
  /** Destination label (name by job, not by brand/codename). */
  label: string;
  /** Material icon name string rendered as the item's icon. */
  icon: string;
  href?: string;
  /** Optional count badge (e.g. unread alerts). */
  badge?: number | string;
  onClick?: () => void;
}

export interface NavigationDrawerSection {
  /** Optional group label (e.g. "Quick access", "Pillars", "Workflow & comms"). */
  title?: string;
  items: NavigationDrawerItem[];
}

export interface NavigationDrawerProps {
  /** Sections by purpose — the "Grouped" variant. Use this for the drawer's default grouped layout. */
  sections: NavigationDrawerSection[];
  /** The id of the currently active destination; shows the active indicator (aria-current). */
  activeId?: string;
  /**
   * Collapses the drawer to a rail (icons only, labels via tooltip) — the
   * "Collapsible" variant. Prefer the dedicated NavigationRail component for
   * a persistent icon-only strip; this flag is for the drawer's own
   * collapse/expand transition.
   */
  collapsed?: boolean;
  /** Fixed panel height; the drawer is permanent on desktop, not an overlay. */
  height?: number | string;
  /** Optional extra class names to compose with the base mdc-drawer class. */
  className?: string;
}

/**
 * NavigationDrawer — MD2 (MDC) Cartrack-themed.
 * Full spec: NavigationDrawer.doc.json
 * Mirrors the mdc-drawer / mdc-deprecated-list class contract from
 * md2-cartrack-library/components/navigation-drawer.html.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px) — the panel's own borderRadius below; note the spec
 *   never actually calls for a radius on the full-height permanent panel itself, only on the
 *   active-item pill, so this may be a copy-paste leftover worth a design review, not something
 *   this fix invented or removed.
 * - color: semantic.color.interactive.primarySelected (active-item tint, ~10%).
 * - radius: semantic.radius.pill (active indicator shape).
 * - spacing: semantic.spacing.md (16px icon→label gap).
 * - type: semantic.typography.scale.subtitle2 (14px/500 item text — exact match).
 * Not yet tokenized: ~240–256px width, 48px item height, 24px icon size have no matching tokens.
 */
export function NavigationDrawer({
  sections,
  activeId,
  collapsed = false,
  height,
  className,
}: NavigationDrawerProps) {
  return (
    <aside
      className={['mdc-drawer', className].filter(Boolean).join(' ')}
      style={{ position: 'relative', height, borderRadius: tokens.primitive.radius.sm }}
      data-collapsed={collapsed || undefined}
    >
      <div className="mdc-drawer__content">
        {sections.map((section, idx) => (
          <nav
            className="mdc-deprecated-list"
            aria-label={section.title ?? 'Navigation'}
            key={section.title ?? idx}
          >
            {section.title && !collapsed ? (
              <h3 className="mdc-deprecated-list-group__subheader">{section.title}</h3>
            ) : null}
            {section.items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <a
                  key={item.id}
                  className={[
                    'mdc-deprecated-list-item',
                    isActive ? 'mdc-deprecated-list-item--activated' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  href={item.href ?? '#'}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                  onClick={
                    item.onClick
                      ? (e) => {
                          e.preventDefault();
                          item.onClick?.();
                        }
                      : undefined
                  }
                >
                  <span className="mdc-deprecated-list-item__ripple" />
                  <i className="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">
                    {item.icon}
                  </i>
                  {!collapsed ? (
                    <span className="mdc-deprecated-list-item__text">{item.label}</span>
                  ) : (
                    <span className="mdc-visually-hidden">{item.label}</span>
                  )}
                  {item.badge !== undefined && !collapsed ? (
                    <span className="mdc-deprecated-list-item__meta">{item.badge}</span>
                  ) : null}
                </a>
              );
            })}
          </nav>
        ))}
      </div>
    </aside>
  );
}

export default NavigationDrawer;
