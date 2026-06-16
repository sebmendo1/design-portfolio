'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
          {workActive && (
            <motion.span
              layoutId="nav-pill"
              className="nav__tab-pill"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="nav__tab-text">Work</span>
        </Link>
        <Link
          href="/about"
          className={`nav__tab${aboutActive ? ' nav__tab--active' : ''}`}
          aria-current={aboutActive ? 'page' : undefined}
        >
          {aboutActive && (
            <motion.span
              layoutId="nav-pill"
              className="nav__tab-pill"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="nav__tab-text">About</span>
        </Link>
      </div>
      <a href="mailto:contact@sebastianmendo.design" className="nav__contact">
        Contact me
      </a>
    </nav>
  );
}
