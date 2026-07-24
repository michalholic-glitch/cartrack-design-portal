import * as React from 'react';
import MuiSnackbar, { type SnackbarProps as MuiSnackbarProps } from '@mui/material/Snackbar';

/**
 * Snackbar — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Snackbar/index.tsx
 * Full spec: Snackbar.doc.json
 * The real karoo-ui wrapper applies zero overrides — a straight
 * `export { default as Snackbar } from '@mui/material/Snackbar'`. This file
 * forwards every real prop through a local forwardRef wrapper for
 * consistency with the rest of this folder. Compose the message + action via
 * the `message`/`action` props (Snackbar's own default SnackbarContent), or
 * fully replace it with `children` (e.g. a custom Alert).
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.surface.inverse / semantic.color.surface.onInverse
 *   — the dark container / light text (SnackbarContent's real default look).
 * - color: semantic.color.brand.primary.light — a legible action-button
 *   colour on the dark surface; an app convention applied via the `action`
 *   button's own sx/color, not a Snackbar built-in.
 * - type: semantic.typography.scale.body2 — the app-wide Typography default
 *   the message text inherits.
 * NOTE: `autoHideDuration` defaults to `null` (no auto-dismiss) — "auto-hides
 *   after a few seconds" is opt-in per instance, not a Snackbar default.
 */
export type SnackbarProps = MuiSnackbarProps;

export const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
  props,
  ref,
) {
  return <MuiSnackbar ref={ref} {...props} />;
});

export default Snackbar;
