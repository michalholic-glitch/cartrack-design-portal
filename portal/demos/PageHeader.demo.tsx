import React from 'react';
import { PageHeader } from '../../design-system/components/PageHeader/PageHeader';
import { Button } from '../../design-system/components/Button/Button';
import { Breadcrumbs } from '../../design-system/components/Breadcrumbs/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

/* Live demos for the portal — rendered from the REAL PageHeader.tsx.
   Keys must exactly match PageHeader.doc.json variant names.

   PageHeader is a compound component with exactly two slots —
   PageHeader.Title and PageHeader.ButtonsContainer — and no other props.
   The Detail variant's back-link is composed from Breadcrumbs, exactly as
   PageHeader.doc.json prescribes (no backLink prop exists to invent). */

/* Full-width staging: the header is a space-between flex row, so it needs the
   tile's whole width to read correctly. */
const Stage = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%' }}>{children}</div>
);

const Simple = () => (
  <Stage>
    <PageHeader>
      <PageHeader.Title>My Profile</PageHeader.Title>
    </PageHeader>
  </Stage>
);

const List = () => {
  const [loading, setLoading] = React.useState(false);
  return (
    <Stage>
      <PageHeader>
        <PageHeader.Title>Vehicles</PageHeader.Title>
        <PageHeader.ButtonsContainer>
          <Button variant="text">Export</Button>
          <Button variant="outlined">Import</Button>
          {/* one contained primary action per view */}
          <Button
            variant="contained"
            startIcon={<span aria-hidden="true">+</span>}
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 900);
            }}
          >
            Add vehicle
          </Button>
        </PageHeader.ButtonsContainer>
      </PageHeader>
    </Stage>
  );
};

const Detail = () => (
  <Stage>
    <PageHeader>
      {/* Back-link built from Breadcrumbs (back arrow + parent label > record
          name), per PageHeader.doc.json — the left slot replaces Title here.
          Breadcrumbs is children-based (Link/Typography), not an items array. */}
      <Breadcrumbs aria-label="Back to vehicles">
        <Link underline="hover" color="inherit" href="#">
          ← Vehicles
        </Link>
        <Typography color="text.primary" aria-current="page">
          CA 123-456
        </Typography>
      </Breadcrumbs>
      <PageHeader.ButtonsContainer>
        <Button variant="outlined">Assign driver</Button>
        <Button variant="contained">Edit vehicle</Button>
      </PageHeader.ButtonsContainer>
    </PageHeader>
  </Stage>
);

/* Hero: the List form — the header as it tops the Vehicles collection page,
   title left, wrapping action row right. */
export const hero = List;

export const demos: Record<string, React.ComponentType> = {
  'Simple (title only)': Simple,
  'List (title + actions)': List,
  'Detail (back-link + actions)': Detail,
};
