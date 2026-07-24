import React from 'react';
import { List } from '../../design-system/components/List/List';
import { Checkbox } from '../../design-system/components/Checkbox/Checkbox';
import { Switch } from '../../design-system/components/Switch/Switch';
import { Divider } from '../../design-system/components/Divider/Divider';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';

/* Live demos for the portal — rendered from the REAL List.tsx (MUI v9 wrapper).
   Keys must exactly match List.doc.json variant names.
   List is just the <ul> container — rows are composed from plain
   @mui/material ListItem / ListItemButton / ListItemText / ListItemIcon.
   Clickable rows use ListItemButton (dontDoThis: never a plain ListItem). */

const panelStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 360,
  border: '1px solid rgba(0, 0, 0, 0.12) /* semantic.color.border.default */',
  borderRadius: 4 /* semantic.radius.default */,
  background: '#FFFFFF /* semantic.color.surface.paper */',
};

const SingleLineDemo = () => (
  <div style={panelStyle}>
    <List aria-label="Drivers">
      {['Jane Cooper', 'Frank Kim', 'Ayesha Patel', 'Thabo Nkosi'].map((name) => (
        <ListItem key={name}>
          <ListItemText primary={name} />
        </ListItem>
      ))}
    </List>
  </div>
);

const VEHICLES = [
  { reg: 'CA 123-456', detail: 'Jane Cooper · Cape Town Main' },
  { reg: 'CA 789-012', detail: 'Frank Kim · Cape Town Main' },
  { reg: 'CA 345-678', detail: 'Unassigned · Paarl depot' },
];

const TwoLineDemo = () => {
  const [selected, setSelected] = React.useState('CA 123-456');
  return (
    <div style={panelStyle}>
      <List aria-label="Vehicles">
        {VEHICLES.map((v) => (
          <ListItem key={v.reg} disablePadding>
            <ListItemButton selected={v.reg === selected} onClick={() => setSelected(v.reg)}>
              <ListItemText primary={v.reg} secondary={v.detail} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const ALERTS = [
  {
    title: 'Harsh braking — CA 123-456',
    body: 'Jane Cooper · N1 near Century City, Cape Town. Speed dropped 78 → 22 km/h in 2.1 s; trip continued normally afterwards.',
  },
  {
    title: 'Geofence exit — CA 789-012',
    body: 'Frank Kim · Left "Cape Town Main depot" at 06:42, outside the permitted 07:00–18:00 window configured for this vehicle group.',
  },
];

const ThreeLineDemo = () => (
  <div style={{ ...panelStyle, maxWidth: 420 }}>
    <List aria-label="Recent alerts">
      {ALERTS.map((a, i) => (
        <React.Fragment key={a.title}>
          {i > 0 && <Divider component="li" />}
          <ListItem alignItems="flex-start">
            <ListItemText primary={a.title} secondary={a.body} />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  </div>
);

const WithControlsDemo = () => {
  const [checked, setChecked] = React.useState<string[]>(['CA 123-456']);
  const [notify, setNotify] = React.useState(true);
  const toggle = (reg: string) =>
    setChecked((c) => (c.includes(reg) ? c.filter((r) => r !== reg) : [...c, reg]));
  return (
    <div style={panelStyle}>
      <List
        aria-label="Report vehicles"
        subheader={<ListSubheader>Include in report ({checked.length})</ListSubheader>}
      >
        {VEHICLES.map((v) => {
          const labelId = `list-controls-${v.reg.replace(/\s/g, '')}`;
          return (
            <ListItem key={v.reg} disablePadding>
              <ListItemButton onClick={() => toggle(v.reg)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(v.reg)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={v.reg} secondary={v.detail} />
              </ListItemButton>
            </ListItem>
          );
        })}
        <Divider component="li" />
        <ListItem
          secondaryAction={
            <Switch
              edge="end"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              inputProps={{ 'aria-labelledby': 'list-controls-notify' }}
            />
          }
        >
          <ListItemText
            id="list-controls-notify"
            primary="Email me this report"
            secondary="Weekly, Monday 07:00"
          />
        </ListItem>
      </List>
    </div>
  );
};

export const hero: React.ComponentType = TwoLineDemo;

export const demos: Record<string, React.ComponentType> = {
  'Single-line': SingleLineDemo,
  'Two-line': TwoLineDemo,
  'Three-line': ThreeLineDemo,
  'With controls': WithControlsDemo,
};
