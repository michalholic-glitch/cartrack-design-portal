import React from 'react';
import { Menu, MenuItemData } from '../../design-system/components/Menu/Menu';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Menu.tsx.
   Keys must exactly match Menu.doc.json variant names.

   Menu is a controlled surface (open/onClose, no trigger of its own), so every
   demo stages it with a real trigger inside a position:relative container tall
   enough that the absolutely-positioned .mdc-menu-surface--open doesn't spill
   over neighbouring tiles.

   "Cascading submenu" is deliberately absent: MenuItemData has no children/
   submenu prop, so a second-level surface can't be expressed with the real
   API — that tile falls back to the mockup (documented gap). */

const Stage = ({ children, minHeight = 300 }: { children: React.ReactNode; minHeight?: number }) => (
  <div style={{ position: 'relative', minHeight }}>{children}</div>
);

/* Anchor: the surface is absolutely positioned, so this zero-height relative
   wrapper pins it directly below the trigger instead of over it. */
const Anchor = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative' }}>{children}</div>
);

const LastAction = ({ text }: { text: string }) =>
  text ? (
    <div style={{ marginTop: 8, fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
      Last action: {text}
    </div>
  ) : null;

const vehicleActions = (report: (label: string) => void): MenuItemData[] => [
  { id: 'edit', label: 'Edit vehicle', icon: 'edit', onClick: () => report('Edit CA 123-456') },
  { id: 'assign', label: 'Assign driver', icon: 'person_add', onClick: () => report('Assign driver to CA 123-456') },
  { id: 'trip', label: 'Download trip report', icon: 'download', shortcut: '⌘D', onClick: () => report('Download trip report') },
  { id: 'sep', divider: true },
  { id: 'delete', label: 'Delete vehicle', icon: 'delete', destructive: true, onClick: () => report('Delete CA 123-456') },
];

const OverflowDemo = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
  const [open, setOpen] = React.useState(initiallyOpen);
  const [last, setLast] = React.useState('');
  return (
    <Stage>
      <Button variant="outlined" label="Actions" leadingIcon="more_vert" onClick={() => setOpen((o) => !o)} />
      <Anchor>
        <Menu variant="overflow" open={open} onClose={() => setOpen(false)} items={vehicleActions(setLast)} />
      </Anchor>
      <LastAction text={last} />
    </Stage>
  );
};

const DropdownDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState('Active');
  const options = ['Active', 'Idle', 'Offline'];
  return (
    <Stage minHeight={220}>
      <Button
        variant="outlined"
        label={`Status: ${status}`}
        leadingIcon="arrow_drop_down"
        onClick={() => setOpen((o) => !o)}
      />
      <Anchor>
        <Menu
          variant="dropdown"
          open={open}
          onClose={() => setOpen(false)}
          items={options.map((option) => ({
            id: option.toLowerCase(),
            label: option,
            selected: option === status,
            onClick: () => setStatus(option),
          }))}
        />
      </Anchor>
    </Stage>
  );
};

const ContextDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [last, setLast] = React.useState('');
  return (
    <Stage>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        onClick={() => open && setOpen(false)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          border: '1px solid #E0E0E0' /* semantic.color.border.default */,
          borderRadius: 4 /* semantic.radius.default */,
          fontSize: 14,
          cursor: 'context-menu',
          userSelect: 'none',
        }}
      >
        <span>CA 123-456 — Jane Cooper</span>
        <span style={{ fontSize: '.75rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
          Right-click this row
        </span>
      </div>
      <Anchor>
        <Menu variant="context" open={open} onClose={() => setOpen(false)} items={vehicleActions(setLast)} />
      </Anchor>
      <LastAction text={last} />
    </Stage>
  );
};

/* Hero: the overflow pattern — a ⋮-style trigger with a vehicle's row actions,
   open on load so the surface itself is what you see first. */
export const hero = () => <OverflowDemo initiallyOpen />;

export const demos: Record<string, React.ComponentType> = {
  'Overflow menu': () => <OverflowDemo />,
  'Dropdown (exposed) menu': DropdownDemo,
  'Context menu': ContextDemo,
  // 'Cascading submenu' omitted — MenuItemData has no children/submenu prop,
  // so a second-level surface can't be built from the real API.
};
