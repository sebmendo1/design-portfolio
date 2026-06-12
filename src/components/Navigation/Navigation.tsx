'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navigation.css';

export function Navigation() {
  const pathname = usePathname();
  const workActive = pathname === '/' || pathname.startsWith('/work');
  const aboutActive = pathname === '/about';

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav__tabs">
        <Link
          href="/"
          className={`nav__tab${workActive ? ' nav__tab--active' : ''}`}
          aria-current={workActive ? 'page' : undefined}
        >
          Work
        </Link>
        <Link
          href="/about"
          className={`nav__tab${aboutActive ? ' nav__tab--active' : ''}`}
          aria-current={aboutActive ? 'page' : undefined}
        >
          About
        </Link>
      </div>
      <a href="mailto:contact@sebastianmendo.design" className="nav__contact">
        Contact me
      </a>
    </nav>
  );
}
