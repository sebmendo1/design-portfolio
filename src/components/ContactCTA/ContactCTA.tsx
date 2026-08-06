import './ContactCTA.css';
import { SITE_CONTACT_EMAIL } from '@/lib/site';

export function ContactCTA() {
  return (
    <section className="contact-cta" aria-label="Contact">
      <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="contact-cta__link">
        {SITE_CONTACT_EMAIL}
      </a>
    </section>
  );
}
