import React from 'react';
import { Tooltip } from '../../design-system/components/Tooltip/Tooltip';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Tooltip.tsx.
   Keys must exactly match Tooltip.doc.json variant names.
   Tooltip.tsx renders the trigger plus a .mdc-tooltip surface that the MDC CSS
   keeps hidden (position: fixed; display: none) until MDC's JS adds
   .mdc-tooltip--shown — and that JS isn't loaded in the portal. So the demo
   stages exactly what MDC's foundation would do: on hover/focus it adds the
   real .mdc-tooltip--shown class and positions the fixed surface from the
   trigger's rect; blur/mouse-out or Escape hides it again. No custom CSS —
   the shown state is MDC's own. */

function HoverReveal({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  const setShown = (shown: boolean) => {
    const root = ref.current;
    if (!root) return;
    const tip = root.querySelector<HTMLElement>('.mdc-tooltip');
    const trigger = root.firstElementChild as HTMLElement | null;
    if (!tip || !trigger || trigger === tip) return;
    if (shown) {
      const r = trigger.getBoundingClientRect();
      tip.classList.add('mdc-tooltip--shown');
      tip.setAttribute('aria-hidden', 'false');
      /* 4px gap below the trigger: semantic.spacing.xs */
      tip.style.top = `${r.bottom + 4}px`;
      tip.style.left = `${r.left}px`;
    } else {
      tip.classList.remove('mdc-tooltip--shown');
      tip.setAttribute('aria-hidden', 'true');
      tip.style.removeProperty('top');
      tip.style.removeProperty('left');
    }
  };

  return (
    <span
      ref={ref}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
      onFocus={() => setShown(true)}
      onBlur={() => setShown(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setShown(false);
      }}
    >
      {children}
    </span>
  );
}

export const hero = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <HoverReveal>
      <Tooltip variant="plain" label="Requires ignition off">
        <Button variant="outlined" label="Immobilise" />
      </Tooltip>
    </HoverReveal>
    <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
      Hover or focus the button.
    </span>
  </div>
);

const Plain = () => (
  <HoverReveal>
    <Tooltip variant="plain" label="Sends the trip report by email">
      <Button variant="text" label="Export" />
    </Tooltip>
  </HoverReveal>
);

const TruncationReveal = () => (
  <HoverReveal>
    <Tooltip variant="truncation" label="Refrigerated trailer — Cape Town depot, bay 14">
      {/* A truncated table-cell value; tabIndex makes it keyboard-reachable
          (the doc requires focus as a trigger, not hover alone). */}
      <span
        tabIndex={0}
        style={{
          display: 'inline-block',
          maxWidth: 160,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          verticalAlign: 'bottom',
          fontSize: '.875rem',
        }}
      >
        Refrigerated trailer — Cape Town depot, bay 14
      </span>
    </Tooltip>
  </HoverReveal>
);

export const demos: Record<string, React.ComponentType> = {
  Plain,
  'Truncation reveal': TruncationReveal,
};
