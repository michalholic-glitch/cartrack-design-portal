import React from 'react';
import { Divider } from '../../design-system/components/Divider/Divider';

/* Live demos for the portal — rendered from the REAL Divider.tsx (a thin
   wrapper over @mui/material/Divider). Keys must exactly match
   Divider.doc.json variant names.
   The Divider API is purely presentational, so each variant is staged in
   the context it's meant for: sections (full-width), a list column with
   leading avatars (inset), a card (middle). Vertical is the separate
   `orientation` prop, not a variant (doc.json dontDoThis), so it isn't a
   tile here. */

const bodyText: React.CSSProperties = {
  font: '400 14px/1.43 system-ui, sans-serif' /* semantic.typography.scale.body2 */,
  color: 'rgba(0,0,0,0.87)' /* semantic.color.text.primary */,
  margin: 0,
};

const secondaryText: React.CSSProperties = {
  ...bodyText,
  color: 'rgba(0,0,0,0.6)' /* semantic.color.text.secondary */,
};

const FullWidth = () => (
  <div style={{ minWidth: '280px' }}>
    <p style={{ ...bodyText, padding: '8px 0' /* semantic.spacing.sm */ }}>
      Fleet summary — 42 vehicles across 7 depots
    </p>
    <Divider />
    <p style={{ ...secondaryText, padding: '8px 0' /* semantic.spacing.sm */ }}>
      Last synced today at 06:12 from Depot North
    </p>
  </div>
);

const DRIVERS = [
  { initials: 'JC', name: 'Jane Cooper', vehicle: 'CA 123-456' },
  { initials: 'FK', name: 'Frank Kim', vehicle: 'CA 789-012' },
];

const InsetRow = ({ initials, name, vehicle }: (typeof DRIVERS)[number]) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px' /* semantic.spacing.md */,
      padding: '8px 16px' /* semantic.spacing.sm semantic.spacing.md */,
    }}
  >
    <span
      aria-hidden="true"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#EEEEEE' /* primitive.color.hue.gray.20 */,
        font: '500 14px/1 system-ui, sans-serif' /* semantic.typography.scale.subtitle2 */,
        color: 'rgba(0,0,0,0.6)' /* semantic.color.text.secondary */,
      }}
    >
      {initials}
    </span>
    <span>
      <span style={{ ...bodyText, display: 'block' }}>{name}</span>
      <span style={{ ...secondaryText, display: 'block' }}>{vehicle}</span>
    </span>
  </div>
);

/* Inset divider: MUI applies a fixed 72px left margin — aligned past the
   40px avatar column above (Divider.doc.json specs). */
const Inset = () => (
  <div style={{ minWidth: '280px' }}>
    <InsetRow {...DRIVERS[0]} />
    <Divider variant="inset" component="div" />
    <InsetRow {...DRIVERS[1]} />
  </div>
);

const Middle = () => (
  <div
    style={{
      minWidth: '280px',
      border:
        '1px solid rgba(0,0,0,0.12)' /* semantic.borderWidth.hairline + semantic.color.border.default */,
      borderRadius: '4px' /* semantic.radius.card */,
      background: '#FFFFFF' /* semantic.color.surface.paper */,
    }}
  >
    <p style={{ ...bodyText, fontWeight: 500, padding: '16px' /* semantic.spacing.md */ }}>
      Depot North
    </p>
    <Divider variant="middle" />
    <p style={{ ...secondaryText, padding: '16px' /* semantic.spacing.md */ }}>
      18 vehicles · 3 on route · 1 offline
    </p>
  </div>
);

export const hero: React.ComponentType = FullWidth;

export const demos: Record<string, React.ComponentType> = {
  'Full-width': FullWidth,
  Inset: Inset,
  Middle: Middle,
};
