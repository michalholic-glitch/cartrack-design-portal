import * as React from 'react';
import MuiPagination, {
  type PaginationProps as MuiPaginationProps,
} from '@mui/material/Pagination';

/**
 * Pagination — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Pagination/index.tsx
 * Full spec: Pagination.doc.json
 * The real karoo-ui wrapper applies zero overrides — a straight
 * `export { default as Pagination } from '@mui/material/Pagination'`. This
 * file forwards every real prop through a local forwardRef wrapper for
 * consistency with the rest of this folder.
 * IMPORTANT: this is MUI's Pagination — page-number buttons + prev/next only.
 * It does NOT include a rows-per-page select or a "1–100 of 100,000" range
 * label; those belong to a different component (MUI's TablePagination, not
 * currently one of karoo-ui's wrapped components) or a hand-built
 * composition alongside this Pagination.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.secondary — default (unselected) item text.
 * - color: semantic.color.interactive.primarySelected — current-page tint,
 *   only when color="primary" is passed (color defaults to "standard", which
 *   uses text.primary / action.selected, not the brand tint).
 * - type: semantic.typography.scale.caption is a reasonable size reference;
 *   MUI's own PaginationItem text is closer to a 14px button-ish size by
 *   default, not literally the caption token.
 */
export type PaginationProps = MuiPaginationProps;

export const Pagination = React.forwardRef<HTMLUListElement, PaginationProps>(
  function Pagination(props, ref) {
    return <MuiPagination ref={ref} {...props} />;
  },
);

export default Pagination;
