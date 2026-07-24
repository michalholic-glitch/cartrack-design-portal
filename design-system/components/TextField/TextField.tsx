import React from 'react';
import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';

export type TextFieldProps = MuiTextFieldProps & {
  /**
   * Prevents the user from changing the field's value (but not from
   * interacting with/focusing/copying from it) — mirrors the real karoo-ui
   * convenience prop, which sets this on both slotProps.input and
   * slotProps.htmlInput because MUI v9 supports readOnly in both places
   * and Autocomplete only wires the htmlInput one.
   */
  readOnly?: boolean;
};

/**
 * TextField — Material UI (MUI) v9, Cartrack-themed via @karoo-ui/core.
 * Full spec: TextField.doc.json
 * Real source: libs/shared/js/karoo-ui/core/src/lib/TextField/index.tsx.
 * Overrides actually applied by karoo-ui's wrapper (both reproduced here):
 * - size defaults to 'small' (fleet-web's form-density convention; see
 *   theme.ts's MuiCheckbox/MuiRadio/MuiSwitch/MuiChip size:'small' defaults
 *   for the same pattern elsewhere in the theme).
 * - readOnly is a plain top-level convenience prop that, when set, is
 *   pushed into BOTH slotProps.input.readOnly and slotProps.htmlInput.readOnly
 *   for predictable behaviour across MUI v9's two possible readOnly locations.
 * Not reproduced: karoo-ui's KarooFormStateContext, which lets a parent
 * form disable/read-only every field at once — that's an internal
 * workspace context (../KarooFormStateContext), dropped here for portability.
 * Tokens (tokens/tokens.json):
 * - radius: semantic.radius.default (4px).
 * - color: semantic.color.brand.primary.dark (focus/active line — .dark, not
 *   .main, keeps the line legible; see tokens.json's accessibility.knownIssues),
 *   semantic.color.status.error.main (error state).
 * - type: semantic.typography.scale.body1 (input text), .caption (helper/error text).
 */
export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
  { size = 'small', readOnly, slotProps, ...props }: TextFieldProps,
  ref,
) {
  const slotPropsInput = slotProps?.input;
  const slotPropsHtmlInput = slotProps?.htmlInput;

  return (
    <MuiTextField
      ref={ref}
      size={size}
      slotProps={{
        ...slotProps,
        htmlInput:
          readOnly !== undefined
            ? { ...slotPropsHtmlInput, readOnly }
            : slotPropsHtmlInput,
        input:
          readOnly !== undefined
            ? { ...slotPropsInput, readOnly }
            : slotPropsInput,
      }}
      {...props}
    />
  );
});

export default TextField;
