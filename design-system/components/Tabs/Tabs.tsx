import React from 'react';
import MuiTabs, { type TabsProps as MuiTabsProps } from '@mui/material/Tabs';

export type TabsProps = MuiTabsProps;

/**
 * Tabs — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: Tabs.doc.json
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Tabs/index.tsx — a bare
 * re-export (`export { default as Tabs } from '@mui/material/Tabs'`), no
 * default-prop overrides. This wrapper adds nothing beyond what karoo-ui
 * does — it forwards every real MUI Tabs prop untouched.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main — indicatorColor/textColor default 'primary'.
 * - type: semantic.typography.scale.button (14px/500, uppercase) — the underlying Tab label style.
 * Compose with <Tab> children (also @mui/material) exactly as MUI's docs show; this
 * repo does not model <Tab> separately since it isn't renamed or overridden.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  return <MuiTabs ref={ref} {...props} />;
});

export default Tabs;
