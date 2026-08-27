import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutPageLayout } from '@/components/AboutPage/AboutPageLayout';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import { practiceOrganizationNode } from '@/lib/json-ld';
import { getSiteUrl } from '@/lib/site';
import { PRIVACY_PAGE } from '@/lib/trust-pages';
import '../about/about.css';

export const metadata: Metadata = createMetadata({
  title: PRIVACY_PAGE.title,
  description: PRIVACY_PAGE.description,
  ...canonicalPath('/privacy'),
  alternates: {
    canonical: '/privacy',
    types: {
      'text/markdown': [{ url: '/privacy', title: 'Privacy as Markdown' }],
    },
  },
  openGraph: {
    title: 'Privacy — Sebastian Mendo',
    description: PRIVACY_PAGE.description,
  },
});

export default function PrivacyPage() {
  return (
    <div className="about-page">
      <StructuredData data={practiceOrganizationNode(getSiteUrl())} />
      <AboutPageLayout>
        <div className="about-page__content">
          <h1 className="about-page__heading">{PRIVACY_PAGE.title}</h1>
          {PRIVACY_PAGE.paragraphs.map((paragraph) => (
            <p key={paragraph} className="about-page__bio">
              {paragraph}
            </p>
          ))}
          <p className="about-page__linkedin">
            <Link href="/contact">Contact</Link>
            {' · '}
            <Link href="/about">About</Link>
          </p>
        </div>
      </AboutPageLayout>
    </div>
  );
}
