import type { ExportedProject } from '@/lib/content-export';
import './CaseStudySrArticle.css';

type CaseStudySrArticleProps = {
  project: ExportedProject;
};

/**
 * Server-rendered narrative corpus for crawlers and LLMs that fetch HTML.
 * Visually hidden (not display:none / aria-hidden) so text stays in the DOM.
 */
export function CaseStudySrArticle({ project }: CaseStudySrArticleProps) {
  const lead = project.tagline ?? project.description;

  return (
    <article
      className="case-study-sr-corpus"
      itemScope
      itemType="https://schema.org/CreativeWork"
      data-machine-readable="true"
    >
      <h1 itemProp="name">{project.title}</h1>
      {lead && <p itemProp="abstract">{lead}</p>}
      {project.company && (
        <p>
          <span itemProp="creator">{project.company}</span>
          {project.role ? ` · ${project.role}` : ''}
          {project.year ? ` · ${project.year}` : ''}
        </p>
      )}
      {project.impact?.length ? (
        <section>
          <h2>Impact</h2>
          <ul>
            {project.impact.map((item) => (
              <li key={`${item.metric}-${item.value}`}>
                <strong>{item.metric}</strong>: {item.value} ({item.context})
              </li>
            ))}
          </ul>
        </section>
      ) : null}
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
