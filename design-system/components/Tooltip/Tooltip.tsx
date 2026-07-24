import * as React from 'react';
import MuiTooltip from '@mui/material/Tooltip';
import type { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';

/**
 * Tooltip — Material UI v9 (Cartrack-themed via @karoo-ui/core).
 * Full spec: Tooltip.doc.json
 * Mirrors @karoo-ui/core's real wrapper (libs/shared/js/karoo-ui/core/src/lib/Tooltip/index.tsx),
 * which wraps @mui/material/Tooltip and defaults `arrow` to `true` — Cartrack's design
 * guidelines call for tooltips to always show an arrow by default (still overridable per
 * instance). Every other prop passes straight through unmodified.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.surface.inverse / semantic.color.surface.onInverse — MUI's own
 *   real default tooltip surface (grey 700 @ 92% opacity, white text), reused here as the
 *   app's one canonical dark/inverse surface.
 * - spacing: semantic.spacing.xs / semantic.spacing.sm approximate MUI's built-in
 *   padding (~4px/8px) and radius (theme.shape.borderRadius, 4px) — not separately tokenized.
 * - delays: real MUI defaults (enterDelay 100ms, leaveDelay 0ms) are NOT overridden by the
 *   karoo-ui wrapper — only `arrow` is.
 */
export type TooltipProps = MuiTooltipProps;

export const Tooltip = React.forwardRef<unknown, TooltipProps>(function Tooltip(
  { arrow = true, ...props },
  ref,
) {
  return <MuiTooltip {...props} arrow={arrow} ref={ref} />;
});

export default Tooltip;
