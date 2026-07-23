import React from 'react';

import tokens from '../../tokens/tokens.json';
import { Menu } from '../Menu';
import { ProgressIndicator } from '../ProgressIndicator';

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

export interface DataTableRowAction<Row> {
  /** Short, verb-first action label (e.g. "Edit", "Delete"). */
  label: string;
  onClick: (row: Row) => void;
  /** Styles the action as destructive (error colour) in the menu. */
  destructive?: boolean;
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
  /**
   * Pagination footer. Omit to render an unpaginated table.
   * Works client-side or server-driven: for server pagination, pass the current page slice as
   * `rows`, the full count as `totalRows`, and fetch the next slice in `onPageChange` — prefer
   * this past a few thousand rows, or whenever the full dataset isn't practical to hold client-side.
   */
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: Row) => void;
  /** Keeps the header row fixed at the top of the scroll container while the body scrolls. */
  stickyHeader?: boolean;
  /**
   * Bounds the table body: vertical scroll appears when content exceeds this height.
   * Horizontal scroll on overflow is always available regardless of this prop.
   * The toolbar and pagination footer stay outside the scroll region.
   */
  maxHeight?: number | string;
  /**
   * Shows an indeterminate linear progress bar under the toolbar and disables row
   * interactions (sort, selection, row click, row actions, paging) while data loads.
   */
  loading?: boolean;
  /**
   * Custom content for the zero-rows state (message and/or action). Defaults to a plain
   * "No data" message. Rendered as a single full-width row, keeping table semantics.
   */
  emptyState?: React.ReactNode;
  /**
   * Per-row overflow actions, rendered as a trailing "⋮" icon-button cell that opens a Menu.
   * The canonical version of the per-row overflow pattern named in templates/table-page.md.
   */
  rowActions?: (row: Row) => DataTableRowAction<Row>[];
  /**
   * Caller-composed controls (search TextField, filter Button, export Menu trigger…) rendered
   * in the default toolbar beside the title. Intentionally generic — DataTable does not own
   * search/filter/export behaviour.
   */
  toolbarActions?: React.ReactNode;
}

/**
 * DataTable — MD2 (MDC) Cartrack-themed.
 * Full spec: DataTable.doc.json
 * Mirrors the mdc-data-table class contract from md2-cartrack-library/components/data-table.html.
 * The MDC reference component is `DataGrid from @karoo-ui/core`; this wraps the same real
 * mdc-data-table__* markup used in production.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.primary (sorted/active header, cell text), semantic.color.text.secondary
 *   (unsorted header, "on-surface-medium", empty-state message), semantic.color.border.default (row
 *   divider and the sticky-header boundary line — literally the same rgba(0,0,0,.12) value the spec
 *   calls out), semantic.color.interactive.primarySelected (selected-row background, ~10% — this IS
 *   the doc's "token --selected"), semantic.color.surface.paper (sticky header fill, so scrolled rows
 *   don't show through — bound here as primitive.color.white, its literal value).
 * - spacing: semantic.spacing.md (16px column padding), semantic.spacing.lg (24px first/last column,
 *   empty-state padding), semantic.spacing.sm (8px row-actions menu offset).
 * - type: semantic.typography.scale.body2 (14px — both header and cell text; weight differs by state,
 *   see states above, not a separate scale entry).
 * Not yet tokenized: row/header/toolbar heights (56/52/40/36/64px) have no matching dimension tokens.
 * `maxHeight` is caller-provided with no default, so it introduces no new dimension token.
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
  stickyHeader = false,
  maxHeight,
  loading = false,
  emptyState,
  rowActions,
  toolbarActions,
}: DataTableProps<Row>) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const someSelected = selectedIds.length > 0 && !allSelected;
  const isContextual = selectable && selectedIds.length > 0;

  const [openActionsRowId, setOpenActionsRowId] = React.useState<string | null>(null);
  const actionsCellRef = React.useRef<HTMLTableCellElement | null>(null);

  // Menu.doc.json promises dismiss on outside click but Menu itself renders only the surface,
  // so the trigger owner (this component) provides the outside-click listener.
  React.useEffect(() => {
    if (openActionsRowId === null) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (actionsCellRef.current && !actionsCellRef.current.contains(e.target as Node)) {
        setOpenActionsRowId(null);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [openActionsRowId]);

  const toggleAll = () => {
    if (!onSelectionChange || loading) return;
    onSelectionChange(allSelected ? [] : rows.map((r) => r.id));
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange || loading) return;
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]
    );
  };

  const columnCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

  // Sticky positioning lives on the header cells (position:sticky on <thead> is unreliable
  // across engines); the fill + boundary line keep scrolled rows from showing through.
  const stickyHeaderCellStyle: React.CSSProperties | undefined = stickyHeader
    ? {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: tokens.primitive.color.white,
        boxShadow: `0 1px 0 ${tokens.semantic.color.border.default}`,
      }
    : undefined;

  return (
    <div
      className={[
        'mdc-data-table',
        dense ? 'mdc-data-table--dense' : '',
        stickyHeader ? 'mdc-data-table--sticky-header' : '',
        loading ? 'mdc-data-table--loading' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-busy={loading || undefined}
    >
      {isContextual ? (
        <div className="mdc-data-table__header-row mdc-data-table__header-row--selected" role="toolbar">
          <span>{selectedIds.length} selected</span>
          {bulkActions.map((action) => (
            <button key={action.label} disabled={loading} onClick={() => action.onClick(selectedIds)}>
              {action.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mdc-data-table__header-row" role="toolbar">
          <span className="mdc-data-table__title">{title}</span>
          {toolbarActions ? (
            <div className="mdc-data-table__toolbar-actions">{toolbarActions}</div>
          ) : null}
        </div>
      )}
      {loading && (
        <div className="mdc-data-table__progress-indicator">
          <ProgressIndicator
            type="linear"
            variant="indeterminate"
            label={`Loading ${title}`}
            maxWidth="100%"
          />
        </div>
      )}
      <div
        className="mdc-data-table__table-container"
        style={{ overflowX: 'auto', ...(maxHeight !== undefined ? { maxHeight, overflowY: 'auto' } : {}) }}
      >
        <table className="mdc-data-table__table" aria-label={title}>
          <thead>
            <tr className="mdc-data-table__header-row">
              {selectable && (
                <th
                  className="mdc-data-table__header-cell mdc-data-table__header-cell--checkbox"
                  role="columnheader"
                  scope="col"
                  style={stickyHeaderCellStyle}
                >
                  <div className="mdc-checkbox" data-indeterminate={someSelected || undefined}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      disabled={loading}
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
                    onClick={col.sortable && !loading ? () => onSortChange?.(col.key) : undefined}
                    style={stickyHeaderCellStyle}
                  >
                    {col.header}
                  </th>
                );
              })}
              {rowActions && (
                <th
                  className="mdc-data-table__header-cell mdc-data-table__header-cell--row-actions"
                  role="columnheader"
                  scope="col"
                  aria-label="Row actions"
                  style={stickyHeaderCellStyle}
                />
              )}
            </tr>
          </thead>
          <tbody className="mdc-data-table__content">
            {rows.length === 0 && !loading ? (
              // Minimal placeholder — delegate to the dedicated Empty state component once it
              // exists (see build_portal.py COMING_SOON["Messaging"]).
              <tr className="mdc-data-table__row mdc-data-table__row--empty">
                <td
                  className="mdc-data-table__cell mdc-data-table__cell--empty"
                  colSpan={columnCount}
                  style={{
                    textAlign: 'center',
                    padding: tokens.primitive.spacing['6'],
                    color: tokens.semantic.color.text.secondary,
                  }}
                >
                  {emptyState ?? 'No data'}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const selected = selectedIds.includes(row.id);
                const actions = rowActions ? rowActions(row) : null;
                const actionsOpen = openActionsRowId === row.id;
                return (
                  <tr
                    key={row.id}
                    className={['mdc-data-table__row', selected ? 'mdc-data-table__row--selected' : '']
                      .filter(Boolean)
                      .join(' ')}
                    aria-selected={selectable ? selected : undefined}
                    onClick={onRowClick && !loading ? () => onRowClick(row) : undefined}
                  >
                    {selectable && (
                      <td className="mdc-data-table__cell mdc-data-table__cell--checkbox">
                        <div className="mdc-checkbox">
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={loading}
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
                    {actions && (
                      <td
                        className="mdc-data-table__cell mdc-data-table__cell--row-actions"
                        ref={actionsOpen ? actionsCellRef : undefined}
                        style={{ position: 'relative' }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setOpenActionsRowId(null);
                        }}
                      >
                        <button
                          type="button"
                          className="mdc-data-table__row-actions-trigger"
                          disabled={loading}
                          aria-haspopup="menu"
                          aria-expanded={actionsOpen}
                          aria-label={`Actions for row ${row.id}`}
                          onClick={() => setOpenActionsRowId(actionsOpen ? null : row.id)}
                        >
                          ⋮
                        </button>
                        {actionsOpen && (
                          <div
                            className="mdc-data-table__row-actions-surface"
                            style={{ position: 'absolute', right: tokens.primitive.spacing['2'], zIndex: 2 }}
                          >
                            <Menu
                              variant="overflow"
                              open
                              onClose={() => setOpenActionsRowId(null)}
                              items={actions.map((action) => ({
                                id: action.label,
                                label: action.label,
                                destructive: action.destructive,
                                onClick: () => action.onClick(row),
                              }))}
                            />
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
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
            disabled={page === 0 || loading}
            onClick={() => onPageChange?.(page - 1)}
            aria-label="Previous page"
          >
            ‹
          </button>
          <button
            className="mdc-data-table__pagination-button mdc-data-table__pagination-button--next"
            disabled={(page + 1) * rowsPerPage >= totalRows || loading}
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
