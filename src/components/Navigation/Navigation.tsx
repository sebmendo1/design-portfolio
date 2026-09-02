'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { DISSOLVE_DURATION, DISSOLVE_EASE } from '@/components/DissolveIn/DissolveIn';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import './Navigation.css';

export function Navigation() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="nav-shell">
      <div className="nav-shell__progressive-blur" aria-hidden="true">
        <span className="nav-shell__blur-layer nav-shell__blur-layer--1" />
        <span className="nav-shell__blur-layer nav-shell__blur-layer--2" />
        <span className="nav-shell__blur-layer nav-shell__blur-layer--3" />
        <span className="nav-shell__blur-layer nav-shell__blur-layer--4" />
      </div>
      <nav className="nav" aria-label="Primary">
        <motion.div
          className="nav__brand-wrap"
          initial={shouldReduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduce
              ? { duration: 0 }
              : { duration: DISSOLVE_DURATION, delay: 0.08, ease: DISSOLVE_EASE }
          }
        >
          <PageHeadline />
        </motion.div>

        <motion.div
          className="nav__links-wrap"
          initial={shouldReduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduce
              ? { duration: 0 }
              : { duration: DISSOLVE_DURATION, delay: 0.12, ease: DISSOLVE_EASE }
          }
        >
          <Link href="/about" className="nav__about">
            About
          </Link>
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="nav__contact">
            Contact me
          </a>
        </motion.div>
      </nav>
    </div>
  );
}
