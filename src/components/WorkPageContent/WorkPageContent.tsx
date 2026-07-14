'use client';

import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AnimatedProjectCard } from '@/components/AnimatedProjectCard/AnimatedProjectCard';
import { WorkPageBio } from '@/components/WorkPageBio/WorkPageBio';
import { WORD_INTERVAL_MS } from '@/components/StreamingText/StreamingText';
import type { ProjectCardSummary } from '@/lib/project-cards';

type WorkPageContentProps = {
  bioText: string;
  projects: ProjectCardSummary[];
  onProjectNavigate?: (href: string) => void;
};

export function WorkPageContent({ bioText, projects, onProjectNavigate }: WorkPageContentProps) {
  const shouldReduce = useReducedMotion();
  const [bioComplete, setBioComplete] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!bioComplete) {
      setRevealedCount(0);
      return;
    }

    if (shouldReduce) {
      setRevealedCount(projects.length);
      return;
    }

    let count = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      count += 1;
      setRevealedCount(count);
      if (count >= projects.length && intervalId) {
        clearInterval(intervalId);
      }
    };

    tick();
    if (projects.length > 1) {
      intervalId = setInterval(tick, WORD_INTERVAL_MS);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [bioComplete, projects.length, shouldReduce]);

  const handleBioComplete = useCallback(() => {
    setBioComplete(true);
  }, []);

  const visibleProjects = bioComplete ? projects.slice(0, revealedCount) : [];

  return (
    <>
      <WorkPageBio text={bioText} onComplete={handleBioComplete} />

      <section className="work-page__grid" aria-label="Portfolio projects">
        {visibleProjects.map((project, index) => (
          <AnimatedProjectCard
            key={project.id}
            project={project}
            index={index}
            streamIn
            onNavigate={onProjectNavigate}
          />
        ))}
      </section>
    </>
  );
}
