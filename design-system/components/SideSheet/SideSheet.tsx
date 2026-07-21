import React from 'react';

export interface SideSheetNavItem {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SideSheetProps {
  /** Standard pushes/reflows content and can stay docked; modal sits over a scrim and traps focus. */
  variant?: 'standard' | 'modal';
  open?: boolean;
  /** The subject/title shown in the header, e.g. a registration number. */
  title: string;
  /** Optional secondary line, e.g. driver name + status. */
  subtitle?: string;
  /** Content nav/list — mirrors mdc-deprecated-list usage in the source markup. Omit to render children instead. */
  navItems?: SideSheetNavItem[];
  /** Arbitrary content/form/tabs, used instead of navItems. */
  children?: React.ReactNode;
  /** Optional footer actions for the sheet's content. */
  footer?: React.ReactNode;
  onClose?: () => void;
}

/**
 * SideSheet — MD2 (MDC) Cartrack-themed.
 * Full spec: SideSheet.doc.json
 * MDC Web has no dedicated "side sheet" primitive — the closest is the Drawer, right-anchored.
 * Mirrors the mdc-drawer class contract from md2-cartrack-library/components/side-sheet.html.
 * Tokens (tokens/tokens.json):
 * - spacing: semantic.spacing.md (16px padding).
 * - color: semantic.color.border.default (the standard variant's flush divider).
 * - type: semantic.typography.scale.h6 (20px/500, high end of the spec's "16–20px/500" header
 *   title range) or semantic.typography.scale.titleMedium (16px/500, low end — added 2026-07-16
 *   to close what used to be a gap; see Card.tsx). Header title below uses h6.
 * Not yet tokenized: ~320–400px width and elevation have no matching tokens.
 */
export function SideSheet({
  variant = 'standard',
  open = true,
  title,
  subtitle,
  navItems,
  children,
  footer,
  onClose,
}: SideSheetProps) {
  if (!open) return null;

  const content = (
    <aside
      className="mdc-drawer"
      role={variant === 'modal' ? 'dialog' : undefined}
      aria-modal={variant === 'modal' ? true : undefined}
      aria-label={variant === 'standard' ? title : undefined}
    >
      <div className="mdc-drawer__header">
        <h3 className="mdc-drawer__title">{title}</h3>
        {subtitle ? <h6 className="mdc-drawer__subtitle">{subtitle}</h6> : null}
        {onClose ? (
          <button
            type="button"
            className="mdc-icon-button material-icons"
            aria-label="Close"
            onClick={onClose}
          >
            close
          </button>
        ) : null}
      </div>
      <div className="mdc-drawer__content">
        {navItems ? (
          <nav className="mdc-deprecated-list">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href ?? '#'}
                aria-current={item.active ? 'page' : undefined}
                className={`mdc-deprecated-list-item${item.active ? ' mdc-deprecated-list-item--activated' : ''}`}
                onClick={item.onClick}
              >
                <span className="mdc-deprecated-list-item__ripple" />
                <span className="mdc-deprecated-list-item__text">{item.label}</span>
              </a>
            ))}
          </nav>
        ) : (
          children
        )}
      </div>
      {footer ? <div className="mdc-drawer__footer">{footer}</div> : null}
    </aside>
  );

  if (variant === 'modal') {
    return (
      <div className="mdc-drawer-scrim" onClick={onClose}>
        {content}
      </div>
    );
  }

  return content;
}

export default SideSheet;
