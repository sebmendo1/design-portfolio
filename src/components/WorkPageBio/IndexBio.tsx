import {
  WORK_PAGE_BIO,
  WORK_PAGE_BIO_CURRENT,
  WORK_PAGE_BIO_LINKS,
} from '@/lib/site';

export function IndexBio() {
  return (
    <h1 className="portfolio-index__bio" aria-label={WORK_PAGE_BIO}>
      Sebastian is a Senior Product Designer building agentic financial experiences at{' '}
      <a
        href={WORK_PAGE_BIO_CURRENT.href}
        className="portfolio-index__bio-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {WORK_PAGE_BIO_CURRENT.label}
      </a>
      . Previously at{' '}
      {WORK_PAGE_BIO_LINKS.map((link, index) => {
        const isLast = index === WORK_PAGE_BIO_LINKS.length - 1;
        const isSecondLast = index === WORK_PAGE_BIO_LINKS.length - 2;
        return (
          <span key={link.href}>
            <a
              href={link.href}
              className="portfolio-index__bio-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
            {isLast ? '.' : isSecondLast ? ' and ' : ', '}
          </span>
        );
      })}
    </h1>
  );
}
