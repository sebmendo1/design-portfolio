import { Navigation } from '@/components/Navigation/Navigation';
import { WorkExperience } from '@/components/WorkExperience/WorkExperience';
import { ContactCTA } from '@/components/ContactCTA/ContactCTA';
import './about.css';

export const metadata = {
  title: 'About — Sebastian Mendo',
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navigation />

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
    </div>
  );
}
