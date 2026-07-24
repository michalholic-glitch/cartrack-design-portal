import * as React from 'react';
import MuiMenu, { type MenuProps as MuiMenuProps } from '@mui/material/Menu';

export {
  type MenuClassKey,
  type MenuClasses,
  getMenuUtilityClass,
  menuClasses,
} from '@mui/material/Menu';

/**
 * Menu — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Menu/index.tsx
 * Full spec: Menu.doc.json
 * Wraps @mui/material/Menu and forwards every real prop; the real karoo-ui
 * wrapper applies no default-prop overrides of its own — it exists mainly to
 * re-export Menu's class-key helpers from one place. Compose menu items with
 * @mui/material/MenuItem as children, not a custom `items` array prop.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px) — the Menu's Paper surface.
 * - color: semantic.color.surface.paper — the Paper background.
 * - spacing: semantic.spacing.md (16px) — MenuItem's default side padding.
 * - type: MenuItem's font-size is themed to 1rem (16px) — see theme.ts's
 *   MuiMenuItem.styleOverrides — NOT semantic.typography.scale.body2 (14px),
 *   the app-wide Typography default. There's no dedicated semantic token for
 *   this 16px MenuItem override; treat 1rem as the real, if untokenized, value.
 */
export type MenuProps = MuiMenuProps;

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(props, ref) {
  return <MuiMenu ref={ref} {...props} />;
});

export default Menu;
