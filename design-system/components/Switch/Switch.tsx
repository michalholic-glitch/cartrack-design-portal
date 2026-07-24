import React from 'react';
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';

export type SwitchProps = MuiSwitchProps;

/**
 * Switch — MUI v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: Switch.doc.json
 *
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Switch/index.tsx is a pure
 * re-export of @mui/material/Switch — `export { default as Switch } from
 * '@mui/material/Switch'` — with zero prop overrides at the wrapper level. The
 * dense "small" look Switch always has in fleet-web comes from theme.ts's
 * `MuiSwitch: { defaultProps: { size: 'small' } }`, not from this file.
 * Replaces one-third of the old MDC-modeled "SelectionControl" umbrella component
 * (see Checkbox.tsx and Radio.tsx for the other two).
 * Unlike the old SelectionControl, Switch has no `label` prop — pair it with
 * @mui/material/FormControlLabel for a clickable label. "Instant apply" (the old
 * doc's behavioral contract for switches) is a UX convention this component does
 * not enforce in code; it's on the consumer to not gate a Switch behind a Save button.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main — checked track/thumb via the default color="primary".
 * - size: theme-level default 'small' (see theme.ts), not set by this wrapper.
 * Not tokenized: MUI's internal track/thumb pixel dimensions have no matching tokens.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(props, ref) {
  return <MuiSwitch ref={ref} {...props} />;
});

export default Switch;
