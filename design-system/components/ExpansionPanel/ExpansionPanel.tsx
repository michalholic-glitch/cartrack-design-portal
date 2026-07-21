import React, { useState } from 'react';

// See Badge.tsx/Card.tsx for why this reads primitive.* directly rather than semantic.* (the latter
// are mostly unresolved alias strings — safe only once a build-time token resolver exists).
import tokens from '../../tokens/tokens.json';

export interface ExpansionPanelProps {
  /** Section title shown in the always-visible header. */
  title: string;
  /** Optional preview value shown on the collapsed header (the "With summary" variant). */
  summary?: string;
  /** Panel body content, revealed when expanded. */
  children?: React.ReactNode;
  /** Controlled open state. When provided, the panel no longer manages its own state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Called with the next open state whenever the header is toggled. */
  onToggle?: (open: boolean) => void;
  /** Disables the header toggle. */
  disabled?: boolean;
  /** Optional extra class names to compose with the base `accordion` class. */
  className?: string;
}

/**
 * ExpansionPanel — MD2 (MDC) Cartrack-themed.
 * Full spec: ExpansionPanel.doc.json
 *
 * NOTE: MDC Web has no accordion / expansion-panel component. The live
 * Cartrack library (md2-cartrack-library/components/expansion-panels.html)
 * builds it from a custom `accordion` header (`hd`) + body (`bd2`) pair, which
 * this component mirrors. Whether opening this panel closes its siblings
 * (single-open vs multi-open) is a decision made by the parent that renders a
 * group of panels — see the "Single vs multi" behavior in the spec.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px).
 * - color: semantic.color.border.default (divider above the body).
 * - spacing: semantic.spacing.md (16px body padding).
 * - type: semantic.typography.scale.subtitle2 (14px/500, low end of the spec's "14–16px/500" range)
 *   or semantic.typography.scale.titleMedium (16px/500, high end — added 2026-07-16 to close what
 *   used to be a gap; see Card.tsx). This component uses titleMedium's fontSize below.
 * Not yet tokenized: ~48px header height and elevation have no matching tokens.
 */
export function ExpansionPanel({
  title,
  summary,
  children,
  open,
  defaultOpen = false,
  onToggle,
  disabled = false,
  className,
}: ExpansionPanelProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div className={['accordion', className].filter(Boolean).join(' ')}>
      <div
        className="hd"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-controls={`${title}-panel`}
        aria-disabled={disabled || undefined}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <span
          style={{
            fontSize: tokens.semantic.typography.scale.titleMedium.fontSize,
            fontWeight: tokens.primitive.fontWeight.medium,
          }}
        >
          {title}
        </span>
        {summary && !isOpen ? <span className="muted">{summary}</span> : null}
        <span className="chev" aria-hidden="true">
          {isOpen ? '⌄' : '›'}
        </span>
      </div>
      {isOpen ? (
        <div className="bd2" id={`${title}-panel`}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default ExpansionPanel;
