import * as React from 'react';
import MuiImageList, { type ImageListProps as MuiImageListProps } from '@mui/material/ImageList';

/**
 * ImageList — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Real source: libs/shared/js/karoo-ui/core/src/lib/ImageList/index.tsx
 * Full spec: ImageList.doc.json
 * The real karoo-ui wrapper applies zero overrides — it's a straight
 * `export { default as ImageList } from '@mui/material/ImageList'`. This
 * file forwards every real prop through a local forwardRef wrapper only to
 * keep the same three-file shape as the rest of this folder; behaviourally
 * it is identical to importing @mui/material/ImageList directly. Compose
 * with @mui/material/ImageListItem and @mui/material/ImageListItemBar.
 * Tokens (tokens/tokens.json):
 * - spacing: semantic.spacing.xs (4px) — matches the real `gap` prop's default.
 * - radius: semantic.radius.default — NOT applied by MUI's ImageListItem
 *   itself; apply via sx/className on each tile if a rounded corner is wanted.
 * - type: semantic.typography.scale.caption — a reasonable size for an
 *   ImageListItemBar title/subtitle, set by you, not a built-in default.
 */
export type ImageListProps = MuiImageListProps;

export const ImageList = React.forwardRef<HTMLUListElement, ImageListProps>(function ImageList(
  props,
  ref,
) {
  return <MuiImageList ref={ref} {...props} />;
});

export default ImageList;
