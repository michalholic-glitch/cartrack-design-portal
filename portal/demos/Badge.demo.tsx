import React from 'react';
import { Badge } from '../../design-system/components/Badge/Badge';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Badge.tsx.
   Keys must exactly match Badge.doc.json variant names. */

/* Simple inline bell glyph so the badge has a realistic host icon.
   Inherits currentColor (see tokens.json semantic.icon.colour.onSurface). */
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

/* Hero: live unread-alert count on the notifications bell — increment/clear via
   staged buttons, so the cap (99+) and hide-at-zero behaviors are both reachable. */
export const hero = () => {
  const [count, setCount] = React.useState(4);
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge hostLabel="Notifications" count={count}>
        <BellIcon />
      </Badge>
      <Badge hostLabel="Vehicles needing attention" dot>
        <TruckIcon />
      </Badge>
      <span style={{ display: 'inline-flex', gap: 8 }}>
        <Button variant="outlined" label="New alert" onClick={() => setCount((c) => c + 1)} />
        <Button variant="text" label="+25" onClick={() => setCount((c) => c + 25)} />
        <Button variant="text" label="Mark all read" onClick={() => setCount(0)} />
      </span>
    </div>
  );
};

const Numeric = () => {
  const [count, setCount] = React.useState(3);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Badge hostLabel="Notifications" count={count}>
        <BellIcon />
      </Badge>
      <Button variant="text" label="New alert" onClick={() => setCount((c) => c + 1)} />
      <Button variant="text" label="Clear" onClick={() => setCount(0)} />
    </div>
  );
};

const Dot = () => {
  const [attention, setAttention] = React.useState(true);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Badge hostLabel="Vehicle CA 123-456" dot count={attention ? 1 : 0}>
        <TruckIcon />
      </Badge>
      <Button
        variant="text"
        label={attention ? 'Resolve' : 'Flag attention'}
        onClick={() => setAttention((a) => !a)}
      />
    </div>
  );
};

const Capped = () => {
  const [count, setCount] = React.useState(127);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Badge hostLabel="Unread alerts" count={count}>
        <BellIcon />
      </Badge>
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        actual count: {count}
      </span>
      <Button variant="text" label="-40" onClick={() => setCount((c) => Math.max(0, c - 40))} />
      <Button variant="text" label="+40" onClick={() => setCount((c) => c + 40)} />
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  Numeric,
  Dot,
  Capped,
};
