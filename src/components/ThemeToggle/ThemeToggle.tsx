'use client';

import { useTheme } from './ThemeProvider';
import './ThemeToggle.css';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  const classes = ['theme-toggle', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      aria-pressed={theme === 'dark'}
      suppressHydrationWarning
    >
      <span className="theme-toggle__to-dark">dark</span>
      <span className="theme-toggle__to-light">light</span>
    </button>
  );
}
