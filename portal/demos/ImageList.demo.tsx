import React from 'react';
import { ImageList } from '../../design-system/components/ImageList/ImageList';
import { ImageListItem, ImageListItemBar } from '@mui/material';

/* Live demos for the portal — rendered from the REAL ImageList.tsx (MUI v9 wrapper).
   Keys must exactly match ImageList.doc.json variant names.
   Images are self-contained SVG data URIs (no network). The hex fills below are
   pixels inside placeholder *image content*, not UI styling — the closest token
   equivalents are noted per swatch. */

const makeImg = (label: string, fill: string, w: number, h: number) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="${w}" height="${h}" fill="${fill}"/>` +
      `<rect x="8" y="8" width="${w - 16}" height="${h - 16}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" rx="4"/>` +
      `<text x="50%" y="50%" fill="#FFFFFF" font-family="Roboto, Arial, sans-serif" font-size="16" font-weight="500" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
      `</svg>`,
  );

// Swatches: brand.primary.dark #BB4800, brand.secondary.light #5C5C5C,
// status.info.dark #1976D2, status.success.dark #388E3C,
// brand.secondary.main #333333, status.warning.dark #F57C00.
const FLEET = [
  { reg: 'CA 123-456', sub: 'Jane Cooper · Cape Town Main', fill: '#BB4800' },
  { reg: 'CA 789-012', sub: 'Frank Kim · Cape Town Main', fill: '#5C5C5C' },
  { reg: 'CA 345-678', sub: 'Unassigned · Paarl depot', fill: '#1976D2' },
  { reg: 'CA 901-234', sub: 'Jane Cooper · Paarl depot', fill: '#388E3C' },
  { reg: 'CA 567-890', sub: 'Frank Kim · Stellenbosch', fill: '#333333' },
  { reg: 'CA 234-567', sub: 'Pool vehicle · Stellenbosch', fill: '#F57C00' },
];

const StandardDemo = () => (
  <ImageList
    cols={3}
    gap={4 /* semantic.spacing.xs — matches the real default */}
    sx={{ width: '100%', maxWidth: 480, m: 0 }}
  >
    {FLEET.map((v) => (
      <ImageListItem key={v.reg}>
        <img src={makeImg(v.reg, v.fill, 320, 240)} alt={`Vehicle ${v.reg}`} loading="lazy" />
      </ImageListItem>
    ))}
  </ImageList>
);

/* Doc groups quilted and woven into one variant; quilted is shown since it's the
   shape that exercises per-item cols/rows spans (swap variant="woven" for the
   alternating-ratio weave). */
const QuiltedDemo = () => {
  const spans: Array<{ cols: number; rows: number }> = [
    { cols: 2, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 2, rows: 1 },
    { cols: 1, rows: 1 },
  ];
  return (
    <ImageList
      variant="quilted"
      cols={4}
      rowHeight={80}
      gap={4 /* semantic.spacing.xs */}
      sx={{ width: '100%', maxWidth: 480, m: 0 }}
    >
      {FLEET.map((v, i) => (
        <ImageListItem key={v.reg} cols={spans[i].cols} rows={spans[i].rows}>
          <img
            src={makeImg(v.reg, v.fill, 160 * spans[i].cols, 84 * spans[i].rows)}
            alt={`Vehicle ${v.reg}`}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

const OverlayDemo = () => (
  <ImageList cols={3} gap={4 /* semantic.spacing.xs */} sx={{ width: '100%', maxWidth: 560, m: 0 }}>
    {FLEET.map((v) => (
      <ImageListItem key={v.reg}>
        <img src={makeImg(v.reg, v.fill, 320, 240)} alt={`Vehicle ${v.reg}`} loading="lazy" />
        <ImageListItemBar title={v.reg} subtitle={v.sub} />
      </ImageListItem>
    ))}
  </ImageList>
);

const MasonryDemo = () => {
  const heights = [200, 140, 260, 170, 230, 150];
  return (
    <ImageList
      variant="masonry"
      cols={3}
      gap={4 /* semantic.spacing.xs */}
      sx={{ width: '100%', maxWidth: 480, m: 0 }}
    >
      {FLEET.map((v, i) => (
        <ImageListItem key={v.reg}>
          {/* masonry lays out with CSS columns — the img needs an explicit height
              (and eager load) so each column reserves real space; lazy/auto-height
              images collapse the column to a sliver. */}
          <img
            src={makeImg(v.reg, v.fill, 320, heights[i])}
            alt={`Vehicle ${v.reg}`}
            style={{ display: 'block', width: '100%', height: heights[i] }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export const hero: React.ComponentType = OverlayDemo;

export const demos: Record<string, React.ComponentType> = {
  Standard: StandardDemo,
  'Quilted / Woven': QuiltedDemo,
  'With text overlay': OverlayDemo,
  Masonry: MasonryDemo,
};
