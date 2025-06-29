// src/theme.ts
'use client';

import { createTheme, Theme, Shadows } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Create an array with the default 'none' value for the first element.
const defaultShadows: string[] = ['none'];

// Populate the rest of the shadows array (from index 1 to 24)
for (let i = 1; i <= 24; i++) {
  const shadow1 = `0px ${i * 1.5}px ${i * 3}px rgba(0, 0, 0, ${0.05 + (i * 0.005)})`;
  const shadow2 = `0px ${i * 1.2}px ${i * 2.5}px rgba(0, 0, 0, ${0.03 + (i * 0.004)})`;
  defaultShadows.push(`${shadow1}, ${shadow2}`);
}

// Explicitly cast our generated array to the required 'Shadows' tuple type.
const customShadows = defaultShadows as Shadows;

// ============= THIS IS THE DEFINITIVE FIX =============
// By adding `as const` at the end, we tell TypeScript to treat all these
// properties as specific, literal values, not generic types (e.g., 'none' instead of 'string').
// This satisfies the strict type requirements of Material UI's createTheme function.
const baseThemeOptions = {
  typography: { fontFamily: roboto.style.fontFamily },
  shape: {
    borderRadius: 8,
  },
  shadows: customShadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: customShadows[1],
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: customShadows[2],
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: customShadows[4],
          },
        },
      },
    },
  },
} as const; // <-- The `as const` assertion is the key fix.

// Define our team color palettes based on the current F1 grid
const themes: { [key: string]: Theme } = {
  default:           createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#D50000', light: '#FF5C5C', dark: '#AA0000' }, secondary: { main: '#333333' } } }),
  mercedes:          createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#00A19C', light: '#4FE2D5', dark: '#007A76' }, secondary: { main: '#27F4D2' } } }),
  ferrari:           createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#DC0000', light: '#FF4545', dark: '#B00000' }, secondary: { main: '#FFEB00' } } }),
  red_bull_racing:   createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#0600EF', light: '#5A56FF', dark: '#0000BB' }, secondary: { main: '#FF0028' } } }),
  mclaren:           createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#FF8700', light: '#FFAD42', dark: '#CC6F00' }, secondary: { main: '#47C7FC' } } }),
  aston_martin:      createTheme({ ...baseThemeOptions, palette: { mode: 'dark', primary: { main: '#00D2BE', light: '#33E0CF', dark: '#00A391' }, secondary: { main: '#00554E' } } }),
  alpine:            createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#0090FF', light: '#33ADFF', dark: '#006DBF' }, secondary: { main: '#FF5E00' } } }),
  williams:          createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#005AFF', light: '#337AFF', dark: '#0047CC' }, secondary: { main: '#00DAFF' } } }),
  haas:              createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#B6B6B6', light: '#D0D0D0', dark: '#8F8F8F' }, secondary: { main: '#FFFFFF' } } }),
  alphatauri:        createTheme({ ...baseThemeOptions, palette: { mode: 'light', primary: { main: '#2B4562', light: '#5C708C', dark: '#1F334A' }, secondary: { main: '#FFFFFF' } } }),
};

export default themes;
