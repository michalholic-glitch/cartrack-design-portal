import React from 'react';
import { TextField } from '../../design-system/components/TextField/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';

/* Live demos for the portal — rendered from the REAL TextField.tsx (MUI v9
   wrapper: size defaults to 'small', plus a readOnly convenience prop).
   Keys must exactly match TextField.doc.json variant names.

   Adornments use slotProps.input per TextField.doc.json's doThis — NOT the
   deprecated InputProps. Every field is controlled and keeps a visible label. */

/* Hero: a controlled field with live validation, next to the wrapper's
   readOnly convenience prop on a system-assigned value. */
export const hero = () => {
  const [reg, setReg] = React.useState('CA 123-456');
  const empty = reg.trim() === '';
  return (
    <div style={{ display: 'flex', gap: 16 /* semantic.spacing.md */, flexWrap: 'wrap' }}>
      <TextField
        label="Registration"
        value={reg}
        onChange={(e) => setReg(e.target.value)}
        error={empty}
        helperText={empty ? 'Enter a registration number' : 'As printed on the licence disc'}
      />
      <TextField label="Fleet ID" value="FLT-00042" readOnly helperText="Assigned by the system" />
    </div>
  );
};

const Outlined = () => {
  const [driver, setDriver] = React.useState('Jane Cooper');
  const empty = driver.trim() === '';
  return (
    <TextField
      label="Driver name"
      value={driver}
      onChange={(e) => setDriver(e.target.value)}
      error={empty}
      helperText={empty ? 'Enter a driver name' : ' '}
    />
  );
};

const Filled = () => {
  const [depot, setDepot] = React.useState('Cape Town depot');
  return (
    <TextField
      variant="filled"
      label="Depot name"
      value={depot}
      onChange={(e) => setDepot(e.target.value)}
      helperText="Shown on all depot reports"
    />
  );
};

const Standard = () => {
  const [ref2, setRef2] = React.useState('');
  return (
    <TextField
      variant="standard"
      label="Cost centre"
      placeholder="e.g. CC-1204"
      value={ref2}
      onChange={(e) => setRef2(e.target.value)}
      helperText="Rare in fleet-web — underline only"
    />
  );
};

const Adornments = () => {
  const [query, setQuery] = React.useState('');
  const [odometer, setOdometer] = React.useState('118400');
  return (
    <div style={{ display: 'flex', gap: 16 /* semantic.spacing.md */, flexWrap: 'wrap' }}>
      <TextField
        label="Search vehicles"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Registration or driver"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                {/* Inline magnifier — @mui/icons-material isn't installed. */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
                </svg>
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        label="Odometer"
        value={odometer}
        onChange={(e) => setOdometer(e.target.value.replace(/[^0-9]/g, ''))}
        slotProps={{
          input: { endAdornment: <InputAdornment position="end">km</InputAdornment> },
          htmlInput: { inputMode: 'numeric' },
        }}
      />
    </div>
  );
};

const Select = () => {
  const [depot, setDepot] = React.useState('cpt');
  return (
    <TextField
      select
      label="Home depot"
      value={depot}
      onChange={(e) => setDepot(e.target.value)}
      helperText="Where CA 123-456 parks overnight"
      style={{ minWidth: 220 /* staging width so the menu doesn't clip */ }}
    >
      <MenuItem value="cpt">Cape Town depot</MenuItem>
      <MenuItem value="jhb">Johannesburg depot</MenuItem>
      <MenuItem value="dbn">Durban depot</MenuItem>
    </TextField>
  );
};

const Multiline = () => {
  const [notes, setNotes] = React.useState(
    'Collected pallets at Cape Town depot 08:10; harsh-braking alert on the N1 cleared with Jane Cooper.'
  );
  return (
    <TextField
      label="Trip notes"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      multiline
      minRows={3}
      maxRows={6}
      helperText={`${notes.length} characters`}
      style={{ width: '100%', maxWidth: 420 /* staging width only */ }}
    />
  );
};

export const demos: Record<string, React.ComponentType> = {
  'variant="outlined"': Outlined,
  'variant="filled"': Filled,
  'variant="standard"': Standard,
  'With adornments (slotProps.input.startAdornment/endAdornment)': Adornments,
  select: Select,
  multiline: Multiline,
};
