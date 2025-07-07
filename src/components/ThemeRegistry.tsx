// src/components/ThemeRegistry.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import themes from '@/theme';

const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { mode } = useSettings(); // 'light' or 'dark'
  const teamKey = user?.favoriteTeam || 'default';
  const theme = themes[teamKey]?.[mode] || themes['default'][mode];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeRegistry;
