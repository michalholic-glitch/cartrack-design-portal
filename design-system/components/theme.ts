/**
 * Cartrack Fleet Portal — MUI theme (decoupled equivalent of the real theme)
 *
 * The real production theme lives at:
 *   libs/shared/js/karoo-ui/core/src/lib/ThemeProvider.tsx  (fleetapp-web monorepo)
 * That file builds a MUI v9 `createTheme()` and depends on workspace-only
 * packages (@karoo/utils) and a locale system. This file reproduces the same
 * palette / typography / shape values — sourced from tokens.json's semantic
 * tier, which was itself generated from ThemeProvider.tsx — as a standalone
 * theme with zero workspace-only dependencies, so every Component.tsx in this
 * folder can be dropped into any MUI v9 app.
 *
 * Every component in this folder assumes it renders under:
 *   <ThemeProvider theme={cartrackTheme}><YourComponent /></ThemeProvider>
 *
 * Not reproduced here (see the real ThemeProvider.tsx for full fidelity):
 * - White-label runtime palette swapping (KarooUiCustomizableTheme)
 * - MUI X locale wiring (dataGrid / datePickers locale text)
 * - A few conditional styleOverrides (OutlinedInput/InputBase readOnly
 *   states, FormLabel asterisk color, IconButton disableRipple padding,
 *   ToggleButtonGroup selected-state border/colors) — these are real but
 *   omitted here for portability; each affected component's .doc.json notes
 *   the omission.
 */
import { createTheme } from '@mui/material/styles';

export const cartrackTheme = createTheme({
  palette: {
    // semantic.color.brand.primary — white-label default (Cartrack theme)
    primary: {
      main: '#F47735',
      light: '#FFA863',
      dark: '#BB4800',
      contrastText: '#FFFFFF',
    },
    // semantic.color.brand.secondary
    secondary: {
      main: '#333333',
      light: '#5C5C5C',
      dark: '#0C0C0C',
      contrastText: '#FFFFFF',
    },
    // semantic.color.status.* — fixed, not white-label customizable
    success: { main: '#4CAF50', light: '#81C784', dark: '#388E3C', contrastText: '#FFFFFF' },
    error: { main: '#F44336', light: '#E57373', dark: '#D32F2F', contrastText: '#FFFFFF' },
    warning: { main: '#FF9800', light: '#FFB74D', dark: '#F57C00', contrastText: '#FFFFFF' },
    info: { main: '#2196F3', light: '#64B5F6', dark: '#1976D2', contrastText: '#FFFFFF' },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  // semantic.radius.default — never overridden in the real theme (theme.shape.borderRadius = 4)
  shape: {
    borderRadius: 4,
  },
  typography: {
    // semantic.typography.fontFamily (muiDefault) — MUI's real unoverridden default,
    // NOT the legacy Roboto-only stack from the pre-MUI styled-components layer.
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Must stay in sync with html { font-size: 14px } — see tokens.json note.
    htmlFontSize: 14,
    fontSize: 14,
    button: {
      textTransform: 'uppercase',
    },
  },
  components: {
    // Real default-prop overrides reproduced from ThemeProvider.tsx.
    MuiTypography: { defaultProps: { variant: 'body2' } },
    MuiDialogContentText: { defaultProps: { variant: 'body2' } },
    MuiCheckbox: { defaultProps: { size: 'small' } },
    MuiRadio: { defaultProps: { size: 'small' } },
    MuiSwitch: { defaultProps: { size: 'small' } },
    MuiChip: { defaultProps: { size: 'small' } },
    MuiMenuItem: { styleOverrides: { root: { fontSize: '1rem' } } },
    MuiDialogContent: { styleOverrides: { root: { overflow: 'visible' } } },
    MuiDataGrid: { styleOverrides: { root: { fontSize: 14 } } },
  },
});

export default cartrackTheme;
