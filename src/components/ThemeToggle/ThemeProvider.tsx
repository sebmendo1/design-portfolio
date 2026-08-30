'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  THEME_EVENT,
  THEME_STORAGE_KEY,
  type Theme,
  applyTheme,
  getPreferredTheme,
  persistTheme,
} from '@/lib/theme';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const next = getPreferredTheme();
    setThemeState(next);
    applyTheme(next);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const stored = getPreferredTheme();
      setThemeState(stored);
      applyTheme(stored);
    };

    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<Theme>).detail;
      if (detail !== 'light' && detail !== 'dark') return;
      setThemeState(detail);
      applyTheme(detail);
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(THEME_EVENT, onTheme);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(THEME_EVENT, onTheme);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    persistTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
