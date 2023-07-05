import type {} from '@mui/material/styles';

interface Customs {
  boxShadow: string;
  [id: string]: string;
}

interface Shades {
  p4: string;
  p8: string;
  p12: string;
  p30: string;
  p50: string;
  p160: string;
  p190: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    customs: Customs;
  }

  interface PaletteOptions {
    customs: Customs;
  }

  interface PaletteColor {
    shades: Partial<Shades>;
  }

  interface SimplePaletteColorOptions {
    shades: Partial<Shades>;
  }
}
