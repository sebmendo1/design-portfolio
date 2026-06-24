import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__body">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="not-found__link">
        Back to work
      </Link>
      <style>{`
        .not-found {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px;
          text-align: center;
        }
        .not-found__title {
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 500;
        }
        .not-found__body {
          color: #666;
          max-width: 420px;
        }
        .not-found__link {
          margin-top: 8px;
          padding: 10px 20px;
          background: #000;
          color: #fff;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
