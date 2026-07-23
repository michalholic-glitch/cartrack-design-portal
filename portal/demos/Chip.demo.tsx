import React from 'react';
import { Chip } from '../../design-system/components/Chip/Chip';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Chip.tsx.
   Keys must exactly match Chip.doc.json variant names. */

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);

const Hint = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
    {children}
  </span>
);

/* Hero: a vehicle-list filter bar — toggleable status filters plus removable
   driver input chips, the chip combination the portal actually uses. */
export const hero = () => {
  const [filters, setFilters] = React.useState<Record<string, boolean>>({
    Active: true,
    Idle: false,
    Offline: false,
  });
  const allDrivers = ['Jane Cooper', 'Frank Kim', 'Lena Ortiz'];
  const [drivers, setDrivers] = React.useState<string[]>(allDrivers);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Row>
        <Hint>Status:</Hint>
        {Object.keys(filters).map((name) => (
          <Chip
            key={name}
            variant="filter"
            label={name}
            selected={filters[name]}
            onClick={() => setFilters((f) => ({ ...f, [name]: !f[name] }))}
          />
        ))}
      </Row>
      <Row>
        <Hint>Drivers:</Hint>
        {drivers.map((d) => (
          <Chip
            key={d}
            variant="input"
            label={d}
            removable
            onRemove={() => setDrivers((ds) => ds.filter((x) => x !== d))}
          />
        ))}
        {drivers.length < allDrivers.length && (
          <Button variant="text" label="Reset drivers" onClick={() => setDrivers(allDrivers)} />
        )}
      </Row>
    </div>
  );
};

const InputChip = () => {
  const all = ['Jane Cooper', 'Frank Kim', 'Lena Ortiz', 'Ana Diaz'];
  const [drivers, setDrivers] = React.useState<string[]>(all);
  return (
    <Row>
      {drivers.map((d) => (
        <Chip
          key={d}
          variant="input"
          label={d}
          removable
          onRemove={() => setDrivers((ds) => ds.filter((x) => x !== d))}
        />
      ))}
      {drivers.length === 0 && (
        <>
          <Hint>All driver chips removed.</Hint>
          <Button variant="text" label="Reset" onClick={() => setDrivers(all)} />
        </>
      )}
    </Row>
  );
};

const FilterChip = () => {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({
    Speeding: true,
    'Harsh braking': false,
    'Geofence exit': false,
    'After hours': false,
  });
  const active = Object.values(selected).filter(Boolean).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Row>
        {Object.keys(selected).map((name) => (
          <Chip
            key={name}
            variant="filter"
            label={name}
            selected={selected[name]}
            onClick={() => setSelected((s) => ({ ...s, [name]: !s[name] }))}
          />
        ))}
      </Row>
      <Hint>{active} alert filter{active === 1 ? '' : 's'} active</Hint>
    </div>
  );
};

const ChoiceChip = () => {
  const options = ['Today', 'Last 7 days', 'Last 30 days'];
  const [choice, setChoice] = React.useState('Today');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Row>
        {options.map((o) => (
          <Chip key={o} variant="choice" label={o} selected={choice === o} onClick={() => setChoice(o)} />
        ))}
      </Row>
      <Hint>Trip range: {choice}</Hint>
    </div>
  );
};

const ActionChip = () => {
  const [last, setLast] = React.useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Row>
        <Chip variant="action" label="Assign driver" onClick={() => setLast('Assign driver')} />
        <Chip variant="action" label="Create geofence" onClick={() => setLast('Create geofence')} />
        <Chip variant="action" label="Export trips" disabled />
      </Row>
      {last && <Hint>Last action: {last}</Hint>}
    </div>
  );
};

const StatusChip = () => (
  <Row>
    {/* Read-only status mapping per Chip.doc.json: Active=success, Idle=warning, Offline=error */}
    <Chip variant="status" status="success" label="Active" />
    <Chip variant="status" status="warning" label="Idle" />
    <Chip variant="status" status="error" label="Offline" />
  </Row>
);

export const demos: Record<string, React.ComponentType> = {
  'Input chip': InputChip,
  'Filter chip': FilterChip,
  'Choice chip': ChoiceChip,
  'Action chip': ActionChip,
  'Status chip (read-only)': StatusChip,
};
