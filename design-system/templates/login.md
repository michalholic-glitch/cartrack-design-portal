# Login / Auth Page (Sign in, Forgot password, MFA)

The front door: one focused task, zero navigation, maximum clarity.

## Layout

Centered Card (max-width 400px) on the app background > logo > form > primary action

## Components used

- Card — the single centered surface (el2 shadow, 4px radius, 32px padding)
- TextField — username/email and password (outlined variant, with visibility toggle on password); error state with helper text on failed auth
- Checkbox — "Remember me"
- Button — ONE contained primary action ("Sign in", primary-dark fill, full-width); "Forgot password?" is a text button, never a second contained button
- Banner — auth-level messages above the form (expired session, maintenance window)
- LinearProgress — indeterminate at the top of the card while authenticating; the button also enters its loading state
- Snackbar — non-blocking confirmations ("Password reset email sent")

## Structure rules

- One screen, one task: sign-in never shares the page with marketing content or navigation.
- Error handling: generic top-of-form message for bad credentials ("Check your username and password") — never reveal which field was wrong; field-level errors only for format problems.
- Forgot-password and MFA are separate steps on the same centered-card layout, with a back text-button.
- The Enter key submits from any field.

## Notes

- Brand orange is fine for the logo and accents; the primary button still uses primary-dark for AA.
- Autofocus the first empty field; label the password visibility toggle for screen readers.
