import React from 'react';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Button.tsx.
   Keys must exactly match Button.doc.json variant names.
   "Toggle button(s)" is deliberately absent: Button.tsx has no toggle variant,
   so that tile falls back to the hand-drawn mockup (documented gap). */

const Clickable = ({ variant, label }: { variant: 'contained' | 'outlined' | 'text'; label: string }) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      variant={variant}
      label={label}
      loading={loading}
      onClick={() => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), 900);
      }}
    />
  );
};

export const hero = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    <Clickable variant="contained" label="Add vehicle" />
    <Clickable variant="outlined" label="Cancel" />
    <Clickable variant="text" label="View report" />
  </div>
);

export const demos: Record<string, React.ComponentType> = {
  Contained: () => <Clickable variant="contained" label="Save vehicle" />,
  Outlined: () => <Clickable variant="outlined" label="Cancel" />,
  Text: () => <Clickable variant="text" label="View report" />,
};
