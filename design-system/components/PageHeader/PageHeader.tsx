import React from 'react';

// See Card.tsx for why this reads primitive.* directly rather than semantic.* (the latter
// are mostly unresolved alias strings — safe only once a build-time token resolver exists).
import tokens from '../../tokens/tokens.json';

export interface PageHeaderProps {
  /** Put `PageHeader.Title` (or a Breadcrumbs-based back-link) first, `PageHeader.ButtonsContainer` second. */
  children: React.ReactNode;
}

interface SlotProps {
  children: React.ReactNode;
}

/**
 * PageHeader — real fleet-web implementation (karoo-ui / MUI `Stack`), NOT an idealized MDC spec.
 * Full spec: PageHeader.doc.json
 *
 * NOTE: unlike most components in this library, this one has no md2-cartrack-library baseline to
 * mirror — no "page header" exists there. AppBar used to fill that role and was removed 2026-07-22
 * for having zero real usage. This instead mirrors the actual, currently-shipping compound component
 * at `apps/fleet-web/src/components/_containers/PageHeader/index.tsx` (43 real usages, confirmed
 * 2026-07-23): a single flex row with two named slots, `Title` and `ButtonsContainer`. The real
 * component has no other props — don't add configuration options here that the source doesn't have.
 *
 * Tokens (tokens/tokens.json):
 * - type: semantic.typography.scale.h5 (24px/400 — the real component's `Typography variant="h5"`).
 * - spacing: semantic.spacing.md / primitive.spacing.4 (16px — the real component's `gap: 2` in MUI
 *   spacing, i.e. theme.spacing(2); see primitive.spacing.note for the theme.spacing(n) = n*8px math).
 */
function PageHeaderRow({ children }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: tokens.primitive.spacing['4'],
      }}
    >
      {children}
    </div>
  );
}

/** The page title. Renders as a real `<h5>` heading — keep it as the page's one main heading. */
function Title({ children }: SlotProps) {
  return (
    <h5
      style={{
        margin: 0,
        fontSize: tokens.semantic.typography.scale.h5.fontSize,
        fontWeight: tokens.primitive.fontWeight.regular,
      }}
    >
      {children}
    </h5>
  );
}

/** Right-aligned row for one or more page-level actions (Buttons, a Menu trigger). Wraps on narrow viewports. */
function ButtonsContainer({ children }: SlotProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: tokens.primitive.spacing['4'],
      }}
    >
      {children}
    </div>
  );
}

export const PageHeader = Object.assign(PageHeaderRow, { Title, ButtonsContainer });

export default PageHeader;
