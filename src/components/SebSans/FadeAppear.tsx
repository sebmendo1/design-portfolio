'use client';

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

type FadeAppearProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
} & Record<string, unknown>;

function isReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function FadeAppear({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  immediate = false,
  ...rest
}: FadeAppearProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isReducedMotion()) {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }

    if (immediate) {
      const timer = window.setTimeout(() => setVisible(true), 50);
      return () => window.clearTimeout(timer);
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={`fade-appear${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
