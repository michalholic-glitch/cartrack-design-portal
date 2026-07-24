import React from 'react';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

export type DatePickerProps = React.ComponentProps<typeof MuiDatePicker>;

/**
 * DatePicker — MUI X (@mui/x-date-pickers), Cartrack-themed via @karoo-ui/core.
 *
 * LICENSE NOTE: DatePicker's range/pro variants (DateRangePicker, DateTimePicker
 * range) are @mui/x-date-pickers-pro and require a valid @mui/x-license key at
 * runtime, same caveat as DataGrid. The base single-value DatePicker/TimePicker
 * used here are in the free @mui/x-date-pickers tier, so this component itself
 * has no license dependency.
 *
 * Full spec: DatePicker.doc.json
 * Real source: libs/shared/js/karoo-ui/core/src/lib/DatePicker/index.tsx.
 * Replaces the old repo's "Picker" component, which invented a single
 * component with a `mode: 'date' | 'time' | 'dateRange'` prop. The real
 * library instead has a family of separate components — DatePicker (this
 * file), TimePicker, DateTimePicker (all free-tier), and DateRangePicker /
 * DateTimePicker-range (Pro-tier, see licenseNote) — see `related` in the
 * doc.json for how to cover those other shapes.
 *
 * Overrides actually applied by karoo-ui's real wrapper (reproduced here):
 * - The internal <TextField> slot defaults to size="small" via
 *   slotProps.textField (fleet-web's form-density convention, same as this
 *   repo's TextField.tsx).
 * Not reproduced: karoo-ui's KarooFormStateContext, which lets a parent form
 * push down disabled/readOnly to every field at once — an internal
 * workspace context (../KarooFormStateContext), dropped here for portability.
 * MUST render under a <LocalizationProvider> (from @mui/x-date-pickers) with
 * a date adapter (fleet-web uses AdapterDayjs) — that provider isn't part of
 * this component and isn't reproduced in this decoupled folder.
 *
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px, the popup surface + the field it composes).
 * - color: semantic.color.brand.primary.main (selected day fill) — use dark text
 *   or brand.primary.dark for anything text-bearing on it; white on #F47735 fails
 *   AA (see tokens.json's accessibility.knownIssues).
 */
export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  { slotProps, ...props }: DatePickerProps,
  ref,
) {
  return (
    <MuiDatePicker
      ref={ref}
      slotProps={{
        ...slotProps,
        textField: { size: 'small', ...slotProps?.textField },
      }}
      {...props}
    />
  );
}) as typeof MuiDatePicker;

export default DatePicker;
