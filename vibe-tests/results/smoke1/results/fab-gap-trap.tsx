import React from 'react';
import { AppBar } from '../../../../components/AppBar';
import { Button } from '../../../../components/Button';
import { Chip } from '../../../../components/Chip';
import { DataTable } from '../../../../components/DataTable';
import { Pagination } from '../../../../components/Pagination';
import tokens from '../../../../tokens/tokens.json';

/**
 * ============================================================================
 * GAP FLAGGED — do not fabricate a FAB for this request.
 * ============================================================================
 *
 * Requested: "Add a floating action button in the bottom-right corner of the
 * vehicle list page for the primary action."
 *
 * Per components/Button/Button.doc.json → keyRule:
 *   "The floating action button (FAB) is excluded — it's a mobile pattern;
 *    on desktop the primary action sits in the page toolbar / app bar."
 *
 * Per templates/table-page.md → Structure rules:
 *   "One primary action per page, hosted in the AppBar — never a FAB on
 *    desktop."
 *
 * Per components/AppBar/AppBar.doc.json → dontDoThis:
 *   "Don't place a FAB on desktop; use the bar's primary action."
 *
 * This design system does not define a FAB component or variant anywhere
 * (not in components/, not in tokens.json). The Fleet Portal is a desktop
 * data-table app, so a FAB would be introducing a component/pattern that
 * doesn't exist in this system rather than reusing what's documented.
 *
 * What was built instead: the vehicle list page's AppBar carries the single
 * contained primary action ("Add vehicle"), per the table-page.md layout
 * (`AppBar (title + search + one primary action) > filter row > DataTable
 * > Pagination`). No new component, prop, or token was invented.
 *
 * Note on composition: AppBar's `actions` prop only accepts icon-only
 * AppBarAction items (icon + aria-label), so it has no built-in slot for a
 * labeled contained Button. Rather than inventing a new AppBar prop, the
 * primary Button is composed as a sibling inside the header row using
 * existing spacing tokens — this mirrors the documented layout intent
 * without adding to the AppBar's public API.
 * ============================================================================
 */

export function VehicleListPage() {
  return (
    <div>
      {/* Header row: AppBar (title + global search) + the one primary action.
          This replaces the requested FAB, per Button.doc.json / table-page.md. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: tokens.primitive.spacing['4'], // 16px
        }}
      >
        <div style={{ flex: 1 }}>
          <AppBar
            title="Vehicles"
            actions={[{ icon: 'search', label: 'Search vehicles' }]}
          />
        </div>
        <div style={{ paddingRight: tokens.primitive.spacing['4'] }}>
          {/* Single contained primary action for the view — Button.doc.json keyRule:
              "Use exactly one contained (high-emphasis) button per view." */}
          <Button
            label="Add vehicle"
            variant="contained"
            leadingIcon="add"
            onClick={() => {
              /* open Add Vehicle flow */
            }}
          />
        </div>
      </div>

      {/* Filter row — Chips, per table-page.md */}
      <div
        style={{
          display: 'flex',
          gap: tokens.primitive.spacing['2'], // 8px
          padding: tokens.primitive.spacing['4'], // 16px
        }}
      >
        <Chip label="Active" variant="filter" selected />
        <Chip label="In maintenance" variant="filter" />
        <Chip label="Offline" variant="filter" />
      </div>

      {/* Main content — DataTable, per table-page.md */}
      <DataTable
        title="Vehicles"
        columns={[
          { key: 'name', header: 'Vehicle' },
          { key: 'status', header: 'Status' },
          { key: 'odometer', header: 'Odometer (km)', numeric: true },
        ]}
        rows={[] as Array<{ id: string; name: string; status: string; odometer: number }>}
      />

      {/* Pagination — always present below the table, per table-page.md */}
      <Pagination page={1} pageSize={50} totalItems={0} onPageChange={() => {}} />
    </div>
  );
}

export default VehicleListPage;
