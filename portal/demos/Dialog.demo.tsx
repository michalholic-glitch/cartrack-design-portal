import React from 'react';
import { Dialog } from '../../design-system/components/Dialog/Dialog';
import { Button } from '../../design-system/components/Button/Button';
import { TextField } from '../../design-system/components/TextField/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

/* Live demos for the portal — rendered from the REAL Dialog.tsx (a thin
   wrapper over @mui/material/Dialog). Keys must exactly match
   Dialog.doc.json variant names.
   Each demo stages the dialog behind a Button; the real MUI Dialog portals
   to document.body with a scrim — intended. The wrapper narrows `open` to
   the literal `true` (app convention: unmount to close), so every demo
   renders the Dialog conditionally rather than passing open={false}.
   DialogTitle/Content/Actions come straight from @mui/material — the
   design system wraps only the Dialog shell. */

const AlertConfirmation = () => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Remove vehicle…
      </Button>
      {open && (
        <Dialog
          open
          role="alertdialog"
          aria-labelledby="remove-vehicle-title"
          aria-describedby="remove-vehicle-desc"
          maxWidth="xs"
          onClose={(_, reason) => {
            /* Destructive decision — don't let a stray backdrop click dismiss
               it silently (Dialog.doc.json dontDoThis). Escape still closes. */
            if (reason === 'backdropClick') return;
            close();
          }}
        >
          <DialogTitle id="remove-vehicle-title">Remove vehicle CA 123-456?</DialogTitle>
          <DialogContent>
            <DialogContentText id="remove-vehicle-desc">
              This removes the vehicle from Depot North's active fleet. Trip history is kept.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            {/* semantic.color.status.error.main — destructive confirm convention */}
            <Button variant="contained" color="error" onClick={close}>
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

const FormDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [driver, setDriver] = React.useState('');
  const close = () => setOpen(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Assign driver…
      </Button>
      {open && (
        <Dialog open fullWidth maxWidth="sm" aria-labelledby="assign-driver-title" onClose={close}>
          <DialogTitle id="assign-driver-title">Assign driver to CA 789-012</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 /* semantic.spacing.md via theme.spacing(2) */ }}>
              The driver takes over this vehicle from the start of the next shift.
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              label="Driver name"
              placeholder="e.g. Jane Cooper"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button variant="contained" disabled={driver.trim() === ''} onClick={close}>
              Assign
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

const FullScreenDialog = () => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open route planner…
      </Button>
      {open && (
        <Dialog open fullScreen aria-labelledby="route-planner-title" onClose={close}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px' /* semantic.spacing.sm semantic.spacing.md */,
              borderBottom:
                '1px solid rgba(0,0,0,0.12)' /* semantic.borderWidth.hairline + semantic.color.border.default */,
            }}
          >
            <span
              id="route-planner-title"
              style={{
                font: '500 20px/1.6 system-ui, sans-serif' /* semantic.typography.scale.h6 */,
                color: 'rgba(0,0,0,0.87)' /* semantic.color.text.primary */,
              }}
            >
              Route planner — CA 123-456
            </span>
            <Button variant="text" onClick={close} aria-label="Close route planner">
              Close
            </Button>
          </div>
          <DialogContent>
            <DialogContentText>
              A full-screen dialog suits a larger focused task (rare on desktop — a page is
              usually better). Plan the Depot North → Depot East run for Jane Cooper here.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export const hero: React.ComponentType = AlertConfirmation;

export const demos: Record<string, React.ComponentType> = {
  'Alert / confirmation': AlertConfirmation,
  'Form dialog': FormDialog,
  'Full-screen (rare on desktop)': FullScreenDialog,
};
