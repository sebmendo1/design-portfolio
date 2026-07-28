import localFont from 'next/font/local';

/** Seb Sans Var — single WOFF2; Display optics via opsz axis at large sizes. */
export const sebSansVar = localFont({
  src: '../app/fonts/SebSansVar.woff2',
  variable: '--font-seb-sans-var',
  display: 'swap',
  weight: '100 900',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
});
