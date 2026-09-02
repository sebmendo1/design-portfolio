import type { Metadata } from 'next';
import { AboutAlbum } from '@/components/AboutAlbum/AboutAlbum';
import { AboutIndexRail } from '@/components/AboutIndexRail/AboutIndexRail';
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
        <div className="about-index">
          <div className="about-index__pane about-index__pane--rail" data-lenis-prevent>
            <AboutIndexRail />
          </div>

          <div className="about-index__pane about-index__pane--album" data-lenis-prevent>
            <AboutAlbum />
          </div>
        </div>
      </AboutPageLayout>
    </div>
  );
}
