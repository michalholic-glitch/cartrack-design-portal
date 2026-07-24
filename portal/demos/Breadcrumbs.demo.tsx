import React from 'react';
import { Breadcrumbs } from '../../design-system/components/Breadcrumbs/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

/* Live demos for the portal — rendered from the REAL Breadcrumbs.tsx (MUI v9 wrapper).
   Keys must exactly match Breadcrumbs.doc.json variant names.
   Real MUI API: Breadcrumbs renders `children` (Link/Typography elements) with its
   own separators — there is no `items` data prop. Current page = non-link last
   child with aria-current="page", per the doc's doThis. */

const noNav = (e: React.MouseEvent) => e.preventDefault(); // demo links go nowhere

/* Crumb link: on-surface-medium, primary-dark on hover — styling belongs to the
   Link child, not Breadcrumbs itself (see Breadcrumbs.doc.json specs). */
const crumbSx = {
  color: 'rgba(0,0,0,.6)', /* semantic.color.text.secondary */
  '&:hover': { color: '#BB4800' }, /* semantic.color.brand.primary.dark */
};

const Crumb = ({ label }: { label: string }) => (
  <Link underline="hover" href="#" onClick={noNav} sx={crumbSx}>
    {label}
  </Link>
);

const Current = ({ label }: { label: string }) => (
  <Typography aria-current="page" sx={{ color: 'rgba(0,0,0,.87)' /* semantic.color.text.primary */ }}>
    {label}
  </Typography>
);

/* Hero: the canonical fleet path — vehicle detail, two levels deep. */
export const hero = () => (
  <Breadcrumbs>
    <Crumb label="Fleet" />
    <Crumb label="Vehicles" />
    <Current label="CA 123-456" />
  </Breadcrumbs>
);

/* Standard: full path for a shallow hierarchy — one child per level. */
const Standard = () => (
  <Breadcrumbs>
    <Crumb label="Fleet" />
    <Crumb label="Drivers" />
    <Current label="Jane Cooper" />
  </Breadcrumbs>
);

/* Collapsed: maxItems folds the middle levels behind an expandable "…" —
   click the ellipsis to reveal the hidden crumbs (built-in, interactive). */
const Collapsed = () => (
  <Breadcrumbs maxItems={3} expandText="Show path">
    <Crumb label="Fleet" />
    <Crumb label="Western Cape" />
    <Crumb label="Cape Town depot" />
    <Crumb label="Vehicles" />
    <Current label="CA 123-456" />
  </Breadcrumbs>
);

/* Custom separator: any node instead of the default "/" — here a chevron glyph. */
const CustomSeparator = () => (
  <Breadcrumbs separator={<span aria-hidden="true">›</span>}>
    <Crumb label="Fleet" />
    <Crumb label="Vehicles" />
    <Crumb label="CA 123-456" />
    <Current label="Trip history" />
  </Breadcrumbs>
);

export const demos: Record<string, React.ComponentType> = {
  'Standard': Standard,
  'Collapsed': Collapsed,
  'Custom separator': CustomSeparator,
};
