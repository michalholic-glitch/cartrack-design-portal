import React from 'react';

export interface PickerPreset {
  /** e.g. "Last 7 days", "This month". */
  label: string;
  value: [Date, Date];
}

export interface PickerProps {
  /**
   * Date picker (single date) / Time picker (time of day) / Date range
   * picker (a from–to span) — the three picker shapes this component covers,
   * per the spec's Variants table. Date-time is handled by combining a
   * `date` picker with a `time` picker rather than a fourth mode.
   */
  mode: 'date' | 'time' | 'dateRange';
  /** Current value: a single Date for date/time, or a [start, end] tuple for dateRange. */
  value?: Date | [Date | null, Date | null] | null;
  onChange?: (value: Date | [Date | null, Date | null] | null) => void;
  /** Field label. */
  label?: string;
  /**
   * Field-only — keyboard entry without a popup (power users).
   * Popup — typeable field with a calendar/clock trigger (default, the
   * "Offer both" key rule).
   * Static — always-open calendar embedded in a panel (inline).
   */
  variant?: 'popup' | 'field-only' | 'static';
  /** Earliest selectable date/time. */
  minDate?: Date;
  /** Latest selectable date/time. */
  maxDate?: Date;
  /** Individually disabled dates, e.g. to block a future service date in the past. */
  disabledDates?: Date[];
  /** Quick presets for a date range, e.g. "Last 7 days", "This month". */
  presets?: PickerPreset[];
  /** Whether the popup calendar/clock surface is open (popup variant only). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional extra class names to compose with the base `picker`/`tf` classes. */
  className?: string;
}

function formatDay(d: Date) {
  return d.getDate();
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isDisabled(day: Date, minDate?: Date, maxDate?: Date, disabledDates?: Date[]) {
  if (minDate && day < minDate) return true;
  if (maxDate && day > maxDate) return true;
  return Boolean(disabledDates?.some((d) => isSameDay(d, day)));
}

function CalendarGrid({
  month,
  selected,
  rangeStart,
  rangeEnd,
  minDate,
  maxDate,
  disabledDates,
  onSelectDay,
}: {
  month: Date;
  selected?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  onSelectDay: (day: Date) => void;
}) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return (
    <div className="grid" role="grid" aria-label="Calendar">
      <span aria-hidden="true">S</span>
      <span aria-hidden="true">M</span>
      <span aria-hidden="true">T</span>
      <span aria-hidden="true">W</span>
      <span aria-hidden="true">T</span>
      <span aria-hidden="true">F</span>
      <span aria-hidden="true">S</span>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = new Date(year, monthIndex, i + 1);
        const isSelected = selected ? isSameDay(day, selected) : false;
        const inRange =
          rangeStart && rangeEnd ? day >= rangeStart && day <= rangeEnd : false;
        const disabled = isDisabled(day, minDate, maxDate, disabledDates);
        return (
          <span
            key={i}
            role="gridcell"
            aria-selected={isSelected || undefined}
            aria-disabled={disabled || undefined}
            className={[isSelected ? 'on' : null, inRange ? 'in-range' : null]
              .filter(Boolean)
              .join(' ')}
            onClick={disabled ? undefined : () => onSelectDay(day)}
          >
            {formatDay(day)}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Picker — MD2 (MDC) Cartrack-themed.
 * Full spec: Picker.doc.json
 *
 * NOTE: MDC Web ships no date or time picker — this is a real gap filled as
 * a Cartrack-custom component. The live Cartrack library
 * (md2-cartrack-library/components/pickers.html) builds it from a custom
 * `picker` surface (`ph2` header + `grid` calendar or `clock` dial) and a
 * `tf outlined` field for the range summary, which this component mirrors.
 * Covers Date picker, Date range picker, and Time picker via the `mode`
 * prop rather than three separate components.
 * Tokens (tokens/tokens.json):
 * - color: semantic.color.brand.primary.{main,dark,onPrimary} — selected day / header fill; use
 *   .dark (not .main) for a primary-filled header per tokens.json's accessibility.knownIssues.
 * - radius: semantic.radius.default (4px surface), semantic.radius.pill (circular day selection).
 * Not yet tokenized: the ~36px day-cell size has no matching dimension token; the month/year label
 * (~.8rem ≈ 12.8px) is closest to semantic.typography.scale.caption (12px) but not an exact match.
 */
export function Picker({
  mode,
  value,
  onChange,
  label,
  variant = 'popup',
  minDate,
  maxDate,
  disabledDates,
  presets,
  open = true,
  onOpenChange,
  className,
}: PickerProps) {
  const surfaceOpen = variant === 'field-only' ? false : variant === 'static' ? true : open;

  if (mode === 'time') {
    const time = value instanceof Date ? value : new Date();
    const hh = String(time.getHours()).padStart(2, '0');
    const mm = String(time.getMinutes()).padStart(2, '0');
    return (
      <div className={['picker', className].filter(Boolean).join(' ')} style={{ width: 220 }}>
        {label ? <div className="lbl">{label}</div> : null}
        <div className="ph2">
          <div className="d">
            {hh}:{mm}
          </div>
        </div>
        {surfaceOpen ? (
          <div className="clock" role="group" aria-label="Time selection">
            <div className="c" />
            <div className="dot" />
          </div>
        ) : null}
      </div>
    );
  }

  if (mode === 'dateRange') {
    const [start, end] = Array.isArray(value) ? value : [null, null];
    const rangeText =
      start && end
        ? `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`
        : 'Select a range';

    return (
      <div className={className}>
        <span className="tf outlined">
          <span className="lbl">{label ?? 'Date range'}</span>
          <div
            className="f"
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-expanded={surfaceOpen}
            onClick={() => onOpenChange?.(!open)}
          >
            {rangeText} 📅
          </div>
        </span>
        {surfaceOpen ? (
          <div className="picker">
            {presets && presets.length ? (
              <div className="presets" role="group" aria-label="Presets">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="p"
                    onClick={() => onChange?.(preset.value)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            ) : null}
            <CalendarGrid
              month={start ?? new Date()}
              rangeStart={start}
              rangeEnd={end}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              onSelectDay={(day) => {
                if (!start || (start && end)) {
                  onChange?.([day, null]);
                } else if (day < start) {
                  onChange?.([day, start]);
                } else {
                  onChange?.([start, day]);
                }
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // mode === 'date'
  const selected = value instanceof Date ? value : null;
  return (
    <div className={['picker', className].filter(Boolean).join(' ')}>
      {label ? <div className="lbl">{label}</div> : null}
      <div className="ph2">
        <div style={{ fontSize: '.8rem' }}>
          {(selected ?? new Date()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase()}
        </div>
        <div className="d">
          {(selected ?? new Date()).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
      {surfaceOpen ? (
        <CalendarGrid
          month={selected ?? new Date()}
          selected={selected}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          onSelectDay={(day) => onChange?.(day)}
        />
      ) : null}
    </div>
  );
}

export default Picker;
