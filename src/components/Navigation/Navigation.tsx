import Link from 'next/link';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import './Navigation.css';

export function Navigation() {
  return (
    <header className="nav-shell">
      <nav className="nav" aria-label="Primary">
        <Link href="/" className="nav__brand">
          Sebastian Mendo
        </Link>
        <div className="nav__links">
          <Link href="/about" className="nav__text-link">
            about
          </Link>
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="nav__text-link">
            contact
          </a>
        </div>
      </nav>
    </header>
  );
}
