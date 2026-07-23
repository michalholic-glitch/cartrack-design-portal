import React from 'react';
import { Pagination } from '../../design-system/components/Pagination/Pagination';

/* Live demos for the portal — rendered from the REAL Pagination.tsx.
   Keys must exactly match Pagination.doc.json variant names.
   Page and page-size are live state; changing rows-per-page resets to page
   one, per the doc's "Resetting" behavior. */

/* Shared controlled state: page (1-indexed) + pageSize. */
function usePaging(initialSize = 25) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialSize);
  return {
    page,
    pageSize,
    onPageChange: setPage,
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setPage(1); // Resetting behavior: page-size change goes back to page one
    },
  };
}

const Caption = ({ text }: { text: string }) => (
  <div style={{ marginBottom: 8, fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
    {text}
  </div>
);

const TableFooter = () => {
  const paging = usePaging();
  return (
    <div>
      <Caption text="4,832 vehicles" />
      <Pagination variant="table-footer" totalItems={4832} {...paging} />
    </div>
  );
};

const Numbered = () => {
  const paging = usePaging();
  return (
    <div>
      <Caption text="1,204 trips this week" />
      <Pagination variant="numbered" totalItems={1204} siblingCount={1} {...paging} />
    </div>
  );
};

const RowsPerPageOnly = () => {
  const paging = usePaging(25);
  return (
    <div>
      <Caption text="38 drivers — fits a couple of pages" />
      <Pagination variant="rows-per-page-only" totalItems={38} {...paging} />
    </div>
  );
};

/* Hero: the default table-footer form on a realistically large fleet dataset —
   rows-per-page select, live range label, prev/next stepping. */
export const hero = TableFooter;

export const demos: Record<string, React.ComponentType> = {
  'Table footer (range + prev/next)': TableFooter,
  'Numbered pages': Numbered,
  'Rows-per-page only': RowsPerPageOnly,
};
