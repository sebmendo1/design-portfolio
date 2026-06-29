'use client';

import { useCallback, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AnimatedProjectCard } from '@/components/AnimatedProjectCard/AnimatedProjectCard';
import { WorkPageBio } from '@/components/WorkPageBio/WorkPageBio';
import type { Project } from '@/data/projects';

type WorkPageContentProps = {
  bioText: string;
  projects: Project[];
  onProjectNavigate?: (href: string) => void;
};

export function WorkPageContent({ bioText, projects, onProjectNavigate }: WorkPageContentProps) {
  const shouldReduce = useReducedMotion();
  const [cardsReady, setCardsReady] = useState(shouldReduce ?? false);

  const handleBioComplete = useCallback(() => {
    setCardsReady(true);
  }, []);

  return (
    <>
      <WorkPageBio text={bioText} onComplete={handleBioComplete} />

      <section className="work-page__grid" aria-label="Portfolio projects">
        {projects.map((project, index) => (
          <AnimatedProjectCard
            key={project.id}
            project={project}
            index={index}
            reveal={cardsReady}
            onNavigate={onProjectNavigate}
          />
        ))}
      </section>
    </>
  );
}
