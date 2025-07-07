// src/context/SettingsContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Mode = 'light' | 'dark';

interface SettingsContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<Mode>('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ui-mode') : null;
    if (stored === 'light' || stored === 'dark') setModeState(stored);
  }, []);

  const setMode = (mode: Mode) => {
    setModeState(mode);
    if (typeof window !== 'undefined') localStorage.setItem('ui-mode', mode);
  };

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <SettingsContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
