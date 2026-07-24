import React from 'react';
import MuiAccordion, { AccordionProps as MuiAccordionProps } from '@mui/material/Accordion';

export type AccordionProps = MuiAccordionProps;

/**
 * Accordion — MUI v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: Accordion.doc.json
 *
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Accordion/index.tsx is a pure
 * re-export of @mui/material/Accordion — `export { default as Accordion } from
 * '@mui/material/Accordion'` — with zero prop overrides at the wrapper level, and
 * theme.ts has no MuiAccordion entry either, so this renders exactly like stock MUI.
 * Replaces the old MDC-modeled "ExpansionPanel" — MDC Web never shipped an
 * accordion primitive; the real fleet-web component is MUI's Accordion, always
 * composed with its two sub-parts as children:
 *   <Accordion><AccordionSummary expandIcon={...}>…</AccordionSummary><AccordionDetails>…</AccordionDetails></Accordion>
 * (AccordionSummary/AccordionDetails are their own equally-thin karoo-ui re-exports —
 * see AccordionSummary/index.tsx and AccordionDetails/index.tsx in the same lib folder.
 * This wrapper only covers the outer Accordion; compose the two sub-parts directly
 * from @mui/material when consuming this component.)
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main is NOT applied here — Accordion has no
 *   built-in "selected" color; only the disabled/hover state layers are themed.
 * - radius: semantic.radius.default (4px) — inherited from Paper, Accordion's root.
 * - spacing: semantic.spacing.md (16px) — approximates AccordionDetails' real
 *   padding (8px 16px 16px), which this wrapper does not set (it's MUI's own default).
 * Not tokenized: AccordionSummary's 48px/64px minHeight is internal to MUI and not
 * exposed as a token.
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  return <MuiAccordion ref={ref} {...props} />;
});

export default Accordion;
