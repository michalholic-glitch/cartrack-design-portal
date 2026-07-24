import React from 'react';
import { Radio } from '../../design-system/components/Radio/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

/* Live demos for the portal — rendered from the REAL Radio.tsx (thin wrapper over
   @mui/material/Radio, MUI v9; theme.ts defaults it to size="small" fleet-wide).
   Keys must exactly match Radio.doc.json variant names. Both variants are
   expressible live — none omitted.
   Grouping composes the real pairing components straight from @mui/material —
   RadioGroup / FormControlLabel / FormControl / FormLabel have no design-system
   wrappers (karoo-ui re-exports them as-is), so this is the documented pattern. */

const captionStyle: React.CSSProperties = {
  fontSize: '12px /* semantic.typography.scale.caption */',
  color: 'rgba(0, 0, 0, 0.6) /* semantic.color.text.secondary */',
};

/* Hero — the standard pattern at real size: FormControl + FormLabel group name,
   RadioGroup owning value/name/onChange, one FormControlLabel per Radio. */
export const hero: React.ComponentType = () => {
  const [period, setPeriod] = React.useState('weekly');
  return (
    <FormControl>
      <FormLabel id="report-period-label">Report period</FormLabel>
      <RadioGroup
        aria-labelledby="report-period-label"
        name="report-period"
        value={period}
        onChange={(event) => setPeriod(event.target.value)}
      >
        <FormControlLabel value="daily" control={<Radio />} label="Daily" />
        <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
        <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
      </RadioGroup>
    </FormControl>
  );
};

const Grouped: React.ComponentType = () => {
  const [driver, setDriver] = React.useState('jane-cooper');
  return (
    <FormControl>
      <FormLabel id="assign-driver-label">Assign driver — CA 123-456</FormLabel>
      <RadioGroup
        aria-labelledby="assign-driver-label"
        name="assign-driver"
        value={driver}
        onChange={(event) => setDriver(event.target.value)}
      >
        <FormControlLabel value="jane-cooper" control={<Radio />} label="Jane Cooper" />
        <FormControlLabel value="frank-kim" control={<Radio />} label="Frank Kim" />
        <FormControlLabel value="unassigned" control={<Radio />} label="Leave unassigned" />
      </RadioGroup>
    </FormControl>
  );
};

/* A single Radio outside a RadioGroup — rare, per the doc.json. It has no
   built-in label and no awareness of other options, so it needs its own
   accessible name (slotProps.input) and manual checked/onChange wiring. */
const Standalone: React.ComponentType = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px /* primitive.spacing.2 */' }}>
      <Radio
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        value="ca-123-456"
        name="standalone-vehicle"
        slotProps={{ input: { 'aria-label': 'Select vehicle CA 123-456' } }}
      />
      <span style={captionStyle}>
        Standalone — no RadioGroup, no clickable label; prefer the grouped pattern.
      </span>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Grouped (RadioGroup) — the standard pattern': Grouped,
  'Standalone Radio': Standalone,
};
