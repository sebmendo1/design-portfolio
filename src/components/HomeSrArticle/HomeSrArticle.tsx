import type { PortfolioExport } from '@/lib/content-export';
import { buildHomeCorpus } from '@/lib/page-markdown';
import '@/components/CaseStudySrArticle/CaseStudySrArticle.css';

type HomeSrArticleProps = {
  data: PortfolioExport;
};

/**
 * Server-rendered homepage corpus for crawlers and LLMs that fetch HTML.
 * Visually hidden (not display:none / aria-hidden) so text stays in the DOM.
 */
export function HomeSrArticle({ data }: HomeSrArticleProps) {
  const corpus = buildHomeCorpus(data);

  return (
    <article
      className="sr-corpus case-study-sr-corpus"
      itemScope
      itemType="https://schema.org/ProfilePage"
      data-machine-readable="true"
    >
      <h1 itemProp="name">{corpus.title}</h1>
      <p itemProp="description">{corpus.lede}</p>
      {corpus.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {corpus.sections.map((section) => (
        <section key={section.id}>
          <h2>{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.items?.length ? (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  );
}
