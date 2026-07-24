import * as React from 'react';
import MuiList, { type ListProps as MuiListProps } from '@mui/material/List';

/**
 * List — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Real source: libs/shared/js/karoo-ui/core/src/lib/List/index.tsx
 * Full spec: List.doc.json
 * The real karoo-ui wrapper applies zero overrides — a straight
 * `export { default as List } from '@mui/material/List'`. This file
 * forwards every real prop through a local forwardRef wrapper for
 * consistency with the rest of this folder. Compose with
 * @mui/material/ListItem, ListItemButton, ListItemIcon, ListItemAvatar,
 * ListItemText, ListSubheader, and Divider — List itself is just the <ul>
 * container (dense spacing + optional subheader/padding removal).
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.text.primary / semantic.color.text.secondary —
 *   ListItemText's primary/secondary typography.
 * - spacing: semantic.spacing.md (16px) — ListItem's default side padding.
 * - type: semantic.typography.scale.body2 — the app-wide default Typography
 *   variant (see theme.ts MuiTypography defaultProps), which ListItemText
 *   inherits unless overridden.
 */
export type ListProps = MuiListProps;

export const List = React.forwardRef<HTMLUListElement, ListProps>(function List(props, ref) {
  return <MuiList ref={ref} {...props} />;
});

export default List;
