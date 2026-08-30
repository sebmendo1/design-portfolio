import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__body">The page you&apos;re looking for doesn&apos;t exist.</p>
      <div className="not-found__actions">
        <Link href="/" className="not-found__link">
          back
        </Link>
        <ThemeToggle />
      </div>
      <style>{`
        .not-found {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 12px;
          padding: 32px 24px;
          max-width: 560px;
        }
        .not-found__title {
          font-size: 16px;
          font-weight: normal;
        }
        .not-found__body {
          font-size: 14px;
          opacity: 0.4;
          max-width: 420px;
        }
        .not-found__actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }
        .not-found__link {
          font-size: 14px;
          color: inherit;
          text-decoration: none;
        }
        .not-found__link:hover {
          text-decoration: underline;
          text-underline-offset: 0.14em;
        }
      `}</style>
    </div>
  );
}
