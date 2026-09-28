'use client';

import { useCallback, useMemo, type MouseEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CaseyActions } from '@/components/CaseyActions/CaseyActions';
import { HomeMenu, HomePageLinks } from '@/components/HomeNav/HomeNav';
import { HomeLogo } from '@/components/HomeProjectCard/HomeProjectCard';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { StudyToc } from '@/components/StudyToc/StudyToc';
import {
  getCaseStudySections,
  getTldrText,
  type CaseStudy,
  type CaseStudyMetric,
} from '@/data/caseStudies/types';
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

const META_FIELDS = [
  ['role', 'Role'],
  ['team', 'Team'],
  ['timeline', 'Timeline'],
  ['platform', 'Platform'],
  ['status', 'Status'],
] as const;

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

function MetricBody({ metric }: { metric: CaseStudyMetric }) {
  return (
    <>
      <span className="study-metric__value">{metric.value}</span>
      <span className="study-metric__label">{metric.label}</span>
      {metric.context || metric.confidence ? (
        <span className="study-metric__note">
          {metric.context}
          {metric.context && metric.confidence ? ' · ' : null}
          {metric.confidence ? (
            <span className="study-metric__confidence">{metric.confidence}</span>
          ) : null}
        </span>
      ) : null}
    </>
  );
}

function KeyResult({ metric }: { metric: CaseStudyMetric }) {
  return (
    <p className="study-metric study-metric--key">
      <MetricBody metric={metric} />
    </p>
  );
}

export function CaseStudyTemplate({ study, next }: CaseStudyTemplateProps) {
  const { navigate, motionProps } = useDissolveNavigate();
  const sections = useMemo(() => getCaseStudySections(study), [study]);
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const { activeId, lock } = useSectionSpy(sectionIds);
  const logo = findHomeSection(study.section)?.logo;
  const nextLogo = next ? findHomeSection(next.section)?.logo : undefined;
  const tldr = getTldrText(study);

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
                variant="toc"
              />
            </div>
          </header>
          <section className="study-sidebar__tldr" aria-labelledby="study-tldr-sidebar">
            <h2 id="study-tldr-sidebar" className="home-nav__label">
              TL;DR
            </h2>
            <p className="study-sidebar__tldr-body">{tldr}</p>
          </section>
          <nav aria-label="On this page" className="home-feed__nav study-sidebar__nav">
            <p className="home-nav__label">On this page</p>
            <div className="study-sidebar__toc">
              <StudyToc sections={sections} activeId={activeId} onSelect={scrollToSection} />
            </div>
          </nav>
          <HomePageLinks className="home-feed__links" />
        </aside>

        <main id="main-content" className="home-feed__main study-main">
          <article className="study-article" aria-labelledby="study-title">
            <section id="overview" className="study-hero" aria-labelledby="study-title" tabIndex={-1}>
              <div className="study-hero__intro">
                <nav aria-label="Breadcrumb" className="study-crumbs">
                  <ol className="study-crumbs__list">
                    <li className="study-crumbs__item">
                      <Link
                        href="/"
                        className="study-back"
                        onClick={(event) => handleInternalClick(event, '/')}
                      >
                        <span aria-hidden="true">←</span> All projects
                      </Link>
                    </li>
                    <li className="study-crumbs__item study-crumbs__current" aria-current="page">
                      {logo ? <HomeLogo logo={logo} /> : null}
                      <span>
                        {study.company} · {study.year}
                      </span>
                    </li>
                  </ol>
                </nav>
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

              <div className={`study-tldr${study.tldr.keyResult ? '' : ' study-tldr--summary-only'}`}>
                {/* Phones hide the sidebar, so the TL;DR moves back into the column. */}
                <div className="study-tldr__summary">
                  <p className="study-eyebrow">TL;DR</p>
                  <p className="study-lede">{tldr}</p>
                </div>
                {study.tldr.keyResult ? <KeyResult metric={study.tldr.keyResult} /> : null}
              </div>
            </section>

            <Section id="context" eyebrow="Why it was hard" heading={study.context.heading}>
              <Paragraphs items={study.context.body} />
              {study.context.constraints?.length ? (
                <ul className="study-constraints" aria-label="Constraints">
                  {study.context.constraints.map((item) => (
                    <li key={item} className="study-constraint">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Section>

            <Section id="decisions" eyebrow="Key decisions" heading={study.decisions.heading}>
              <ol className="study-decisions">
                {study.decisions.items.map((item, index) => (
                  <li key={item.title} className="study-decision">
                    <div className="study-decision__card">
                      <p className="study-decision__index">
                        Decision {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className="study-decision__title">{item.title}</h3>
                      <p className="study-body">{item.body}</p>
                      <dl className="study-decision__why">
                        <div>
                          <dt>Instead of</dt>
                          <dd>{item.alternative}</dd>
                        </div>
                        <div>
                          <dt>Trade-off</dt>
                          <dd>{item.tradeoff}</dd>
                        </div>
                      </dl>
                    </div>
                    {item.figure ? <CaseStudyFigureView figure={item.figure} logo={logo} /> : null}
                  </li>
                ))}
              </ol>
            </Section>

            {study.behavior ? (
              <Section id="behavior" eyebrow="How it behaves" heading={study.behavior.heading}>
                {study.behavior.intro ? <p className="study-body">{study.behavior.intro}</p> : null}
                <ol className="study-states">
                  {study.behavior.states.map((item) => (
                    <li key={item.state} className="study-state">
                      <span className="study-state__name">{item.state}</span>
                      <span className="study-state__behavior">{item.behavior}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            ) : null}

            {study.shipped ? (
              <Section id="shipped" eyebrow="What shipped" heading={study.shipped.heading}>
                {study.shipped.body ? <p className="study-body">{study.shipped.body}</p> : null}
                <div className="study-figures">
                  {study.shipped.figures.map((figure, index) => (
                    <CaseStudyFigureView key={index} figure={figure} logo={logo} />
                  ))}
                </div>
              </Section>
            ) : null}

            <Section id="result" eyebrow="Result" heading={study.result.heading}>
              {study.result.metrics.length ? (
                <ul className="study-metrics">
                  {study.result.metrics.map((metric) => (
                    <li key={metric.label} className="study-metric">
                      <MetricBody metric={metric} />
                    </li>
                  ))}
                </ul>
              ) : null}
              <Paragraphs items={study.result.body} />
            </Section>

            {study.reflection ? (
              <Section id="reflection" eyebrow="Reflection" heading={study.reflection.heading}>
                <Paragraphs items={study.reflection.body} />
              </Section>
            ) : null}
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
