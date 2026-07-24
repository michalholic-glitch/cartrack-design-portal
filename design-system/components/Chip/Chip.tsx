import * as React from 'react';
import MuiChip from '@mui/material/Chip';
import type { ChipProps as MuiChipProps } from '@mui/material/Chip';

/**
 * Chip — Material UI v9 (Cartrack-themed via @karoo-ui/core).
 * Full spec: Chip.doc.json
 * Mirrors @karoo-ui/core's real wrapper (libs/shared/js/karoo-ui/core/src/lib/Chip/index.tsx),
 * which is a *pure* re-export of @mui/material/Chip — no default-prop overrides in the
 * wrapper itself. The one Cartrack-specific default (`size="small"`) is NOT set here — it
 * comes from the shared theme's `MuiChip: { defaultProps: { size: 'small' } }` (see theme.ts),
 * which applies globally to every Chip instance via <ThemeProvider>.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.chip (16px pill — MUI's own Chip default, NOT theme.shape's 4px).
 * - typography: semantic.typography.scale.body2 (14px/400, medium size label).
 * - spacing: semantic.spacing.sm (icon/label gaps, approximate).
 * - status colour mapping (Active/Idle/Offline): semantic.color.statusChip.{success,warning,error}
 *   — there is no native `status` variant on real MUI Chip; this is a usage pattern built by
 *   passing `sx`/`color` mapped from these tokens, not a Chip prop.
 */
export type ChipProps = MuiChipProps;

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(function Chip(props, ref) {
  return <MuiChip ref={ref} {...props} />;
});

export default Chip;
