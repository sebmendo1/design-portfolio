import { WorkPageContent } from '@/components/WorkPageContent/WorkPageContent';
import type { ProjectCardSummary } from '@/lib/project-cards';

type WorkPageShellProps = {
  bioText: string;
  projects: ProjectCardSummary[];
};

export function WorkPageShell({ bioText, projects }: WorkPageShellProps) {
  return (
    <div className="work-page">
      <div className="work-page__content">
        <main id="main-content">
          <WorkPageContent bioText={bioText} projects={projects} />
        </main>
      </div>
    </div>
  );
}
