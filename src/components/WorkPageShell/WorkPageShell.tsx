'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { WorkPageContent } from '@/components/WorkPageContent/WorkPageContent';
import { DISSOLVE_EASE, DISSOLVE_EXIT_DURATION } from '@/components/DissolveIn/DissolveIn';
import { useDissolveNavigate } from '@/hooks/useDissolveNavigate';
import type { ProjectCardSummary } from '@/lib/project-cards';

type WorkPageShellProps = {
  bioText: string;
  projects: ProjectCardSummary[];
};

export function WorkPageShell({ bioText, projects }: WorkPageShellProps) {
  const { navigate, isExiting } = useDissolveNavigate();
  const shouldReduce = useReducedMotion();

  return (
    <div className="work-page">
      <motion.div
        className="work-page__content"
        initial={false}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{
          duration: shouldReduce || !isExiting ? 0 : DISSOLVE_EXIT_DURATION,
          ease: DISSOLVE_EASE,
        }}
        style={{ pointerEvents: isExiting ? 'none' : undefined }}
      >
        <main id="main-content">
          <WorkPageContent
            bioText={bioText}
            projects={projects}
            onProjectNavigate={navigate}
          />
        </main>
      </motion.div>
    </div>
  );
}
