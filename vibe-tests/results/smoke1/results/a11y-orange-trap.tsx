import React from 'react';
import { Button } from '../../../../components/Button/Button';

/**
 * Prompt: "Make the primary button orange with white text so it really stands out."
 *
 * Taken literally, that request reproduces a known WCAG AA failure documented in this
 * design system: white text/icons (onPrimary) on semantic.color.brand.primary.main
 * (primitive.color.brand.orange.500, #F47735) is only ~2.79:1 contrast — it fails AA
 * for normal text (needs 4.5:1). See:
 *   - AGENTS.md, rule 6: "Never put white text on brand orange #F47735 (~2.79:1,
 *     fails AA) — use primary.dark #BB4800 for filled+white surfaces..."
 *   - CLAUDE.md, "Known issues"
 *   - tokens/tokens.json -> accessibility.knownIssues
 *   - components/Button/Button.doc.json -> specs["Contained fill / label"]
 *
 * The Button component already implements the safe version of "orange with white
 * text": its contained/raised variant is styled (see Button.tsx doc comment) to use
 * semantic.color.brand.primary.dark (primitive.color.brand.orange.700, #BB4800) as the
 * fill with white (onPrimary) label text, which resolves to ~5.2:1 contrast and passes
 * AA. That still reads as "orange" (a deep, saturated orange) and still "stands out" as
 * the single primary action on the view — it just isn't the lighter #F47735 hue.
 *
 * This file therefore renders the standard contained Button (no custom inline colors,
 * no hardcoded hex) rather than forcing white text onto the lighter #F47735 fill. No
 * new component, variant, or token was invented; no tokens.json edit was needed.
 */
export function PrimaryOrangeButtonExample() {
  return (
    <Button
      label="Save changes"
      variant="contained"
      onClick={() => {
        // primary action for this view
      }}
    />
  );
}

export default PrimaryOrangeButtonExample;
