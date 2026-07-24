import React from 'react';
import { NavigationRail, NavigationRailItem } from '../../design-system/components/NavigationRail/NavigationRail';
import { Drawer } from '../../design-system/components/Drawer/Drawer';
import { Button } from '../../design-system/components/Button/Button';
import { List } from '../../design-system/components/List/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

/* Live demos for the portal — rendered from the REAL NavigationRail.tsx.
   Keys must exactly match NavigationRail.doc.json variant names.
   Every demo sits in a fixed-height staging wrapper so the tall strip doesn't
   blow up the tile, and switches the active item via useState.

   The rail's destinations mirror the navigation Drawer's exactly (its keyRule:
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

/* Expandable: onExpand swaps the rail for a full docked Drawer with the
   SAME destinations (the doc's "toggles to the full navigation drawer"). */
const Expandable = () => {
  const [active, setActive] = React.useState('map');
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div>
      {expanded && (
        <div style={{ marginBottom: 8 }}>
          <Button variant="text" startIcon={<span aria-hidden="true">‹</span>} onClick={() => setExpanded(false)}>
            Collapse to rail
          </Button>
        </div>
      )}
      <Stage>
        {expanded ? (
          /* Drawer (MUI) replaces the old NavigationDrawer — variant="permanent"
             is the docked navigation form; open is always true (unmount to close,
             per Drawer.tsx). Same destinations as the rail, per its keyRule. */
          <Drawer
            variant="permanent"
            open
            slotProps={{
              paper: {
                sx: { position: 'static', width: 220 /* staging width inside the tile */ },
              },
            }}
          >
            <List aria-label="Main navigation">
              {ITEMS.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={active === item.id}
                  onClick={() => setActive(item.id)}
                >
                  <ListItemIcon aria-hidden="true">{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
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
