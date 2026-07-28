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

type ProjectRevealGridProps = {
  projects: ProjectCardSummary[];
  skipAnimation: boolean;
  onProjectNavigate?: (href: string) => void;
};

function ProjectRevealGrid({
  projects,
  skipAnimation,
  onProjectNavigate,
}: ProjectRevealGridProps) {
  const [revealedCount, setRevealedCount] = useState(() =>
    skipAnimation ? projects.length : 0,
  );

  useEffect(() => {
    if (skipAnimation) return;

    let count = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      count += 1;
      setRevealedCount(count);
      if (count >= projects.length && intervalId) {
        clearInterval(intervalId);
      }
    };

    const startTimeoutId = setTimeout(() => {
      tick();
      if (projects.length > 1) {
        intervalId = setInterval(tick, WORD_INTERVAL_MS);
      }
    }, 0);

    return () => {
      clearTimeout(startTimeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [skipAnimation, projects.length]);

  const visibleCount = skipAnimation ? projects.length : revealedCount;

  return (
    <section className="work-page__grid" aria-label="Portfolio projects">
      {projects.slice(0, visibleCount).map((project, index) => (
        <AnimatedProjectCard
          key={project.id}
          project={project}
          index={index}
          streamIn
          onNavigate={onProjectNavigate}
        />
      ))}
    </section>
  );
}

export function WorkPageContent({ bioText, projects, onProjectNavigate }: WorkPageContentProps) {
  const shouldReduce = useReducedMotion();
  const [bioComplete, setBioComplete] = useState(false);
  const skipAnimation = shouldReduce ?? false;

  const handleBioComplete = useCallback(() => {
    setBioComplete(true);
  }, []);

  return (
    <>
      <WorkPageBio text={bioText} onComplete={handleBioComplete} />

      {bioComplete ? (
        <ProjectRevealGrid
          key={String(skipAnimation)}
          projects={projects}
          skipAnimation={skipAnimation}
          onProjectNavigate={onProjectNavigate}
        />
      ) : (
        <section className="work-page__grid" aria-label="Portfolio projects" />
      )}
    </>
  );
}
