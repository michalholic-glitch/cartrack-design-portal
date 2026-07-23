import React from 'react';
import { Banner } from '../../design-system/components/Banner/Banner';
import { Button } from '../../design-system/components/Button/Button';

/* Live demos for the portal — rendered from the REAL Banner.tsx.
   Keys must exactly match Banner.doc.json variant names. */

type Severity = 'info' | 'warning' | 'error' | 'success';

/* Dismissible staging wrapper: the secondary action removes the banner (as in the
   real portal); a small reset button brings it back so the tile stays explorable. */
const Dismissible = ({
  severity,
  message,
  primaryActionLabel,
}: {
  severity: Severity;
  message: string;
  primaryActionLabel: string;
}) => {
  const [visible, setVisible] = React.useState(true);
  const [acted, setActed] = React.useState('');
  if (!visible) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: '.8rem', color: 'rgba(0,0,0,.6)' /* semantic.color.text.secondary */ }}>
          Banner dismissed{acted ? ` (${acted})` : ''} — layout reflows.
        </span>
        <Button variant="text" label="Reset demo" onClick={() => { setVisible(true); setActed(''); }} />
      </div>
    );
  }
  return (
    <div style={{ width: '100%' }}>
      <Banner
        severity={severity}
        message={message}
        secondaryActionLabel="Dismiss"
        onSecondaryAction={() => setVisible(false)}
        primaryActionLabel={primaryActionLabel}
        onPrimaryAction={() => { setActed(primaryActionLabel); setVisible(false); }}
      />
    </div>
  );
};

/* Hero: the warning banner — the portal's most common case (service due). */
export const hero = () => (
  <Dismissible
    severity="warning"
    message="3 vehicles are due for service within the next 7 days."
    primaryActionLabel="Review vehicles"
  />
);

export const demos: Record<string, React.ComponentType> = {
  Informational: () => (
    <Dismissible
      severity="info"
      message="Trip reports can now be exported as CSV in addition to PDF."
      primaryActionLabel="Learn more"
    />
  ),
  Warning: () => (
    <Dismissible
      severity="warning"
      message="Vehicle CA 123-456 is due for service in 3 days."
      primaryActionLabel="Schedule service"
    />
  ),
  Error: () => (
    <Dismissible
      severity="error"
      message="Live tracking sync failed — positions on this page may be up to 15 minutes old."
      primaryActionLabel="Retry sync"
    />
  ),
  Success: () => (
    <Dismissible
      severity="success"
      message="Fleet utilisation report for June finished generating."
      primaryActionLabel="View report"
    />
  ),
};
