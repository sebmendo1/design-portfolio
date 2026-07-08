import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation/Navigation';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { WorkExperience } from '@/components/WorkExperience/WorkExperience';
import { ContactCTA } from '@/components/ContactCTA/ContactCTA';
import { buildPortfolioExport } from '@/lib/content-export';
import { buildProfilePageGraph } from '@/lib/json-ld';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import './about.css';

const ABOUT_DESCRIPTION =
  'Sebastian Mendo is a Senior Product Designer at JPMorgan Chase, previously at Salesforce, Chorus AI, Writer, and Shift.';

export const metadata: Metadata = createMetadata({
  title: 'About',
  description: ABOUT_DESCRIPTION,
  ...canonicalPath('/about'),
  openGraph: {
    title: 'About — Sebastian Mendo',
    description: ABOUT_DESCRIPTION,
  },
});

export default async function AboutPage() {
  const portfolio = await buildPortfolioExport();

  return (
    <div className="about-page">
      <StructuredData data={buildProfilePageGraph(portfolio)} />
      <Navigation />
      <main id="main-content">
        <div className="about-page__content">
          <h1 className="about-page__heading">
            Sebastian Mendo is a Senior Product Designer specialized in building
            AI-first digital products.
          </h1>
          <p className="about-page__bio">
            Currently designing core agentic flows at JPMorgan Chase. Previously at
            Salesforce, Chorus AI, Writer, and Shift.
          </p>
        </div>

        <WorkExperience />
        <ContactCTA />
      </main>
    </div>
  );
}
