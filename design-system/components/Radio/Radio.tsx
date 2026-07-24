import React from 'react';
import MuiRadio, { RadioProps as MuiRadioProps } from '@mui/material/Radio';

export type RadioProps = MuiRadioProps;

/**
 * Radio — MUI v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: Radio.doc.json
 *
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Radio/index.tsx is a pure
 * re-export of @mui/material/Radio — `export { default as Radio } from
 * '@mui/material/Radio'` — with zero prop overrides at the wrapper level. The
 * dense "small" look Radio always has in fleet-web comes from theme.ts's
 * `MuiRadio: { defaultProps: { size: 'small' } }`, not from this file.
 * Replaces one-third of the old MDC-modeled "SelectionControl" umbrella component
 * (see Checkbox.tsx and Switch.tsx for the other two).
 * Real pairing component: @mui/material/RadioGroup (also re-exported as-is by
 * karoo-ui, see lib/RadioGroup/index.tsx). A bare Radio has no notion of
 * "the other options in its set" — RadioGroup supplies `name`, `value`, and
 * `onChange` to every descendant Radio via context so only one can be selected.
 * The old SelectionControl's `name` prop on a single control mimicked this
 * manually; the real pattern is to wrap a group of Radios in <RadioGroup>.
 * Unlike the old SelectionControl, Radio has no `label` prop — pair each Radio
 * with @mui/material/FormControlLabel for a clickable label.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main — selected fill via the default color="primary".
 * - size: theme-level default 'small' (see theme.ts), not set by this wrapper.
 * Not tokenized: MUI's internal small/medium icon and touch-target dimensions have
 * no matching tokens.
 */
export const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(function Radio(props, ref) {
  return <MuiRadio ref={ref} {...props} />;
});

export default Radio;
