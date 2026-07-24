import * as React from 'react';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import type { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material/Breadcrumbs';

/**
 * Breadcrumbs — Material UI v9 (Cartrack-themed via @karoo-ui/core).
 * Full spec: Breadcrumbs.doc.json
 * Mirrors @karoo-ui/core's real wrapper
 * (libs/shared/js/karoo-ui/core/src/lib/Breadcrumbs/index.tsx), which is a *pure*
 * re-export of @mui/material/Breadcrumbs — no default-prop overrides. All theming
 * comes from the shared MUI theme (theme.ts), not this wrapper.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.secondary (crumb links) / semantic.color.brand.primary.dark
 *   (hover) — Breadcrumbs itself has no text styling; colour comes from whatever
 *   Link/Typography children you render inside it.
 * - typography: semantic.typography.scale.body2 (14px/400, the app-wide default variant).
 * - spacing: MUI's own built-in 8px separator margin (theme.spacing(1)) — not a
 *   separate token.
 */
export type BreadcrumbsProps = MuiBreadcrumbsProps;

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  props,
  ref,
) {
  return <MuiBreadcrumbs ref={ref} {...props} />;
});

export default Breadcrumbs;
