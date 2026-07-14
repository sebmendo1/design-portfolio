'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation/Navigation';
import { WorkPageContent } from '@/components/WorkPageContent/WorkPageContent';
import { useDissolveNavigate } from '@/hooks/useDissolveNavigate';
import type { ProjectCardSummary } from '@/lib/project-cards';

type WorkPageShellProps = {
  bioText: string;
  projects: ProjectCardSummary[];
};

export function WorkPageShell({ bioText, projects }: WorkPageShellProps) {
  const { navigate, motionProps } = useDissolveNavigate();

  return (
    <div className="work-page">
      <motion.div className="work-page__content" {...motionProps}>
        <Navigation />
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
