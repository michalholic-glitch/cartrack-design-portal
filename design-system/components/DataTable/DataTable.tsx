import React from 'react';

export interface DataTableColumn<Row> {
  /** Unique column key, also used as the sort key. */
  key: string;
  /** Column header label. */
  header: string;
  /** Right-aligns the column and uses tabular figures — use for numeric data. */
  numeric?: boolean;
  /** Column participates in sorting when a sort handler is provided. */
  sortable?: boolean;
  /** Renders a cell's value; defaults to `row[key]`. */
  render?: (row: Row) => React.ReactNode;
}

export interface DataTableProps<Row extends { id: string }> {
  /** Table title shown in the toolbar (replaced by the contextual toolbar during selection). */
  title: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  /** Enables the leading selection checkbox column and the contextual toolbar. */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Bulk actions shown in the contextual toolbar while rows are selected (e.g. Export, Delete). */
  bulkActions?: { label: string; onClick: (selectedIds: string[]) => void }[];
  /** Active sort column key; only one column sorts at a time unless multi-sort is explicitly built by the caller. */
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (columnKey: string) => void;
  /** Reduces row/header height for high-volume operator screens. */
  dense?: boolean;
  /** Pagination footer. Omit to render an unpaginated table. */
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: Row) => void;
}

/**
 * DataTable — MD2 (MDC) Cartrack-themed.
 * Full spec: DataTable.doc.json
 * Mirrors the mdc-data-table class contract from md2-cartrack-library/components/data-table.html.
 * The MDC reference component is `DataGrid from @karoo-ui/core`; this wraps the same real
 * mdc-data-table__* markup used in production.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.primary (sorted/active header, cell text), semantic.color.text.secondary
 *   (unsorted header, "on-surface-medium"), semantic.color.border.default (row divider — literally the
 *   same rgba(0,0,0,.12) value the spec calls out), semantic.color.interactive.primarySelected
 *   (selected-row background, ~10% — this IS the doc's "token --selected").
 * - spacing: semantic.spacing.md (16px column padding), semantic.spacing.lg (24px first/last column).
 * - type: semantic.typography.scale.body2 (14px — both header and cell text; weight differs by state,
 *   see states above, not a separate scale entry).
 * Not yet tokenized: row/header/toolbar heights (56/52/40/36/64px) have no matching dimension tokens.
 */
export function DataTable<Row extends { id: string }>({
  title,
  columns,
  rows,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  bulkActions = [],
  sortColumn,
  sortDirection = 'asc',
  onSortChange,
  dense = false,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowClick,
}: DataTableProps<Row>) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const someSelected = selectedIds.length > 0 && !allSelected;
  const isContextual = selectable && selectedIds.length > 0;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? [] : rows.map((r) => r.id));
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]
    );
  };

  return (
    <div className={['mdc-data-table', dense ? 'mdc-data-table--dense' : ''].filter(Boolean).join(' ')}>
      {isContextual ? (
        <div className="mdc-data-table__header-row mdc-data-table__header-row--selected" role="toolbar">
          <span>{selectedIds.length} selected</span>
          {bulkActions.map((action) => (
            <button key={action.label} onClick={() => action.onClick(selectedIds)}>
              {action.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mdc-data-table__header-row" role="toolbar">
          <span className="mdc-data-table__title">{title}</span>
        </div>
      )}
      <div className="mdc-data-table__table-container">
        <table className="mdc-data-table__table" aria-label={title}>
          <thead>
            <tr className="mdc-data-table__header-row">
              {selectable && (
                <th className="mdc-data-table__header-cell mdc-data-table__header-cell--checkbox" role="columnheader" scope="col">
                  <div className="mdc-checkbox" data-indeterminate={someSelected || undefined}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={toggleAll}
                      aria-label="Select all rows"
                    />
                  </div>
                </th>
              )}
              {columns.map((col) => {
                const sorted = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    className={[
                      'mdc-data-table__header-cell',
                      col.numeric ? 'mdc-data-table__header-cell--numeric' : '',
                      col.sortable ? 'mdc-data-table__header-cell--sortable' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role="columnheader"
                    scope="col"
                    aria-sort={sorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={col.sortable ? () => onSortChange?.(col.key) : undefined}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="mdc-data-table__content">
            {rows.map((row) => {
              const selected = selectedIds.includes(row.id);
              return (
                <tr
                  key={row.id}
                  className={['mdc-data-table__row', selected ? 'mdc-data-table__row--selected' : '']
                    .filter(Boolean)
                    .join(' ')}
                  aria-selected={selectable ? selected : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    <td className="mdc-data-table__cell mdc-data-table__cell--checkbox">
                      <div className="mdc-checkbox">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRow(row.id)}
                          aria-label={`Select row ${row.id}`}
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((col, idx) => {
                    const CellTag = idx === 0 ? 'th' : 'td';
                    return (
                      <CellTag
                        key={col.key}
                        className={[
                          'mdc-data-table__cell',
                          col.numeric ? 'mdc-data-table__cell--numeric' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        scope={idx === 0 ? 'row' : undefined}
                      >
                        {col.render ? col.render(row) : String((row as any)[col.key] ?? '')}
                      </CellTag>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {page !== undefined && rowsPerPage !== undefined && totalRows !== undefined && (
        <div className="mdc-data-table__pagination">
          <div className="mdc-data-table__pagination-rows-per-page">Rows per page: {rowsPerPage}</div>
          <div className="mdc-data-table__pagination-total">
            {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, totalRows)} of {totalRows}
          </div>
          <button
            className="mdc-data-table__pagination-button mdc-data-table__pagination-button--prev"
            disabled={page === 0}
            onClick={() => onPageChange?.(page - 1)}
            aria-label="Previous page"
          >
            ‹
          </button>
          <button
            className="mdc-data-table__pagination-button mdc-data-table__pagination-button--next"
            disabled={(page + 1) * rowsPerPage >= totalRows}
            onClick={() => onPageChange?.(page + 1)}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
