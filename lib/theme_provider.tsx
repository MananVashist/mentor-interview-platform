// lib/theme_provider.tsx
import React, { createContext, useContext } from 'react';
import { THEME, type AppTheme } from './theme';

const ThemeContext = createContext<AppTheme | null>(null);

export const ThemeProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: AppTheme;
}) => {
  // always provide a non-null theme
  return (
    <ThemeContext.Provider value={value ?? THEME}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): AppTheme => {
  const ctx = useContext(ThemeContext);
  // if someone calls useTheme() outside provider, don't crash — return THEME
  return ctx ?? THEME;
};
