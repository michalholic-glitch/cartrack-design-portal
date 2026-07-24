import React from 'react';
import { Tabs } from '../../design-system/components/Tabs/Tabs';
import Tab from '@mui/material/Tab';

/* Live demos for the portal — rendered from the REAL Tabs.tsx (a bare wrapper
   over @mui/material/Tabs; compose with <Tab> children per Tabs.doc.json).
   Keys must exactly match Tabs.doc.json variant names.

   Tabs is controlled-only: every demo drives a value/onChange pair with
   useState and renders a fleet tabpanel for the active value. */

/* Minimal tabpanel wired with the id/aria-controls pairing MUI's docs use. */
const TabPanel = ({
  value,
  index,
  prefix,
  children,
}: {
  value: number;
  index: number;
  prefix: string;
  children: React.ReactNode;
}) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`${prefix}-panel-${index}`}
    aria-labelledby={`${prefix}-tab-${index}`}
    style={{
      padding: 16, // semantic.spacing.md
      fontSize: '.85rem',
      color: 'rgba(0,0,0,.6)', // semantic.color.text.secondary
    }}
  >
    {value === index && children}
  </div>
);

const a11yProps = (prefix: string, index: number) => ({
  id: `${prefix}-tab-${index}`,
  'aria-controls': `${prefix}-panel-${index}`,
});

/* Inline glyphs — @mui/icons-material isn't installed, so plain SVG paths
   (inherit currentColor). */
const RouteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 15.18V7a4 4 0 0 0-8 0v10a2 2 0 0 1-4 0V8.82A3 3 0 1 0 5 8.82V17a4 4 0 0 0 8 0V7a2 2 0 0 1 4 0v8.18A3 3 0 1 0 19 15.18z" />
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

/* Hero: the vehicle-detail tab bar — peer views of one vehicle. */
export const hero = () => {
  const [value, setValue] = React.useState(0);
  return (
    <div style={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={(_e, v: number) => setValue(v)}
        aria-label="Vehicle CA 123-456 sections"
        sx={{ borderBottom: 1, borderColor: 'divider' /* semantic.color.border.default */ }}
      >
        <Tab label="Overview" {...a11yProps('tabs-hero', 0)} />
        <Tab label="Trips" {...a11yProps('tabs-hero', 1)} />
        <Tab label="Alerts" {...a11yProps('tabs-hero', 2)} />
        <Tab label="Service" {...a11yProps('tabs-hero', 3)} />
      </Tabs>
      <TabPanel value={value} index={0} prefix="tabs-hero">
        CA 123-456 · Toyota Hilux · Driver: Jane Cooper · Cape Town depot
      </TabPanel>
      <TabPanel value={value} index={1} prefix="tabs-hero">
        14 trips this week · 1,082 km · last trip ended 16:42
      </TabPanel>
      <TabPanel value={value} index={2} prefix="tabs-hero">
        3 open alerts · 2 harsh braking · 1 geofence exit
      </TabPanel>
      <TabPanel value={value} index={3} prefix="tabs-hero">
        Next service due in 3 days · 118,400 km
      </TabPanel>
    </div>
  );
};

const Standard = () => {
  const [value, setValue] = React.useState(0);
  return (
    <div style={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={(_e, v: number) => setValue(v)}
        aria-label="Driver Jane Cooper sections"
        sx={{ borderBottom: 1, borderColor: 'divider' /* semantic.color.border.default */ }}
      >
        <Tab label="Profile" {...a11yProps('tabs-std', 0)} />
        <Tab label="Trips" {...a11yProps('tabs-std', 1)} />
        <Tab label="Scorecard" {...a11yProps('tabs-std', 2)} />
      </Tabs>
      <TabPanel value={value} index={0} prefix="tabs-std">
        Jane Cooper · Licence C1 · Cape Town depot
      </TabPanel>
      <TabPanel value={value} index={1} prefix="tabs-std">
        6 trips today, mostly CA 123-456
      </TabPanel>
      <TabPanel value={value} index={2} prefix="tabs-std">
        Safety score 92/100 — top decile in the fleet
      </TabPanel>
    </div>
  );
};

const Scrollable = () => {
  const depots = [
    'Cape Town',
    'Johannesburg',
    'Durban',
    'Gqeberha',
    'Bloemfontein',
    'Polokwane',
    'Nelspruit',
    'Kimberley',
  ];
  const [value, setValue] = React.useState(0);
  return (
    <div style={{ maxWidth: 360 /* staging: force overflow so the bar scrolls */ }}>
      <Tabs
        value={value}
        onChange={(_e, v: number) => setValue(v)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Depots"
        sx={{ borderBottom: 1, borderColor: 'divider' /* semantic.color.border.default */ }}
      >
        {depots.map((d, i) => (
          <Tab key={d} label={d} {...a11yProps('tabs-scroll', i)} />
        ))}
      </Tabs>
      <TabPanel value={value} index={value} prefix="tabs-scroll">
        {depots[value]} depot — vehicles on site refresh live.
      </TabPanel>
    </div>
  );
};

const FullWidth = () => {
  const [value, setValue] = React.useState(0);
  return (
    <div style={{ maxWidth: 360 /* staging: small (mobile-like) view */ }}>
      <Tabs
        value={value}
        onChange={(_e, v: number) => setValue(v)}
        variant="fullWidth"
        aria-label="Map layers"
        sx={{ borderBottom: 1, borderColor: 'divider' /* semantic.color.border.default */ }}
      >
        <Tab label="Live" {...a11yProps('tabs-full', 0)} />
        <Tab label="Trips" {...a11yProps('tabs-full', 1)} />
        <Tab label="Zones" {...a11yProps('tabs-full', 2)} />
      </Tabs>
      <TabPanel value={value} index={0} prefix="tabs-full">
        42 vehicles reporting live positions
      </TabPanel>
      <TabPanel value={value} index={1} prefix="tabs-full">
        Replay today's trips on the map
      </TabPanel>
      <TabPanel value={value} index={2} prefix="tabs-full">
        5 geofence zones drawn
      </TabPanel>
    </div>
  );
};

const Vertical = () => {
  const [value, setValue] = React.useState(0);
  return (
    <div style={{ display: 'flex', height: 180 /* staging height for the rail */ }}>
      <Tabs
        value={value}
        onChange={(_e, v: number) => setValue(v)}
        orientation="vertical"
        aria-label="Report categories"
        sx={{ borderRight: 1, borderColor: 'divider' /* semantic.color.border.default */ }}
      >
        <Tab label="Utilisation" {...a11yProps('tabs-vert', 0)} />
        <Tab label="Fuel" {...a11yProps('tabs-vert', 1)} />
        <Tab label="Drivers" {...a11yProps('tabs-vert', 2)} />
      </Tabs>
      <TabPanel value={value} index={0} prefix="tabs-vert">
        Fleet utilisation, June: 78% average across 42 vehicles.
      </TabPanel>
      <TabPanel value={value} index={1} prefix="tabs-vert">
        Fuel spend, June: R 184,220 · 3 anomalies flagged.
      </TabPanel>
      <TabPanel value={value} index={2} prefix="tabs-vert">
        Driver scorecards ready for 18 drivers.
      </TabPanel>
    </div>
  );
};

const IconLabel = () => {
  const [value, setValue] = React.useState(1);
  return (
    <div style={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={(_e, v: number) => setValue(v)}
        aria-label="Vehicle activity"
        sx={{ borderBottom: 1, borderColor: 'divider' /* semantic.color.border.default */ }}
      >
        <Tab
          icon={<RouteIcon />}
          iconPosition="start"
          label="Trips"
          {...a11yProps('tabs-icon', 0)}
        />
        {/* Count composed into the label node, per Tabs.doc.json's variant note. */}
        <Tab
          icon={<BellIcon />}
          iconPosition="start"
          label={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 /* semantic.spacing.sm */ }}>
              Alerts
              <span
                style={{
                  fontSize: '.7rem',
                  lineHeight: '18px',
                  minWidth: 18,
                  borderRadius: 9,
                  padding: '0 4px', // semantic.spacing.xs
                  background: '#F44336', // semantic.color.status.error.main
                  color: '#FFFFFF', // status contrastText (see theme.ts palette.error)
                }}
              >
                3
              </span>
            </span>
          }
          {...a11yProps('tabs-icon', 1)}
        />
      </Tabs>
      <TabPanel value={value} index={0} prefix="tabs-icon">
        Trips for CA 123-456, today
      </TabPanel>
      <TabPanel value={value} index={1} prefix="tabs-icon">
        3 open alerts for CA 123-456
      </TabPanel>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'variant="standard"': Standard,
  'variant="scrollable"': Scrollable,
  'variant="fullWidth"': FullWidth,
  'orientation="vertical"': Vertical,
  'Tab with icon / label': IconLabel,
};
