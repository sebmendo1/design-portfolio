'use client';

import { motion } from 'framer-motion';
import { CaseStudyScrolly } from '@/components/CaseStudyScrolly/CaseStudyScrolly';
import type { CaseStudyConfig } from '@/components/CaseStudyScrolly/types';
import { CaseyActions } from '@/components/CaseyActions/CaseyActions';
import { useDissolveNavigate } from '@/hooks/useDissolveNavigate';
import { getCompanyLogo } from '@/data/companyLogos';
import type { Project } from '@/data/projects';

type CaseStudyPageContentProps = {
  project: Project;
  config: CaseStudyConfig;
};

export function CaseStudyPageContent({ project, config }: CaseStudyPageContentProps) {
  const { navigate, motionProps } = useDissolveNavigate();

  return (
    <div className="case-study">
      <motion.div className="case-study__content" {...motionProps}>
        <main id="main-content">
          <CaseStudyScrolly
            config={config}
            company={project.company}
            companyLogo={getCompanyLogo(project.company)}
            onHomeNavigate={navigate}
            slot={project.slug === 'casey-ai' ? <CaseyActions /> : undefined}
          />
        </main>
      </motion.div>
    </div>
  );
}
