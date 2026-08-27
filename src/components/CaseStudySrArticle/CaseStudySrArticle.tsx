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
      data-project-slug={project.slug}
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
              <li
                key={item.id ?? `${item.metric}-${item.value}`}
                data-impact-id={item.id}
                itemScope
                itemType="https://schema.org/PropertyValue"
                itemProp="additionalProperty"
              >
                {item.id ? <meta itemProp="identifier" content={item.id} /> : null}
                <strong itemProp="name">{item.metric}</strong>:{' '}
                <span itemProp="value">{item.value}</span> ({item.context}
                {item.confidence ? `; confidence: ${item.confidence}` : ''})
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
