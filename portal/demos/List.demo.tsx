import React from 'react';
import { List, ListItemData } from '../../design-system/components/List/List';
import { SelectionControl } from '../../design-system/components/SelectionControl/SelectionControl';

/* Live demos for the portal — rendered from the REAL List.tsx.
   Keys must exactly match List.doc.json variant names. */

/* Simple initials avatar used as a leading element (staging only). */
const avatar = (name: string) => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: '50%',
      fontSize: 13,
      fontWeight: 500,
      background: '#EEEEEE' /* primitive.color.hue.gray.20 */,
      color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */,
    }}
  >
    {name.split(' ').map((p) => p[0]).join('')}
  </span>
);

const meta = (text: string) => (
  <span style={{ fontSize: '.75rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>{text}</span>
);

const SingleLine = () => (
  <div style={{ maxWidth: 420 }}>
    <List
      lines={1}
      subheader="Drivers on shift"
      items={[
        { id: 'd1', primaryText: 'Jane Cooper' },
        { id: 'd2', primaryText: 'Frank Kim' },
        { id: 'd3', primaryText: 'Lena Ortiz' },
        { id: 'd4', primaryText: 'Ana Diaz' },
      ]}
    />
  </div>
);

const TwoLine = () => {
  const [openedId, setOpenedId] = React.useState('v1');
  const vehicles: ListItemData[] = [
    { id: 'v1', primaryText: 'CA 123-456 · Toyota Hilux', secondaryText: 'Jane Cooper · last trip 2 min ago', trailing: meta('62,340 km') },
    { id: 'v2', primaryText: 'CA 234-567 · Ford Ranger', secondaryText: 'Frank Kim · last trip 14 min ago', trailing: meta('48,102 km') },
    { id: 'v3', primaryText: 'CA 345-678 · Isuzu D-Max', secondaryText: 'Lena Ortiz · last trip 1 h ago', trailing: meta('91,775 km') },
  ];
  return (
    <div style={{ maxWidth: 420 }}>
      <List
        lines={2}
        subheader="Vehicles"
        items={vehicles.map((v) => ({
          ...v,
          leading: avatar(v.secondaryText!.split(' · ')[0]),
          selected: v.id === openedId,
          onClick: () => setOpenedId(v.id),
        }))}
      />
    </div>
  );
};

const ThreeLine = () => (
  <div style={{ maxWidth: 420 }}>
    <List
      lines={3}
      subheader="Maintenance records"
      items={[
        {
          id: 'm1',
          primaryText: 'CA 123-456 · 60,000 km service',
          secondaryText: 'Completed 21 May 2026 · Cape Town depot workshop',
          tertiaryText: 'Oil, filters, brake pads (front) · R 4,820',
          trailing: meta('Done'),
        },
        {
          id: 'm2',
          primaryText: 'CA 234-567 · Brake pads (rear)',
          secondaryText: 'Booked 28 Jul 2026 · Paarl service centre',
          tertiaryText: 'Reported by driver Frank Kim after harsh-braking alert',
          trailing: meta('Booked'),
        },
        {
          id: 'm3',
          primaryText: 'CA 345-678 · Windscreen chip',
          secondaryText: 'Awaiting quote · logged 19 Jul 2026',
          tertiaryText: 'Chip on passenger side, outside wiper sweep',
          trailing: meta('Open'),
        },
      ]}
    />
  </div>
);

const WithControls = () => {
  // Leading checkboxes for multi-select. The checkbox label is empty on purpose:
  // per List.doc.json accessibility, "Leading checkboxes are labelled by the item text".
  const [checked, setChecked] = React.useState<string[]>(['v1']);
  const toggle = (id: string, next: boolean) =>
    setChecked((c) => (next ? [...c, id] : c.filter((x) => x !== id)));
  const rows = [
    { id: 'v1', primaryText: 'CA 123-456 · Toyota Hilux', secondaryText: 'Cape Town depot' },
    { id: 'v2', primaryText: 'CA 234-567 · Ford Ranger', secondaryText: 'Paarl DC' },
    { id: 'v3', primaryText: 'CA 345-678 · Isuzu D-Max', secondaryText: 'Stellenbosch hub' },
  ];
  return (
    <div style={{ maxWidth: 420 }}>
      <List
        lines={2}
        subheader={`Assign to route (${checked.length} selected)`}
        items={rows.map((r) => ({
          ...r,
          leading: (
            <SelectionControl
              type="checkbox"
              label=""
              id={`list-check-${r.id}`}
              checked={checked.includes(r.id)}
              onChange={(next) => toggle(r.id, next)}
            />
          ),
          selected: checked.includes(r.id),
        }))}
      />
    </div>
  );
};

/* Hero: the two-line list — the spec's most common variant — with leading
   avatars, trailing meta and clickable, selectable rows, at actual size. */
export const hero = TwoLine;

export const demos: Record<string, React.ComponentType> = {
  'Single-line': SingleLine,
  'Two-line': TwoLine,
  'Three-line': ThreeLine,
  'With controls': WithControls,
};
