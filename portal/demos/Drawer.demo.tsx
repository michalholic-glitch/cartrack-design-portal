import React from 'react';
import { Drawer } from '../../design-system/components/Drawer/Drawer';
import { Button } from '../../design-system/components/Button/Button';
import { List } from '../../design-system/components/List/List';
import { Divider } from '../../design-system/components/Divider/Divider';
import { Checkbox } from '../../design-system/components/Checkbox/Checkbox';
import { ListItem, ListItemButton, ListItemText, FormControlLabel } from '@mui/material';

/* Live demos for the portal — rendered from the REAL Drawer.tsx (MUI v9 wrapper).
   Keys must exactly match Drawer.doc.json variant names.
   Wrapper convention: `open` is narrowed to the literal `true` — a Drawer is
   only rendered while open; we unmount to close (same as Dialog).
   Docked demos pin the Paper inside a position:relative stage via
   sx `& .MuiDrawer-paper { position: absolute }` so they stay contained. */

const NAV_WIDTH = 220;

const stageStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  height: 320,
  overflow: 'hidden',
  width: '100%',
  border: '1px solid rgba(0, 0, 0, 0.12) /* semantic.color.border.default */',
  borderRadius: 4 /* semantic.radius.default */,
  background: '#FFFFFF /* semantic.color.surface.default */',
};

const stageBodyStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: 16 /* semantic.spacing.md */,
  color: 'rgba(0, 0, 0, 0.6) /* semantic.color.text.secondary */',
  fontSize: '0.875rem /* semantic.typography.scale.body2 */',
};

/** Grouped nav content — one clear active destination, short top level. */
const NavContent = () => {
  const [active, setActive] = React.useState('Live map');
  return (
    <>
      <div
        style={{
          padding: 16 /* semantic.spacing.md */,
          fontWeight: 500,
          color: 'rgba(0, 0, 0, 0.87) /* semantic.color.text.primary */',
        }}
      >
        Fleet Portal
      </div>
      <Divider />
      <List aria-label="Primary navigation">
        {['Live map', 'Assets', 'Reports'].map((label) => (
          <ListItem key={label} disablePadding>
            <ListItemButton selected={label === active} onClick={() => setActive(label)}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List aria-label="Administration">
        {['Drivers', 'Geofences'].map((label) => (
          <ListItem key={label} disablePadding>
            <ListItemButton selected={label === active} onClick={() => setActive(label)}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

const PermanentDemo = () => (
  <div style={stageStyle}>
    <Drawer
      open
      variant="permanent"
      sx={{
        width: NAV_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { position: 'absolute', width: NAV_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <NavContent />
    </Drawer>
    <div style={stageBodyStyle}>
      Page content — the permanent drawer is always docked beside it. 42 vehicles on the live
      map; CA 123-456 last reported 2 min ago.
    </div>
  </div>
);

const PersistentDemo = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={stageStyle}>
      {open && (
        <Drawer
          open
          variant="persistent"
          sx={{
            '& .MuiDrawer-paper': { position: 'absolute', width: NAV_WIDTH, boxSizing: 'border-box' },
          }}
        >
          <NavContent />
        </Drawer>
      )}
      <div
        style={{
          ...stageBodyStyle,
          marginLeft: open ? NAV_WIDTH : 0,
          transition: 'margin-left 225ms cubic-bezier(0, 0, 0.2, 1)',
        }}
      >
        {/* Persistent drawers have no backdrop — provide your own close affordance. */}
        <Button variant="outlined" onClick={() => setOpen(!open)}>
          {open ? 'Hide navigation' : 'Show navigation'}
        </Button>
        <p style={{ marginTop: 16 /* semantic.spacing.md */ }}>
          Content reflows beside the docked drawer instead of being overlaid.
        </p>
      </div>
    </div>
  );
};

const TemporaryDemo = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* Real behavior: the temporary variant portals a modal overlay over the page. */}
      <Button variant="outlined" onClick={() => setOpen(true)}>
        View vehicle summary
      </Button>
      {open && (
        <Drawer
          open
          anchor="right"
          onClose={() => setOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: 320 } }}
        >
          <div style={{ padding: 16 /* semantic.spacing.md */ }}>
            <div
              style={{
                fontWeight: 500,
                marginBottom: 8 /* semantic.spacing.sm */,
                color: 'rgba(0, 0, 0, 0.87) /* semantic.color.text.primary */',
              }}
            >
              CA 123-456
            </div>
            <div
              style={{
                color: 'rgba(0, 0, 0, 0.6) /* semantic.color.text.secondary */',
                fontSize: '0.875rem /* semantic.typography.scale.body2 */',
                marginBottom: 16 /* semantic.spacing.md */,
              }}
            >
              Driver: Jane Cooper
              <br />
              Depot: Cape Town Main
              <br />
              Status: Driving · 62 km/h
              <br />
              Last report: 2 min ago
            </div>
            <Button variant="text" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </Drawer>
      )}
    </>
  );
};

const FiltersPanelDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<Record<string, boolean>>({
    Driving: true,
    Idling: false,
    Parked: false,
    'No signal': false,
  });
  const activeCount = Object.values(filters).filter(Boolean).length;
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Filters ({activeCount})
      </Button>
      {open && (
        <Drawer
          open
          anchor="right"
          onClose={() => setOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: 300 } }}
        >
          <div style={{ padding: 16 /* semantic.spacing.md */ }}>
            <div
              style={{
                fontWeight: 500,
                marginBottom: 8 /* semantic.spacing.sm */,
                color: 'rgba(0, 0, 0, 0.87) /* semantic.color.text.primary */',
              }}
            >
              Filter vehicles
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Object.keys(filters).map((label) => (
                <FormControlLabel
                  key={label}
                  control={
                    <Checkbox
                      checked={filters[label]}
                      onChange={(e) => setFilters({ ...filters, [label]: e.target.checked })}
                    />
                  }
                  label={label}
                />
              ))}
            </div>
            <Divider sx={{ my: 2 }} />
            <div style={{ display: 'flex', gap: 8 /* semantic.spacing.sm */ }}>
              <Button variant="contained" onClick={() => setOpen(false)}>
                Apply
              </Button>
              <Button
                variant="text"
                onClick={() =>
                  setFilters({ Driving: false, Idling: false, Parked: false, 'No signal': false })
                }
              >
                Clear all
              </Button>
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
};

export const hero: React.ComponentType = PermanentDemo;

export const demos: Record<string, React.ComponentType> = {
  'Permanent (docked navigation drawer)': PermanentDemo,
  'Persistent (toggleable docked drawer)': PersistentDemo,
  'Temporary (modal side sheet / overlay)': TemporaryDemo,
  'Filters panel': FiltersPanelDemo,
};
