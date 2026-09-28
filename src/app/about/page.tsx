import type { Metadata } from 'next';
import { AboutFeed } from '@/components/AboutFeed/AboutFeed';
import { AboutPageLayout } from '@/components/AboutPage/AboutPageLayout';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { PROFILE } from '@/data/profile';
import { buildProfilePageGraphFromProfile } from '@/lib/json-ld';
import { canonicalPath, createMetadata } from '@/lib/metadata';
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
  return (
    <div className="about-page">
      <StructuredData data={buildProfilePageGraphFromProfile()} />
      <AboutPageLayout>
        <AboutFeed />
      </AboutPageLayout>
    </div>
  );
}
