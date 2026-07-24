import React from 'react';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Button.tsx (MUI v9 wrapper,
   disableElevation defaulted true). Keys must exactly match Button.doc.json
   variant names. Real MUI API: the label is `children` (rendered uppercase by
   the theme), the real default variant is "text", and the real `loading` /
   `loadingPosition` props drive the async state — no invented `label` prop. */

/* Hero: the doc's canonical trio — one contained primary action per view,
   outlined secondary beside it, text for low emphasis. */
export const hero = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' /* semantic.spacing.md */ }}>
    <Button variant="contained">Add vehicle</Button>
    <Button variant="outlined">Export CSV</Button>
    <Button variant="text">View trips</Button>
  </div>
);

/* Contained: the single primary action. Click it to see the real MUI `loading`
   prop take over (indicator + disabled) while the save is in flight. */
const Contained = () => {
  const [loading, setLoading] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const save = () => {
    setLoading(true);
    setSaved(false);
    window.setTimeout(() => {
      setLoading(false);
      setSaved(true);
    }, 1200);
  };
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button variant="contained" loading={loading} loadingPosition="start" onClick={save}>
        Save vehicle
      </Button>
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        {loading ? 'Saving CA 123-456…' : saved ? 'Saved CA 123-456' : 'One contained button per view'}
      </span>
    </div>
  );
};

/* Outlined: important secondary actions — classically Cancel beside the primary. */
const Outlined = () => {
  const [lastAction, setLastAction] = React.useState<string | null>(null);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="outlined" onClick={() => setLastAction('Export started')}>
        Export CSV
      </Button>
      <Button variant="outlined" onClick={() => setLastAction('Assignment cancelled')}>
        Cancel
      </Button>
      <Button variant="contained" onClick={() => setLastAction('Driver assigned: Jane Cooper')}>
        Assign driver
      </Button>
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        {lastAction ?? 'Outlined steps down beside the one contained action'}
      </span>
    </div>
  );
};

/* Text: low-emphasis actions (toolbars, cards, dialog dismissals) —
   the real MUI default variant. Includes the disabled state. */
const Text = () => {
  const [dismissed, setDismissed] = React.useState(false);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="text" onClick={() => setDismissed(false)}>
        View trips
      </Button>
      <Button variant="text" onClick={() => setDismissed(true)}>
        Dismiss
      </Button>
      <Button variant="text" disabled>
        Archived
      </Button>
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        {dismissed ? 'Alert dismissed for CA 123-456' : 'Low-emphasis actions for Frank Kim’s alerts'}
      </span>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Contained': Contained,
  'Outlined': Outlined,
  'Text': Text,
};
