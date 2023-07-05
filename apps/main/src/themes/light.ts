import {
  createTheme,
  PaletteOptions,
  responsiveFontSizes,
  SimplePaletteColorOptions,
  TypeAction,
  TypeBackground,
  TypeText,
} from '@mui/material/styles';
import { alpha } from '@mui/system';
import type {} from '@mui/x-data-grid/themeAugmentation';

import { breakpoints } from './breakpoints';

interface CustomPaletteOptions
  extends Omit<
    PaletteOptions,
    'common' | 'customs' | 'grey' | 'mode' | 'tonalOffset' | 'contrastThreshold'
  > {
  primary: SimplePaletteColorOptions;
  secondary: SimplePaletteColorOptions;
  error: SimplePaletteColorOptions;
  warning: SimplePaletteColorOptions;
  info: SimplePaletteColorOptions;
  success: SimplePaletteColorOptions;
  text: Partial<TypeText>;
  divider: string;
  action: Partial<TypeAction>;
  background: Partial<TypeBackground>;
}

const palette: CustomPaletteOptions = {
  text: {
    primary: '#000000de',
    secondary: '#0000008a',
    disabled: '#00000061',
  },
  primary: {
    main: '#2044bf',
    dark: '#162f85',
    light: '#4c69cb',
    contrastText: '#ffffff',
    shades: {},
  },
  secondary: {
    main: '#0fb6f1',
    dark: '#0a7fa8',
    light: '#3fc4f3',
    contrastText: '#000000de',
    shades: {},
  },
  action: {
    hover: '#0000000a',
    selected: '#00000014',
    disabledBackground: '#0000001f',
    focus: '#0000001f',
    disabled: '#00000042',
    active: '#0000008a',
  },
  error: {
    main: '#e02f2a',
    dark: '#9c201d',
    light: '#e65854',
    contrastText: '#ffffff',
    shades: {},
  },
  warning: {
    main: '#ed6c02',
    dark: '#a54b01',
    light: '#f08934',
    contrastText: '#ffffff',
    shades: {},
  },
  info: {
    main: '#0288d1',
    dark: '#015f92',
    light: '#349fda',
    contrastText: '#ffffff',
    shades: {},
  },
  success: {
    main: '#2e7d32',
    dark: '#205723',
    light: '#57975b',
    contrastText: '#ffffff',
    shades: {},
  },
  background: {
    default: '#f5f7fb',
    paper: '#ffffff',
  },
  divider: '#0000001f',
};

const getP160 = (color: string): string =>
  `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), ${color}`;

const getP190 = (color: string): string =>
  `linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), ${color}`;

const theme = createTheme({
  breakpoints,
  palette: {
    text: {
      ...palette.text,
    },
    primary: {
      ...palette.primary,
      shades: {
        p4: alpha(palette.primary.main, 0.04),
        p8: alpha(palette.primary.main, 0.08),
        p12: alpha(palette.primary.main, 0.12),
        p30: alpha(palette.primary.main, 0.3),
        p50: alpha(palette.primary.main, 0.5),
        p160: getP160(palette.primary.main),
        p190: getP190(palette.primary.main),
      },
    },
    secondary: {
      ...palette.secondary,
      shades: {
        p4: alpha(palette.secondary.main, 0.04),
        p8: alpha(palette.secondary.main, 0.08),
        p12: alpha(palette.secondary.main, 0.12),
        p30: alpha(palette.secondary.main, 0.3),
        p50: alpha(palette.secondary.main, 0.5),
        p160: getP160(palette.secondary.main),
        p190: getP190(palette.secondary.main),
      },
    },
    action: {
      ...palette.action,
    },
    error: {
      ...palette.error,
      shades: {
        p4: alpha(palette.error.main, 0.04),
        p12: alpha(palette.error.main, 0.12),
        p30: alpha(palette.error.main, 0.3),
        p50: alpha(palette.error.main, 0.5),
        p160: getP160(palette.error.main),
        p190: getP190(palette.error.main),
      },
    },
    warning: {
      ...palette.warning,
      shades: {
        p4: alpha(palette.warning.main, 0.04),
        p12: alpha(palette.warning.main, 0.12),
        p30: alpha(palette.warning.main, 0.3),
        p50: alpha(palette.warning.main, 0.5),
        p160: getP160(palette.warning.main),
        p190: getP190(palette.warning.main),
      },
    },
    info: {
      ...palette.info,
      shades: {
        p4: alpha(palette.info.main, 0.04),
        p12: alpha(palette.info.main, 0.12),
        p30: alpha(palette.info.main, 0.3),
        p50: alpha(palette.info.main, 0.5),
        p160: getP160(palette.info.main),
        p190: getP190(palette.info.main),
      },
    },
    success: {
      ...palette.success,
      shades: {
        p4: alpha(palette.success.main, 0.04),
        p12: alpha(palette.success.main, 0.12),
        p30: alpha(palette.success.main, 0.3),
        p50: alpha(palette.success.main, 0.5),
        p160: getP160(palette.success.main),
        p190: getP190(palette.success.main),
      },
    },
    background: {
      ...palette.background,
    },
    divider: palette.divider,
    customs: {
      /**
       * Think twice before adding custom name.
       * Use the closest colors that we've currently have.
       * If you still need customized, please give a color name and the hexa code.
       * Hard to find color naming? You can get it here https://chir.ag/projects/name-that-color
       */
      blueRibbon: '#2c60f6',
      silver: '#cccccc',
      doveGray: '#707070',
      aliceBlue: '#EDF4FC',
      patternsBlue: '#D5E8FA',

      boxShadow: '0 0.25rem 0.25rem rgba(0, 0, 0, 0.25)',
      boxBorder: '#e0e0e0',

      alertDescription: '#0d1b4c',
      alertBackground: '#e9ecf9',
    },
  },
  typography: {
    fontFamily: 'Roboto,sans-serif',
    overline: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 'bold',
          textTransform: 'unset',
        },
      },
    },
  },
});

export const light = responsiveFontSizes(theme);
