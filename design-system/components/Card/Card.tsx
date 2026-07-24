import * as React from 'react';
import MuiCard from '@mui/material/Card';
import type { CardProps as MuiCardProps } from '@mui/material/Card';

/**
 * Card — Material UI v9 (Cartrack-themed via @karoo-ui/core).
 * Full spec: Card.doc.json
 * Mirrors @karoo-ui/core's real wrapper (libs/shared/js/karoo-ui/core/src/lib/Card/index.tsx),
 * which is a *pure* re-export of @mui/material/Card — no default-prop overrides. All
 * theming comes from the shared MUI theme (theme.ts), not this wrapper.
 * Card itself is just the outer surface (it extends Paper); title/media/actions are
 * composed with sibling MUI components (CardHeader, CardContent, CardMedia, CardActions,
 * CardActionArea) — not covered by this doc/wrapper pass.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.card (4px, theme.shape.borderRadius, unmodified).
 * - elevation: MUI's Paper elevation system (default elevation 1; `raised` bumps it to
 *   elevation 8) — not tokenized as a discrete value.
 * - spacing / typography for composed content (title 16px/500, body 14px/400) come from
 *   whatever CardHeader/CardContent/Typography children you render inside — see
 *   semantic.spacing.md and semantic.typography.scale.titleMedium / body2.
 */
export type CardProps = MuiCardProps;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  return <MuiCard ref={ref} {...props} />;
});

export default Card;
