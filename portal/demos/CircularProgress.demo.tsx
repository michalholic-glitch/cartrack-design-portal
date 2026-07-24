import React from 'react';
import { CircularProgress } from '../../design-system/components/CircularProgress/CircularProgress';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL CircularProgress.tsx
   (a thin wrapper over @mui/material/CircularProgress; split out of the old
   umbrella "ProgressIndicator" — LinearProgress is its own component now).
   Keys must exactly match CircularProgress.doc.json variant names.
   CircularProgress renders no text, so each demo pairs it with a visually
   adjacent label (doc.json doThis). */

const labelStyle: React.CSSProperties = {
  font: '400 14px/1.43 system-ui, sans-serif' /* semantic.typography.scale.body2 */,
  color: 'rgba(0,0,0,0.6)' /* semantic.color.text.secondary */,
};

const Indeterminate = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' /* semantic.spacing.md */ }}>
    <CircularProgress aria-label="Loading vehicle list" />
    <span style={labelStyle}>Loading vehicle list…</span>
  </div>
);

/* Staged determinate progress: advances 0 → 100 in steps, then stops —
   restart to watch it again. Never fakes a percentage (doc.json dontDoThis):
   the value shown is the value passed. */
const Determinate = () => {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (value >= 100) return;
    const id = setTimeout(() => setValue((v) => Math.min(v + 10, 100)), 600);
    return () => clearTimeout(id);
  }, [value]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' /* semantic.spacing.md */ }}>
      <CircularProgress
        variant="determinate"
        value={value}
        aria-label={`Syncing trip data: ${value}%`}
      />
      <span style={labelStyle}>
        {value < 100 ? `Syncing trip data for CA 123-456… ${value}%` : 'Sync complete'}
      </span>
      {value >= 100 && (
        <Button variant="text" size="small" onClick={() => setValue(0)}>
          Restart sync
        </Button>
      )}
    </div>
  );
};

export const hero: React.ComponentType = () => <CircularProgress aria-label="Loading" />;

export const demos: Record<string, React.ComponentType> = {
  'variant="indeterminate" (default)': Indeterminate,
  'variant="determinate"': Determinate,
};
