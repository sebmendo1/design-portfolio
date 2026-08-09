'use client';

import { useCallback, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { StreamingText } from '@/components/StreamingText/StreamingText';
import '@/components/StreamingText/StreamingText.css';

type AboutPageIntroProps = {
  title: string;
  paragraphs: readonly string[];
};

export function AboutPageIntro({ title, paragraphs }: AboutPageIntroProps) {
  const shouldReduce = useReducedMotion();
  const skipAnimation = shouldReduce ?? false;
  const totalStages = paragraphs.length + 1;
  const [stage, setStage] = useState(() => (skipAnimation ? totalStages : 0));

  const handleTitleComplete = useCallback(() => {
    if (skipAnimation) return;
    setStage(1);
  }, [skipAnimation]);

  const handleParagraphComplete = useCallback(
    (index: number) => {
      if (skipAnimation) return;
      setStage(index + 2);
    },
    [skipAnimation],
  );

  return (
    <>
      <StreamingText
        as="h1"
        className="about-page__heading"
        text={title}
        reveal={skipAnimation || stage >= 0}
        instant={skipAnimation}
        onComplete={handleTitleComplete}
        aria-label={title}
      />
      {paragraphs.map((paragraph, index) => (
        <StreamingText
          key={paragraph}
          as="p"
          className="about-page__bio"
          text={paragraph}
          reveal={skipAnimation || stage >= index + 1}
          instant={skipAnimation}
          onComplete={() => handleParagraphComplete(index)}
        />
      ))}
    </>
  );
}
