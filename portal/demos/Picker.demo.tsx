import React from 'react';
import { Picker, PickerPreset } from '../../design-system/components/Picker/Picker';

/* Live demos for the portal — rendered from the REAL Picker.tsx.
   Keys must exactly match Picker.doc.json variant names.
   All seed dates are fixed (June 2026) so the calendars render deterministically —
   never Date.now(). */

const JUN = (day: number, h = 0, m = 0) => new Date(2026, 5, day, h, m);

const RANGE_PRESETS: PickerPreset[] = [
  { label: 'Last 7 days', value: [JUN(14), JUN(20)] },
  { label: 'This month', value: [JUN(1), JUN(30)] },
];

const DatePicker = () => {
  const [date, setDate] = React.useState<Date>(JUN(20));
  return (
    <Picker
      mode="date"
      label="Service due date"
      value={date}
      minDate={JUN(1)}
      maxDate={JUN(30)}
      onChange={(v) => {
        if (v instanceof Date) setDate(v);
      }}
    />
  );
};

const DateRangePicker = () => {
  const [range, setRange] = React.useState<[Date | null, Date | null]>([JUN(14), JUN(20)]);
  const [open, setOpen] = React.useState(true);
  return (
    <Picker
      mode="dateRange"
      label="Trip history period"
      value={range}
      presets={RANGE_PRESETS}
      open={open}
      onOpenChange={setOpen}
      onChange={(v) => {
        if (Array.isArray(v)) setRange(v);
      }}
    />
  );
};

const TimePicker = () => {
  /* The clock surface is a static dial in Picker.tsx (no day-cell equivalent to
     click), so this one displays the controlled value rather than editing it. */
  const [time] = React.useState<Date>(JUN(20, 8, 30));
  return <Picker mode="time" label="Report cut-off" value={time} />;
};

const DateTime = () => {
  /* Per Picker.tsx there is no fourth mode — date-time is composed by pairing a
     date-mode Picker with a time-mode Picker. */
  const [date, setDate] = React.useState<Date>(JUN(18));
  const time = JUN(18, 6, 15);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Picker
        mode="date"
        label="Trip window start — date"
        value={date}
        onChange={(v) => {
          if (v instanceof Date) setDate(v);
        }}
      />
      <Picker mode="time" label="Trip window start — time" value={time} />
    </div>
  );
};

const FieldOnly = () => {
  const [range, setRange] = React.useState<[Date | null, Date | null]>([JUN(1), JUN(15)]);
  return (
    <Picker
      mode="dateRange"
      variant="field-only"
      label="Report period (typed)"
      value={range}
      onChange={(v) => {
        if (Array.isArray(v)) setRange(v);
      }}
    />
  );
};

const StaticInline = () => {
  const [date, setDate] = React.useState<Date>(JUN(24));
  return (
    <Picker
      mode="date"
      variant="static"
      label="Maintenance booking"
      value={date}
      disabledDates={[JUN(21), JUN(28)]} /* workshop closed on Sundays */
      onChange={(v) => {
        if (v instanceof Date) setDate(v);
      }}
    />
  );
};

/* Hero: the fleet-typical case — a report-period date range with presets,
   fully interactive (click days to move the range, presets to jump). */
export const hero = () => {
  const [range, setRange] = React.useState<[Date | null, Date | null]>([JUN(14), JUN(20)]);
  const [open, setOpen] = React.useState(true);
  return (
    <Picker
      mode="dateRange"
      label="Report period"
      value={range}
      presets={RANGE_PRESETS}
      open={open}
      onOpenChange={setOpen}
      onChange={(v) => {
        if (Array.isArray(v)) setRange(v);
      }}
    />
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Date picker': DatePicker,
  'Date range picker': DateRangePicker,
  'Time picker': TimePicker,
  'Date-time / date-time range': DateTime,
  'Field-only': FieldOnly,
  'Static / inline': StaticInline,
};
