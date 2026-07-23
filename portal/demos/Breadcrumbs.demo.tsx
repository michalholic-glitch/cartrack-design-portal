import React from 'react';
import { Breadcrumbs } from '../../design-system/components/Breadcrumbs/Breadcrumbs';

/* Live demos for the portal — rendered from the REAL Breadcrumbs.tsx.
   Keys must exactly match Breadcrumbs.doc.json variant names.
   "With menu crumb" is deliberately absent: BreadcrumbsProps has no menu/sibling-list
   support (items are plain label+href), so that tile falls back to the static mockup. */

/* Hero: the standard vehicle-detail trail, plus a live look at how the same deep
   path renders collapsed vs. in full. */
export const hero = () => {
  const [collapse, setCollapse] = React.useState(true);
  const deepPath = [
    { label: 'Fleet', href: '#fleet' },
    { label: 'Regions', href: '#regions' },
    { label: 'Western Cape', href: '#western-cape' },
    { label: 'Vehicles', href: '#vehicles' },
    { label: 'CA 123-456' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Breadcrumbs
        items={[
          { label: 'Fleet', href: '#fleet' },
          { label: 'Vehicles', href: '#vehicles' },
          { label: 'CA 123-456' },
        ]}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Breadcrumbs items={deepPath} maxVisible={collapse ? 3 : undefined} />
        <label
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '.8rem', color: 'rgba(0,0,0,.6)', /* semantic.color.text.secondary */
          }}
        >
          <input type="checkbox" checked={collapse} onChange={(e) => setCollapse(e.target.checked)} />
          Collapse deep path
        </label>
      </div>
    </div>
  );
};

const Standard = () => (
  <Breadcrumbs
    items={[
      { label: 'Fleet', href: '#fleet' },
      { label: 'Vehicles', href: '#vehicles' },
      { label: 'CA 123-456' },
    ]}
  />
);

const Collapsed = () => (
  <Breadcrumbs
    maxVisible={3}
    items={[
      { label: 'Fleet', href: '#fleet' },
      { label: 'Regions', href: '#regions' },
      { label: 'Western Cape', href: '#western-cape' },
      { label: 'Vehicles', href: '#vehicles' },
      { label: 'CA 123-456' },
    ]}
  />
);

export const demos: Record<string, React.ComponentType> = {
  Standard,
  Collapsed,
  // "With menu crumb" omitted: the real Breadcrumbs API has no way to attach a
  // sibling-page menu to a crumb — falls back to the static mockup tile.
};
