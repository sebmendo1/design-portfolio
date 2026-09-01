'use client';

import { StreamingText } from '@/components/StreamingText/StreamingText';
import { buildIndexStreamDelays, INDEX_BIO_PARTS } from '@/lib/index-stream';
import { WORK_PAGE_BIO } from '@/lib/site';

type IndexBioProps = {
  startDelayMs?: number;
};

const delays = buildIndexStreamDelays();

export function IndexBio({ startDelayMs }: IndexBioProps) {
  const partDelays =
    startDelayMs == null
      ? delays.bioParts
      : delays.bioParts.map((delay) => delay - delays.bio + startDelayMs);

  return (
    <h1 className="portfolio-index__bio" aria-label={WORK_PAGE_BIO}>
      {INDEX_BIO_PARTS.map((part, index) => {
        const delay = partDelays[index] ?? delays.bio;
        const text = (
          <StreamingText text={part.text} as="span" startDelayMs={delay} />
        );

        if (part.type === 'link') {
          return (
            <a
              key={`${part.href}-${index}`}
              href={part.href}
              className="portfolio-index__bio-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
            </a>
          );
        }

        return <span key={`text-${index}`}>{text}</span>;
      })}
    </h1>
  );
}
