import React from 'react';
import { ImageList, ImageListItemData } from '../../design-system/components/ImageList/ImageList';

/* Live demos for the portal — rendered from the REAL ImageList.tsx.
   Keys must exactly match ImageList.doc.json variant names.
   "Quilted / woven" and "Masonry" are deliberately absent: ImageList.tsx only
   renders a uniform grid (fixed 80px tile height, equal-width `cols`), so
   varied tile sizes / aspect ratios can't be expressed — those tiles fall back
   to the mockup (documented gap).

   Images are self-contained SVG data URIs standing in for vehicle photos, so
   the portal needs no network fetch. Fill colours are staging pixels taken
   from the tokens.json data-viz hue palette (paths commented per swatch). */

const photo = (text: string, fill: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80">` +
      `<rect width="160" height="80" fill="${fill}"/>` +
      `<rect x="0" y="56" width="160" height="24" fill="rgba(0,0,0,0.25)"/>` +
      `<text x="80" y="46" font-family="Roboto,Arial,sans-serif" font-size="13" fill="#FFFFFF" text-anchor="middle">${text}</text>` +
      `</svg>`
  );

/* Swatches: primitive.color.hue.* (categorical palette) — staging photo fills only. */
const BLUE = '#5390BC';   /* primitive.color.hue.blue.base */
const GREEN = '#5CAE60';  /* primitive.color.hue.green.base */
const CYAN = '#53B8C6';   /* primitive.color.hue.cyan.base */
const PURPLE = '#A870BD'; /* primitive.color.hue.purple.base */
const YELLOW = '#D9A141'; /* primitive.color.hue.yellow.60 */
const RED = '#CE5239';    /* primitive.color.hue.red.base */

const VEHICLES: { reg: string; fill: string }[] = [
  { reg: 'CA 123-456', fill: BLUE },
  { reg: 'CA 234-567', fill: GREEN },
  { reg: 'CA 345-678', fill: CYAN },
  { reg: 'CA 456-789', fill: PURPLE },
  { reg: 'CA 567-890', fill: YELLOW },
  { reg: 'CA 678-901', fill: RED },
];

const items = (withLabel: boolean, onClick?: (reg: string) => void): ImageListItemData[] =>
  VEHICLES.map((v) => ({
    id: v.reg,
    src: photo(v.reg, v.fill),
    alt: `Inspection photo of vehicle ${v.reg}`,
    label: withLabel ? v.reg : undefined,
    onClick: onClick ? () => onClick(v.reg) : undefined,
  }));

const Standard = () => <ImageList items={items(false)} cols={3} maxWidth={360} />;

const WithTextOverlay = () => <ImageList items={items(true)} cols={3} maxWidth={360} />;

/* Hero: the standard grid with caption overlays and clickable tiles —
   inspection snapshots opening a larger view, at actual size. */
export const hero = () => {
  const [viewing, setViewing] = React.useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 /* semantic.spacing.sm */ }}>
      <ImageList items={items(true, setViewing)} cols={3} maxWidth={360} />
      <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
        {viewing ? `Opening inspection photo for ${viewing}…` : 'Click a tile to open its larger view.'}
      </span>
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Standard': Standard,
  'With text overlay': WithTextOverlay,
  // 'Quilted / woven' omitted — ImageList.tsx renders equal-size tiles only (no per-tile spans).
  // 'Masonry' omitted — tile height is fixed at 80px, so differing aspect ratios can't be expressed.
};
