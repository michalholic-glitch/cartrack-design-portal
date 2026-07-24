import * as React from 'react';
import MuiButton from '@mui/material/Button';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';

/**
 * Button — Material UI v9 (Cartrack-themed via @karoo-ui/core).
 * Full spec: Button.doc.json
 * Mirrors @karoo-ui/core's real wrapper (libs/shared/js/karoo-ui/core/src/lib/Button/index.tsx),
 * which wraps @mui/material/Button and defaults `disableElevation` to `true` — Cartrack's
 * designers don't want the contained-button drop shadow. Every other prop passes straight
 * through unmodified.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.{main,dark,onPrimary} — MUI's `color="primary"`
 *   (the real default), used by the default `variant="contained"` fill/label; use `.dark`
 *   (not `.main`) where white text must pass WCAG AA (see tokens.json's
 *   accessibility.knownIssues — white on #F47735 is only ~2.79:1).
 * - radius: semantic.radius.button (4px, theme.shape.borderRadius, unmodified).
 * - typography: semantic.typography.scale.button (14px/500, uppercase — theme.ts sets
 *   typography.button.textTransform = 'uppercase').
 * - spacing: MUI's own built-in padding (16px sides / 8px for text buttons) — not a
 *   separate token.
 * Note: real MUI default `variant` is "text", not "contained" — pass `variant="contained"`
 * explicitly for the single primary action per view (see Button.doc.json's keyRule).
 */
export type ButtonProps = MuiButtonProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { disableElevation = true, ...props },
  ref,
) {
  return <MuiButton {...props} disableElevation={disableElevation} ref={ref} />;
});

export default Button;
