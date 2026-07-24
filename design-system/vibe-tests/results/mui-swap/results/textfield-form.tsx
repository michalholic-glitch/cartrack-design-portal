import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
// Layout composition helpers — plain MUI v9 primitives (not wrapped
// design-system components); Card.doc.json explicitly composes titles/actions
// with these sibling MUI parts.
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';

// Design-system components (the 27 wrapped components in ../components).
import { TextField } from '../../../../components/TextField';
import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import cartrackTheme from '../../../../components/theme';

export interface Driver {
  name: string;
  phone: string;
}

export interface EditDriverFormProps {
  /** Current driver values (controlled). */
  driver: Driver;
  /** Called with the edited driver when the form is submitted. */
  onSave: (driver: Driver) => void;
}

/**
 * EditDriverForm — edit a driver's name and phone number.
 *
 * Uses the design-system <TextField> (never raw <input>), one <Button>
 * primary action per view, and the shared MUI theme for all visual values.
 * No hardcoded colors/sizes: spacing uses theme spacing units via `sx`
 * (multiples of theme.spacing), colors/typography/radius come from the theme.
 */
export const EditDriverForm: React.FC<EditDriverFormProps> = ({ driver, onSave }) => {
  const [name, setName] = React.useState(driver.name);
  const [phone, setPhone] = React.useState(driver.phone);

  const nameError = name.trim() === '';
  // Simple presence + basic phone-shape check; drives the error/helperText pair.
  const phoneError = phone.trim() === '' || !/^[+\d][\d\s()-]{5,}$/.test(phone.trim());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameError || phoneError) return;
    onSave({ name: name.trim(), phone: phone.trim() });
  };

  return (
    <Card component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480 }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit driver
        </Typography>

        {/* gap: 2 = theme spacing units, not a hardcoded px value */}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Driver name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            error={nameError}
            helperText={nameError ? 'Enter the driver’s name' : 'First and last name'}
          />

          <TextField
            label="Phone number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            fullWidth
            error={phoneError}
            helperText={
              phoneError
                ? 'Enter a valid contact number'
                : 'Used for SMS and call alerts'
            }
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        {/* One primary action per view. */}
        <Button type="submit" variant="contained" disabled={nameError || phoneError}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
};

/**
 * Demo wrapper — renders the form under the Cartrack MUI theme, as every
 * component in this system requires (see components/theme.ts).
 */
export const EditDriverFormDemo: React.FC = () => (
  <ThemeProvider theme={cartrackTheme}>
    <EditDriverForm
      driver={{ name: 'Thabo Nkosi', phone: '+27 82 123 4567' }}
      onSave={(driver) => console.log('save driver', driver)}
    />
  </ThemeProvider>
);

export default EditDriverFormDemo;
