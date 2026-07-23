# Menus

**Status:** stable  
**Category:** Actions  
**Library:** Material Components Web (MDC) 14.0.0 — Cartrack-themed (see `build/mdc.cartrack.theme.scss`)  
**MDC reference:** `Menu, MenuItem`  
**Source:** `md2-cartrack-library/components/menus.html`  
**Tokens:** `--primary`, `--primary-dark`, `--on-primary`, `--surface`, `--on-surface`, `--divider` (see DESIGN.md)

## What it is
Menus show a temporary list of choices on a surface — overflow actions behind a ⋮ button, row actions in a data table, or a list of options from a control. They appear on demand and dismiss on selection or outside click.

## Key rule
> Use a menu for secondary or overflow actions. Don't hide a view's primary action in a menu — promote it to a button in the toolbar.

## When to use
- **Overflow menu** — Secondary actions behind a ⋮ in toolbars, cards, and table rows.
- **Dropdown (exposed) menu** — A field that opens a list to choose one value (see also Select on the Text fields page).
- **Context menu** — Right-click actions on a desktop row or item.
- **Cascading submenu** — Grouped choices that expand to a second level (use sparingly).

## When NOT to use (and what to do instead)
- Don't bury frequently-used actions in an overflow menu.
- Don't nest more than one submenu level.
- Don't use a menu where a few options fit better as visible buttons or tabs.

## Variants
| Variant | When to use |
| --- | --- |
| Overflow menu | Secondary actions behind a ⋮ in toolbars, cards, and table rows. |
| Dropdown (exposed) menu | A field that opens a list to choose one value (see also Select on the Text fields page). |
| Context menu | Right-click actions on a desktop row or item. |
| Cascading submenu | Grouped choices that expand to a second level (use sparingly). |

## Anatomy
- Trigger — the control that opens the menu (overflow ⋮, a button, or a field).
- Surface — an elevated container holding the items.
- Menu item — one choice; may carry a leading icon and a trailing shortcut/meta.
- Divider — groups items (e.g. separates destructive actions).
- Selected / disabled item — current choice or unavailable option.

## Behaviors
- **Open & dismiss** — Opens at the trigger; closes on selection, Escape, or an outside click. It should never cover its own trigger if avoidable.
- **Selection** — Selecting an item performs the action and closes the menu; a stateful menu marks the current choice.
- **Keyboard** — Arrow keys move focus, Enter activates, Escape closes; typing jumps to a matching item.

## States
| State | Treatment |
| --- | --- |
| Item enabled | Default text on surface. |
| Item hover/focus | 4% overlay. |
| Item selected | Light primary tint / check. |
| Item disabled | 38% black text, not selectable. |

## Specs
| Property | Value |
| --- | --- |
| Surface radius / elevation | 4px, high elevation (overlay) |
| Item height | ~36–48px |
| Item text | Roboto 14–16px / 400 |
| Item padding | 16px sides |
| Min width | ~112px; grows to content |

## Correct usage (themed MDC markup)
```html
<div style="position:relative;width:220px">
<div class="mdc-menu mdc-menu-surface mdc-menu-surface--open" style="position:relative">
<ul aria-orientation="vertical" class="mdc-deprecated-list" role="menu">
<li class="mdc-deprecated-list-item" role="menuitem"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">Edit</span></li>
<li class="mdc-deprecated-list-item" role="menuitem"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">Duplicate</span></li>
<li class="mdc-deprecated-list-item" role="menuitem"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">Export</span></li>
<li class="mdc-deprecated-list-divider" role="separator"></li>
<li class="mdc-deprecated-list-item" role="menuitem"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text" style="color:var(--mdc-theme-error)">Delete</span></li>
</ul>
</div>
</div>
```

## Do
- Group destructive actions and set them apart with a divider.
- Keep labels short and verb-first.
- Use a menu for overflow, not for a view's primary action.

## Don't
- Don't bury frequently-used actions in an overflow menu.
- Don't nest more than one submenu level.
- Don't use a menu where a few options fit better as visible buttons or tabs.

## Accessibility
- The trigger exposes aria-haspopup and expanded state; the surface uses a menu role with menuitem children. Focus moves into the menu on open and returns to the trigger on close. Full keyboard support (arrows, Enter, Escape, type-ahead).
