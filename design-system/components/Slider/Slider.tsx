import React from 'react';
import MuiSlider, { SliderProps as MuiSliderProps } from '@mui/material/Slider';

export type SliderProps = MuiSliderProps;

/**
 * Slider — MUI v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: Slider.doc.json
 *
 * Real source: libs/shared/js/karoo-ui/core/src/lib/Slider/index.tsx is a pure
 * re-export of @mui/material/Slider — `export { default as Slider } from
 * '@mui/material/Slider'` — with zero prop overrides at the wrapper level, and
 * theme.ts has no MuiSlider entry either, so this renders exactly like stock MUI.
 * The old MDC-modeled Slider.tsx invented a `variant: 'continuous' | 'discrete' |
 * 'range'` prop and hand-rolled thumb/track positioning with inline styles because
 * it shipped no MDC JS. None of that exists here: the real Slider is a single
 * component whose behavior is controlled by real props — `step`/`marks` for a
 * discrete feel, and passing `value`/`defaultValue` as a two-element array for a
 * two-thumb range — with all positioning handled internally.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.main — active track/thumb via the default color="primary".
 * - borderWidth: semantic.borderWidth.thin (2px) — approximates the real rail/track
 *   height at size="medium" (MUI's default); size="small" renders a thinner rail.
 * Not tokenized: exact thumb diameter and hit-target sizing are internal to
 * @mui/material/Slider and not exposed as tokens.
 */
export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(props, ref) {
  return <MuiSlider ref={ref} {...props} />;
});

export default Slider;
