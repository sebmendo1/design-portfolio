import { Navigation } from '@/components/Navigation/Navigation';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import { projects } from '@/data/projects';
import './work-page.css';

export default function WorkPage() {
  return (
    <div className="work-page">
      <Navigation />

      <section className="work-page__bio" aria-label="Bio">
        <p className="work-page__bio-text">
          Sebastian Mendo is a Senior Product Designer building agentic
          experiences across tech and finance. He&rsquo;s currently designing
          core agentic banking flows for JPMorgan Chase.
        </p>
      </section>

      <main className="work-page__grid" aria-label="Portfolio projects">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </main>
    </div>
  );
}
