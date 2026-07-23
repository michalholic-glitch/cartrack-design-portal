import React from 'react';
import { SelectionControl } from '../../design-system/components/SelectionControl/SelectionControl';

/* Live demos for the portal — rendered from the REAL SelectionControl.tsx.
   Keys must exactly match SelectionControl.doc.json variant names.
   All three types are genuinely controlled via useState. */

const groupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };
const legendStyle: React.CSSProperties = {
  fontSize: '.8rem',
  fontWeight: 500,
  color: 'rgba(0, 0, 0, 0.6)' /* semantic.color.text.secondary */,
  marginBottom: 4,
};

/** Checkbox group with a select-all parent showing the indeterminate dash. */
const Checkboxes = () => {
  const [types, setTypes] = React.useState<Record<string, boolean>>({
    'Light vehicles': true,
    'Heavy trucks': true,
    Trailers: false,
  });
  const keys = Object.keys(types);
  const checkedCount = keys.filter((k) => types[k]).length;
  const allChecked = checkedCount === keys.length;
  const someChecked = checkedCount > 0 && !allChecked;
  return (
    <div style={groupStyle}>
      <span style={legendStyle}>Vehicle types in report</span>
      <SelectionControl
        type="checkbox"
        label="All vehicle types"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={(next) => setTypes(Object.fromEntries(keys.map((k) => [k, next])))}
      />
      {keys.map((k) => (
        <div key={k} style={{ marginLeft: 32 }}>
          <SelectionControl
            type="checkbox"
            label={k}
            checked={types[k]}
            onChange={(next) => setTypes((t) => ({ ...t, [k]: next }))}
          />
        </div>
      ))}
    </div>
  );
};

/** Radio group — one report format from a short mutually exclusive set. */
const Radios = () => {
  const [format, setFormat] = React.useState('PDF');
  const options = ['PDF', 'Excel (XLSX)', 'CSV'];
  return (
    <div style={groupStyle} role="radiogroup" aria-label="Report format">
      <span style={legendStyle}>Report format</span>
      {options.map((opt) => (
        <SelectionControl
          key={opt}
          type="radio"
          name="report-format"
          label={opt}
          checked={format === opt}
          onChange={(next) => {
            if (next) setFormat(opt);
          }}
        />
      ))}
    </div>
  );
};

/** Switches — instant-effect notification settings, one disabled. */
const Switches = () => {
  const [speeding, setSpeeding] = React.useState(true);
  const [geofence, setGeofence] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={legendStyle}>Notifications</span>
      <div>
        <SelectionControl type="switch" label="Speeding alerts" checked={speeding} onChange={setSpeeding} />
      </div>
      <div>
        <SelectionControl type="switch" label="Geofence entry/exit alerts" checked={geofence} onChange={setGeofence} />
      </div>
      <div>
        <SelectionControl type="switch" label="Crash alerts (managed by admin)" checked disabled />
      </div>
    </div>
  );
};

/* Hero: all three control kinds side by side, each controlled and clickable. */
export const hero = () => (
  <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
    <Checkboxes />
    <Radios />
    <Switches />
  </div>
);

export const demos: Record<string, React.ComponentType> = {
  Checkbox: Checkboxes,
  'Radio button': Radios,
  Switch: Switches,
};
