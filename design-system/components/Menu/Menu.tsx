import React from 'react';

// NOTE: this previously referenced `var(--mdc-theme-error)`, a CSS custom property that isn't
// defined anywhere in this repo — a dead reference (same class of bug as Dialog.tsx's `var(--error)`).
// See Badge.tsx/Card.tsx for why primitive.* is used directly rather than semantic.* here.
import tokens from '../../tokens/tokens.json';

export interface MenuItemData {
  /** Unique key for the item. */
  id: string;
  /** Renders a `mdc-deprecated-list-divider` separator instead of an item (e.g. to set destructive actions apart). */
  divider?: boolean;
  /** Choice label. Keep it short and verb-first. */
  label?: string;
  /** Leading icon (material icon name string) shown before the label. */
  icon?: string;
  /** Trailing shortcut/meta text shown after the label. */
  shortcut?: string;
  /** Marks the current choice (stateful menu). */
  selected?: boolean;
  /** Unavailable option — not selectable. */
  disabled?: boolean;
  /** Styles the label as a destructive action (e.g. Delete). */
  destructive?: boolean;
  onClick?: () => void;
}

export interface MenuProps {
  /** Choices and dividers shown on the menu surface. */
  items: MenuItemData[];
  /** Whether the menu surface is open. */
  open: boolean;
  /** Called on selection, Escape, or an outside click. */
  onClose?: () => void;
  /**
   * Overflow / Dropdown (exposed) / Context / Cascading submenu — which
   * trigger pattern opened this menu, per the spec's Variants table.
   */
  variant?: 'overflow' | 'dropdown' | 'context' | 'cascading';
  /** Optional extra class names to compose with the base mdc-menu class. */
  className?: string;
}

/**
 * Menu — MD2 (MDC) Cartrack-themed.
 * Full spec: Menu.doc.json
 * Mirrors the mdc-menu / mdc-menu-surface / mdc-deprecated-list class
 * contract from md2-cartrack-library/components/menus.html.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px surface radius).
 * - color: semantic.color.status.error.main (destructive item label — was a dead
 *   `var(--mdc-theme-error)` reference before this fix), semantic.color.surface.paper (surface fill).
 * - spacing: semantic.spacing.md (16px item padding).
 * - type: semantic.typography.scale.body2 (14px/400 item text low end; 16px is body1).
 * Not yet tokenized: ~36–48px item height and ~112px min width have no matching tokens.
 */
export function Menu({ items, open, onClose, variant = 'overflow', className }: MenuProps) {
  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose?.();
  };

  return (
    <div
      className={['mdc-menu', 'mdc-menu-surface', 'mdc-menu-surface--open', className]
        .filter(Boolean)
        .join(' ')}
      data-variant={variant}
      onKeyDown={handleKeyDown}
    >
      <ul className="mdc-deprecated-list" role="menu" aria-orientation="vertical">
        {items.map((item) =>
          item.divider ? (
            <li key={item.id} className="mdc-deprecated-list-divider" role="separator" />
          ) : (
            <li
              key={item.id}
              className="mdc-deprecated-list-item"
              role="menuitem"
              aria-disabled={item.disabled || undefined}
              aria-selected={item.selected || undefined}
              onClick={
                item.disabled
                  ? undefined
                  : () => {
                      item.onClick?.();
                      onClose?.();
                    }
              }
            >
              <span className="mdc-deprecated-list-item__ripple" />
              {item.icon ? (
                <i className="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">
                  {item.icon}
                </i>
              ) : null}
              <span
                className="mdc-deprecated-list-item__text"
                style={item.destructive ? { color: tokens.primitive.color.status.error['500'] } : undefined}
              >
                {item.label}
              </span>
              {item.shortcut ? (
                <span className="mdc-deprecated-list-item__meta">{item.shortcut}</span>
              ) : null}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default Menu;
