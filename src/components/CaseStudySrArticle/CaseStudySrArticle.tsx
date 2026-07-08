import type { ExportedProject } from '@/lib/content-export';

type CaseStudySrArticleProps = {
  project: ExportedProject;
};

export function CaseStudySrArticle({ project }: CaseStudySrArticleProps) {
  const lead = project.tagline ?? project.description;

  return (
    <article
      className="sr-only"
      itemScope
      itemType="https://schema.org/CreativeWork"
      aria-hidden="true"
    >
      <h1 itemProp="name">{project.title}</h1>
      {lead && <p itemProp="abstract">{lead}</p>}
      {project.sections.map((section) => {
        const heading = section.label
          ? `${section.label}: ${section.headline}`
          : section.headline;
        return (
          <section key={section.id}>
            <h2>{heading}</h2>
            {section.body && <p>{section.body}</p>}
          </section>
        );
      })}
    </article>
  );
}
