import React from 'react';
import MuiCircularProgress, {
  type CircularProgressProps as MuiCircularProgressProps,
} from '@mui/material/CircularProgress';

export type CircularProgressProps = MuiCircularProgressProps;

/**
 * CircularProgress — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: CircularProgress.doc.json
 * Real source: libs/shared/js/karoo-ui/core/src/lib/CircularProgress/index.tsx — a
 * bare re-export (`export { default as CircularProgress } from '@mui/material/CircularProgress'`),
 * no default-prop overrides. This wrapper forwards every real MUI prop untouched.
 * Split out of the old repo's single "ProgressIndicator" component — the real
 * library has two separate components (CircularProgress, LinearProgress), not
 * one umbrella component with a `type` prop.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main (color="primary" default).
 */
export const CircularProgress = React.forwardRef<HTMLSpanElement, CircularProgressProps>(
  function CircularProgress(props, ref) {
    return <MuiCircularProgress ref={ref} {...props} />;
  },
);

export default CircularProgress;
