// src/theme.ts
'use client';

import { createTheme, Theme, Shadows } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

// --- Font Setup: Use Roboto from Google Fonts for consistent typography ---
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// --- Custom Shadows: Generate a Material UI-compatible shadows array ---
const defaultShadows: string[] = ['none'];
for (let i = 1; i <= 24; i++) {
  const shadow1 = `0px ${i * 1.5}px ${i * 3}px rgba(0, 0, 0, ${0.05 + (i * 0.005)})`;
  const shadow2 = `0px ${i * 1.2}px ${i * 2.5}px rgba(0, 0, 0, ${0.03 + (i * 0.004)})`;
  defaultShadows.push(`${shadow1}, ${shadow2}`);
}
const customShadows = defaultShadows as Shadows;

// --- Base Theme Options: Shared style settings for all themes ---
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
        root: { boxShadow: customShadows[1] },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: customShadows[2],
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': { boxShadow: customShadows[4] },
        },
      },
    },
  },
} as const;

// --- Team Theme Palettes (light/dark) ---
// NOTE: The 'mode' property is a string literal ('light' or 'dark') for PaletteOptions compatibility.
const teamPalettes = {
  default: {
    light: { mode: 'light' as const, primary: { main: '#D50000', light: '#FF5C5C', dark: '#AA0000' }, secondary: { main: '#333333' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#D50000', light: '#FF5C5C', dark: '#AA0000' }, secondary: { main: '#333333' } },
  },
  mercedes: {
    light: { mode: 'light' as const, primary: { main: '#00A19C', light: '#4FE2D5', dark: '#007A76' }, secondary: { main: '#27F4D2' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#00D2BE', light: '#4FE2D5', dark: '#007A76' }, secondary: { main: '#222222' } },
  },
  ferrari: {
    light: { mode: 'light' as const, primary: { main: '#DC0000', light: '#FF4545', dark: '#B00000' }, secondary: { main: '#FFEB00' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#DC0000', light: '#FF4545', dark: '#B00000' }, secondary: { main: '#FFEB00' } },
  },
  red_bull_racing: {
    light: { mode: 'light' as const, primary: { main: '#0600EF', light: '#5A56FF', dark: '#0000BB' }, secondary: { main: '#FF0028' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#1E41FF', light: '#5A56FF', dark: '#0000BB' }, secondary: { main: '#FF1E00' } },
  },
  mclaren: {
    light: { mode: 'light' as const, primary: { main: '#FF8700', light: '#FFAD42', dark: '#CC6F00' }, secondary: { main: '#47C7FC' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#FF8700', light: '#FFAD42', dark: '#CC6F00' }, secondary: { main: '#222222' } },
  },
  aston_martin: {
    light: { mode: 'light' as const, primary: { main: '#229971', light: '#33E0CF', dark: '#007A76' }, secondary: { main: '#FFD700' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#00D2BE', light: '#33E0CF', dark: '#00A391' }, secondary: { main: '#00554E' } },
  },
  alpine: {
    light: { mode: 'light' as const, primary: { main: '#0090FF', light: '#33ADFF', dark: '#006DBF' }, secondary: { main: '#FF5E00' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#0090FF', light: '#33ADFF', dark: '#006DBF' }, secondary: { main: '#FF5E00' } },
  },
  williams: {
    light: { mode: 'light' as const, primary: { main: '#005AFF', light: '#337AFF', dark: '#0047CC' }, secondary: { main: '#00DAFF' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#005AFF', light: '#337AFF', dark: '#0047CC' }, secondary: { main: '#00DAFF' } },
  },
  haas: {
    light: { mode: 'light' as const, primary: { main: '#B6B6B6', light: '#D0D0D0', dark: '#8F8F8F' }, secondary: { main: '#FFFFFF' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#B6BABD', light: '#D0D0D0', dark: '#8F8F8F' }, secondary: { main: '#E10600' } },
  },
  rb: {
    light: { mode: 'light' as const, primary: { main: '#6692FF', light: '#A1BFFF', dark: '#305F99' }, secondary: { main: '#FFD700' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#6692FF', light: '#A1BFFF', dark: '#305F99' }, secondary: { main: '#FFD700' } },
  },
  sauber: {
    light: { mode: 'light' as const, primary: { main: '#52E252', light: '#8DF78D', dark: '#329632' }, secondary: { main: '#000000' } },
    dark:  { mode: 'dark'  as const, primary: { main: '#52E252', light: '#8DF78D', dark: '#329632' }, secondary: { main: '#000000' } },
  },
};

// --- Build themes object: themes[teamKey][mode] ---
const themes: { [key: string]: { light: Theme; dark: Theme } } = {};
Object.entries(teamPalettes).forEach(([key, palette]) => {
  themes[key] = {
    light: createTheme({ ...baseThemeOptions, palette: palette.light }),
    dark: createTheme({ ...baseThemeOptions, palette: palette.dark }),
  };
});

export default themes;
