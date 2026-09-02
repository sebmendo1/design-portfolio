import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
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
      <div className="not-found__actions">
        <Link href="/" className="not-found__link">
          back
        </Link>
        <ThemeToggle />
      </div>
      <nav className="not-found__recovery" aria-label="Where to look next">
        <a href="/sitemap.xml">Sitemap</a>
        <a href="/llms.txt">llms.txt</a>
        <a href="/content.json">content.json</a>
        <a href="/impact.json">impact.json</a>
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
        .not-found__recovery {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
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
