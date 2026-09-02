'use client';

import { useTheme } from './ThemeProvider';
import './ThemeToggle.css';

type ThemeToggleProps = {
  className?: string;
};

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M12.85 10.35A5.7 5.7 0 0 1 5.65 3.15 5.85 5.85 0 1 0 12.85 10.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.65" fill="currentColor" />
      <path
        d="M8 1.6v1.35M8 13.05V14.4M1.6 8h1.35M13.05 8H14.4M3.22 3.22l.96.96M11.82 11.82l.96.96M12.78 3.22l-.96.96M4.18 11.82l-.96.96"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
      <span className="theme-toggle__icon theme-toggle__icon--to-dark">
        <MoonIcon />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--to-light">
        <SunIcon />
      </span>
    </button>
  );
}
