import React from 'react';
import { PageHeader } from '../../design-system/components/PageHeader/PageHeader';
import { Button } from '../../design-system/components/Button/Button';
import { Breadcrumbs } from '../../design-system/components/Breadcrumbs/Breadcrumbs';

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
          <Button variant="text" label="Export" />
          <Button variant="outlined" label="Import" />
          {/* one contained primary action per view */}
          <Button
            variant="contained"
            label="Add vehicle"
            leadingIcon="add"
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 900);
            }}
          />
        </PageHeader.ButtonsContainer>
      </PageHeader>
    </Stage>
  );
};

const Detail = () => (
  <Stage>
    <PageHeader>
      {/* Back-link built from Breadcrumbs (back arrow + parent label > record
          name), per PageHeader.doc.json — the left slot replaces Title here. */}
      <Breadcrumbs
        items={[
          { label: '← Vehicles', href: '#' },
          { label: 'CA 123-456' },
        ]}
      />
      <PageHeader.ButtonsContainer>
        <Button variant="outlined" label="Assign driver" />
        <Button variant="contained" label="Edit vehicle" leadingIcon="edit" />
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
