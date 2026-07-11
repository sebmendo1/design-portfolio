'use client';

import { useEffect, useState, type RefObject } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LiquidGlass from 'liquid-glass-react';
import { motion, useReducedMotion } from 'framer-motion';
import { DISSOLVE_DURATION, DISSOLVE_EASE } from '@/components/DissolveIn/DissolveIn';
import './Navigation.css';

const DESKTOP_NAV_MEDIA = '(min-width: 769px)';

type NavigationProps = {
  floatingGlass?: boolean;
  onFloatingChange?: (floating: boolean) => void;
  mouseContainer?: RefObject<HTMLElement | null>;
};

export function Navigation({
  floatingGlass = false,
  onFloatingChange,
  mouseContainer,
}: NavigationProps) {
  const shouldReduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!floatingGlass || shouldReduce) return;

    const mediaQuery = window.matchMedia(DESKTOP_NAV_MEDIA);
    const onScroll = () => {
      setScrolled(mediaQuery.matches && window.scrollY > 12);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    mediaQuery.addEventListener('change', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      mediaQuery.removeEventListener('change', onScroll);
    };
  }, [floatingGlass, shouldReduce]);

  const useGlass = floatingGlass && scrolled && !shouldReduce;

  useEffect(() => {
    onFloatingChange?.(useGlass);
  }, [useGlass, onFloatingChange]);

  const nav = (
    <nav className={`nav${useGlass ? ' nav--floating' : ''}`} aria-label="Primary">
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
        className="nav__contact-wrap"
        initial={shouldReduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduce
            ? { duration: 0 }
            : { duration: DISSOLVE_DURATION, delay: 0.16, ease: DISSOLVE_EASE }
        }
      >
        <a href="mailto:contact@sebastianmendo.design" className="nav__contact">
          Contact me
        </a>
      </motion.div>
    </nav>
  );

  if (!useGlass) return nav;

  return (
    <LiquidGlass
      overLight
      cornerRadius={16}
      blurAmount={0.075}
      saturation={125}
      elasticity={0.18}
      displacementScale={40}
      aberrationIntensity={1.5}
      mouseContainer={mouseContainer}
      className="nav-glass"
      padding="0"
      style={{ width: '100%', display: 'block' }}
    >
      {nav}
    </LiquidGlass>
  );
}
