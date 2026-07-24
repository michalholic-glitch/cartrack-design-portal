import React from 'react';
import { Accordion } from '../../design-system/components/Accordion/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

/* Live demos for the portal — rendered from the REAL Accordion.tsx (MUI v9 wrapper).
   Keys must exactly match Accordion.doc.json variant names.
   AccordionSummary/AccordionDetails are composed directly from @mui/material,
   as the wrapper header instructs (the karoo-ui sub-parts are equally-thin re-exports).
   @mui/icons-material is not installed — expandIcon uses an inline SVG chevron. */

const ExpandIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
      fill="rgba(0,0,0,.6)" /* semantic.color.text.secondary */
    />
  </svg>
);

const detailLine: React.CSSProperties = {
  margin: 0,
  fontSize: '.875rem', /* semantic.typography.scale.body2 */
  color: 'rgba(0,0,0,.87)', /* semantic.color.text.primary */
};

/* Hero: one accordion at its natural size, expanded so the composed
   Summary + Details anatomy is visible. */
export const hero = () => (
  <div style={{ maxWidth: 480 }}>
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography>Vehicle details — CA 123-456</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p style={detailLine}>Toyota Hilux 2.8 GD-6 · Cape Town depot</p>
        <p style={detailLine}>Driver: Jane Cooper · Odometer: 84,212 km</p>
      </AccordionDetails>
    </Accordion>
  </div>
);

/* Single-open group: not built into Accordion — the parent lifts state and only
   ever sets one instance's `expanded` to true (the classic MUI controlled-group pattern). */
const SingleOpenGroup = () => {
  const [open, setOpen] = React.useState<string | false>('details');
  const toggle = (panel: string) => (_event: React.SyntheticEvent, expanded: boolean) =>
    setOpen(expanded ? panel : false);
  return (
    <div style={{ maxWidth: 480 }}>
      <Accordion expanded={open === 'details'} onChange={toggle('details')}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography>Vehicle details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p style={detailLine}>CA 123-456 · Toyota Hilux 2.8 GD-6 · Odometer 84,212 km</p>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={open === 'driver'} onChange={toggle('driver')}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography>Driver assignment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p style={detailLine}>Jane Cooper (primary) · Frank Kim (relief)</p>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={open === 'service'} onChange={toggle('service')}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography>Service history</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p style={detailLine}>Last service 2026-06-30 at 80,000 km · Next due 90,000 km</p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

/* Multi-open group: each instance keeps its own independent state —
   here uncontrolled via defaultExpanded, exactly as the doc describes. */
const MultiOpenGroup = () => (
  <div style={{ maxWidth: 480 }}>
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography>Depot contacts</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p style={detailLine}>Cape Town depot · dispatch@cartrack.example · +27 21 555 0100</p>
      </AccordionDetails>
    </Accordion>
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography>Geofences</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p style={detailLine}>N1 Depot yard · Airport precinct · Client site — Paarl</p>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography>Notification rules</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p style={detailLine}>Speeding &gt; 120 km/h · After-hours ignition · Geofence exit</p>
      </AccordionDetails>
    </Accordion>
  </div>
);

/* With summary text: a key value shown on the collapsed header —
   a secondary Typography inside AccordionSummary alongside the title. */
const WithSummaryText = () => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div style={{ maxWidth: 480 }}>
      <Accordion expanded={expanded} onChange={(_e, v) => setExpanded(v)}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography style={{ width: '40%', flexShrink: 0 }}>Odometer</Typography>
          <Typography style={{ color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
            84,212 km
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p style={detailLine}>Reading reported by unit at 2026-07-24 09:12 · CA 123-456</p>
          <p style={detailLine}>Average 1,840 km/week over the last 8 weeks.</p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Single-open group': SingleOpenGroup,
  'Multi-open group': MultiOpenGroup,
  'With summary text': WithSummaryText,
};
