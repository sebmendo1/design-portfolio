import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation/Navigation';
import { WorkExperience } from '@/components/WorkExperience/WorkExperience';
import { ContactCTA } from '@/components/ContactCTA/ContactCTA';
import './about.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Sebastian Mendo is a Senior Product Designer at JPMorgan Chase, previously at Salesforce, Chorus AI, Writer, and Shift.',
  openGraph: {
    title: 'About — Sebastian Mendo',
    description:
      'Sebastian Mendo is a Senior Product Designer at JPMorgan Chase, previously at Salesforce, Chorus AI, Writer, and Shift.',
  },
};

export default function AboutPage() {
  return (
    <div className="about-page">
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
