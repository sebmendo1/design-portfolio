'use client';

import { useReducedMotion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal/ScrollReveal';
import { StreamingText } from '@/components/StreamingText/StreamingText';
import '@/components/StreamingText/StreamingText.css';

type AboutPageIntroProps = {
  title: string;
  paragraphs: readonly string[];
};

export function AboutPageIntro({ title, paragraphs }: AboutPageIntroProps) {
  const shouldReduce = useReducedMotion();

  return (
    <>
      <StreamingText
        as="h1"
        className="about-page__heading"
        text={title}
        reveal
        instant={shouldReduce ?? false}
        aria-label={title}
      />
      {paragraphs.map((paragraph) => (
        <ScrollReveal key={paragraph}>
          {(revealed) => (
            <StreamingText
              as="p"
              className="about-page__bio"
              text={paragraph}
              reveal={revealed}
              instant={shouldReduce ?? false}
            />
          )}
        </ScrollReveal>
      ))}
    </>
  );
}
