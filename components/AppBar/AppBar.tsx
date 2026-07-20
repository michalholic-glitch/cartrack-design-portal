import React from 'react';

export interface AppBarAction {
  icon: string; // material-icons ligature name, e.g. "search"
  label: string; // used as aria-label
  onClick?: () => void;
}

export interface AppBarProps {
  /** Current page/section name shown as the title. */
  title: string;
  /** Standard header actions (search, notifications, overflow, etc). Ignored while contextual. */
  actions?: AppBarAction[];
  /** Shows the nav toggle / back arrow leading element. */
  showNavigationIcon?: boolean;
  onNavigationIconClick?: () => void;
  /**
   * Contextual / selection variant — replaces the title with a selection count
   * and swaps standard actions for bulk actions.
   */
  contextual?: boolean;
  /** Number of selected items, shown in the contextual bar. */
  selectedCount?: number;
  /** Bulk actions shown only while `contextual` is true. */
  contextualActions?: AppBarAction[];
  /** Called when the contextual bar's close (✕) control is used to clear selection. */
  onCloseContextual?: () => void;
}

/**
 * AppBar — MD2 (MDC) Cartrack-themed.
 * Full spec: AppBar.doc.json
 * Mirrors the mdc-top-app-bar class contract from md2-cartrack-library/components/app-bar.html.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.{main,dark,onPrimary} for a primary-filled bar (see
 *   tokens.json's accessibility.knownIssues re: white-on-orange contrast); semantic.color.surface.paper
 *   + semantic.color.text.primary for the safer default white bar.
 * - spacing: semantic.spacing.md (16px side padding).
 * - type: semantic.typography.scale.h6 (~20px/500 title).
 * Not yet tokenized: bar height (56–64px) has no matching dimension token in tokens.json.
 */
export function AppBar({
  title,
  actions = [],
  showNavigationIcon = true,
  onNavigationIconClick,
  contextual = false,
  selectedCount = 0,
  contextualActions = [],
  onCloseContextual,
}: AppBarProps) {
  if (contextual) {
    return (
      <header className="mdc-top-app-bar" style={{ position: 'relative' }}>
        <div className="mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <button
              aria-label="Clear selection"
              className="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
              onClick={onCloseContextual}
            >
              close
            </button>
            <span className="mdc-top-app-bar__title">{selectedCount} selected</span>
          </section>
          <section
            className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
            role="toolbar"
          >
            {contextualActions.map((action) => (
              <button
                key={action.label}
                aria-label={action.label}
                className="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            ))}
          </section>
        </div>
      </header>
    );
  }

  return (
    <header className="mdc-top-app-bar" style={{ position: 'relative' }}>
      <div className="mdc-top-app-bar__row">
        <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          {showNavigationIcon && (
            <button
              aria-label="Open menu"
              className="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
              onClick={onNavigationIconClick}
            >
              menu
            </button>
          )}
          <span className="mdc-top-app-bar__title">{title}</span>
        </section>
        <section
          className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
          role="toolbar"
        >
          {actions.map((action) => (
            <button
              key={action.label}
              aria-label={action.label}
              className="material-icons mdc-top-app-bar__action-item mdc-icon-button"
              onClick={action.onClick}
            >
              {action.icon}
            </button>
          ))}
        </section>
      </div>
    </header>
  );
}

export default AppBar;
