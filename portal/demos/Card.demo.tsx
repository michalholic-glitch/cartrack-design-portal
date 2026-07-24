import React from 'react';
import { Card } from '../../design-system/components/Card/Card';
import { Button } from '../../design-system/components/Button/Button';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

/* Live demos for the portal — rendered from the REAL Card.tsx (MUI v9 wrapper).
   Keys must exactly match Card.doc.json variant names.
   Card is only the outer Paper surface — title/media/actions are composed from
   the sibling MUI components (CardHeader/CardContent/CardMedia/CardActions/
   CardActionArea), exactly as the wrapper header and doc.json describe. */

const CARD_WIDTH = 320;

const secondaryText: React.CSSProperties = {
  color: 'rgba(0,0,0,.6)', /* semantic.color.text.secondary */
};

const VehicleBody = () => (
  <>
    <Typography variant="body2">Driver: Jane Cooper</Typography>
    <Typography variant="body2">Odometer: 84,212 km</Typography>
    <Typography variant="body2" style={secondaryText}>
      Last seen: N1 Depot, Cape Town · 09:12
    </Typography>
  </>
);

/* Hero: a vehicle summary card at real dashboard size — header, content,
   and a row of low-emphasis actions (contained stays reserved for the page). */
export const hero = () => (
  <Card style={{ width: CARD_WIDTH }}>
    <CardHeader title="CA 123-456" subheader="Toyota Hilux 2.8 GD-6" />
    <CardContent style={{ paddingTop: 0 }}>
      <VehicleBody />
    </CardContent>
    <CardActions>
      <Button variant="text" size="small">
        View trips
      </Button>
      <Button variant="text" size="small">
        Assign driver
      </Button>
    </CardActions>
  </Card>
);

/* Elevated: the real MUI default — variant="elevation", resting elevation 1. */
const Elevated = () => (
  <Card style={{ width: CARD_WIDTH }}>
    <CardHeader title="CA 123-456" subheader="Toyota Hilux 2.8 GD-6" />
    <CardContent style={{ paddingTop: 0 }}>
      <VehicleBody />
    </CardContent>
  </Card>
);

/* Outlined: border instead of shadow — for dense dashboards. */
const Outlined = () => (
  <Card variant="outlined" style={{ width: CARD_WIDTH }}>
    <CardHeader title="CA 789-012" subheader="Isuzu NPR 400 · Paarl depot" />
    <CardContent style={{ paddingTop: 0 }}>
      <Typography variant="body2">Driver: Frank Kim</Typography>
      <Typography variant="body2">Odometer: 132,908 km</Typography>
      <Typography variant="body2" style={secondaryText}>
        Service due in 2,092 km
      </Typography>
    </CardContent>
  </Card>
);

/* Raised: `raised` bumps an elevation-variant card to elevation 8 —
   toggle it live to compare the emphasis. */
const Raised = () => {
  const [raised, setRaised] = React.useState(true);
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Card raised={raised} style={{ width: CARD_WIDTH }}>
        <CardHeader title="Fleet utilisation" subheader="Cape Town depot · today" />
        <CardContent style={{ paddingTop: 0 }}>
          <Typography variant="body2">41 of 48 vehicles active</Typography>
          <Typography variant="body2" style={secondaryText}>
            3 in service · 4 idle
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="text" size="small" onClick={() => setRaised((r) => !r)}>
            {raised ? 'Normal elevation' : 'Raise card'}
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

/* With media: a CardMedia region for an image/map. No remote assets in the
   portal, so the media slot renders as a styled placeholder block. */
const WithMedia = () => (
  <Card style={{ width: CARD_WIDTH }}>
    <CardMedia
      component="div"
      style={{
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #E0E0E0, #F5F5F5)', /* primitive.color.neutral.grey300 → grey100 (placeholder for map/photo) */
        color: 'rgba(0,0,0,.6)', /* semantic.color.text.secondary */
        fontSize: '.8rem',
      }}
    >
      Map preview — N1 Depot
    </CardMedia>
    <CardHeader title="CA 123-456" subheader="Last position 09:12" />
    <CardContent style={{ paddingTop: 0 }}>
      <Typography variant="body2" style={secondaryText}>
        Parked · ignition off · geofence: N1 Depot yard
      </Typography>
    </CardContent>
  </Card>
);

/* Actionable (whole-card): CardActionArea makes the entire card one interactive
   target (ripple + focus ring) — no competing controls nested inside. */
const ActionableWholeCard = () => {
  const [opens, setOpens] = React.useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <Card style={{ width: CARD_WIDTH }}>
        <CardActionArea onClick={() => setOpens((n) => n + 1)}>
          <CardHeader title="CA 123-456" subheader="Toyota Hilux 2.8 GD-6" />
          <CardContent style={{ paddingTop: 0 }}>
            <VehicleBody />
          </CardContent>
        </CardActionArea>
      </Card>
      <span style={{ fontSize: '.8rem', ...secondaryText }}>
        {opens === 0
          ? 'Click anywhere on the card — it opens the vehicle detail'
          : `Would open CA 123-456 detail (clicked ${opens}×)`}
      </span>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Elevated': Elevated,
  'Outlined': Outlined,
  'Raised': Raised,
  'With media': WithMedia,
  'Actionable (whole-card)': ActionableWholeCard,
};
