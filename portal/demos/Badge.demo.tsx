import React from 'react';
import { Badge } from '../../design-system/components/Badge/Badge';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Badge.tsx (MUI v9 wrapper).
   Keys must exactly match Badge.doc.json variant names.
   Real MUI API: Badge wraps its host `children`, count goes in `badgeContent`,
   dot is `variant="dot"` — there is no invented hostLabel/count prop anymore.
   @mui/icons-material is not installed — hosts are inline SVG glyphs. */

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 8h-3V4H3a2 2 0 0 0-2 2v11h2a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h2v-5l-3-4zM6 18.5A1.5 1.5 0 1 1 7.5 17 1.5 1.5 0 0 1 6 18.5zm13.5-9 1.96 2.5H17V9.5zM18 18.5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
  </svg>
);

/* Hero: live unread-alert count on the notifications bell. The host (not the
   Badge) carries the accessible name including the count, per Badge.doc.json. */
export const hero = () => {
  const [count, setCount] = React.useState(4);
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge badgeContent={count} color="error">
        <span aria-label={`Notifications, ${count} unread`} role="img">
          <BellIcon />
        </span>
      </Badge>
      <Badge variant="dot" color="error">
        <span aria-label="Vehicles needing attention" role="img">
          <TruckIcon />
        </span>
      </Badge>
      <span style={{ display: 'inline-flex', gap: 8 /* semantic.spacing.sm */ }}>
        <Button variant="outlined" size="small" onClick={() => setCount((c) => c + 1)}>
          New alert
        </Button>
        <Button variant="text" size="small" onClick={() => setCount(0)}>
          Mark all read
        </Button>
      </span>
    </div>
  );
};

/* Standard (numeric): count via badgeContent; auto-hides at zero (showZero=false default). */
const StandardNumeric = () => {
  const [count, setCount] = React.useState(3);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Badge badgeContent={count} color="error">
        <span aria-label={`Notifications, ${count} unread`} role="img">
          <BellIcon />
        </span>
      </Badge>
      <Button variant="text" size="small" onClick={() => setCount((c) => c + 1)}>
        New alert
      </Button>
      <Button variant="text" size="small" onClick={() => setCount(0)}>
        Clear
      </Button>
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        {count === 0 ? 'badge hides at zero' : `${count} unread`}
      </span>
    </div>
  );
};

/* Dot: attention without a number — variant="dot". Toggled via `invisible`. */
const Dot = () => {
  const [attention, setAttention] = React.useState(true);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Badge variant="dot" color="error" invisible={!attention}>
        <span
          aria-label={attention ? 'Vehicle CA 123-456, needs attention' : 'Vehicle CA 123-456'}
          role="img"
        >
          <TruckIcon />
        </span>
      </Badge>
      <Button variant="text" size="small" onClick={() => setAttention((a) => !a)}>
        {attention ? 'Resolve' : 'Flag attention'}
      </Button>
    </div>
  );
};

/* Capped: counts above `max` (default 99) render as "99+" automatically. */
const Capped = () => {
  const [count, setCount] = React.useState(127);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Badge badgeContent={count} color="error">
        <span aria-label={`Unread alerts, ${count}`} role="img">
          <BellIcon />
        </span>
      </Badge>
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        actual count: {count}
      </span>
      <Button variant="text" size="small" onClick={() => setCount((c) => Math.max(0, c - 40))}>
        -40
      </Button>
      <Button variant="text" size="small" onClick={() => setCount((c) => c + 40)}>
        +40
      </Button>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Standard (numeric)': StandardNumeric,
  'Dot': Dot,
  'Capped': Capped,
};
