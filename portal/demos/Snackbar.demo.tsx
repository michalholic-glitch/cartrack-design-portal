import React from 'react';
import { Snackbar } from '../../design-system/components/Snackbar/Snackbar';
import { Button } from '../../design-system/components/Button/Button';
import Alert from '@mui/material/Alert';

/* Live demos for the portal — rendered from the REAL Snackbar.tsx (thin wrapper
   over @mui/material/Snackbar, MUI v9). Keys must exactly match
   Snackbar.doc.json variant names. All three variants are expressible live —
   none omitted.
   Each demo opens via a staging trigger Button and sets an explicit
   autoHideDuration — per the doc.json, auto-dismiss is opt-in (the real default
   is null / no auto-hide). Positioning is left at MUI's documented default,
   anchorOrigin { vertical: 'bottom', horizontal: 'left' }, which is what the
   doc.json's Position spec records — no override needed. The snackbar renders
   fixed to the viewport, as it would in the app. */

/* Hero — the most representative use: brief confirmation with a single Undo
   action. Timer is longer because there's an action to reach (doc guidance),
   and clickaway is ignored so an accidental click doesn't eat the Undo. */
export const hero: React.ComponentType = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Unassign driver
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Frank Kim unassigned from CA 123-456"
        action={
          <Button
            size="small"
            onClick={() => setOpen(false)}
            sx={{ color: '#FFA863' /* semantic.color.brand.primary.light — legible on the dark surface */ }}
          >
            Undo
          </Button>
        }
      />
    </div>
  );
};

const MessageOnly: React.ComponentType = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Save vehicle
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message="Vehicle CA 123-456 saved"
      />
    </div>
  );
};

const WithAction: React.ComponentType = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Archive geofence
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Geofence “Depot A” archived"
        action={
          <Button
            size="small"
            onClick={() => setOpen(false)}
            sx={{ color: '#FFA863' /* semantic.color.brand.primary.light — legible on the dark surface */ }}
          >
            Undo
          </Button>
        }
      />
    </div>
  );
};

/* `children` fully replaces the default SnackbarContent — here with an Alert
   for an error toast, the doc.json's own example. (Persistent errors that need
   acknowledgement belong in a Banner, not a snackbar.) */
const CustomContent: React.ComponentType = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Run trip export
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert severity="error" variant="filled" onClose={() => setOpen(false)}>
          Export failed — no trips for CA 123-456 in the selected period
        </Alert>
      </Snackbar>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Message only': MessageOnly,
  'With action': WithAction,
  'Custom content': CustomContent,
};
