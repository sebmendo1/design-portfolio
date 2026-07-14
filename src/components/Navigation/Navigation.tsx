'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { DISSOLVE_DURATION, DISSOLVE_EASE } from '@/components/DissolveIn/DissolveIn';
import { PROFILE_ROLES } from '@/data/profile';
import { getCompanyLogo } from '@/data/companyLogos';
import './Navigation.css';

const COMPANY_LOGO_KEY: Record<string, string> = {
  'JPMorgan Chase': 'chase',
  Salesforce: 'salesforce',
  WRITER: 'writer',
  'Chorus.ai': 'chorus',
  Shift: 'shift',
};

const NAV_WORK_LOGO_SIZE = 40;

const COMPANIES = PROFILE_ROLES.filter(
  (role, index, roles) => roles.findIndex(({ company }) => company === role.company) === index,
).map((role) => ({
  name: role.company === 'JPMorgan Chase' ? 'Chase' : role.company,
  logo: getCompanyLogo(role.company),
  logoKey: COMPANY_LOGO_KEY[role.company],
  href: role.relatedProjectSlugs?.[0]
    ? `/work/${role.relatedProjectSlugs[0]}`
    : `/about#role-${role.id}`,
}));

export function Navigation() {
  const shouldReduce = useReducedMotion();
  const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
  const workMenuRef = useRef<HTMLDivElement>(null);
  const workMenuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isWorkMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!workMenuRef.current?.contains(event.target as Node)) {
        setIsWorkMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsWorkMenuOpen(false);
        workMenuTriggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isWorkMenuOpen]);

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
          <div className="nav__work" ref={workMenuRef}>
            <button
              ref={workMenuTriggerRef}
              type="button"
              className="nav__about nav__work-trigger"
              aria-haspopup="true"
              aria-expanded={isWorkMenuOpen}
              aria-controls="nav-work-menu"
              onPointerDown={(event) => {
                if (event.button === 0) {
                  setIsWorkMenuOpen((isOpen) => !isOpen);
                }
              }}
              onClick={(event) => {
                // Keyboard and assistive-technology clicks do not emit pointer events.
                if (event.detail === 0) {
                  setIsWorkMenuOpen((isOpen) => !isOpen);
                }
              }}
            >
              My Work
              <svg
                className="nav__work-chevron"
                viewBox="0 0 12 12"
                width="12"
                height="12"
                aria-hidden="true"
              >
                <path d="m2.5 4.5 3.5 3 3.5-3" />
              </svg>
            </button>

            {isWorkMenuOpen && (
              <div id="nav-work-menu" className="nav__work-menu" aria-label="Companies">
                {COMPANIES.map((company) => (
                  <Link
                    key={company.name}
                    href={company.href}
                    className="nav__work-item"
                    onClick={() => setIsWorkMenuOpen(false)}
                  >
                    <span
                      className={
                        company.logoKey
                          ? `nav__work-logo nav__work-logo--${company.logoKey}`
                          : 'nav__work-logo'
                      }
                      aria-hidden="true"
                    >
                      {company.logo ? (
                        <OptimizedImage
                          src={company.logo}
                          alt=""
                          width={NAV_WORK_LOGO_SIZE}
                          height={NAV_WORK_LOGO_SIZE}
                        />
                      ) : (
                        <span className="nav__work-logo-fallback">
                          {company.name.charAt(0)}
                        </span>
                      )}
                    </span>
                    <span>{company.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
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
