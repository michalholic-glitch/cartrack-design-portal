import React from 'react';
import MuiLinearProgress, {
  type LinearProgressProps as MuiLinearProgressProps,
} from '@mui/material/LinearProgress';

export type LinearProgressProps = MuiLinearProgressProps;

/**
 * LinearProgress — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: LinearProgress.doc.json
 * Real source: libs/shared/js/karoo-ui/core/src/lib/LinearProgress/index.tsx — a
 * bare re-export (`export { default as LinearProgress } from '@mui/material/LinearProgress'`),
 * no default-prop overrides. This wrapper forwards every real MUI prop untouched.
 * Split out of the old repo's single "ProgressIndicator" component — the real
 * library has two separate components (CircularProgress, LinearProgress), not
 * one umbrella component with a `type` prop.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main (color="primary" default).
 */
export const LinearProgress = React.forwardRef<HTMLSpanElement, LinearProgressProps>(
  function LinearProgress(props, ref) {
    return <MuiLinearProgress ref={ref} {...props} />;
  },
);

export default LinearProgress;
