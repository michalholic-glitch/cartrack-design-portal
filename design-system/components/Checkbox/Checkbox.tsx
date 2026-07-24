import React from 'react';
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';

export type CheckboxProps = MuiCheckboxProps;

/**
 * Checkbox — MUI v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: Checkbox.doc.json
 *
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Checkbox/index.tsx is a pure
 * re-export of @mui/material/Checkbox — `export { default as Checkbox } from
 * '@mui/material/Checkbox'` — with zero prop overrides at the wrapper level. The
 * dense "small" look Checkbox always has in fleet-web does NOT come from this
 * component or its wrapper — it comes from theme.ts's `MuiCheckbox: { defaultProps:
 * { size: 'small' } }`. Do not invent a `size="small"` default in this file; it
 * only applies when rendered under <ThemeProvider theme={cartrackTheme}>.
 * Replaces one-third of the old MDC-modeled "SelectionControl" umbrella component
 * (see Radio.tsx and Switch.tsx for the other two) — the real library has three
 * separate components, not one `type` discriminator prop.
 * Note: unlike the old SelectionControl, Checkbox has no `label` prop. Pair it
 * with @mui/material/FormControlLabel for a clickable label, exactly as karoo-ui's
 * own FormControlLabel wrapper (lib/FormControlLabel/index.tsx) is designed to do.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main — checked fill via the default color="primary".
 * - size: theme-level default 'small' (see theme.ts), not set by this wrapper.
 * Not tokenized: MUI's internal small/medium icon and touch-target dimensions have
 * no matching tokens.
 */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(props, ref) {
  return <MuiCheckbox ref={ref} {...props} />;
});

export default Checkbox;
