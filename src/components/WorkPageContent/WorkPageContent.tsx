'use client';

import { useCallback, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import { ScrollReveal } from '@/components/ScrollReveal/ScrollReveal';
import { WorkPageBio } from '@/components/WorkPageBio/WorkPageBio';
import type { ProjectCardSummary } from '@/lib/project-cards';

type WorkPageContentProps = {
  bioText: string;
  projects: ProjectCardSummary[];
  onProjectNavigate?: (href: string) => void;
};

type ScrollProjectCardProps = {
  project: ProjectCardSummary;
  skipAnimation: boolean;
  onProjectNavigate?: (href: string) => void;
};

function ScrollProjectCard({
  project,
  skipAnimation,
  onProjectNavigate,
}: ScrollProjectCardProps) {
  return (
    <ScrollReveal className="work-page__card-reveal">
      {(revealed) => (
        <ProjectCard
          project={project}
          streamMeta
          metaReveal={skipAnimation || revealed}
          onNavigate={onProjectNavigate}
        />
      )}
    </ScrollReveal>
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
        <section className="work-page__grid" aria-label="Portfolio projects">
          {projects.map((project) => (
            <ScrollProjectCard
              key={project.id}
              project={project}
              skipAnimation={skipAnimation}
              onProjectNavigate={onProjectNavigate}
            />
          ))}
        </section>
      ) : (
        <section className="work-page__grid" aria-label="Portfolio projects" />
      )}
    </>
  );
}
