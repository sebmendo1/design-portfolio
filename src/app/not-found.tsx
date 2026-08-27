import Link from 'next/link';
import { toNotFoundMarkdown } from '@/lib/page-markdown';
import { getSiteUrl } from '@/lib/site';
import '@/components/CaseStudySrArticle/CaseStudySrArticle.css';

export default function NotFound() {
  const siteUrl = getSiteUrl();
  const markdown = toNotFoundMarkdown(siteUrl);

  return (
    <div className="not-found">
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__body">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="not-found__link">
        Back to work
      </Link>
      <nav className="not-found__recovery" aria-label="Where to look next">
        <a href="/sitemap.xml">Sitemap</a>
        <a href="/llms.txt">llms.txt</a>
        <a href="/content.json">content.json</a>
        <a href="/.well-known/ai.txt">Agent guide</a>
        <a href="/contact">Contact</a>
        <a href="/privacy">Privacy</a>
      </nav>
      <article className="sr-corpus case-study-sr-corpus" data-machine-readable="true">
        <pre>{markdown}</pre>
      </article>
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
        .not-found__recovery {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px 16px;
          max-width: 420px;
          font-size: 14px;
        }
        .not-found__recovery a {
          color: #666;
        }
      `}</style>
    </div>
  );
}
