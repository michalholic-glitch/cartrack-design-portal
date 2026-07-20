import React from 'react';

export interface PaginationProps {
  /** Current page, 1-indexed. */
  page: number;
  /** Rows shown per page. */
  pageSize: number;
  /** Total row count across all pages ("1–100 of 100,000"). */
  totalItems: number;
  /** Page-size choices offered in the rows-per-page control (e.g. 25/50/100). */
  pageSizeOptions?: number[];
  /**
   * Table footer (range + prev/next) — default for data tables.
   * Numbered pages — when operators jump around; good for moderate counts.
   * Rows-per-page only — when the dataset fits a couple of pages.
   */
  variant?: 'table-footer' | 'numbered' | 'rows-per-page-only';
  /** How many page-number buttons to show around the current page (numbered variant). */
  siblingCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** Optional extra class names to compose with the base `pgn` class. */
  className?: string;
}

function buildPageList(page: number, pageCount: number, siblingCount: number): (number | '…')[] {
  const pages: (number | '…')[] = [];
  const start = Math.max(1, page - siblingCount);
  const end = Math.min(pageCount, page + siblingCount);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('…');
  }
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < pageCount) {
    if (end < pageCount - 1) pages.push('…');
    pages.push(pageCount);
  }
  return pages;
}

/**
 * Pagination — MD2 (MDC) Cartrack-themed.
 * Full spec: Pagination.doc.json
 *
 * NOTE: MDC Web has no standalone pagination component — pagination lives
 * inside the data table (rows-per-page + range + prev/next). The live
 * Cartrack library (md2-cartrack-library/components/pagination.html) builds
 * a small custom control using the `pgn` / `lbl` / `p` classes, which this
 * component mirrors.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.secondary ("on-surface-medium" label text), semantic.color.interactive.primarySelected
 *   (current-page highlight, ~10% — same family as DataTable's selected-row token).
 * - type: semantic.typography.scale.caption (12px, low end of the spec's "12–14px" text range;
 *   14px is body2).
 * Not yet tokenized: ~32px control height and ~52px footer height have no matching tokens.
 */
export function Pagination({
  page,
  pageSize,
  totalItems,
  pageSizeOptions = [25, 50, 100],
  variant = 'table-footer',
  siblingCount = 1,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const atFirst = page <= 1;
  const atLast = page >= pageCount;

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(1, next), pageCount);
    if (clamped !== page) onPageChange?.(clamped);
  };

  return (
    <nav
      className={['pgn', className].filter(Boolean).join(' ')}
      aria-label="Pagination"
    >
      <span className="lbl">
        Rows per page:{' '}
        <select
          aria-label="Rows per page"
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </span>

      {variant !== 'rows-per-page-only' ? (
        <>
          <span className="lbl">
            {start.toLocaleString()}–{end.toLocaleString()} of {totalItems.toLocaleString()}
          </span>
          <span
            className="p"
            role="button"
            aria-disabled={atFirst}
            aria-label="Previous page"
            onClick={() => !atFirst && goTo(page - 1)}
          >
            ‹
          </span>
          {variant === 'numbered'
            ? buildPageList(page, pageCount, siblingCount).map((p, idx) =>
                p === '…' ? (
                  <span className="p" key={`ellipsis-${idx}`} aria-hidden="true">
                    …
                  </span>
                ) : (
                  <span
                    className={['p', p === page ? 'on' : null].filter(Boolean).join(' ')}
                    key={p}
                    role="button"
                    aria-current={p === page ? 'page' : undefined}
                    onClick={() => goTo(p)}
                  >
                    {p}
                  </span>
                )
              )
            : null}
          <span
            className="p"
            role="button"
            aria-disabled={atLast}
            aria-label="Next page"
            onClick={() => !atLast && goTo(page + 1)}
          >
            ›
          </span>
        </>
      ) : null}
    </nav>
  );
}

export default Pagination;
