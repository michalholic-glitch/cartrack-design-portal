import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import type { DividerProps as MuiDividerProps } from '@mui/material/Divider';

/**
 * Divider — Material UI v9 (Cartrack-themed via @karoo-ui/core).
 * Full spec: Divider.doc.json
 * Mirrors @karoo-ui/core's real wrapper (libs/shared/js/karoo-ui/core/src/lib/Divider/index.tsx),
 * which is a *pure* re-export of @mui/material/Divider — no default-prop overrides. All
 * theming comes from the shared MUI theme (theme.ts), not this wrapper.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.border.default (rgba(0,0,0,.12) — MUI's own real default divider
 *   colour, unmodified).
 * - borderWidth: semantic.borderWidth.hairline (1px).
 * - spacing: semantic.spacing.md (16px) approximates the `inset`/`middle` variant margins;
 *   MUI's real `inset` variant uses a fixed 72px left margin (aligns past a 40px avatar),
 *   not this token exactly — see Divider.doc.json specs.
 */
export type DividerProps = MuiDividerProps;

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(function Divider(props, ref) {
  return <MuiDivider ref={ref} {...props} />;
});

export default Divider;
