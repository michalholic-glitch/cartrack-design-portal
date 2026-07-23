import React from 'react';
import { Divider } from '../../design-system/components/Divider/Divider';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Divider.tsx.
   Keys must exactly match Divider.doc.json variant names.
   The Divider API is purely presentational, so each variant is staged inside
   the context it's meant for (sections, list rows, a toolbar). */

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px' /* semantic.spacing.md side padding */,
  fontSize: '.875rem',
  color: 'rgba(0,0,0,.87)' /* semantic.color.text.primary */,
};

const metaStyle: React.CSSProperties = {
  fontSize: '.75rem',
  color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */,
};

const Section = ({ title, body }: { title: string; body: string }) => (
  <div style={{ padding: 16 /* semantic.spacing.md */ }}>
    <div style={{ fontSize: '.875rem', fontWeight: 500, color: 'rgba(0,0,0,.87)' /* semantic.color.text.primary */ }}>
      {title}
    </div>
    <div style={{ ...metaStyle, marginTop: 4 /* semantic.spacing.xs */ }}>{body}</div>
  </div>
);

const FullWidth = () => (
  <div style={{ maxWidth: 420 }}>
    <Section title="Vehicle details" body="CA 123-456 · Toyota Hilux 2.4 GD-6 · 62,340 km" />
    <Divider variant="full-width" />
    <Section title="Assigned driver" body="Jane Cooper · licence code EC1 · since 12 Mar 2026" />
    <Divider variant="full-width" />
    <Section title="Maintenance" body="Next service due at 65,000 km (in 2,660 km)" />
  </div>
);

const Inset = () => (
  <div style={{ maxWidth: 420 }}>
    <div style={rowStyle}><span>CA 123-456 · Jane Cooper</span><span style={metaStyle}>2 min ago</span></div>
    <Divider variant="inset" />
    <div style={rowStyle}><span>CA 234-567 · Frank Kim</span><span style={metaStyle}>14 min ago</span></div>
    <Divider variant="inset" />
    <div style={rowStyle}><span>CA 345-678 · Lena Ortiz</span><span style={metaStyle}>1 h ago</span></div>
  </div>
);

const Middle = () => (
  <div style={{ maxWidth: 420 }}>
    <Section title="Trip summary" body="Cape Town depot → Paarl DC · 58.2 km · 1 h 04 min" />
    <Divider variant="middle" />
    <Section title="Driver score" body="92 / 100 · 1 harsh-braking event" />
  </div>
);

const Vertical = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'stretch',
      gap: 8 /* semantic.spacing.sm */,
      height: 36,
      maxWidth: 420,
    }}
  >
    <Button variant="text" label="Export" />
    <Divider variant="vertical" />
    <Button variant="text" label="Filter" />
    <Divider variant="vertical" />
    <Button variant="text" label="Refresh" />
  </div>
);

/* Hero: the divider doing its everyday job — separating sections of a vehicle
   record and inline toolbar actions, at actual size. */
export const hero = () => (
  <div style={{ maxWidth: 420 }}>
    <Vertical />
    <Divider variant="full-width" />
    <Section title="Assigned driver" body="Jane Cooper · licence code EC1 · since 12 Mar 2026" />
    <Divider variant="inset" />
    <Section title="Maintenance" body="Next service due at 65,000 km (in 2,660 km)" />
  </div>
);

export const demos: Record<string, React.ComponentType> = {
  'Full-width': FullWidth,
  'Inset': Inset,
  'Middle': Middle,
  'Vertical': Vertical,
};
