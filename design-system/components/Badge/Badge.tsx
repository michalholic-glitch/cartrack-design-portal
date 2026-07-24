import * as React from 'react';
import MuiBadge from '@mui/material/Badge';
import type { BadgeProps as MuiBadgeProps } from '@mui/material/Badge';

/**
 * Badge — Material UI v9 (Cartrack-themed via @karoo-ui/core).
 * Full spec: Badge.doc.json
 * Mirrors @karoo-ui/core's real wrapper
 * (libs/shared/js/karoo-ui/core/src/lib/Badge/index.tsx), which is a *pure* re-export
 * of @mui/material/Badge — no default-prop overrides at all. All theming comes from
 * the shared MUI theme (theme.ts), not this wrapper.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.status.error.{main,onStatus} — real default is MUI's
 *   `color="default"` (grey); Cartrack usage typically passes color="error" for alert counts.
 * - typography: semantic.typography.scale.labelSmall (12px/500) is the closest named scale
 *   step to the badge numeral's visual size — NOT a real MUI Typography `variant`, Badge sets
 *   its own font-size internally.
 * - radius / geometry: MUI's own built-in badge geometry (20px pill / 6px dot) — not tokenized.
 */
export type BadgeProps = MuiBadgeProps;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) {
  return <MuiBadge ref={ref} {...props} />;
});

export default Badge;
