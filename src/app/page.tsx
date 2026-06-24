import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation/Navigation';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import { getMergedProjects } from '@/lib/cms-data';
import { SITE_DESCRIPTION } from '@/lib/site';
import './work-page.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Work',
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'Work — Sebastian Mendo',
    description: SITE_DESCRIPTION,
  },
};

export default async function WorkPage() {
  const projects = await getMergedProjects();

  return (
    <div className="work-page">
      <Navigation />

      <main id="main-content">
        <div className="work-page__bio">
          <h1 className="work-page__bio-text">
            Sebastian Mendo is a Senior Product Designer specialized in building
            AI-first digital products. Currently designing core agentic experiences at
            JPMorgan Chase. Previously at Salesforce and Writer AI.
          </h1>
        </div>

        <section className="work-page__grid" aria-label="Portfolio projects">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </main>
    </div>
  );
}
