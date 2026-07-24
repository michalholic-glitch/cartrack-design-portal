import React from 'react';
import { Menu } from '../../design-system/components/Menu/Menu';
import { Button } from '../../design-system/components/Button/Button';
import { Divider } from '../../design-system/components/Divider/Divider';
import { MenuItem } from '@mui/material';

/* Live demos for the portal — rendered from the REAL Menu.tsx (MUI v9 wrapper).
   Keys must exactly match Menu.doc.json variant names.
   Every Menu is anchored to a real trigger (anchorEl state or anchorPosition)
   with onClose wired. Items are plain @mui/material MenuItem children —
   the wrapper deliberately has no custom `items` array prop. */

const OverflowDemo = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const close = () => setAnchorEl(null);
  return (
    <>
      <Button
        variant="outlined"
        aria-label="More actions for CA 123-456"
        aria-haspopup="menu"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ minWidth: 40, px: 1 }}
      >
        ⋮
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
        <MenuItem onClick={close}>Edit vehicle</MenuItem>
        <MenuItem onClick={close}>Assign driver</MenuItem>
        <MenuItem onClick={close}>View trip history</MenuItem>
        <Divider />
        {/* Destructive action set apart with a Divider (doThis). */}
        <MenuItem onClick={close} sx={{ color: '#D32F2F' /* semantic.color.status.error.dark */ }}>
          Remove vehicle
        </MenuItem>
      </Menu>
    </>
  );
};

const DEPOTS = ['Cape Town Main', 'Paarl depot', 'Stellenbosch'];

const DropdownDemo = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [depot, setDepot] = React.useState(DEPOTS[0]);
  const close = () => setAnchorEl(null);
  return (
    <>
      <Button
        variant="outlined"
        aria-haspopup="menu"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Depot: {depot} ▾
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
        {DEPOTS.map((d) => (
          <MenuItem
            key={d}
            selected={d === depot}
            onClick={() => {
              setDepot(d);
              close();
            }}
          >
            {d}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const ContextMenuDemo = () => {
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const close = () => setPos(null);
  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setPos({ top: e.clientY, left: e.clientX });
        }}
        style={{
          padding: 16 /* semantic.spacing.md */,
          border: '1px dashed rgba(0, 0, 0, 0.12) /* semantic.color.border.default */',
          borderRadius: 4 /* semantic.radius.default */,
          color: 'rgba(0, 0, 0, 0.6) /* semantic.color.text.secondary */',
          fontSize: '0.875rem /* semantic.typography.scale.body2 */',
          userSelect: 'none',
          cursor: 'context-menu',
        }}
      >
        Right-click this row — CA 123-456 · Jane Cooper · Driving
      </div>
      <Menu
        open={pos !== null}
        onClose={close}
        anchorReference="anchorPosition"
        anchorPosition={pos ?? undefined}
      >
        <MenuItem onClick={close}>Zoom to vehicle</MenuItem>
        <MenuItem onClick={close}>Follow on live map</MenuItem>
        <MenuItem onClick={close}>Copy registration</MenuItem>
      </Menu>
    </>
  );
};

/* Composed manually with a second Menu anchored to the parent item —
   cascading is not a built-in Menu feature. One submenu level only. */
const CascadingDemo = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [subAnchorEl, setSubAnchorEl] = React.useState<HTMLElement | null>(null);
  const closeAll = () => {
    setSubAnchorEl(null);
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        variant="outlined"
        aria-haspopup="menu"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Report actions
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeAll}>
        <MenuItem onClick={closeAll}>Refresh data</MenuItem>
        <MenuItem onClick={closeAll}>Schedule…</MenuItem>
        <MenuItem aria-haspopup="menu" onClick={(e) => setSubAnchorEl(e.currentTarget)}>
          <span style={{ flex: 1 }}>Export</span>
          <span aria-hidden="true" style={{ marginLeft: 16 /* semantic.spacing.md */ }}>
            ▸
          </span>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={subAnchorEl}
        open={Boolean(subAnchorEl)}
        onClose={() => setSubAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={closeAll}>Export as CSV</MenuItem>
        <MenuItem onClick={closeAll}>Export as PDF</MenuItem>
        <MenuItem onClick={closeAll}>Export as XLSX</MenuItem>
      </Menu>
    </>
  );
};

export const hero: React.ComponentType = OverflowDemo;

export const demos: Record<string, React.ComponentType> = {
  'Overflow menu': OverflowDemo,
  'Dropdown (exposed) menu': DropdownDemo,
  'Context menu': ContextMenuDemo,
  'Cascading submenu': CascadingDemo,
};
