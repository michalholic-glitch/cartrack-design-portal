# Map / Tracking View (e.g. Live fleet map, Trip replay)

The Fleet Portal's signature screen: a full-bleed map with overlaid navigation and a synced asset list.

## Layout

NavigationRail (left edge) > full-bleed map canvas > floating asset panel (SideSheet-style, left) > floating controls (right)

## Components used

- NavigationRail — primary app navigation on the left edge; the map never hides it
- SideSheet (as docked panel) — searchable asset list synced with the map; selecting an asset focuses the map and vice versa
- TextField — search within the asset panel ("Find vehicle, driver, location")
- Chip — map filter chips floating at the top of the canvas (status filters: Driving, Idling, No signal)
- Card — asset popup/preview on marker click: name, status chip, speed, driver, "View details" text button
- Chip (status) — vehicle status colours from `semantic.color.vehicleStatus`, matching marker colours exactly
- Tooltip — icon-only map controls (zoom, layers, traffic) always carry tooltips
- Snackbar — transient feedback ("Following FLT-042", "Geofence saved")

## Structure rules

- The map is the page — no page header; search and filters float on the canvas with surface backgrounds and el2 shadows.
- Marker colour = list status-chip colour = the same vehicleStatus token. One source, three renderings.
- The asset panel is collapsible; collapsed state leaves only search + filter chips floating.
- Marker click = lightweight Card popup; "View details" navigates to the detail page — never open a full Dialog over the map.

## Notes

- Never place floating elements in the map's bottom-centre — that zone is for the OS/browser attribution and scale.
- Clustered markers show a count badge; cluster click zooms, it never opens a list Dialog.
