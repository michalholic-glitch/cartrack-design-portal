import React from 'react';
import { Snackbar } from '../../design-system/components/Snackbar/Snackbar';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Snackbar.tsx.
   Keys must exactly match Snackbar.doc.json variant names.
   Snackbar.tsx renders the mdc-snackbar contract, which the portal CSS positions
   fixed at the bottom of the viewport (.mdc-snackbar { position: fixed; bottom: 0 }) —
   that overlay is real behaviour, so every demo is triggered by a staging Button,
   auto-dismisses on a timer (per the doc's Auto-dismiss behaviour), and can be
   closed explicitly via onClose. One snackbar at a time, per doc.json. */

function useSnackbar(durationMs: number) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
    timer.current = window.setTimeout(() => setOpen(false), durationMs);
  };
  const close = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  return { open, show, close };
}

export const hero = () => {
  const snack = useSnackbar(4000);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button variant="contained" label="Save vehicle" onClick={snack.show} />
      <Snackbar
        variant="message"
        open={snack.open}
        message="Vehicle saved"
        onClose={snack.close}
      />
    </div>
  );
};

const MessageOnly = () => {
  const snack = useSnackbar(4000);
  return (
    <>
      <Button variant="outlined" label="Save changes" onClick={snack.show} />
      <Snackbar variant="message" open={snack.open} message="Changes saved" onClose={snack.close} />
    </>
  );
};

const WithAction = () => {
  /* Longer timeout when there's an action (doc spec: ~4–6s, longer with an action). */
  const snack = useSnackbar(6000);
  const [undone, setUndone] = React.useState(false);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button
        variant="outlined"
        label="Unassign driver"
        onClick={() => {
          setUndone(false);
          snack.show();
        }}
      />
      {undone && (
        <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
          Assignment restored.
        </span>
      )}
      <Snackbar
        variant="action"
        open={snack.open}
        message="Driver unassigned from CA 123-456"
        actionLabel="Undo"
        onAction={() => {
          setUndone(true);
          snack.close();
        }}
        onClose={snack.close}
      />
    </div>
  );
};

const ErrorToast = () => {
  const snack = useSnackbar(4000);
  return (
    <>
      <Button variant="outlined" label="Export trips" onClick={snack.show} />
      <Snackbar
        variant="error"
        open={snack.open}
        message="Trip export failed"
        onClose={snack.close}
      />
    </>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Message only': MessageOnly,
  'With action': WithAction,
  'Error toast': ErrorToast,
};
