import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import { cartrackTheme } from '../../../../components/theme';
import { Card } from '../../../../components/Card';
import { Button } from '../../../../components/Button';
import { TextField } from '../../../../components/TextField';

/**
 * VehicleEditForm — edit a single vehicle's core attributes.
 *
 * Action model (AGENTS.md rules 4 & 5, Button.doc.json doThis):
 * - "Save vehicle" is the single contained (high-emphasis) primary action.
 *   MUI's real default variant is "text", so variant="contained" is passed explicitly.
 * - "Cancel" is a lower-emphasis outlined button beside it — never a second contained button.
 *
 * Styling flows entirely through the theme + sx (AGENTS.md rule 3): no hardcoded
 * colors, spacing, or type. Rendered under <ThemeProvider theme={cartrackTheme}>.
 */
export interface VehicleEditFormProps {
  /** Called with no args when the operator commits the edit. */
  onSave?: () => void;
  /** Called when the operator abandons the edit. */
  onCancel?: () => void;
  /** Shows the loading indicator on Save and disables both actions while saving. */
  saving?: boolean;
  initialRegistration?: string;
  initialMake?: string;
  initialOdometer?: string;
}

export function VehicleEditForm({
  onSave,
  onCancel,
  saving = false,
  initialRegistration = '',
  initialMake = '',
  initialOdometer = '',
}: VehicleEditFormProps) {
  const [registration, setRegistration] = React.useState(initialRegistration);
  const [make, setMake] = React.useState(initialMake);
  const [odometer, setOdometer] = React.useState(initialOdometer);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave?.();
  };

  return (
    <ThemeProvider theme={cartrackTheme}>
      <Card variant="outlined" sx={{ maxWidth: 480 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Registration"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Make & model"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              fullWidth
            />
            <TextField
              label="Odometer"
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              helperText="Current reading in kilometres"
              fullWidth
            />
          </CardContent>

          {/* Cancel (lower-emphasis outlined) sits beside the single contained primary. */}
          <CardActions sx={{ justifyContent: 'flex-end', gap: 1, px: 2, pb: 2 }}>
            <Button variant="outlined" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" loading={saving}>
              Save vehicle
            </Button>
          </CardActions>
        </Box>
      </Card>
    </ThemeProvider>
  );
}

export default VehicleEditForm;
