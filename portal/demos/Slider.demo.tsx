import React from 'react';
import { Slider } from '../../design-system/components/Slider/Slider';

/* Live demos for the portal — rendered from the REAL Slider.tsx (thin wrapper over
   @mui/material/Slider, MUI v9). Keys must exactly match Slider.doc.json variant
   names. All three variants are expressible live — none omitted.
   No invented `variant` prop (the old MDC-era demo's approach): continuous is the
   default behavior, discrete is `step` + `marks`, range is a two-element `value`
   array — exactly as the doc.json's correction note says. */

const stageStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px /* primitive.spacing.6 */',
  width: '100%',
  maxWidth: '360px',
};

const readoutStyle: React.CSSProperties = {
  fontSize: '14px /* semantic.typography.scale.body2 */',
  color: 'rgba(0, 0, 0, 0.87) /* semantic.color.text.primary */',
  whiteSpace: 'nowrap',
  minWidth: '72px',
  textAlign: 'right',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px /* semantic.typography.scale.caption */',
  color: 'rgba(0, 0, 0, 0.6) /* semantic.color.text.secondary */',
  display: 'block',
  marginBottom: '4px /* primitive.spacing.1 */',
};

/* Hero — geofence radius: continuous drag with live value feedback. */
export const hero: React.ComponentType = () => {
  const [radius, setRadius] = React.useState(750);
  return (
    <div style={{ width: '100%', maxWidth: '360px' }}>
      <span style={labelStyle} id="geofence-radius-label">
        Geofence radius — Depot A
      </span>
      <div style={stageStyle}>
        <Slider
          aria-labelledby="geofence-radius-label"
          value={radius}
          onChange={(_event, value) => setRadius(value as number)}
          min={100}
          max={2000}
          step={50}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} m`}
        />
        <span style={readoutStyle}>{radius} m</span>
      </div>
    </div>
  );
};

const Continuous: React.ComponentType = () => {
  const [opacity, setOpacity] = React.useState(60);
  return (
    <div style={stageStyle}>
      <Slider
        aria-label="Map overlay opacity"
        value={opacity}
        onChange={(_event, value) => setOpacity(value as number)}
      />
      <span style={readoutStyle}>{opacity}%</span>
    </div>
  );
};

const Discrete: React.ComponentType = () => {
  const [distance, setDistance] = React.useState(10);
  return (
    <div style={stageStyle}>
      <Slider
        aria-label="Alert radius"
        value={distance}
        onChange={(_event, value) => setDistance(value as number)}
        min={5}
        max={20}
        step={5}
        marks={[
          { value: 5, label: '5 km' },
          { value: 10, label: '10 km' },
          { value: 15, label: '15 km' },
          { value: 20, label: '20 km' },
        ]}
        valueLabelDisplay="auto"
      />
      <span style={readoutStyle}>{distance} km</span>
    </div>
  );
};

const pad = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

const Range: React.ComponentType = () => {
  const [window, setWindow] = React.useState<number[]>([8, 17]);
  return (
    <div style={stageStyle}>
      <Slider
        getAriaLabel={(index) => (index === 0 ? 'Report window start' : 'Report window end')}
        getAriaValueText={(value) => pad(value)}
        value={window}
        onChange={(_event, value) => setWindow(value as number[])}
        min={0}
        max={24}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => pad(value)}
        disableSwap
      />
      <span style={readoutStyle}>
        {pad(window[0])}–{pad(window[1])}
      </span>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Continuous': Continuous,
  'Discrete': Discrete,
  'Range (two thumbs)': Range,
};
