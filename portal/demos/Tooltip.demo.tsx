import React from 'react';
import { Tooltip } from '../../design-system/components/Tooltip/Tooltip';
import { Button } from '../../design-system/components/Button/Button';
import IconButton from '@mui/material/IconButton';

/* Live demos for the portal — rendered from the REAL Tooltip.tsx (MUI v9
   wrapper; `arrow` defaults to true per the karoo-ui wrapper). Hover/focus
   triggers are native MUI behaviour — hover any trigger below.
   Keys must exactly match Tooltip.doc.json variant names. */

/* Inline glyph — @mui/icons-material isn't installed. */
const CrosshairIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm8.94 3A8.99 8.99 0 0 0 13 3.06V1h-2v2.06A8.99 8.99 0 0 0 3.06 11H1v2h2.06A8.99 8.99 0 0 0 11 20.94V23h2v-2.06A8.99 8.99 0 0 0 20.94 13H23v-2zM12 19a7 7 0 1 1 7-7 7 7 0 0 1-7 7z" />
  </svg>
);

/* Hero: an icon-only action labelled by its tooltip — the doc's first doThis. */
export const hero = () => {
  const [followed, setFollowed] = React.useState(false);
  return (
    <div style={{ display: 'flex', gap: 16 /* semantic.spacing.md */, alignItems: 'center' }}>
      <Tooltip title={followed ? 'Stop following CA 123-456' : 'Follow CA 123-456 on the map'}>
        <IconButton
          aria-label={followed ? 'Stop following CA 123-456' : 'Follow CA 123-456 on the map'}
          color={followed ? 'primary' : 'default'}
          onClick={() => setFollowed((f) => !f)}
        >
          <CrosshairIcon />
        </IconButton>
      </Tooltip>
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        {followed ? 'Following CA 123-456' : 'Hover or focus the button'}
      </span>
    </div>
  );
};

const Plain = () => (
  <div style={{ display: 'flex', gap: 16 /* semantic.spacing.md */, alignItems: 'center' }}>
    <Tooltip title="Assign Jane Cooper to CA 123-456">
      <Button variant="outlined">Assign driver</Button>
    </Tooltip>
    {/* placement + arrow are plain MUI props forwarded by the wrapper. */}
    <Tooltip title="Last position update 16:42" placement="right">
      <span
        tabIndex={0}
        style={{
          fontSize: '.85rem',
          borderBottom: '1px dotted rgba(0,0,0,0.6)', // semantic.color.text.secondary
          cursor: 'help',
        }}
      >
        Updated 2 min ago
      </span>
    </Tooltip>
  </div>
);

/* Truncated cell text revealed in full on hover/focus — a usage pattern,
   not a component variant (per Tooltip.doc.json). */
const TruncationReveal = () => {
  const depot = 'Cape Town depot — 14 Buitengracht Street, Foreshore, Cape Town, 8001';
  return (
    <Tooltip title={depot}>
      <span
        tabIndex={0}
        style={{
          display: 'inline-block',
          maxWidth: 180, // staging: force truncation in the tile
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '.85rem',
          verticalAlign: 'bottom',
        }}
      >
        {depot}
      </span>
    </Tooltip>
  );
};

export const demos: Record<string, React.ComponentType> = {
  Plain,
  'Truncation reveal (usage pattern)': TruncationReveal,
};
