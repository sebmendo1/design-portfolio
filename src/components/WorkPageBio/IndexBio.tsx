import { INDEX_BIO_PARTS } from '@/lib/index-stream';
import { WORK_PAGE_BIO } from '@/lib/site';

type IndexBioProps = {
  startDelayMs?: number;
  intervalMs?: number;
};

export function IndexBio({}: IndexBioProps) {
  return (
    <h1 className="portfolio-index__bio" aria-label={WORK_PAGE_BIO}>
      {INDEX_BIO_PARTS.map((part, index) => {
        if (part.type === 'gap') {
          return <span key={`gap-${index}`}> </span>;
        }

        if (part.type === 'link') {
          return (
            <a
              key={`${part.href}-${index}`}
              href={part.href}
              className="portfolio-index__bio-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {part.text}
            </a>
          );
        }

        return <span key={`text-${index}`}>{part.text}</span>;
      })}
    </h1>
  );
}
