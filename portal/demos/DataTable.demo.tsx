import React from 'react';
import { DataTable, DataTableColumn } from '../../design-system/components/DataTable/DataTable';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL DataTable.tsx.
   Keys must exactly match DataTable.doc.json variant names. */

type Row = { id: string; reg: string; driver: string; status: string; odo: number; lastTrip: string };

const DRIVERS = ['Jane Cooper', 'Frank Kim', 'Lena Ortiz', 'Ana Diaz'];
const STATUS = ['Active', 'Idle', 'Offline'];
const ALL_ROWS: Row[] = Array.from({ length: 24 }, (_, i) => ({
  id: `r${i}`,
  reg: `CA ${100 + i}-${400 + i}`,
  driver: DRIVERS[i % 4],
  status: STATUS[i % 3],
  odo: 50000 + i * 731,
  lastTrip: `${i + 1} min ago`,
}));

const chip = (status: string) => {
  /* status-chip colours: tokens.json semantic.color.status tints (same mapping the preview uses) */
  const map: Record<string, [string, string]> = {
    Active: ['#E8F5E9', '#1B5E20'],
    Idle: ['#FFF3E0', '#E65100'],
    Offline: ['#FFEBEE', '#B71C1C'],
  };
  const [bg, fg] = map[status];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 8px',
        borderRadius: 12, fontSize: 12, fontWeight: 500, background: bg, color: fg,
      }}
    >
      {status}
    </span>
  );
};

const COLUMNS: DataTableColumn<Row>[] = [
  { key: 'reg', header: 'Registration', sortable: true },
  { key: 'driver', header: 'Driver', sortable: true },
  { key: 'status', header: 'Status', render: (r) => chip(r.status) },
  { key: 'odo', header: 'Odometer (km)', numeric: true, sortable: true, render: (r) => r.odo.toLocaleString() },
];

function useSort(rows: Row[]) {
  const [sortColumn, setSortColumn] = React.useState<string | undefined>();
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const sorted = React.useMemo(() => {
    if (!sortColumn) return rows;
    const s = [...rows].sort((a, b) =>
      String((a as any)[sortColumn]).localeCompare(String((b as any)[sortColumn]), undefined, { numeric: true })
    );
    return sortDirection === 'asc' ? s : s.reverse();
  }, [rows, sortColumn, sortDirection]);
  const onSortChange = (k: string) => {
    setSortDirection(sortColumn === k && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortColumn(k);
  };
  return { sorted, sortColumn, sortDirection, onSortChange };
}

const WithToolbar = () => {
  const { sorted, ...sort } = useSort(ALL_ROWS.slice(0, 4));
  return (
    <DataTable<Row>
      title="Vehicles"
      columns={COLUMNS}
      rows={sorted}
      {...sort}
      toolbarActions={<Button variant="text" label="Filter" />}
    />
  );
};

const Selectable = () => {
  const [selected, setSelected] = React.useState<string[]>(['r0', 'r1']);
  return (
    <DataTable<Row>
      title="Vehicles"
      columns={COLUMNS}
      rows={ALL_ROWS.slice(0, 4)}
      selectable
      selectedIds={selected}
      onSelectionChange={setSelected}
      bulkActions={[
        { label: 'Export', onClick: () => {} },
        { label: 'Delete', onClick: () => setSelected([]) },
      ]}
    />
  );
};

const Paginated = () => {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
  return (
    <DataTable<Row>
      title="Vehicles"
      columns={COLUMNS}
      rows={ALL_ROWS.slice(page * rowsPerPage, (page + 1) * rowsPerPage)}
      page={page}
      rowsPerPage={rowsPerPage}
      totalRows={ALL_ROWS.length}
      onPageChange={setPage}
    />
  );
};

const Dense = () => (
  <DataTable<Row> title="Vehicles" columns={COLUMNS} rows={ALL_ROWS.slice(0, 5)} dense />
);

const StickyBounded = () => {
  const { sorted, ...sort } = useSort(ALL_ROWS);
  return (
    <DataTable<Row>
      title="Vehicles"
      columns={COLUMNS}
      rows={sorted}
      {...sort}
      stickyHeader
      maxHeight={240}
    />
  );
};

const Loading = () => (
  <DataTable<Row> title="Vehicles" columns={COLUMNS} rows={ALL_ROWS.slice(0, 2)} loading />
);

const EmptyState = () => (
  <DataTable<Row>
    title="Vehicles"
    columns={COLUMNS}
    rows={[]}
    emptyState={
      <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        No vehicles match the current filters.
        <Button variant="text" label="Clear filters" />
      </span>
    }
  />
);

const RowActions = () => {
  const [last, setLast] = React.useState('');
  return (
    <div>
      <DataTable<Row>
        title="Vehicles"
        columns={COLUMNS}
        rows={ALL_ROWS.slice(0, 3)}
        rowActions={(row) => [
          { label: 'Edit', onClick: (r) => setLast(`Edit ${r.reg}`) },
          { label: 'Duplicate', onClick: (r) => setLast(`Duplicate ${r.reg}`) },
          { label: 'Delete', destructive: true, onClick: (r) => setLast(`Delete ${r.reg}`) },
        ]}
      />
      {last && (
        <div style={{ marginTop: 8, fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
          Last action: {last}
        </div>
      )}
    </div>
  );
};

/* Hero: the component at its fullest — toolbar, sorting, selection, sticky bounded
   body, row actions, pagination — everything interactive, at actual size. */
export const hero = () => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 12;
  const pageRows = ALL_ROWS.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const { sorted, ...sort } = useSort(pageRows);
  return (
    <DataTable<Row>
      title="Vehicles"
      columns={COLUMNS}
      rows={sorted}
      {...sort}
      selectable
      selectedIds={selected}
      onSelectionChange={setSelected}
      bulkActions={[{ label: 'Export', onClick: () => {} }, { label: 'Delete', onClick: () => setSelected([]) }]}
      stickyHeader
      maxHeight={300}
      page={page}
      rowsPerPage={rowsPerPage}
      totalRows={ALL_ROWS.length}
      onPageChange={(p) => { setSelected([]); setPage(p); }}
      rowActions={() => [
        { label: 'Edit', onClick: () => {} },
        { label: 'Delete', destructive: true, onClick: () => {} },
      ]}
      toolbarActions={<Button variant="text" label="Filter" />}
    />
  );
};

export const demos: Record<string, React.ComponentType> = {
  'With toolbar': WithToolbar,
  'Selectable (checkboxes)': Selectable,
  'Paginated': Paginated,
  'Dense': Dense,
  'Sticky header + bounded height': StickyBounded,
  'Loading': Loading,
  'Empty state': EmptyState,
  'Row actions': RowActions,
};
