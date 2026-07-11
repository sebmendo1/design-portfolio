'use client';

import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AnimatedProjectCard } from '@/components/AnimatedProjectCard/AnimatedProjectCard';
import { WorkGallery } from '@/components/WorkGallery/WorkGallery';
import { WorkPageBio } from '@/components/WorkPageBio/WorkPageBio';
import type { Project } from '@/data/projects';

const GALLERY_QUERY = '(max-width: 768px)';

type WorkPageContentProps = {
  bioText: string;
  projects: Project[];
  onProjectNavigate?: (href: string) => void;
};

export function WorkPageContent({ bioText, projects, onProjectNavigate }: WorkPageContentProps) {
  const shouldReduce = useReducedMotion();
  const [cardsReady, setCardsReady] = useState(shouldReduce ?? false);
  const [useGallery, setUseGallery] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(GALLERY_QUERY);

    const updateMode = () => {
      setUseGallery(mediaQuery.matches && !shouldReduce);
    };

    updateMode();
    mediaQuery.addEventListener('change', updateMode);
    return () => mediaQuery.removeEventListener('change', updateMode);
  }, [shouldReduce]);

  const handleBioComplete = useCallback(() => {
    setCardsReady(true);
  }, []);

  if (useGallery) {
    return (
      <WorkGallery
        bioText={bioText}
        projects={projects}
        onProjectNavigate={onProjectNavigate}
      />
    );
  }

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
