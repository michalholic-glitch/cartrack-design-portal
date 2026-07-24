import React from 'react';
import { Switch } from '../../design-system/components/Switch/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { List } from '../../design-system/components/List/List';

/* Live demos for the portal — rendered from the REAL Switch.tsx (a thin wrapper
   over @mui/material/Switch; theme.ts's MuiSwitch defaultProps make it size="small").
   Keys must exactly match Switch.doc.json variant names.

   Switch has no label prop — every labelled instance below composes
   FormControlLabel or a ListItem, per Switch.doc.json's doThis. Each demo
   applies its effect the moment it's toggled (instant-apply contract). */

/* Hero: a settings toggle that visibly applies instantly — no Save button. */
export const hero = () => {
  const [on, setOn] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 /* semantic.spacing.xs */ }}>
      <FormControlLabel
        control={<Switch checked={on} onChange={(e) => setOn(e.target.checked)} />}
        label="Live tracking alerts"
      />
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        {on
          ? 'Applied instantly — CA 123-456 will alert on geofence exit.'
          : 'Applied instantly — alerts for CA 123-456 are off.'}
      </span>
    </div>
  );
};

const Standalone = () => {
  const [nightAlerts, setNightAlerts] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 /* semantic.spacing.sm */ }}>
      <FormControlLabel
        control={
          <Switch checked={nightAlerts} onChange={(e) => setNightAlerts(e.target.checked)} />
        }
        label="Night driving alerts (22:00–05:00)"
      />
      {/* Disabled state: setting locked by the fleet admin role. */}
      <FormControlLabel
        control={<Switch checked disabled />}
        label="Speed-limit alerts (enforced by admin)"
      />
    </div>
  );
};

/* Trailing control on settings-list rows — edge="end" per Switch.doc.json. */
const ListItemTrailing = () => {
  const [rows, setRows] = React.useState({ geofence: true, service: true, driver: false });
  const toggle = (key: keyof typeof rows) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setRows((r) => ({ ...r, [key]: e.target.checked }));
  return (
    <List
      aria-label="Notification settings"
      style={{ width: '100%', maxWidth: 380 /* staging width only */ }}
    >
      <ListItem
        secondaryAction={
          <Switch
            edge="end"
            checked={rows.geofence}
            onChange={toggle('geofence')}
            slotProps={{ input: { 'aria-labelledby': 'switch-demo-geofence' } }}
          />
        }
      >
        <ListItemText
          id="switch-demo-geofence"
          primary="Geofence exit alerts"
          secondary="All vehicles, Cape Town depot"
        />
      </ListItem>
      <ListItem
        secondaryAction={
          <Switch
            edge="end"
            checked={rows.service}
            onChange={toggle('service')}
            slotProps={{ input: { 'aria-labelledby': 'switch-demo-service' } }}
          />
        }
      >
        <ListItemText
          id="switch-demo-service"
          primary="Service-due reminders"
          secondary="7 days before due date"
        />
      </ListItem>
      <ListItem
        secondaryAction={
          <Switch
            edge="end"
            checked={rows.driver}
            onChange={toggle('driver')}
            slotProps={{ input: { 'aria-labelledby': 'switch-demo-driver' } }}
          />
        }
      >
        <ListItemText
          id="switch-demo-driver"
          primary="Driver scorecard digest"
          secondary="Weekly email to Jane Cooper"
        />
      </ListItem>
    </List>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Standalone toggle': Standalone,
  'List item trailing toggle': ListItemTrailing,
};
