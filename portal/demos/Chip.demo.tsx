import React from 'react';
import { Chip } from '../../design-system/components/Chip/Chip';

/* Live demos for the portal — rendered from the REAL Chip.tsx (a thin
   wrapper over @mui/material/Chip). Keys must exactly match Chip.doc.json
   variant names.
   The "small" chip size comes from cartrackTheme's MuiChip defaultProps
   (the portal mount supplies the ThemeProvider). Status colouring is a
   usage pattern (sx mapped from the statusChip tokens), not a Chip prop —
   per Chip.doc.json. */

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px' /* semantic.spacing.sm */,
    }}
  >
    {children}
  </div>
);

const FilledChips = () => (
  <Row>
    <Chip label="Depot North" />
    <Chip label="Long haul" />
    <Chip label="Refrigerated" />
  </Row>
);

const OutlinedChips = () => (
  <Row>
    <Chip variant="outlined" label="Depot North" />
    <Chip variant="outlined" label="Long haul" />
    <Chip variant="outlined" label="Refrigerated" />
  </Row>
);

/* Filter chips (onClick toggles) + input chips (onDelete removes) — both are
   usage patterns of the same Chip API, per the doc.json ("no dedicated
   input/filter/choice/action prop"). Selected filter chips use brand primary
   DARK, not main: white on #F47735 fails WCAG AA (tokens.json
   accessibility.knownIssues). */
const FILTERS = ['Active', 'Idle', 'Offline'];
const DRIVERS = ['Jane Cooper', 'Frank Kim', 'Ayanda Dlamini'];

const ClickableDeletableChips = () => {
  const [on, setOn] = React.useState<string[]>(['Active']);
  const [drivers, setDrivers] = React.useState<string[]>(DRIVERS);
  const toggle = (f: string) =>
    setOn((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' /* semantic.spacing.md */ }}>
      <Row>
        {FILTERS.map((f) => {
          const selected = on.includes(f);
          return (
            <Chip
              key={f}
              label={f}
              onClick={() => toggle(f)}
              variant={selected ? 'filled' : 'outlined'}
              aria-pressed={selected}
              sx={
                selected
                  ? {
                      bgcolor: '#BB4800' /* semantic.color.brand.primary.dark */,
                      color: '#FFFFFF' /* semantic.color.brand.primary.onPrimary */,
                      '&:hover': { bgcolor: '#BB4800' /* semantic.color.brand.primary.dark */ },
                    }
                  : undefined
              }
            />
          );
        })}
      </Row>
      <Row>
        {drivers.map((d) => (
          <Chip key={d} label={d} onDelete={() => setDrivers((s) => s.filter((x) => x !== d))} />
        ))}
        {drivers.length === 0 && (
          <Chip variant="outlined" label="Reset drivers" onClick={() => setDrivers(DRIVERS)} />
        )}
      </Row>
    </div>
  );
};

/* Read-only status mapping: Active=success, Idle=warning, Offline=error.
   50-tone fill + 900-tone text (the AA-passing pair per tokens.json's
   statusChip note). No onClick/onDelete — status chips stay non-interactive. */
const StatusChips = () => (
  <Row>
    <Chip
      label="Active"
      sx={{
        bgcolor: '#E8F5E9' /* semantic.color.statusChip.success.background */,
        color: '#1B5E20' /* semantic.color.statusChip.success.text */,
      }}
    />
    <Chip
      label="Idle"
      sx={{
        bgcolor: '#FFF3E0' /* semantic.color.statusChip.warning.background */,
        color: '#E65100' /* semantic.color.statusChip.warning.text */,
      }}
    />
    <Chip
      label="Offline"
      sx={{
        bgcolor: '#FFEBEE' /* semantic.color.statusChip.error.background */,
        color: '#B71C1C' /* semantic.color.statusChip.error.text */,
      }}
    />
  </Row>
);

export const hero: React.ComponentType = () => <Chip label="Jane Cooper" />;

export const demos: Record<string, React.ComponentType> = {
  Filled: FilledChips,
  Outlined: OutlinedChips,
  'Clickable / deletable': ClickableDeletableChips,
  'Status (read-only, usage pattern)': StatusChips,
};
