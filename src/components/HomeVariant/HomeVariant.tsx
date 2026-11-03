import Image from 'next/image';
import Link from 'next/link';
import { HomeProjectCard } from '@/components/HomeProjectCard/HomeProjectCard';
import { groupHomeSections } from '@/lib/home-sections';
import { resolveIndexPreviewProject } from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';
import {
  SITE_CONTACT_EMAIL,
  SITE_GITHUB_URL,
  SITE_LINKEDIN_URL,
  SITE_X_URL,
} from '@/lib/site';
import './HomeVariant.css';

/**
 * Roles as drawn on Figma frame Portfolio-Main (1080:39966).
 * This list does not match `PROFILE_ROLES` (Chase is current there; Writer and Shift appear there).
 */
const EXPERIENCE = [
  { company: 'ZoomInfo', role: 'Principal Product Designer', period: '2026 - Present' },
  { company: 'Chase AI', role: 'Senior Product Designer', period: '2025 - 2026' },
  { company: 'Chase Home Lending', role: 'Senior Product Designer', period: '2023-2025' },
  { company: 'Salesforce', role: 'Product Designer', period: '2021-2023' },
  { company: 'Chorus AI', role: 'Product Designer', period: '2020-2021' },
] as const;

/**
 * Instagram is in the frame. The site has no Instagram URL, so the label
 * renders without a destination until Sebastian supplies one.
 */
const SOCIAL: { label: string; href?: string }[] = [
  { label: 'X', href: SITE_X_URL },
  { label: 'Instagram' },
  { label: 'LinkedIn', href: SITE_LINKEDIN_URL },
  { label: 'GitHub', href: SITE_GITHUB_URL },
  { label: 'Email', href: `mailto:${SITE_CONTACT_EMAIL}` },
];

type HomeVariantProps = {
  projects: ProjectCardSummary[];
};

export function HomeVariant({ projects }: HomeVariantProps) {
  const cards = groupHomeSections().flatMap((section) =>
    section.items.map((entry) => ({
      entry,
      logo: section.logo,
      project: resolveIndexPreviewProject(entry, projects),
    })),
  );

  return (
    <div className="home-variant">
      <header className="home-variant__header">
        <div className="home-variant__bar">
          <Link href="/" className="home-variant__brand" aria-label="SebMendoDesign home">
            <span className="home-variant__avatar">
              <Image
                src="/assets/nav-avatar.png"
                alt=""
                width={36}
                height={36}
                priority
                className="home-variant__avatar-img"
              />
            </span>
            <span className="home-variant__name">SebMendoDesign</span>
          </Link>
          <Link href="/contact" className="home-variant__contact">
            Contact me
          </Link>
        </div>
      </header>

      <main id="main-content">
        <section className="home-variant__intro" aria-label="Introduction">
          <p className="home-variant__lede">
            Sebastian Mendo designs and builds agentic experiences across tech and finance.
          </p>
        </section>

        <section className="home-variant__projects" aria-labelledby="home-projects-heading">
          <h2 id="home-projects-heading" className="sr-only">
            Projects
          </h2>
          <div className="home-variant__rail" tabIndex={0}>
            {cards.map((card, index) => (
              <HomeProjectCard
                key={card.entry.id}
                entry={card.entry}
                project={card.project}
                logo={card.logo}
                priority={index < 3}
              />
            ))}
          </div>
        </section>

        <section className="home-variant__experience" aria-labelledby="home-experience-heading">
          <div className="home-variant__column">
            <h2 id="home-experience-heading" className="sr-only">
              Experience
            </h2>
            <ul className="home-variant__roles">
              {EXPERIENCE.map((item) => (
                <li key={item.company} className="home-variant__role">
                  <div className="home-variant__role-copy">
                    <p className="home-variant__company">{item.company}</p>
                    <p className="home-variant__role-title">{item.role}</p>
                  </div>
                  <p className="home-variant__period">{item.period}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="home-variant__footer">
          <nav className="home-variant__social" aria-label="Social">
            {SOCIAL.map((link) =>
              link.href ? (
                <a key={link.label} href={link.href} className="home-variant__social-link" rel="me">
                  {link.label}
                </a>
              ) : (
                <span key={link.label} className="home-variant__social-link">
                  {link.label}
                </span>
              ),
            )}
          </nav>
          <div className="home-variant__wordmark-slot">
            <p className="home-variant__wordmark" aria-hidden="true">
              SebMendoDesign
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
