# Detail Page (e.g. Single vehicle, Driver profile, Geofence)

One record in depth: identity at the top, related data grouped into tabbed or stacked sections.

## Layout

AppBar (back arrow + record name + actions) > identity header (Card) > Tabs > tab content (Cards / DataTable / List)

## Components used

- AppBar — back arrow as the leading element, record name as title, page actions (edit, overflow ⋮)
- Card — identity header: registration, status chip, key metrics (odometer, driver, last position); titleMedium (16px/500) for the card title
- Tabs — section navigation: Overview, Trips, Maintenance, Alerts (Documents, Costs into overflow if >5)
- DataTable — history-style tab content (trips, events), same rules as the table-page template
- List — two-line list for grouped attributes and settings
- ExpansionPanel — long secondary content inside a tab (e.g. specifications)
- Banner — record-level warnings at the top of content (e.g. "No signal for 3 days")
- Dialog — destructive confirmations (delete/deactivate record)

## Structure rules

- The identity header never scrolls away content the operator needs while reading tabs — keep it compact (max ~120px).
- Tabs navigate within the record; the AppBar back arrow returns to the collection (table page).
- Status is shown once, in the identity header, as a status chip — not repeated per section.
- Edit is a page action in the AppBar; per-field editing uses inline TextFields in a dedicated Edit mode or SideSheet.

## Notes

- Deep-link every tab (URL per tab) so alerts and reports can link straight to e.g. a vehicle's Maintenance tab.
- Empty tab states name the enable path ("No geofence events — set up a geofence in Settings → Geofences").
