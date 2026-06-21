import { Navigation } from '@/components/Navigation/Navigation';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import { projects } from '@/data/projects';
import './work-page.css';

export default function WorkPage() {
  return (
    <div className="work-page">
      <Navigation />

      <div className="work-page__bio">
        <p className="work-page__bio-text">
          Sebastian Mendo is a Senior Product Designer specialized in building
          AI-first digital products. Currently designing core agentic experiences at
          JPMorgan Chase. Previously at Salesforce and Writer AI.
        </p>
      </div>

      <main className="work-page__grid" aria-label="Portfolio projects">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </main>
    </div>
  );
}
