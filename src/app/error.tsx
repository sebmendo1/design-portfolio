'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="app-error">
      <h1 className="app-error__title">Something went wrong</h1>
      <p className="app-error__body">Try again, or return to the homepage.</p>
      <div className="app-error__actions">
        <button type="button" onClick={reset} className="app-error__btn">
          Try again
        </button>
        <Link href="/" className="app-error__link">
          Back to work
        </Link>
      </div>
      <style>{`
        .app-error {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px;
          text-align: center;
        }
        .app-error__title {
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 500;
        }
        .app-error__body {
          color: #666;
        }
        .app-error__actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .app-error__btn,
        .app-error__link {
          padding: 10px 20px;
          border-radius: 999px;
          font-weight: 500;
          text-decoration: none;
        }
        .app-error__btn {
          background: #000;
          color: #fff;
          border: none;
          cursor: pointer;
        }
        .app-error__link {
          background: #f4f3f2;
          color: #000;
        }
      `}</style>
    </div>
  );
}
