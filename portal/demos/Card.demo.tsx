import React from 'react';
import { Card } from '../../design-system/components/Card/Card';

/* Live demos for the portal — rendered from the REAL Card.tsx.
   Keys must exactly match Card.doc.json variant names. */

const KpiRow = ({ items }: { items: [string, string][] }) => (
  <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
    {items.map(([value, caption]) => (
      <span key={caption} style={{ display: 'inline-flex', flexDirection: 'column' }}>
        <strong style={{ fontSize: '1.1rem', color: 'rgba(0,0,0,.87)' /* semantic.color.text.primary */ }}>
          {value}
        </strong>
        <span style={{ fontSize: '.75rem' }}>{caption}</span>
      </span>
    ))}
  </div>
);

/* Static "map thumbnail" placeholder for the media slot — demo staging only. */
const MapThumb = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      minHeight: 120,
      background:
        'linear-gradient(135deg, #87B1D0 0%, #A5D2A8 100%)' /* primitive.color.hue.blue.20 → hue.green.20 */,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '.8rem',
      color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */,
    }}
  >
    Last known position — N1, Cape Town
  </div>
);

const ActionFeedback = ({ last }: { last: string }) =>
  last ? (
    <div style={{ marginTop: 8, fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
      Last action: {last}
    </div>
  ) : null;

/* Hero: an elevated vehicle-summary card with KPIs and low-emphasis actions,
   beside an actionable card — the two ways cards appear on the dashboard. */
export const hero = () => {
  const [last, setLast] = React.useState('');
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
        <div style={{ width: 320 }}>
          <Card
            title="CA 123-456"
            subtitle="Jane Cooper · Active"
            content={<KpiRow items={[['52,431', 'km odometer'], ['12 min', 'since last trip'], ['96%', 'utilisation']]} />}
            actions={[
              { label: 'View trips', onClick: () => setLast('View trips') },
              { label: 'Track', onClick: () => setLast('Track') },
            ]}
          />
        </div>
        <div style={{ width: 320 }}>
          <Card
            title="Alerts today"
            subtitle="Fleet-wide"
            content="7 speeding · 2 harsh braking · 1 geofence exit"
            actionable
            onClick={() => setLast('Open alerts (whole-card click)')}
          />
        </div>
      </div>
      <ActionFeedback last={last} />
    </div>
  );
};

const Elevated = () => {
  const [last, setLast] = React.useState('');
  return (
    <div style={{ width: 320 }}>
      <Card
        title="CA 123-456"
        subtitle="Jane Cooper · Active"
        content={<KpiRow items={[['52,431', 'km odometer'], ['12 min', 'since last trip']]} />}
        actions={[
          { label: 'View trips', onClick: () => setLast('View trips') },
          { label: 'Track', onClick: () => setLast('Track') },
        ]}
      />
      <ActionFeedback last={last} />
    </div>
  );
};

const Outlined = () => (
  <div style={{ width: 320 }}>
    <Card
      variant="outlined"
      title="Fuel spend — June"
      subtitle="42 vehicles"
      content={<KpiRow items={[['R 184,220', 'total'], ['R 4,386', 'per vehicle']]} />}
      actions={[{ label: 'Open report', onClick: () => {} }]}
    />
  </div>
);

const WithMedia = () => (
  <div style={{ width: 320 }}>
    <Card
      title="CA 789-012"
      subtitle="Frank Kim · Idle"
      media={<MapThumb />}
      content="Stationary for 26 minutes near Paarden Eiland depot."
      actions={[{ label: 'Track live', onClick: () => {} }]}
    />
  </div>
);

const Actionable = () => {
  const [opens, setOpens] = React.useState(0);
  return (
    <div style={{ width: 320 }}>
      <Card
        actionable
        onClick={() => setOpens((n) => n + 1)}
        title="CA 345-678"
        subtitle="Lena Ortiz · Offline"
        content="Last seen 2 h ago — click anywhere on the card to open the vehicle detail."
      />
      {opens > 0 && (
        <div style={{ marginTop: 8, fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
          Would navigate to vehicle detail ({opens}×)
        </div>
      )}
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  Elevated,
  Outlined,
  'With media': WithMedia,
  'Actionable (whole-card)': Actionable,
};
