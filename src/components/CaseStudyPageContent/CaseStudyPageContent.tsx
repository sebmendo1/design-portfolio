'use client';

import { CaseStudyScrolly } from '@/components/CaseStudyScrolly/CaseStudyScrolly';
import type { CaseStudyConfig } from '@/components/CaseStudyScrolly/types';
import { CaseyActions } from '@/components/CaseyActions/CaseyActions';
import { getCompanyLogo } from '@/data/companyLogos';
import type { Project } from '@/data/projects';

type CaseStudyPageContentProps = {
  project: Project;
  config: CaseStudyConfig;
};

export function CaseStudyPageContent({ project, config }: CaseStudyPageContentProps) {
  return (
    <div className="case-study">
      <div className="case-study__content">
        <main id="main-content">
          <CaseStudyScrolly
            config={config}
            company={project.company}
            companyLogo={getCompanyLogo(project.company)}
            slot={project.slug === 'casey-ai' ? <CaseyActions /> : undefined}
          />
        </main>
      </div>
    </div>
  );
}
