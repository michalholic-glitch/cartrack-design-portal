import React from 'react';
import Paper, { type PaperProps } from '@mui/material/Paper';
import {
  DataGrid as MuiDataGrid,
  type DataGridProps as MuiDataGridProps,
  type GridValidRowModel,
} from '@mui/x-data-grid';

export type DataGridProps<R extends GridValidRowModel = any> = MuiDataGridProps<R> & {
  /** Props forwarded to the root Paper container (see below). */
  RootPaperProps?: PaperProps;
};

/**
 * DataGrid — MUI X (@mui/x-data-grid), Cartrack-themed via @karoo-ui/core.
 *
 * LICENSE NOTE: fleet-web's real DataGrid wrapper is actually built on
 * `DataGridPremium` from `@mui/x-data-grid-premium` (see DataGridBase.tsx),
 * not the free community `DataGrid`. The Premium/Pro tiers require a valid
 * `@mui/x-license` key at runtime (fleet-web calls `LicenseInfo.setLicenseKey(...)`
 * once at import time in the real karoo-ui barrel). Outside a licensed
 * environment, the Premium/Pro grid renders with watermarks and console
 * errors. This decoupled wrapper deliberately imports the free-tier
 * `@mui/x-data-grid` `DataGrid` instead (no license dependency, portable
 * outside the fleetapp-web monorepo) — its column/row/sort/filter/selection
 * prop API is the same shape fleet-web's Premium grid extends, so this file
 * documents that common surface faithfully; grouping/aggregation/pivoting/
 * Excel-export are Premium-only extras NOT modeled here.
 *
 * Full spec: DataGrid.doc.json
 * Real source: libs/shared/js/karoo-ui/core/src/lib/DataGrid/DataGrid.tsx +
 * DataGridBase.tsx (real fleet-web source).
 * Replaces the old repo's "DataTable" component — fleet-web's real tabular
 * data uses MUI X DataGrid, not a plain <table>/<tr>/<td> component.
 *
 * Overrides actually applied by karoo-ui's real wrapper (reproduced here):
 * - Renders inside a `<Paper>` with flex/column layout and height:100% so the
 *   grid fills its container responsively (a documented MUI X workaround,
 *   see https://github.com/mui/mui-x/issues/8758).
 * - `showToolbar` defaults to true (real default is also true, unlike some
 *   older MUI X versions).
 * - Selected-row background is overridden to a neutral grey tint instead of
 *   MUI's default primary tint (`rgba(91,91,91,13.5%)` / `20.5%` hover).
 * - Cell/column-header focus outlines are suppressed (`outline: none`) —
 *   fleet-web relies on its own row/cell hover-highlight instead.
 * - `.MuiDataGrid-main` gets a `minHeight: 130px` guard to avoid a real MUI
 *   crash when the grid is resized to near-zero height (FTW-8383).
 * Not reproduced here (see DataGridBase.tsx for full fidelity): the
 * apiRef-based stable-columns workaround, the `keepNonExistentRowsSelected`
 * auto-default for checkboxSelection, tree-data/grouping column defaults,
 * and the filter-panel width tweak — all real, all omitted for portability
 * and to keep this a genuinely "thin" wrapper.
 *
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.primary/secondary, semantic.color.border.default,
 *   semantic.color.surface.paper.
 * - type: semantic.typography.scale.body2 (cell text, theme's default variant).
 * - MuiDataGrid.styleOverrides.root fontSize is pinned to 14px in theme.ts.
 */
export function DataGrid<R extends GridValidRowModel = any>({
  RootPaperProps,
  sx,
  ...props
}: DataGridProps<R>) {
  return (
    <Paper
      {...RootPaperProps}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        },
        ...(Array.isArray(RootPaperProps?.sx) ? RootPaperProps!.sx : RootPaperProps?.sx ? [RootPaperProps.sx] : []),
      ]}
    >
      <MuiDataGrid<R>
        showToolbar
        {...props}
        sx={[
          {
            border: 'none',
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: 'rgb(91 91 91 / 13.5%)',
            },
            '& .MuiDataGrid-row.Mui-selected:hover': {
              backgroundColor: 'rgb(91 91 91 / 20.5%)',
            },
            '& .MuiDataGrid-main': {
              minHeight: '130px',
            },
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      />
    </Paper>
  );
}

export default DataGrid;
