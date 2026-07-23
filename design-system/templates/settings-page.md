# Settings Page (e.g. Notification preferences, Account, Fleet configuration)

Grouped, mostly-form content where the operator changes state rather than reads it.

## Layout

Page header (title) > two-column: settings navigation (List) left, settings content (Cards with form controls) right

## Components used

- Page header — page title only; no primary action (saving happens per section) — the simple/settings-header variant of the Page header pattern (Title only, no ButtonsContainer).
- List — settings category navigation (single-line items, selected state = 8% overlay + primary-dark text)
- Card — one card per settings group, titleMedium heading, ≤6 controls each
- SelectionControl — switches for on/off preferences (the default control), checkboxes for multi-select groups, radios for exclusive choices
- TextField — text/number entry; helper text explains consequences ("Alerts are sent to this address")
- Slider — approximate values only (e.g. map refresh interval); exact values use a TextField
- Picker — dates/times (e.g. quiet hours)
- Button — per-card "Save" (contained, primary-dark) appears only when that card has unsaved changes
- Snackbar — save confirmation ("Notification settings saved") with optional Undo
- Dialog — confirmations for destructive or fleet-wide changes

## Structure rules

- Group by operator intent ("Notifications", "Map display"), not by backend model names.
- A switch applies immediately + Snackbar; forms with TextFields require an explicit Save. Never mix both behaviors in one card.
- Dangerous zone (delete account, reset fleet data) is the last card, visually separated, destructive actions in error colour with a typed-confirmation Dialog.

## Notes

- Every control gets a visible label on the left, control on the right; no floating unlabeled switches.
- Disabled controls always explain why via helper text or Tooltip ("Managed by your administrator").
