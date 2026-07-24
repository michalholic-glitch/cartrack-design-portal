import React from 'react';
import { Stepper } from '../../design-system/components/Stepper/Stepper';
import { Button } from '../../design-system/components/Button/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';

/* Live demos for the portal — rendered from the REAL Stepper.tsx (thin wrapper
   over @mui/material/Stepper, MUI v9). Keys must exactly match
   Stepper.doc.json variant names. All five variants are expressible live —
   none omitted.
   Steps are composed as real Step/StepLabel children (no invented `steps`
   array prop — see the doc.json correction note), and Back/Next navigation is
   consumer-built with design-system Buttons driving `activeStep`, exactly as
   the doc's "Navigation (external)" anatomy entry prescribes. */

const onboardingSteps = ['Vehicle details', 'Assign driver', 'Confirm'];

const stageStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '560px',
};

const controlsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px /* primitive.spacing.2 */',
  marginTop: '16px /* primitive.spacing.4 */',
};

const captionStyle: React.CSSProperties = {
  fontSize: '12px /* semantic.typography.scale.caption */',
  color: 'rgba(0, 0, 0, 0.6) /* semantic.color.text.secondary */',
  marginTop: '16px /* primitive.spacing.4 */',
};

const bodyStyle: React.CSSProperties = {
  fontSize: '14px /* semantic.typography.scale.body2 */',
  color: 'rgba(0, 0, 0, 0.87) /* semantic.color.text.primary */',
  margin: 0,
};

/* Back / Next / Reset — external navigation driving activeStep. One contained
   primary action per view; Back stays a text button. */
const StepControls = ({
  activeStep,
  stepCount,
  onBack,
  onNext,
  onReset,
}: {
  activeStep: number;
  stepCount: number;
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
}) => (
  <div style={controlsStyle}>
    {activeStep === stepCount ? (
      <Button variant="outlined" onClick={onReset}>
        Reset
      </Button>
    ) : (
      <React.Fragment>
        <Button disabled={activeStep === 0} onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext}>
          {activeStep === stepCount - 1 ? 'Finish' : 'Next'}
        </Button>
      </React.Fragment>
    )}
  </div>
);

/* Hero — onboarding a new vehicle: horizontal linear stepper at actual size,
   with the external Back/Next controls the real component requires. */
export const hero: React.ComponentType = () => {
  const [activeStep, setActiveStep] = React.useState(1);
  return (
    <div style={stageStyle}>
      <Stepper activeStep={activeStep}>
        {onboardingSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <p style={captionStyle}>
        {activeStep === onboardingSteps.length
          ? 'Vehicle CA 123-456 onboarded.'
          : `Step ${activeStep + 1} of ${onboardingSteps.length} — onboarding CA 123-456`}
      </p>
      <StepControls
        activeStep={activeStep}
        stepCount={onboardingSteps.length}
        onBack={() => setActiveStep((step) => step - 1)}
        onNext={() => setActiveStep((step) => step + 1)}
        onReset={() => setActiveStep(0)}
      />
    </div>
  );
};

const Horizontal: React.ComponentType = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  return (
    <div style={stageStyle}>
      <Stepper activeStep={activeStep}>
        {onboardingSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <StepControls
        activeStep={activeStep}
        stepCount={onboardingSteps.length}
        onBack={() => setActiveStep((step) => step - 1)}
        onNext={() => setActiveStep((step) => step + 1)}
        onReset={() => setActiveStep(0)}
      />
    </div>
  );
};

const verticalSteps = [
  {
    label: 'Vehicle details',
    detail: 'Registration CA 123-456, 2024 Toyota Hilux, odometer 48,210 km.',
  },
  {
    label: 'Assign driver',
    detail: 'Jane Cooper (default) or Frank Kim — one primary driver per vehicle.',
  },
  {
    label: 'Confirm',
    detail: 'Review the details above, then finish to add the vehicle to the fleet.',
  },
];

const Vertical: React.ComponentType = () => {
  const [activeStep, setActiveStep] = React.useState(1);
  return (
    <div style={{ ...stageStyle, maxWidth: '400px' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {verticalSteps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <p style={bodyStyle}>{step.detail}</p>
              <div style={controlsStyle}>
                <Button disabled={index === 0} onClick={() => setActiveStep(index - 1)}>
                  Back
                </Button>
                <Button variant="contained" onClick={() => setActiveStep(index + 1)}>
                  {index === verticalSteps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === verticalSteps.length && (
        <div style={controlsStyle}>
          <Button variant="outlined" onClick={() => setActiveStep(0)}>
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

/* Linear is the default (`nonLinear` false): headers aren't clickable, order is
   enforced by the consumer deciding when activeStep may advance. */
const Linear: React.ComponentType = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  return (
    <div style={stageStyle}>
      <Stepper activeStep={activeStep}>
        {onboardingSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <p style={captionStyle}>
        Linear (default) — steps complete in order; headers are display-only, so
        navigation happens only through the buttons below.
      </p>
      <StepControls
        activeStep={activeStep}
        stepCount={onboardingSteps.length}
        onBack={() => setActiveStep((step) => step - 1)}
        onNext={() => setActiveStep((step) => step + 1)}
        onReset={() => setActiveStep(0)}
      />
    </div>
  );
};

/* Non-linear: `nonLinear` + StepButton headers — the operator jumps freely;
   completion is tracked per step by the consumer. */
const NonLinear: React.ComponentType = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<Record<number, boolean>>({});
  return (
    <div style={stageStyle}>
      <Stepper nonLinear activeStep={activeStep}>
        {onboardingSteps.map((label, index) => (
          <Step key={label} completed={Boolean(completed[index])}>
            <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <p style={captionStyle}>
        Click any step header to jump to it — mutual order is not enforced.
      </p>
      <div style={controlsStyle}>
        <Button
          variant="contained"
          onClick={() => setCompleted((done) => ({ ...done, [activeStep]: true }))}
        >
          Mark step complete
        </Button>
        <Button variant="outlined" onClick={() => setCompleted({})}>
          Reset
        </Button>
      </div>
    </div>
  );
};

const reportSteps = ['Choose report', 'Select vehicles', 'Set period', 'Schedule'];

const AlternativeLabel: React.ComponentType = () => {
  const [activeStep, setActiveStep] = React.useState(2);
  return (
    <div style={stageStyle}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {reportSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <StepControls
        activeStep={activeStep}
        stepCount={reportSteps.length}
        onBack={() => setActiveStep((step) => step - 1)}
        onNext={() => setActiveStep((step) => step + 1)}
        onReset={() => setActiveStep(0)}
      />
    </div>
  );
};

export const demos: Record<string, React.ComponentType> = {
  'Horizontal': Horizontal,
  'Vertical': Vertical,
  'Linear': Linear,
  'Non-linear': NonLinear,
  'Alternative label': AlternativeLabel,
};
