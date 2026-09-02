'use client';

import { StreamingText } from '@/components/StreamingText/StreamingText';
import { buildIndexStreamDelays, INDEX_BIO_PARTS } from '@/lib/index-stream';
import { WORK_PAGE_BIO } from '@/lib/site';

type IndexBioProps = {
  startDelayMs?: number;
  intervalMs?: number;
};

const delays = buildIndexStreamDelays();

export function IndexBio({ startDelayMs, intervalMs }: IndexBioProps) {
  const partDelays =
    startDelayMs == null
      ? delays.bioParts
      : delays.bioParts.map((delay) => delay - delays.bio + startDelayMs);
  const cadence = intervalMs ?? delays.intervalMs;

  return (
    <h1 className="portfolio-index__bio" aria-label={WORK_PAGE_BIO}>
      {INDEX_BIO_PARTS.map((part, index) => {
        if (part.type === 'gap') {
          return <span key={`gap-${index}`}> </span>;
        }

        const delay = partDelays[index] ?? delays.bio;
        const text = (
          <StreamingText
            text={part.text}
            as="span"
            startDelayMs={delay}
            intervalMs={cadence}
          />
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
