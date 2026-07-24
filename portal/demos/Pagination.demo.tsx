import React from 'react';
import { Pagination } from '../../design-system/components/Pagination/Pagination';

/* Live demos for the portal — rendered from the REAL Pagination.tsx (thin wrapper
   over @mui/material/Pagination, MUI v9). Keys must exactly match
   Pagination.doc.json variant names. All three variants are expressible live —
   none omitted.
   Per the doc.json, this component is page controls only — no rows-per-page
   select or "1–100 of N" range label. The hero composes its own range caption
   alongside, as the doc's doThis suggests. */

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px /* primitive.spacing.4 */',
};

const captionStyle: React.CSSProperties = {
  fontSize: '12px /* semantic.typography.scale.caption */',
  color: 'rgba(0, 0, 0, 0.6) /* semantic.color.text.secondary */',
};

/* Hero — a fleet data grid's pager: composed range caption + page controls,
   brand tint on the current page. */
export const hero: React.ComponentType = () => {
  const [page, setPage] = React.useState(3);
  const pageSize = 25;
  const totalVehicles = 1187;
  const count = Math.ceil(totalVehicles / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalVehicles);
  return (
    <div style={rowStyle}>
      <span style={captionStyle}>
        {from}–{to} of {totalVehicles.toLocaleString()} vehicles
      </span>
      <Pagination
        count={count}
        page={page}
        onChange={(_event, value) => setPage(value)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </div>
  );
};

const TextDefault: React.ComponentType = () => {
  const [page, setPage] = React.useState(1);
  return (
    <Pagination
      count={12}
      page={page}
      onChange={(_event, value) => setPage(value)}
    />
  );
};

const Outlined: React.ComponentType = () => {
  const [page, setPage] = React.useState(4);
  return (
    <Pagination
      variant="outlined"
      count={12}
      page={page}
      onChange={(_event, value) => setPage(value)}
    />
  );
};

const RoundedShape: React.ComponentType = () => {
  const [page, setPage] = React.useState(2);
  return (
    <Pagination
      shape="rounded"
      count={12}
      page={page}
      onChange={(_event, value) => setPage(value)}
    />
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Text (default)': TextDefault,
  'Outlined': Outlined,
  'Rounded shape': RoundedShape,
};
