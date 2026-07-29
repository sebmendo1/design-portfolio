'use client';

import {
  useEffect,
  useState,
  type ElementType,
  type HTMLAttributes,
} from 'react';

type TypewriterTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
} & HTMLAttributes<HTMLElement>;

function isReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function TypewriterText({
  text,
  as: Tag = 'span',
  className = '',
  speed = 28,
  delay = 0,
  showCursor = true,
  ...rest
}: TypewriterTextProps) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!isReducedMotion()) return;
    const timer = window.setTimeout(() => {
      setReduced(true);
      setCount(text.length);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [text.length]);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setActive(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay, reduced]);

  useEffect(() => {
    if (!active || reduced || count >= text.length) return;
    const timer = window.setTimeout(() => setCount((value) => value + 1), speed);
    return () => window.clearTimeout(timer);
  }, [active, count, reduced, speed, text.length]);

  const done = reduced || count >= text.length;
  const display = reduced ? text : text.slice(0, count);

  return (
    <Tag className={`typewriter${className ? ` ${className}` : ''}`} {...rest}>
      <span aria-hidden="true">{display}</span>
      {showCursor && !done ? (
        <span className="typewriter-cursor" aria-hidden="true">
          |
        </span>
      ) : null}
    </Tag>
  );
}
