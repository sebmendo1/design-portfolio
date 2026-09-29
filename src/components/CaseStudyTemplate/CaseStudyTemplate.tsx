'use client';

import { Fragment, useCallback, useMemo, type MouseEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CaseyActions } from '@/components/CaseyActions/CaseyActions';
import { HomeMenu, HomePageLinks } from '@/components/HomeNav/HomeNav';
import { HomeLogo } from '@/components/HomeProjectCard/HomeProjectCard';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { StudyToc } from '@/components/StudyToc/StudyToc';
import {
  getCaseStudySections,
  type CaseStudy,
  type CaseStudyMetric,
  type CaseStudySectionId,
} from '@/data/caseStudies/types';
import { useDissolveNavigate } from '@/hooks/useDissolveNavigate';
import { useSectionSpy } from '@/hooks/useSectionSpy';
import { findHomeSection } from '@/lib/home-sections';
import { getReadMinutes } from '@/lib/case-study-content';
import { CaseStudyFigureView } from './CaseStudyMedia';
import '@/components/HomeFeed/HomeFeed.css';
import './CaseStudyTemplate.css';

type CaseStudyTemplateProps = {
  study: CaseStudy;
  next?: Pick<CaseStudy, 'slug' | 'title' | 'summary' | 'section'>;
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Renders `**bold**` spans from lede copy. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        const bold = part.match(/^\*\*(.+)\*\*$/);
        if (bold) {
          return <strong key={index}>{bold[1]}</strong>;
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

function Section({
  id,
  heading,
  children,
}: {
  id: CaseStudySectionId;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="study-section load-reveal" aria-labelledby={`${id}-heading`} tabIndex={-1}>
      <h2 id={`${id}-heading`} className="study-heading">
        {heading}
      </h2>
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

export function CaseStudyTemplate({ study, next }: CaseStudyTemplateProps) {
  const { navigate, motionProps } = useDissolveNavigate();
  const sections = useMemo(() => getCaseStudySections(study), [study]);
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const { activeId, lock } = useSectionSpy(sectionIds);
  const logo = findHomeSection(study.section)?.logo;
  const nextLogo = next ? findHomeSection(next.section)?.logo : undefined;
  const readMinutes = getReadMinutes(study);

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
          <header className="home-feed__header load-reveal">
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
          <nav aria-label="On this page" className="home-feed__nav study-sidebar__nav load-reveal">
            <p className="home-nav__label">On this page</p>
            <div className="study-sidebar__toc">
              <StudyToc sections={sections} activeId={activeId} onSelect={scrollToSection} />
            </div>
          </nav>
          <HomePageLinks className="home-feed__links load-reveal" />
        </aside>

        <main id="main-content" className="home-feed__main study-main">
          <article className="study-article" aria-labelledby="study-title">
            <section id="overview" className="study-hero" aria-labelledby="study-title" tabIndex={-1}>
              <div className="study-hero__intro">
                <nav aria-label="Breadcrumb" className="study-crumbs load-reveal">
                  <ol className="study-crumbs__list">
                    <li className="study-crumbs__item">
                      <Link
                        href="/"
                        className="study-back"
                        onClick={(event) => handleInternalClick(event, '/')}
                      >
                        <span aria-hidden="true">←</span>
                        <span className="sr-only">All projects</span>
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
                <h1 id="study-title" className="study-title load-reveal">
                  {study.title}
                </h1>
                <p className="study-byline load-reveal">
                  <span>{study.meta.role}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{study.meta.timeline}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{study.meta.status}</span>
                  <span aria-hidden="true"> · </span>
                  <span>
                    {readMinutes} min read
                  </span>
                </p>
                <p className="study-byline study-byline--secondary load-reveal">
                  <span>{study.meta.team}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{study.meta.platform}</span>
                </p>
              </div>

              <CaseStudyFigureView
                figure={study.hero}
                logo={logo}
                priority
                className="load-reveal load-reveal--media"
              />

              {study.caseyActions || study.links?.length ? (
                <div className="study-actions load-reveal">
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

              <div className="study-lede load-reveal">
                {study.lede.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </section>

            <Section id="problem" heading={study.problem.heading}>
              <Paragraphs items={study.problem.body} />
            </Section>

            <Section id="why-it-matters" heading={study.whyItMatters.heading}>
              <Paragraphs items={study.whyItMatters.body} />
            </Section>

            <Section id="decisions" heading={study.decisions.heading}>
              <ol className="study-decisions">
                {study.decisions.items.map((item) => (
                  <li key={item.title} className="study-decision">
                    <h3 className="study-decision__title">{item.title}</h3>
                    <p className="study-body">{item.body}</p>
                    <p className="study-decision__aside">
                      <span className="study-decision__aside-label">Instead of</span> {item.alternative}
                    </p>
                    <p className="study-decision__aside">
                      <span className="study-decision__aside-label">Trade-off</span> {item.tradeoff}
                    </p>
                    {item.figure ? <CaseStudyFigureView figure={item.figure} logo={logo} /> : null}
                  </li>
                ))}
              </ol>
            </Section>

            {study.howItWorks ? (
              <Section id="how-it-works" heading={study.howItWorks.heading}>
                {study.howItWorks.intro ? <p className="study-body">{study.howItWorks.intro}</p> : null}
                {study.howItWorks.states?.length ? (
                  <ol className="study-states">
                    {study.howItWorks.states.map((item) => (
                      <li key={item.state} className="study-state">
                        <span className="study-state__name">{item.state}</span>
                        <span className="study-state__behavior">{item.behavior}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {study.howItWorks.figures?.length ? (
                  <div className="study-figures">
                    {study.howItWorks.figures.map((figure, index) => (
                      <CaseStudyFigureView key={index} figure={figure} logo={logo} />
                    ))}
                  </div>
                ) : null}
              </Section>
            ) : null}

            <Section id="impact" heading={study.impact.heading}>
              {study.impact.metrics.length ? (
                <ul className="study-metrics">
                  {study.impact.metrics.map((metric) => (
                    <li key={metric.label} className="study-metric">
                      <MetricBody metric={metric} />
                    </li>
                  ))}
                </ul>
              ) : null}
              <Paragraphs items={study.impact.body} />
            </Section>

            {study.reflection ? (
              <Section id="reflection" heading={study.reflection.heading}>
                <Paragraphs items={study.reflection.body} />
              </Section>
            ) : null}
          </article>

          {next ? (
            <nav aria-label="Next case study" className="study-next load-reveal">
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

          <HomePageLinks className="study-footer-links load-reveal" />
        </main>
      </div>
    </motion.div>
  );
}
