import React from 'react';
import { LinearProgress } from '../../design-system/components/LinearProgress/LinearProgress';

/* Live demos for the portal — rendered from the REAL LinearProgress.tsx (MUI v9 wrapper).
   Keys must exactly match LinearProgress.doc.json variant names.
   LinearProgress renders no text of its own — each demo wraps it with a
   labelled container (doThis: accessible label via the wrapping element),
   and sizes it via the wrapper (no maxWidth prop exists). */

const Labelled = ({
  label,
  detail,
  children,
}: {
  label: string;
  detail?: string;
  children: React.ReactNode;
}) => (
  <div role="group" aria-label={label} style={{ width: '100%', maxWidth: 360 }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8 /* semantic.spacing.sm */,
        fontSize: '0.875rem /* semantic.typography.scale.body2 */',
        color: 'rgba(0, 0, 0, 0.6) /* semantic.color.text.secondary */',
      }}
    >
      <span>{label}</span>
      {detail ? <span>{detail}</span> : null}
    </div>
    {children}
  </div>
);

/** Loops 0 → 100 to keep the determinate demos alive. */
const useLoopingValue = (step = 4, everyMs = 400) => {
  const [value, setValue] = React.useState(8);
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setValue((v) => (v >= 100 ? 8 : Math.min(v + step, 100)));
    }, everyMs);
    return () => window.clearInterval(id);
  }, [step, everyMs]);
  return value;
};

const IndeterminateDemo = () => (
  <Labelled label="Loading trip history for CA 123-456">
    <LinearProgress />
  </Labelled>
);

const DeterminateDemo = () => {
  const value = useLoopingValue();
  return (
    <Labelled label="Exporting trip report" detail={`${Math.round(value)}%`}>
      <LinearProgress variant="determinate" value={value} />
    </Labelled>
  );
};

const BufferDemo = () => {
  const value = useLoopingValue(3, 350);
  const valueBuffer = Math.min(value + 18, 100);
  return (
    <Labelled label="Downloading firmware for 12 units" detail={`${Math.round(value)}%`}>
      <LinearProgress variant="buffer" value={value} valueBuffer={valueBuffer} />
    </Labelled>
  );
};

const QueryDemo = () => (
  <Labelled label="Querying position history…">
    <LinearProgress variant="query" />
  </Labelled>
);

export const hero: React.ComponentType = DeterminateDemo;

export const demos: Record<string, React.ComponentType> = {
  'variant="indeterminate" (default)': IndeterminateDemo,
  'variant="determinate"': DeterminateDemo,
  'variant="buffer"': BufferDemo,
  'variant="query"': QueryDemo,
};
