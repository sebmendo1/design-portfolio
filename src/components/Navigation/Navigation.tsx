import Link from 'next/link';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import './Navigation.css';

export function Navigation() {
  return (
    <div className="nav-shell">
      <div className="nav-shell__progressive-blur" aria-hidden="true">
        <span className="nav-shell__blur-layer nav-shell__blur-layer--1" />
        <span className="nav-shell__blur-layer nav-shell__blur-layer--2" />
        <span className="nav-shell__blur-layer nav-shell__blur-layer--3" />
        <span className="nav-shell__blur-layer nav-shell__blur-layer--4" />
      </div>
      <nav className="nav" aria-label="Primary">
        <div className="nav__brand-wrap">
          <PageHeadline />
        </div>

        <div className="nav__links-wrap">
          <Link href="/about" className="nav__about">
            About
          </Link>
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="nav__contact">
            Contact me
          </a>
        </div>
      </nav>
    </div>
  );
}
