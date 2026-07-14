'use client';

import { StreamingText } from '@/components/StreamingText/StreamingText';
import { WORK_PAGE_BIO } from '@/lib/site';
import { StreamingBioText } from './StreamingBioText';

type WorkPageBioProps = {
  text?: string;
  onComplete?: () => void;
};

export function WorkPageBio({ text = WORK_PAGE_BIO, onComplete }: WorkPageBioProps) {
  const useLinkedBio = text === WORK_PAGE_BIO;

  return (
    <div className="work-page__bio">
      {useLinkedBio ? (
        <StreamingBioText onComplete={onComplete} />
      ) : (
        <StreamingText
          as="h1"
          className="work-page__bio-text"
          text={text}
          reveal
          onComplete={onComplete}
          aria-label={text}
        />
      )}
    </div>
  );
}
