'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: 32, fontWeight: 500 }}>Something went wrong</h1>
          <button type="button" onClick={reset} style={{ padding: '10px 20px', borderRadius: 999, background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
