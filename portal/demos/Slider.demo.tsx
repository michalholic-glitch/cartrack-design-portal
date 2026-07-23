import React from 'react';
import { Slider } from '../../design-system/components/Slider/Slider';

/* Live demos for the portal — rendered from the REAL Slider.tsx.
   Keys must exactly match Slider.doc.json variant names.
   Every demo shows the current value next to the track (doc.json:
   "Don't hide the value"). */

const valueStyle: React.CSSProperties = {
  fontSize: '.875rem',
  color: 'rgba(0, 0, 0, 0.6)' /* semantic.color.text.secondary */,
  minWidth: 96,
};

const labelStyle: React.CSSProperties = {
  fontSize: '.8rem',
  fontWeight: 500,
  color: 'rgba(0, 0, 0, 0.6)' /* semantic.color.text.secondary */,
  marginBottom: 4,
};

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 16, maxWidth: 480 };

const Continuous = () => {
  const [radius, setRadius] = React.useState(750);
  return (
    <div>
      <div style={labelStyle}>Geofence radius</div>
      <div style={row}>
        <Slider
          variant="continuous"
          label="Geofence radius"
          value={radius}
          min={100}
          max={5000}
          onChange={(v) => {
            if (typeof v === 'number') setRadius(v);
          }}
        />
        <span style={valueStyle}>{radius.toLocaleString()} m</span>
      </div>
    </div>
  );
};

const Discrete = () => {
  const [threshold, setThreshold] = React.useState(15);
  return (
    <div>
      <div style={labelStyle}>Speed alert threshold (over limit)</div>
      <div style={row}>
        <Slider
          variant="discrete"
          label="Speed alert threshold"
          value={threshold}
          min={5}
          max={30}
          step={5}
          onChange={(v) => {
            if (typeof v === 'number') setThreshold(v);
          }}
        />
        <span style={valueStyle}>+{threshold} km/h</span>
      </div>
    </div>
  );
};

const Range = () => {
  const [window_, setWindow] = React.useState<[number, number]>([6, 18]);
  const fmt = (h: number) => `${String(h).padStart(2, '0')}:00`;
  return (
    <div>
      <div style={labelStyle}>Trip replay time window</div>
      <div style={row}>
        <Slider
          variant="range"
          label="Trip replay time window"
          value={window_}
          min={0}
          max={24}
          step={1}
          onChange={(v) => {
            if (Array.isArray(v)) setWindow(v);
          }}
        />
        <span style={valueStyle}>
          {fmt(window_[0])} – {fmt(window_[1])}
        </span>
      </div>
    </div>
  );
};

/* Hero: the fleet-typical case — dragging a geofence radius with the value
   read out beside the track. */
export const hero = Continuous;

export const demos: Record<string, React.ComponentType> = {
  Continuous,
  Discrete,
  'Range (two thumbs)': Range,
};
