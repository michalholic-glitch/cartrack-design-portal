import React from 'react';

export interface TabItem {
  label: string;
  /** Material icon ligature name, for "with icon" tabs. */
  icon?: string;
  /** Reinforce a tab with a count, e.g. "Alerts 3". */
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  activeIndex: number;
  onChange?: (index: number) => void;
  /** Fixed = small known set that fits the width. Scrollable = many tabs that overflow; the bar scrolls. */
  scrollable?: boolean;
}

/**
 * Tabs — MD2 (MDC) Cartrack-themed.
 * Full spec: Tabs.doc.json
 * Mirrors the mdc-tab-bar class contract from md2-cartrack-library/components/tabs.html.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main (active label + underline — set by the mdc-tab--active
 *   / mdc-tab-indicator--active CSS classes below, not inline).
 * - spacing: semantic.spacing.md (16px side padding).
 * - type: semantic.typography.scale.button (14px/500/uppercase — exact match to the label spec).
 * Not yet tokenized: 48px tab height, 2px indicator thickness, and ~90px min tab width have no
 * matching tokens.
 */
export function Tabs({ items, activeIndex, onChange, scrollable = false }: TabsProps) {
  return (
    <div className="mdc-tab-bar" role="tablist">
      <div className="mdc-tab-scroller">
        <div className="mdc-tab-scroller__scroll-area">
          <div
            className={`mdc-tab-scroller__scroll-content${scrollable ? ' mdc-tab-scroller__scroll-content--scrollable' : ''}`}
          >
            {items.map((item, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={item.label}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  className={`mdc-tab${active ? ' mdc-tab--active' : ''}`}
                  onClick={() => onChange?.(i)}
                >
                  <span className="mdc-tab__content">
                    {item.icon ? <span className="mdc-tab__icon material-icons">{item.icon}</span> : null}
                    <span className="mdc-tab__text-label">
                      {item.label}
                      {typeof item.count === 'number' ? ` ${item.count}` : ''}
                    </span>
                  </span>
                  <span className={`mdc-tab-indicator${active ? ' mdc-tab-indicator--active' : ''}`}>
                    <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline" />
                  </span>
                  <span className="mdc-tab__ripple" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tabs;
