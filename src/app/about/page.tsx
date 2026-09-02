import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutPageLayout } from '@/components/AboutPage/AboutPageLayout';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { WorkTimeline } from '@/components/WorkTimeline/WorkTimeline';
import { PROFILE } from '@/data/profile';
import { buildProfilePageGraphFromProfile } from '@/lib/json-ld';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import { SITE_SOCIAL_NAV } from '@/lib/site';
import './about.css';

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
          <div className="about-index__pane about-index__pane--rail">
            <header className="about-index__headline">
              <PageHeadline />
            </header>

            <div className="about-index__intro">
              <h1 className="about-index__heading">{aboutIntro.title}</h1>
              {aboutIntro.paragraphs.map((paragraph) => (
                <p key={paragraph} className="about-index__bio">
                  {paragraph}
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

          <div className="about-index__pane about-index__pane--timeline">
            <WorkTimeline />
          </div>
        </div>
      </AboutPageLayout>
    </div>
  );
}
