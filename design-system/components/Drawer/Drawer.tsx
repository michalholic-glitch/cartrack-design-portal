import * as React from 'react';
import MuiDrawer, { type DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import { mergeSlotProps } from '@mui/material/utils';

export {
  type DrawerClassKey,
  type DrawerClasses,
  drawerClasses,
  getDrawerUtilityClass,
} from '@mui/material/Drawer';

/**
 * Drawer — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Drawer/index.tsx
 * Full spec: Drawer.doc.json
 * Consolidates the old design-system/components/NavigationDrawer and
 * design-system/components/SideSheet docs — both were confirmed to
 * duplicate-map to this single real component. Use variant="permanent" or
 * "persistent" for a docked, navigation-style drawer, and variant="temporary"
 * (the MUI default) for an overlay side sheet / filters panel.
 * Wraps @mui/material/Drawer and forwards every real prop. Two real
 * overrides, kept from the production wrapper:
 * 1. `open` is narrowed from `boolean` to the literal `true` — the same
 *    app-wide "modal open=true only" convention as Dialog; unmount to close.
 * 2. `slotProps.transition.appear` defaults to `true` (merged with any
 *    slotProps.transition you pass), so the drawer's entrance always
 *    animates, even on first mount.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px) — the Paper slot.
 * - color: semantic.color.interactive.primarySelected — active nav item tint,
 *   an app convention for the List/ListItemButton content you place inside,
 *   not a Drawer prop.
 * - color: semantic.color.border.default — the flush edge/divider on a
 *   docked (permanent/persistent) drawer.
 * - spacing: semantic.spacing.md (16px) — typical content/header padding.
 * - type: semantic.typography.scale.subtitle2 / .titleMedium — typical nav
 *   item / header title sizes (titleMedium isn't a real MUI Typography
 *   variant yet — see tokens.json's note on it).
 * NOTE: fleet-web's actual primary/persistent navigation shell is a bespoke
 * MainSideNavbar component (see patterns/main-navigation), NOT this Drawer —
 * variant="permanent" below documents a real, supported Drawer API shape,
 * not a claim that fleet-web's current main nav is built with it.
 */
export type DrawerProps = Omit<MuiDrawerProps, 'open'> & {
  /** App convention: a Drawer is only ever rendered while open; unmount to close it. */
  open: true;
};

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { slotProps, ...props },
  ref,
) {
  return (
    <MuiDrawer
      ref={ref}
      slotProps={{
        ...slotProps,
        transition: mergeSlotProps(slotProps?.transition, {
          appear: true,
        }),
      }}
      {...props}
    />
  );
});

export default Drawer;
