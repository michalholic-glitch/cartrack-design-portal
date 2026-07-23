import React from 'react';
import { Dialog } from '../../design-system/components/Dialog/Dialog';
import { Button } from '../../design-system/components/Button/Button';
import { TextField } from '../../design-system/components/TextField/TextField';

/* Live demos for the portal — rendered from the REAL Dialog.tsx.
   Keys must exactly match Dialog.doc.json variant names.
   "Full-screen (rare on desktop)" is deliberately absent: DialogProps has no
   size/full-screen prop, so that tile falls back to the mockup (documented gap).

   Dialogs render position:fixed over the page — that IS the real MDC behavior.
   Each demo stages a trigger Button; the dialog's own actions always close it
   (destructive dialogs disable scrim/Escape dismissal by design, so the two
   action buttons are the only way out — both close it here). */

const ConfirmRemove = () => {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState('');
  const close = () => setOpen(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <Button variant="outlined" label="Remove vehicle" onClick={() => { setResult(''); setOpen(true); }} />
      <Dialog
        open={open}
        title="Remove vehicle CA 123-456?"
        content="The vehicle, its trip history and driver assignments will be removed from the fleet. This cannot be undone."
        confirmLabel="Remove"
        destructive
        onConfirm={() => { setResult('Vehicle CA 123-456 removed.'); close(); }}
        cancelLabel="Cancel"
        onCancel={close}
      />
      {result && (
        <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
          {result}
        </span>
      )}
    </div>
  );
};

const FormDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [driver, setDriver] = React.useState('');
  const [note, setNote] = React.useState('');
  const [result, setResult] = React.useState('');
  const close = () => setOpen(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <Button variant="outlined" label="Assign driver" onClick={() => { setResult(''); setOpen(true); }} />
      <Dialog
        open={open}
        title="Assign driver to CA 123-456"
        content={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 /* semantic.spacing.md */ }}>
            <TextField label="Driver name" value={driver} onChange={setDriver} helperText="As registered on the driver licence" />
            <TextField label="Handover note" value={note} onChange={setNote} multiline rows={2} />
          </div>
        }
        confirmLabel="Assign"
        onConfirm={() => { setResult(driver ? `${driver} assigned to CA 123-456.` : 'No driver entered.'); close(); }}
        cancelLabel="Cancel"
        onCancel={close}
        onClose={close}
      />
      {result && (
        <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
          {result}
        </span>
      )}
    </div>
  );
};

/* Hero: the alert/confirmation form — the dialog's most representative job in a
   fleet portal (confirming a consequential action), fully interactive. */
export const hero = ConfirmRemove;

export const demos: Record<string, React.ComponentType> = {
  'Alert / confirmation': ConfirmRemove,
  'Form dialog': FormDialog,
  // 'Full-screen (rare on desktop)' omitted — Dialog.tsx exposes no size/full-screen prop.
};
