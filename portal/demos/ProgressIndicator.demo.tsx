import React from 'react';
import { ProgressIndicator } from '../../design-system/components/ProgressIndicator/ProgressIndicator';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL ProgressIndicator.tsx.
   Keys must exactly match ProgressIndicator.doc.json variant names.
   Determinate demos are staged with an animate button (setInterval + cleanup)
   so the fill visibly advances instead of sitting at a frozen percentage. */

/** Shared staged animation: press the button, watch a determinate task run 0→100. */
function useStagedProgress(startAt: number) {
  const [value, setValue] = React.useState(startAt);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setValue((v) => Math.min(100, v + 4)), 120);
    return () => window.clearInterval(id);
  }, [running]);
  React.useEffect(() => {
    if (value >= 100) setRunning(false);
  }, [value]);
  const start = () => {
    setValue(0);
    setRunning(true);
  };
  return { value, running, start };
}

const pctStyle: React.CSSProperties = {
  fontSize: '.8rem',
  color: 'rgba(0, 0, 0, 0.6)' /* semantic.color.text.secondary */,
  minWidth: 40,
};

const LinearDeterminate = () => {
  const { value, running, start } = useStagedProgress(65);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ProgressIndicator type="linear" variant="determinate" value={value} label="Exporting trips" maxWidth="100%" />
        <span style={pctStyle}>{value}%</span>
      </div>
      <div>
        <Button variant="outlined" label={running ? 'Exporting…' : 'Export trips'} onClick={start} />
      </div>
    </div>
  );
};

const LinearIndeterminate = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
    <ProgressIndicator type="linear" variant="indeterminate" label="Loading vehicles" maxWidth="100%" />
    <span style={pctStyle}>Loading vehicles…</span>
  </div>
);

const CircularDeterminate = () => {
  const { value, running, start } = useStagedProgress(75);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <ProgressIndicator type="circular" variant="determinate" value={value} label="Uploading proof of delivery" />
      <span style={pctStyle}>{value}%</span>
      <Button variant="outlined" label={running ? 'Uploading…' : 'Upload'} onClick={start} />
    </div>
  );
};

const CircularIndeterminate = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <ProgressIndicator type="circular" variant="indeterminate" label="Fetching live positions" size={32} />
    <span style={pctStyle}>Fetching live positions…</span>
  </div>
);

/* Hero: both shapes at actual size — an animatable determinate export bar plus
   the inline indeterminate spinner the portal shows while positions stream in. */
export const hero = () => {
  const { value, running, start } = useStagedProgress(40);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 360 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ProgressIndicator type="linear" variant="determinate" value={value} label="Exporting trips" maxWidth="100%" />
        <span style={pctStyle}>{value}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <ProgressIndicator type="circular" variant="indeterminate" label="Fetching live positions" size={32} />
        <Button variant="outlined" label={running ? 'Exporting…' : 'Export trips'} onClick={start} />
      </div>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Linear determinate': LinearDeterminate,
  'Linear indeterminate': LinearIndeterminate,
  'Circular determinate': CircularDeterminate,
  'Circular indeterminate': CircularIndeterminate,
};
