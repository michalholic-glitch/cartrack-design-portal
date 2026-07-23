import React from 'react';
import {
  NavigationDrawer,
  NavigationDrawerSection,
} from '../../design-system/components/NavigationDrawer/NavigationDrawer';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL NavigationDrawer.tsx.
   Keys must exactly match NavigationDrawer.doc.json variant names.
   Every demo sits in a fixed-height staging wrapper so the full-height panel
   doesn't blow up the tile, and switches the active item via useState. */

const Stage = ({ children, height = 320 }: { children: React.ReactNode; height?: number }) => (
  <div style={{ height, display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>{children}</div>
);

/* The portal's real destinations — the same set the NavigationRail mirrors. */
const GROUPED_SECTIONS: NavigationDrawerSection[] = [
  {
    title: 'Quick access',
    items: [
      { id: 'map', label: 'Live map', icon: 'map' },
      { id: 'assets', label: 'Assets', icon: 'local_shipping' },
    ],
  },
  {
    title: 'Pillars',
    items: [
      { id: 'drivers', label: 'Drivers', icon: 'person' },
      { id: 'reports', label: 'Reports', icon: 'assessment' },
    ],
  },
  {
    title: 'Workflow & comms',
    items: [{ id: 'alerts', label: 'Alerts', icon: 'notifications', badge: 12 }],
  },
];

const FLAT_SECTION: NavigationDrawerSection[] = [
  {
    items: [
      { id: 'map', label: 'Live map', icon: 'map' },
      { id: 'assets', label: 'Assets', icon: 'local_shipping' },
      { id: 'drivers', label: 'Drivers', icon: 'person' },
      { id: 'reports', label: 'Reports', icon: 'assessment' },
    ],
  },
];

/* Wire each item's onClick to active-item state, keeping the data static above. */
const withActive = (
  sections: NavigationDrawerSection[],
  setActive: (id: string) => void
): NavigationDrawerSection[] =>
  sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item, onClick: () => setActive(item.id) })),
  }));

const Permanent = () => {
  const [active, setActive] = React.useState('map');
  return (
    <Stage>
      <NavigationDrawer sections={withActive(FLAT_SECTION, setActive)} activeId={active} height="100%" />
    </Stage>
  );
};

const Collapsible = () => {
  const [active, setActive] = React.useState('assets');
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Button
          variant="text"
          label={collapsed ? 'Expand' : 'Collapse'}
          leadingIcon={collapsed ? 'chevron_right' : 'chevron_left'}
          onClick={() => setCollapsed((c) => !c)}
        />
      </div>
      <Stage>
        <NavigationDrawer
          sections={withActive(FLAT_SECTION, setActive)}
          activeId={active}
          collapsed={collapsed}
          height="100%"
        />
      </Stage>
    </div>
  );
};

const Grouped = () => {
  const [active, setActive] = React.useState('drivers');
  return (
    <Stage height={360}>
      <NavigationDrawer sections={withActive(GROUPED_SECTIONS, setActive)} activeId={active} height="100%" />
    </Stage>
  );
};

/* Hero: the drawer as it ships — grouped by purpose, one active destination,
   an unread-alerts badge, fully clickable. */
export const hero = () => {
  const [active, setActive] = React.useState('map');
  return (
    <Stage height={360}>
      <NavigationDrawer sections={withActive(GROUPED_SECTIONS, setActive)} activeId={active} height="100%" />
    </Stage>
  );
};

export const demos: Record<string, React.ComponentType> = {
  Permanent,
  Collapsible,
  Grouped,
};
