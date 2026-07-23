import React from 'react';
import { TextField } from '../../design-system/components/TextField/TextField';

/* Live demos for the portal — rendered from the REAL TextField.tsx.
   Keys must exactly match TextField.doc.json variant names.
   "Select / dropdown field" is deliberately absent: TextFieldProps has no
   select/options API (a dropdown is a different control — see Menu), so that
   tile falls back to the hand-drawn mockup (documented gap).
   All fields are controlled (value/onChange), and the error demos are driven
   by real validation of what you type. */

/* Registration field with live validation — e.g. "CA 123-456". */
function RegistrationField() {
  const [value, setValue] = React.useState('');
  const error =
    value && !/^[A-Z]{1,3}\s?\d{2,3}[- ]\d{3}$/i.test(value.trim())
      ? 'Use the format CA 123-456'
      : undefined;
  return (
    <TextField
      variant="outlined"
      label="Vehicle registration"
      value={value}
      onChange={setValue}
      required
      helperText="e.g. CA 123-456"
      error={error}
    />
  );
}

export const hero = () => {
  const [driver, setDriver] = React.useState('Jane Cooper');
  return (
    /* One field style per form (doc rule) — both outlined. */
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <RegistrationField />
      <TextField
        variant="outlined"
        label="Driver name"
        value={driver}
        onChange={setDriver}
        helperText="As shown on the driver's licence"
      />
    </div>
  );
};

const Filled = () => {
  const [value, setValue] = React.useState('');
  return (
    <TextField
      variant="filled"
      label="Driver name"
      value={value}
      onChange={setValue}
      helperText="As shown on the driver's licence"
    />
  );
};

const Outlined = () => <RegistrationField />;

/* "With adornments": staged with the unit adornment ("km"), which is real text.
   Glyph adornments (search magnifier, clear, password visibility) take an icon
   name rendered via an icon font the portal doesn't ship, so a glyph would
   render as its raw word here. Typing a non-number shows real validation. */
const WithAdornments = () => {
  const [odo, setOdo] = React.useState('52431');
  const n = Number(odo.replace(/\s/g, ''));
  const error = odo && (!Number.isFinite(n) || n < 0) ? 'Enter the odometer in km' : undefined;
  return (
    <TextField
      variant="outlined"
      label="Odometer"
      value={odo}
      onChange={setOdo}
      trailingIcon="km"
      helperText="Current reading"
      error={error}
    />
  );
};

const Multiline = () => {
  const [notes, setNotes] = React.useState('Front-left tyre replaced at the depot; pressure rechecked after 50 km.');
  return (
    <TextField
      variant="outlined"
      label="Trip notes"
      value={notes}
      onChange={setNotes}
      multiline
      rows={3}
      helperText="Visible to the fleet manager"
    />
  );
};

export const demos: Record<string, React.ComponentType> = {
  Filled,
  Outlined,
  'With adornments': WithAdornments,
  'Multiline / textarea': Multiline,
};
