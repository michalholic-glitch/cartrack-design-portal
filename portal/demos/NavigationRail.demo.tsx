import React from 'react';
import { NavigationRail, NavigationRailItem } from '../../design-system/components/NavigationRail/NavigationRail';
import { NavigationDrawer } from '../../design-system/components/NavigationDrawer/NavigationDrawer';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL NavigationRail.tsx.
   Keys must exactly match NavigationRail.doc.json variant names.
   Every demo sits in a fixed-height staging wrapper so the tall strip doesn't
   blow up the tile, and switches the active item via useState.

   The rail's destinations mirror the NavigationDrawer's exactly (its keyRule:
   same destinations at different widths) — the Expandable demo makes that
   literal by toggling between the two components. */

const Stage = ({ children, height = 320 }: { children: React.ReactNode; height?: number }) => (
  <div style={{ height, display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>{children}</div>
);

/* NavigationRailItem.icon is a React.ReactNode glyph (see NavigationRail.tsx). */
const ITEMS: NavigationRailItem[] = [
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'assets', label: 'Assets', icon: '🚚' },
  { id: 'drivers', label: 'Drivers', icon: '👤' },
  { id: 'reports', label: 'Reports', icon: '📊' },
];

const withActive = (setActive: (id: string) => void): NavigationRailItem[] =>
  ITEMS.map((item) => ({ ...item, onClick: () => setActive(item.id) }));

const Labelled = () => {
  const [active, setActive] = React.useState('map');
  return (
    <Stage>
      <NavigationRail items={withActive(setActive)} activeId={active} showLabels />
    </Stage>
  );
};

const IconOnly = () => {
  const [active, setActive] = React.useState('assets');
  return (
    <Stage>
      <NavigationRail items={withActive(setActive)} activeId={active} showLabels={false} />
    </Stage>
  );
};

/* Expandable: onExpand swaps the rail for the full NavigationDrawer with the
   SAME destinations (the doc's "toggles to the full navigation drawer"). */
const Expandable = () => {
  const [active, setActive] = React.useState('map');
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div>
      {expanded && (
        <div style={{ marginBottom: 8 }}>
          <Button variant="text" label="Collapse to rail" leadingIcon="chevron_left" onClick={() => setExpanded(false)} />
        </div>
      )}
      <Stage>
        {expanded ? (
          <NavigationDrawer
            sections={[
              {
                items: [
                  { id: 'map', label: 'Map', icon: 'map', onClick: () => setActive('map') },
                  { id: 'assets', label: 'Assets', icon: 'local_shipping', onClick: () => setActive('assets') },
                  { id: 'drivers', label: 'Drivers', icon: 'person', onClick: () => setActive('drivers') },
                  { id: 'reports', label: 'Reports', icon: 'assessment', onClick: () => setActive('reports') },
                ],
              },
            ]}
            activeId={active}
            height="100%"
          />
        ) : (
          <NavigationRail
            items={withActive(setActive)}
            activeId={active}
            showLabels
            onExpand={() => setExpanded(true)}
          />
        )}
      </Stage>
    </div>
  );
};

/* Hero: the recommended labelled form, active-item switching live. */
export const hero = () => {
  const [active, setActive] = React.useState('map');
  return (
    <Stage>
      <NavigationRail items={withActive(setActive)} activeId={active} showLabels />
    </Stage>
  );
};

export const demos: Record<string, React.ComponentType> = {
  Labelled,
  'Icon-only': IconOnly,
  Expandable,
};
