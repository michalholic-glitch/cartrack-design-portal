import React from 'react';
import { Tabs, TabItem } from '../../design-system/components/Tabs/Tabs';

/* Live demos for the portal — rendered from the REAL Tabs.tsx.
   Keys must exactly match Tabs.doc.json variant names.
   Every demo drives activeIndex/onChange state, and (where a panel makes sense)
   swaps the panel content so selection is visibly doing something. */

const VEHICLE_TABS: TabItem[] = [
  { label: 'Overview' },
  { label: 'Trips' },
  { label: 'Maintenance' },
  { label: 'Alerts' },
];

const PANEL_COPY: Record<string, string> = {
  Overview: 'CA 123-456 · Jane Cooper · 52,431 km · last seen 3 min ago.',
  Trips: '14 trips today · 312 km · longest: Depot → Cape Town CBD (48 km).',
  Maintenance: 'Next service in 2,569 km · brake pads replaced 12 Jun.',
  Alerts: '3 open alerts · harsh braking (2), speeding (1).',
};

function TabbedPanel({ items, scrollable }: { items: TabItem[]; scrollable?: boolean }) {
  const [active, setActive] = React.useState(0);
  const label = items[active].label;
  return (
    <div>
      <Tabs items={items} activeIndex={active} onChange={setActive} scrollable={scrollable} />
      <div
        role="tabpanel"
        style={{
          padding: 16, /* semantic.spacing.md */
          fontSize: '.875rem',
          color: 'rgba(0,0,0,.6)', /* semantic.color.text.secondary */
          borderTop: '1px solid rgba(0,0,0,.12)', /* semantic.color.border.default */
        }}
      >
        {PANEL_COPY[label] ?? `${label} for CA 123-456.`}
      </div>
    </div>
  );
}

export const hero = () => <TabbedPanel items={VEHICLE_TABS} />;

const Fixed = () => <TabbedPanel items={VEHICLE_TABS} />;

const Scrollable = () => (
  /* Width-constrained so the nine tabs genuinely overflow and the bar scrolls. */
  <div style={{ maxWidth: 480 }}>
    <TabbedPanel
      scrollable
      items={[
        { label: 'Overview' },
        { label: 'Trips' },
        { label: 'Maintenance' },
        { label: 'Alerts' },
        { label: 'Fuel' },
        { label: 'Drivers' },
        { label: 'Geofences' },
        { label: 'Documents' },
        { label: 'Costs' },
      ]}
    />
  </div>
);

/* "With icon / count": expressed with the count half of the variant.
   TabItem.icon takes a Material icon ligature, but the portal ships no icon
   font (self-hosted Montserrat only), so a ligature would render as its raw
   word — counts are real text and render correctly. */
const WithIconCount = () => (
  <TabbedPanel
    items={[
      { label: 'Overview' },
      { label: 'Trips', count: 14 },
      { label: 'Maintenance', count: 1 },
      { label: 'Alerts', count: 3 },
    ]}
  />
);

export const demos: Record<string, React.ComponentType> = {
  Fixed,
  Scrollable,
  'With icon / count': WithIconCount,
};
