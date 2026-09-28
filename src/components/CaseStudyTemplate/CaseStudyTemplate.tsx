'use client';

import { useCallback, type MouseEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CaseyActions } from '@/components/CaseyActions/CaseyActions';
import { HomeMenu, HomeNavList, HomePageLinks } from '@/components/HomeNav/HomeNav';
import { HomeLogo } from '@/components/HomeProjectCard/HomeProjectCard';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { CASE_STUDY_SECTIONS, type CaseStudy } from '@/data/caseStudies/types';
import { useDissolveNavigate } from '@/hooks/useDissolveNavigate';
import { useSectionSpy } from '@/hooks/useSectionSpy';
import { findHomeSection } from '@/lib/home-sections';
import { CaseStudyFigureView } from './CaseStudyMedia';
import '@/components/HomeFeed/HomeFeed.css';
import './CaseStudyTemplate.css';

type CaseStudyTemplateProps = {
  study: CaseStudy;
  next?: Pick<CaseStudy, 'slug' | 'title' | 'summary' | 'section'>;
};

const SECTION_IDS = CASE_STUDY_SECTIONS.map((section) => section.id);

const META_FIELDS = [
  ['role', 'Role'],
  ['team', 'Team'],
  ['timeline', 'Timeline'],
  ['platform', 'Platform'],
  ['impact', 'Impact'],
] as const;

const VERDICT_LABELS = {
  shipped: 'Shipped',
  evolved: 'Evolved',
  dropped: 'Dropped',
} as const;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Section({
  id,
  eyebrow,
  heading,
  children,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="study-section" aria-labelledby={`${id}-heading`} tabIndex={-1}>
      <header className="study-section__header">
        <p className="study-eyebrow">{eyebrow}</p>
        <h2 id={`${id}-heading`} className="study-heading">
          {heading}
        </h2>
      </header>
      {children}
    </section>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="study-prose">
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

export function CaseStudyTemplate({ study, next }: CaseStudyTemplateProps) {
  const { navigate, motionProps } = useDissolveNavigate();
  const { activeId, lock } = useSectionSpy(SECTION_IDS);
  const logo = findHomeSection(study.section)?.logo;
  const nextLogo = next ? findHomeSection(next.section)?.logo : undefined;

  const scrollToSection = useCallback(
    (id: string) => {
      const node = document.getElementById(id);
      if (!node) return;
      lock(id);
      node.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      node.focus({ preventScroll: true });
      window.history.replaceState(null, '', `#${id}`);
    },
    [lock],
  );

  function handleInternalClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(href);
  }

  const sections = CASE_STUDY_SECTIONS.map(({ id, label }) => ({ id, label }));

  return (
    <motion.div className="study" {...motionProps}>
      <div className="home-feed study-layout">
        <aside className="home-feed__sidebar study-sidebar">
          <header className="home-feed__header">
            <PageHeadline className="page-headline--home home-feed__headline" />
            <div className="home-feed__menu">
              <HomeMenu
                sections={sections}
                activeId={activeId}
                onSelect={scrollToSection}
                label="On this page"
              />
            </div>
          </header>
          <div className="study-sidebar__project">
            <Link href="/" className="study-back" onClick={(event) => handleInternalClick(event, '/')}>
              <span aria-hidden="true">←</span> All projects
            </Link>
            <div className="study-identity">
              {logo ? <HomeLogo logo={logo} /> : null}
              <div className="study-identity__text">
                <p className="study-identity__company">{study.company}</p>
                <p className="study-identity__year">{study.year}</p>
              </div>
            </div>
          </div>
          <nav aria-label="On this page" className="home-feed__nav study-sidebar__nav">
            <p className="home-nav__label">On this page</p>
            <div className="study-nav">
              <HomeNavList sections={sections} activeId={activeId} onSelect={scrollToSection} />
            </div>
          </nav>
          <HomePageLinks className="home-feed__links" />
        </aside>

        <main id="main-content" className="home-feed__main study-main">
          <article className="study-article" aria-labelledby="study-title">
            <section id="overview" className="study-hero" aria-labelledby="study-title" tabIndex={-1}>
              <div className="study-hero__intro">
                <Link
                  href="/"
                  className="study-back study-back--inline"
                  onClick={(event) => handleInternalClick(event, '/')}
                >
                  <span aria-hidden="true">←</span> All projects
                </Link>
                <p className="study-eyebrow">
                  {study.company} · {study.year}
                </p>
                <h1 id="study-title" className="study-title">
                  {study.title}
                </h1>
                <p className="study-summary">{study.summary}</p>
              </div>

              <CaseStudyFigureView figure={study.hero} logo={logo} priority />

              <dl className="study-meta">
                {META_FIELDS.map(([key, label]) => (
                  <div key={key} className={`study-meta__item study-meta__item--${key}`}>
                    <dt>{label}</dt>
                    <dd>{study.meta[key]}</dd>
                  </div>
                ))}
              </dl>

              {study.caseyActions || study.links?.length ? (
                <div className="study-actions">
                  {study.caseyActions ? <CaseyActions /> : null}
                  {study.links?.map((link) => {
                    const external = /^https?:\/\//.test(link.href);
                    return external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        className="study-link-pill"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="study-link-pill"
                        onClick={(event) => handleInternalClick(event, link.href)}
                      >
                        {link.label} <span aria-hidden="true">→</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}

              <div className="study-tldr">
                <p className="study-eyebrow">TL;DR</p>
                <h2 id="tldr-heading" className="study-heading">
                  {study.tldr.heading}
                </h2>
                <p className="study-lede">{study.tldr.body}</p>
                <ul className="study-outcomes">
                  {study.tldr.outcomes.map((outcome) => (
                    <li key={outcome.label} className="study-outcome">
                      <span className="study-outcome__value">{outcome.value}</span>
                      <span className="study-outcome__label">{outcome.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <Section id="problem" eyebrow="Problem" heading={study.problem.heading}>
              <Paragraphs items={study.problem.body} />
              {study.problem.quote ? (
                <blockquote className="study-quote">
                  <p>{study.problem.quote}</p>
                </blockquote>
              ) : null}
            </Section>

            <Section id="constraints" eyebrow="Constraints" heading={study.constraints.heading}>
              <ol className="study-constraints">
                {study.constraints.items.map((item, index) => (
                  <li key={item.title} className="study-constraint">
                    <span className="study-constraint__index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="study-subheading">{item.title}</h3>
                      <p className="study-body">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="decisions" eyebrow="Process and key decisions" heading={study.decisions.heading}>
              {study.decisions.intro ? <p className="study-lede">{study.decisions.intro}</p> : null}
              <ol className="study-decisions">
                {study.decisions.items.map((item, index) => (
                  <li key={item.title} className="study-decision">
                    <div className="study-decision__card">
                      <p className="study-decision__index">Decision {String(index + 1).padStart(2, '0')}</p>
                      <h3 className="study-decision__title">{item.title}</h3>
                      <p className="study-body">{item.body}</p>
                      <dl className="study-decision__why">
                        <div>
                          <dt>Trade-off</dt>
                          <dd>{item.tradeoff}</dd>
                        </div>
                        <div>
                          <dt>Why</dt>
                          <dd>{item.rationale}</dd>
                        </div>
                      </dl>
                    </div>
                    {item.figure ? <CaseStudyFigureView figure={item.figure} logo={logo} /> : null}
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="explorations" eyebrow="Design explorations" heading={study.explorations.heading}>
              {study.explorations.intro ? <p className="study-lede">{study.explorations.intro}</p> : null}
              {study.explorations.figure ? (
                <CaseStudyFigureView figure={study.explorations.figure} logo={logo} />
              ) : null}
              <ul className="study-explorations">
                {study.explorations.items.map((item) => (
                  <li key={item.title} className="study-exploration">
                    <div className="study-exploration__head">
                      <h3 className="study-subheading">{item.title}</h3>
                      <span className={`study-verdict study-verdict--${item.verdict}`}>
                        {VERDICT_LABELS[item.verdict]}
                      </span>
                    </div>
                    <p className="study-body">{item.body}</p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="final-design" eyebrow="Final design" heading={study.finalDesign.heading}>
              <Paragraphs items={study.finalDesign.body} />
              <div className="study-figures">
                {study.finalDesign.figures.map((figure, index) => (
                  <CaseStudyFigureView key={index} figure={figure} logo={logo} />
                ))}
              </div>
            </Section>

            <Section id="results" eyebrow="Results" heading={study.results.heading}>
              <ul className="study-metrics">
                {study.results.metrics.map((metric) => (
                  <li key={metric.label} className="study-metric">
                    <span className="study-metric__value">{metric.value}</span>
                    <span className="study-metric__label">{metric.label}</span>
                    {metric.note ? <span className="study-metric__note">{metric.note}</span> : null}
                  </li>
                ))}
              </ul>
              <Paragraphs items={study.results.body} />
            </Section>

            <Section id="reflection" eyebrow="Reflection" heading={study.reflection.heading}>
              <Paragraphs items={study.reflection.body} />
              <div className="study-next-steps">
                <h3 className="study-subheading">What’s next</h3>
                <ul>
                  {study.reflection.next.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Section>
          </article>

          {next ? (
            <nav aria-label="Next case study" className="study-next">
              <p className="study-eyebrow">Next case study</p>
              <Link
                href={`/work/${next.slug}`}
                className="study-next__link"
                onClick={(event) => handleInternalClick(event, `/work/${next.slug}`)}
              >
                {nextLogo ? <HomeLogo logo={nextLogo} /> : null}
                <span className="study-next__text">
                  <span className="study-next__title">{next.title}</span>
                  <span className="study-next__summary">{next.summary}</span>
                </span>
                <span className="study-next__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </nav>
          ) : null}

          <HomePageLinks className="study-footer-links" />
        </main>
      </div>
    </motion.div>
  );
}
