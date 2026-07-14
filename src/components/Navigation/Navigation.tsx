'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { DISSOLVE_DURATION, DISSOLVE_EASE } from '@/components/DissolveIn/DissolveIn';
import './Navigation.css';

export function Navigation() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="nav-shell">
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
          <Link href="/" className="nav__brand" aria-label="SebMendoDesign home">
            <span className="nav__brand-avatar">
              <Image
                src="/assets/nav-avatar.png"
                alt=""
                width={36}
                height={36}
                className="nav__brand-avatar-img"
                priority
              />
            </span>
            <span className="nav__brand-text">SebMendoDesign</span>
          </Link>
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
          <a href="mailto:contact@sebastianmendo.design" className="nav__contact">
            Contact me
          </a>
        </motion.div>
      </nav>
    </div>
  );
}
