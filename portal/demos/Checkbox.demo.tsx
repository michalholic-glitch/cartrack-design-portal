import React from 'react';
import { Checkbox } from '../../design-system/components/Checkbox/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

/* Live demos for the portal — rendered from the REAL Checkbox.tsx (a thin
   wrapper over @mui/material/Checkbox). Keys must exactly match
   Checkbox.doc.json variant names.
   MUI Checkbox has no `label` prop — every labelled instance composes with
   @mui/material/FormControlLabel, exactly as Checkbox.doc.json's doThis
   demands. The dense "small" size comes from cartrackTheme's
   MuiCheckbox defaultProps (the portal mount supplies the ThemeProvider). */

const ROWS = [
  { id: 'CA 123-456', driver: 'Jane Cooper' },
  { id: 'CA 789-012', driver: 'Frank Kim' },
  { id: 'CA 345-678', driver: 'Ayanda Dlamini' },
];

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px' /* semantic.spacing.sm */,
  padding: '4px 8px' /* semantic.spacing.xs semantic.spacing.sm */,
  borderBottom: '1px solid rgba(0,0,0,0.12)' /* semantic.borderWidth.hairline + semantic.color.border.default */,
  font: '400 14px/1.43 system-ui, sans-serif' /* semantic.typography.scale.body2 */,
  color: 'rgba(0,0,0,0.87)' /* semantic.color.text.primary */,
};

const StandaloneCheckbox = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={(_, next) => setChecked(next)} />}
      label="Pre-trip inspection for CA 123-456 is complete"
    />
  );
};

const RowCheckboxes = () => {
  const [selected, setSelected] = React.useState<string[]>(['CA 123-456']);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <div style={{ minWidth: '280px' }}>
      {ROWS.map((row) => (
        <div key={row.id} style={rowStyle}>
          <Checkbox
            checked={selected.includes(row.id)}
            onChange={() => toggle(row.id)}
            slotProps={{ input: { 'aria-label': `Select ${row.id}` } }}
          />
          <span>{row.id}</span>
          <span style={{ color: 'rgba(0,0,0,0.6)' /* semantic.color.text.secondary */ }}>
            {row.driver}
          </span>
        </div>
      ))}
      <div
        style={{
          padding: '8px' /* semantic.spacing.sm */,
          font: '400 12px/1.66 system-ui, sans-serif' /* semantic.typography.scale.caption */,
          color: 'rgba(0,0,0,0.6)' /* semantic.color.text.secondary */,
        }}
      >
        {selected.length} of {ROWS.length} vehicles selected
      </div>
    </div>
  );
};

const SelectAllCheckbox = () => {
  const [selected, setSelected] = React.useState<string[]>(['CA 123-456']);
  const allChecked = selected.length === ROWS.length;
  const someChecked = selected.length > 0 && !allChecked;
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <div style={{ minWidth: '280px' }}>
      <div style={{ ...rowStyle, fontWeight: 500 /* semantic.typography.scale.subtitle2 weight */ }}>
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onChange={() => setSelected(allChecked ? [] : ROWS.map((r) => r.id))}
          slotProps={{ input: { 'aria-label': 'Select all vehicles' } }}
        />
        <span>Vehicle</span>
      </div>
      {ROWS.map((row) => (
        <div key={row.id} style={rowStyle}>
          <Checkbox
            checked={selected.includes(row.id)}
            onChange={() => toggle(row.id)}
            slotProps={{ input: { 'aria-label': `Select ${row.id}` } }}
          />
          <span>{row.id}</span>
          <span style={{ color: 'rgba(0,0,0,0.6)' /* semantic.color.text.secondary */ }}>
            {row.driver}
          </span>
        </div>
      ))}
    </div>
  );
};

export const hero: React.ComponentType = () => (
  <FormControlLabel
    control={<Checkbox defaultChecked />}
    label="Notify me when this vehicle leaves the depot"
  />
);

export const demos: Record<string, React.ComponentType> = {
  'Standalone checkbox': StandaloneCheckbox,
  'List/table row checkbox': RowCheckboxes,
  'Header select-all checkbox (indeterminate)': SelectAllCheckbox,
};
