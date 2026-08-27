import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutPageLayout } from '@/components/AboutPage/AboutPageLayout';
import { ContactCTA } from '@/components/ContactCTA/ContactCTA';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import { practiceOrganizationNode } from '@/lib/json-ld';
import { getSiteUrl, SITE_LINKEDIN_URL } from '@/lib/site';
import { CONTACT_PAGE } from '@/lib/trust-pages';
import '../about/about.css';

export const metadata: Metadata = createMetadata({
  title: CONTACT_PAGE.title,
  description: CONTACT_PAGE.description,
  ...canonicalPath('/contact'),
  alternates: {
    canonical: '/contact',
    types: {
      'text/markdown': [{ url: '/contact', title: 'Contact as Markdown' }],
    },
  },
  openGraph: {
    title: 'Contact — Sebastian Mendo',
    description: CONTACT_PAGE.description,
  },
});

export default function ContactPage() {
  return (
    <div className="about-page">
      <StructuredData data={practiceOrganizationNode(getSiteUrl())} />
      <AboutPageLayout>
        <div className="about-page__content">
          <h1 className="about-page__heading">{CONTACT_PAGE.title}</h1>
          {CONTACT_PAGE.paragraphs.map((paragraph) => (
            <p key={paragraph} className="about-page__bio">
              {paragraph}
            </p>
          ))}
          <p className="about-page__linkedin">
            <Link href={SITE_LINKEDIN_URL} rel="me">
              LinkedIn
            </Link>
            {' · '}
            <Link href="/privacy">Privacy</Link>
          </p>
        </div>
        <ContactCTA />
      </AboutPageLayout>
    </div>
  );
}
