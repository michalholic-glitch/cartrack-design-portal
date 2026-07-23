import React from 'react';
import { SideSheet } from '../../design-system/components/SideSheet/SideSheet';
import { Button } from '../../design-system/components/Button/Button';
import { SelectionControl } from '../../design-system/components/SelectionControl/SelectionControl';
import { Slider } from '../../design-system/components/Slider/Slider';

/* Live demos for the portal — rendered from the REAL SideSheet.tsx.
   Keys must exactly match SideSheet.doc.json variant names.
   Each demo is staged inside a fixed-height "page region" so the sheet docks
   against something; the modal stage adds transform:translateZ(0) so the
   fixed-position mdc-drawer-scrim is contained by the stage, not the viewport. */

/** Fixed-height stage simulating a page region beside/behind the sheet. */
const Stage = ({ children, contain }: { children: React.ReactNode; contain?: boolean }) => (
  <div
    style={{
      position: 'relative',
      height: 360,
      overflow: 'hidden',
      display: 'flex',
      border: '1px solid rgba(0, 0, 0, 0.12)' /* semantic.color.border.default */,
      borderRadius: 4 /* semantic.radius.default */,
      /* creates a containing block so the modal variant's fixed scrim stays inside the stage */
      transform: contain ? 'translateZ(0)' : undefined,
    }}
  >
    {children}
  </div>
);

/** Simplified vehicle list standing in for the main content the sheet sits beside. */
const VehicleList = ({ selected }: { selected: string }) => {
  const rows = ['CA 123-456', 'CA 208-119', 'CA 341-902', 'CA 455-210', 'CA 512-777'];
  return (
    <div style={{ flex: 1, padding: 16 /* semantic.spacing.md */, overflow: 'auto' }}>
      <div style={{ fontWeight: 500, marginBottom: 8 /* semantic.spacing.sm */ }}>Vehicles</div>
      {rows.map((reg) => (
        <div
          key={reg}
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)' /* semantic.color.border.default */,
            fontSize: '.875rem',
            background: reg === selected ? 'rgba(244, 119, 53, 0.08)' /* semantic.color.brand.primary.main @ 8% state layer */ : undefined,
            color: 'rgba(0, 0, 0, 0.87)' /* semantic.color.text.primary */,
          }}
        >
          {reg}
        </div>
      ))}
    </div>
  );
};

const detailRow = (label: string, value: string) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '.875rem' }}>
    <span style={{ color: 'rgba(0, 0, 0, 0.6)' /* semantic.color.text.secondary */ }}>{label}</span>
    <span style={{ color: 'rgba(0, 0, 0, 0.87)' /* semantic.color.text.primary */ }}>{value}</span>
  </div>
);

const VehicleDetail = () => (
  <div style={{ padding: '0 16px' /* semantic.spacing.md */ }}>
    {detailRow('Status', 'Active — driving')}
    {detailRow('Odometer', '84 112 km')}
    {detailRow('Last trip', 'Depot → N1 Northbound')}
    {detailRow('Fuel level', '62%')}
    {detailRow('Next service', '20 Jun 2026')}
  </div>
);

const Standard = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Stage>
      <VehicleList selected="CA 123-456" />
      {open ? (
        <SideSheet
          variant="standard"
          title="CA 123-456"
          subtitle="Jane Cooper — Active"
          onClose={() => setOpen(false)}
          footer={<Button variant="text" label="View full profile" />}
        >
          <VehicleDetail />
        </SideSheet>
      ) : (
        <div style={{ padding: 16 /* semantic.spacing.md */, alignSelf: 'flex-start' }}>
          <Button variant="outlined" label="Reopen detail" onClick={() => setOpen(true)} />
        </div>
      )}
    </Stage>
  );
};

const Modal = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Stage contain>
      <VehicleList selected="CA 208-119" />
      <div style={{ padding: 16 /* semantic.spacing.md */, alignSelf: 'flex-start' }}>
        <Button variant="contained" label="Edit vehicle" onClick={() => setOpen(true)} />
      </div>
      <SideSheet
        variant="modal"
        open={open}
        title="Edit CA 208-119"
        subtitle="Changes apply on save"
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', gap: 8 /* semantic.spacing.sm */ }}>
            <Button variant="contained" label="Save" onClick={() => setOpen(false)} />
            <Button variant="text" label="Cancel" onClick={() => setOpen(false)} />
          </div>
        }
      >
        <VehicleDetail />
      </SideSheet>
    </Stage>
  );
};

const FiltersPanel = () => {
  const [active, setActive] = React.useState(true);
  const [idle, setIdle] = React.useState(true);
  const [offline, setOffline] = React.useState(false);
  const [radius, setRadius] = React.useState(15);
  return (
    <Stage>
      <VehicleList selected="" />
      <SideSheet
        variant="standard"
        title="Filters"
        subtitle="3 of 5 vehicles shown"
        onClose={() => {}}
        footer={
          <div style={{ display: 'flex', gap: 8 /* semantic.spacing.sm */ }}>
            <Button variant="contained" label="Apply" />
            <Button variant="text" label="Clear all" />
          </div>
        }
      >
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 /* semantic.spacing.sm */ }}>
          <SelectionControl type="checkbox" label="Active" checked={active} onChange={setActive} />
          <SelectionControl type="checkbox" label="Idle" checked={idle} onChange={setIdle} />
          <SelectionControl type="checkbox" label="Offline" checked={offline} onChange={setOffline} />
          <div style={{ marginTop: 8, fontSize: '.8rem', color: 'rgba(0, 0, 0, 0.6)' /* semantic.color.text.secondary */ }}>
            Within {radius} km of depot
          </div>
          <Slider
            variant="discrete"
            label="Distance from depot"
            value={radius}
            min={5}
            max={50}
            step={5}
            onChange={(v) => {
              if (typeof v === 'number') setRadius(v);
            }}
          />
        </div>
      </SideSheet>
    </Stage>
  );
};

/* Hero: the canonical use — a vehicle's detail docked beside the list that
   stays visible, with the selected row highlighted. */
export const hero = Standard;

export const demos: Record<string, React.ComponentType> = {
  'Standard (pushes content)': Standard,
  'Modal (over a scrim)': Modal,
  'Filters panel': FiltersPanel,
};
