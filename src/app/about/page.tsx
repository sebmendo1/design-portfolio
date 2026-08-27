import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutPageLayout } from '@/components/AboutPage/AboutPageLayout';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { WorkTimeline } from '@/components/WorkTimeline/WorkTimeline';
import { ContactCTA } from '@/components/ContactCTA/ContactCTA';
import { PROFILE } from '@/data/profile';
import { buildProfilePageGraphFromProfile } from '@/lib/json-ld';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import { SITE_LINKEDIN_URL } from '@/lib/site';
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
        <div className="about-page__content">
          <h1 className="about-page__heading">{aboutIntro.title}</h1>
          {aboutIntro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="about-page__bio">
              {paragraph}
            </p>
          ))}

          <p className="about-page__linkedin">
            <Link href={SITE_LINKEDIN_URL} rel="me">
              LinkedIn
            </Link>
          </p>
        </div>

        <WorkTimeline />
        <ContactCTA />
      </AboutPageLayout>
    </div>
  );
}
