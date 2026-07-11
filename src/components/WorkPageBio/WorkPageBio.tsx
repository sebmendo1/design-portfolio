'use client';

import { StreamingText } from '@/components/StreamingText/StreamingText';

type WorkPageBioProps = {
  text: string;
  onComplete?: () => void;
};

export function WorkPageBio({ text, onComplete }: WorkPageBioProps) {
  return (
    <div className="work-page__bio">
      <StreamingText
        as="h1"
        className="work-page__bio-text"
        text={text}
        reveal
        onComplete={onComplete}
        aria-label={text}
      />
    </div>
  );
}
