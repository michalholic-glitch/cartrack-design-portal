import React from 'react';
import { ExpansionPanel } from '../../design-system/components/ExpansionPanel/ExpansionPanel';

/* Live demos for the portal — rendered from the REAL ExpansionPanel.tsx.
   Keys must exactly match ExpansionPanel.doc.json variant names.
   Single-open vs multi-open is (per the component note) a decision made by the
   parent rendering the group: controlled `open`/`onToggle` for single-open,
   uncontrolled `defaultOpen` for multi-open. */

const bodyText: React.CSSProperties = {
  fontSize: '.875rem',
  color: 'rgba(0,0,0,.87)' /* semantic.color.text.primary */,
  margin: 0,
};

const SPEC_ROWS: [string, string][] = [
  ['Registration', 'CA 123-456'],
  ['Model', 'Toyota Hilux 2.4 GD-6'],
  ['Odometer', '62,340 km'],
];

const SpecList = () => (
  <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 16px' /* semantic.spacing.xs / md */ }}>
    {SPEC_ROWS.map(([k, v]) => (
      <React.Fragment key={k}>
        <dt style={{ fontSize: '.75rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>{k}</dt>
        <dd style={{ ...bodyText, margin: 0 }}>{v}</dd>
      </React.Fragment>
    ))}
  </dl>
);

const SingleOpen = () => {
  // Controlled group: opening one section closes the others (guided reading).
  const [openId, setOpenId] = React.useState<string | null>('specs');
  const sections: { id: string; title: string; body: React.ReactNode }[] = [
    { id: 'specs', title: 'Vehicle specifications', body: <SpecList /> },
    { id: 'driver', title: 'Driver assignment', body: <p style={bodyText}>Jane Cooper · licence code EC1 · assigned 12 Mar 2026.</p> },
    { id: 'service', title: 'Service history', body: <p style={bodyText}>Last service 21 May 2026 at 60,000 km — oil, filters, brake pads (front).</p> },
  ];
  return (
    <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8 /* semantic.spacing.sm */ }}>
      {sections.map((s) => (
        <ExpansionPanel
          key={s.id}
          title={s.title}
          open={openId === s.id}
          onToggle={(next) => setOpenId(next ? s.id : null)}
        >
          {s.body}
        </ExpansionPanel>
      ))}
    </div>
  );
};

const MultiOpen = () => (
  // Uncontrolled: each panel manages its own state, so several can be open at once (reference scanning).
  <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8 /* semantic.spacing.sm */ }}>
    <ExpansionPanel title="Open maintenance jobs" defaultOpen>
      <p style={bodyText}>Brake pads (rear) — booked 28 Jul · Windscreen chip — awaiting quote.</p>
    </ExpansionPanel>
    <ExpansionPanel title="Completed this month" defaultOpen>
      <p style={bodyText}>60,000 km service · Tyre rotation · Licence disc renewal.</p>
    </ExpansionPanel>
    <ExpansionPanel title="Parts on order">
      <p style={bodyText}>Cabin air filter (ETA 3 days) · Wiper blade set.</p>
    </ExpansionPanel>
  </div>
);

const WithSummary = () => (
  <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8 /* semantic.spacing.sm */ }}>
    <ExpansionPanel title="Odometer" summary="62,340 km">
      <p style={bodyText}>Reading reported 2 min ago by the CA 123-456 tracking unit.</p>
    </ExpansionPanel>
    <ExpansionPanel title="Next service" summary="in 2,660 km">
      <p style={bodyText}>65,000 km interval service — book with the Cape Town depot workshop.</p>
    </ExpansionPanel>
    <ExpansionPanel title="Driver" summary="Jane Cooper">
      <p style={bodyText}>Licence code EC1 · PDP valid to Nov 2027 · driver score 92/100.</p>
    </ExpansionPanel>
  </div>
);

/* Hero: a single-open group with summary values — the panel taming a dense
   vehicle record, fully interactive. */
export const hero = () => {
  const [openId, setOpenId] = React.useState<string | null>('specs');
  const sections: { id: string; title: string; summary: string; body: React.ReactNode }[] = [
    { id: 'specs', title: 'Vehicle specifications', summary: 'Toyota Hilux', body: <SpecList /> },
    { id: 'driver', title: 'Driver assignment', summary: 'Jane Cooper', body: <p style={bodyText}>Jane Cooper · licence code EC1 · assigned 12 Mar 2026.</p> },
    { id: 'service', title: 'Next service', summary: 'in 2,660 km', body: <p style={bodyText}>65,000 km interval service — book with the Cape Town depot workshop.</p> },
  ];
  return (
    <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8 /* semantic.spacing.sm */ }}>
      {sections.map((s) => (
        <ExpansionPanel
          key={s.id}
          title={s.title}
          summary={s.summary}
          open={openId === s.id}
          onToggle={(next) => setOpenId(next ? s.id : null)}
        >
          {s.body}
        </ExpansionPanel>
      ))}
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Single-open': SingleOpen,
  'Multi-open': MultiOpen,
  'With summary': WithSummary,
};
