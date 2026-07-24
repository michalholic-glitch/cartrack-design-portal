import * as React from 'react';
import MuiDialog, { type DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import Fade, { type FadeProps } from '@mui/material/Fade';

export {
  type DialogClassKey,
  type DialogClasses,
  dialogClasses,
  getDialogUtilityClass,
} from '@mui/material/Dialog';

/**
 * Dialog — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Dialog/index.tsx
 * Full spec: Dialog.doc.json
 * Wraps @mui/material/Dialog and forwards every real Dialog prop. The one
 * real override, kept from the production wrapper: `open` is narrowed from
 * `boolean` to the literal `true` — an app-wide convention (a Dialog is only
 * ever mounted while open; callers unmount it, rather than pass open={false},
 * to close it). A default Fade transition (always `in`) is supplied via the
 * `slots.transition` slot, matching the production default.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px) — the dialog's Paper surface, via theme.shape.
 * - color: semantic.color.status.error.main — destructive confirm actions (an
 *   app convention you apply to a DialogActions button, not a Dialog prop).
 * - type: semantic.typography.scale.h6 — DialogTitle's default heading size.
 * - MuiDialogContent is themed with `overflow: 'visible'` and
 *   MuiDialogContentText defaults to variant="body2" (see theme.ts) — both
 *   real, both different from plain unthemed @mui/material defaults.
 */
export type DialogProps = Omit<MuiDialogProps, 'open'> & {
  /** App convention: a Dialog is only ever rendered while open; unmount to close it. */
  open: true;
};

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { slots, ...props },
  ref,
) {
  return (
    <MuiDialog
      ref={ref}
      slots={{
        transition: DefaultTransition,
        ...slots,
      }}
      {...props}
    />
  );
});

const DefaultTransition = React.forwardRef<unknown, FadeProps>(function Transition(props, ref) {
  return <Fade in ref={ref} {...props} />;
});

export default Dialog;
