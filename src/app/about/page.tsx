import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { AboutAlbum } from '@/components/AboutAlbum/AboutAlbum';
import { AboutPageLayout } from '@/components/AboutPage/AboutPageLayout';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { PROFILE } from '@/data/profile';
import { buildProfilePageGraphFromProfile } from '@/lib/json-ld';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import {
  SITE_SOCIAL_NAV,
  WORK_PAGE_BIO_CURRENT,
  WORK_PAGE_BIO_LINKS,
} from '@/lib/site';
import './about.css';

const ABOUT_COMPANY_LINKS = [
  WORK_PAGE_BIO_CURRENT,
  ...WORK_PAGE_BIO_LINKS,
  { label: 'Cursor', href: 'https://cursor.com' },
];
const ABOUT_COMPANY_PATTERN = new RegExp(
  `(${ABOUT_COMPANY_LINKS.map((company) =>
    company.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  ).join('|')})`,
  'g',
);

function linkifyAboutCompanies(text: string): ReactNode[] {
  return text.split(ABOUT_COMPANY_PATTERN).map((part, index) => {
    const company = ABOUT_COMPANY_LINKS.find((item) => item.label === part);
    if (!company) return part;

    return (
      <a
        key={`${company.href}-${index}`}
        href={company.href}
        className="about-index__bio-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {company.label}
      </a>
    );
  });
}

const ABOUT_DESCRIPTION = PROFILE.aboutIntro.paragraphs[0];

export const metadata: Metadata = createMetadata({
  title: 'About',
  description: ABOUT_DESCRIPTION,
  ...canonicalPath('/about'),
  alternates: {
    canonical: '/about',
    types: {
      'text/markdown': [{ url: '/about', title: 'About as Markdown' }],
    },
  },
  openGraph: {
    title: 'About — Sebastian Mendo',
    description: ABOUT_DESCRIPTION,
  },
});

export default function AboutPage() {
  const { aboutIntro } = PROFILE;

  return (
    <div className="about-page">
      <StructuredData data={buildProfilePageGraphFromProfile()} />
      <AboutPageLayout>
        <div className="about-index">
          <div className="about-index__pane about-index__pane--rail" data-lenis-prevent>
            <header className="about-index__headline">
              <PageHeadline />
            </header>

            <div className="about-index__intro">
              <h1 className="about-index__heading">{aboutIntro.title}</h1>
              {aboutIntro.paragraphs.map((paragraph) => (
                <p key={paragraph} className="about-index__bio">
                  {linkifyAboutCompanies(paragraph)}
                </p>
              ))}
            </div>

            <nav className="about-index__links" aria-label="Page">
              <Link href="/" className="about-index__link">
                work
              </Link>
              {SITE_SOCIAL_NAV.map((link) => (
                <a key={link.href} href={link.href} className="about-index__link" rel="me">
                  {link.label}
                </a>
              ))}
              <ThemeToggle />
            </nav>
          </div>

          <div className="about-index__pane about-index__pane--album" data-lenis-prevent>
            <AboutAlbum />
          </div>
        </div>
      </AboutPageLayout>
    </div>
  );
}
