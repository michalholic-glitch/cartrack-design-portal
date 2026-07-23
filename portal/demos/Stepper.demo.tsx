import React from 'react';
import { Stepper, StepperStep } from '../../design-system/components/Stepper/Stepper';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Stepper.tsx.
   Keys must exactly match Stepper.doc.json variant names.
   Every demo is a working wizard: activeStep is state, staged Back/Next Buttons
   move through it, and (where the flow allows) clicking a reachable step jumps
   to it via onStepClick — Stepper.tsx itself blocks clicks on upcoming steps
   when linear. */

const ADD_VEHICLE_STEPS: StepperStep[] = [
  { label: 'Vehicle details' },
  { label: 'Assign driver' },
  { label: 'Confirm' },
];

/* Shared wizard staging: Stepper + Back/Next controls under it. */
function Wizard({
  steps,
  orientation,
  linear,
  caption,
}: {
  steps: StepperStep[];
  orientation?: 'horizontal' | 'vertical';
  linear?: boolean;
  caption?: (active: number) => string;
}) {
  const [active, setActive] = React.useState(0);
  const last = steps.length - 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Stepper
        orientation={orientation}
        linear={linear}
        steps={steps}
        activeStep={active}
        onStepClick={setActive}
      />
      {caption && (
        <div style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
          {caption(active)}
        </div>
      )}
      <div style={{ display: 'flex', gap: 16 }}>
        <Button
          variant="outlined"
          label="Back"
          disabled={active === 0}
          onClick={() => setActive((a) => Math.max(0, a - 1))}
        />
        <Button
          variant="contained"
          label={active === last ? 'Finish' : 'Next'}
          disabled={active === last}
          onClick={() => setActive((a) => Math.min(last, a + 1))}
        />
      </div>
    </div>
  );
}

export const hero = () => (
  <Wizard
    steps={ADD_VEHICLE_STEPS}
    caption={(a) =>
      ['Registration, make and odometer.', 'Pick a driver, or skip for now.', 'Review and add the vehicle.'][a]
    }
  />
);

const Horizontal = () => <Wizard steps={ADD_VEHICLE_STEPS} orientation="horizontal" />;

const Vertical = () => (
  <Wizard
    orientation="vertical"
    steps={[
      { label: 'Vehicle details', subLabel: 'Registration, make, odometer' },
      { label: 'Assign driver', subLabel: 'Optional' },
      { label: 'Confirm', subLabel: 'Review before adding' },
    ]}
  />
);

const Linear = () => (
  <Wizard
    linear
    steps={[{ label: 'Select vehicles' }, { label: 'Date range' }, { label: 'Generate report' }]}
    caption={() => 'Linear: upcoming steps are not clickable — advance with Next; completed steps can be clicked to go back.'}
  />
);

const NonLinear = () => (
  <Wizard
    linear={false}
    steps={[{ label: 'Pick vehicles' }, { label: 'Pick drivers' }, { label: 'Review' }]}
    caption={() => 'Non-linear: click any step to jump to it.'}
  />
);

export const demos: Record<string, React.ComponentType> = {
  Horizontal,
  Vertical,
  Linear,
  'Non-linear': NonLinear,
};
