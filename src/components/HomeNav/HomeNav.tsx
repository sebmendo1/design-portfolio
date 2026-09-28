'use client';

import { useRef, type MouseEvent, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import type { HomeSection } from '@/lib/home-sections';
import { SITE_SOCIAL_NAV } from '@/lib/site';
import './HomeNav.css';

type NavSection = Pick<HomeSection, 'id' | 'label'>;

type HomeNavListProps = {
  sections: NavSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function HomeNavList({ sections, activeId, onSelect }: HomeNavListProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    onSelect(id);
  }

  return (
    <ul className="home-nav">
      {sections.map((section) => {
        const active = section.id === activeId;
        return (
          <li key={section.id} className="home-nav__item">
            <a
              href={`#${section.id}`}
              className={`home-nav__row${active ? ' is-active' : ''}`}
              aria-current={active ? 'true' : undefined}
              onClick={(event) => handleClick(event, section.id)}
            >
              <span className="home-nav__pill">{section.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export type HomePage = 'work' | 'about';

const PAGE_SWITCH_LINK: Record<HomePage, { href: string; label: string }> = {
  work: { href: '/about', label: 'about' },
  about: { href: '/', label: 'work' },
};

type HomePageLinksProps = {
  className?: string;
  page?: HomePage;
};

export function HomePageLinks({ className, page = 'work' }: HomePageLinksProps) {
  const pageLink = PAGE_SWITCH_LINK[page];

  return (
    <div className={['home-links', className].filter(Boolean).join(' ')}>
      <Link href={pageLink.href} className="home-links__link">
        {pageLink.label}
      </Link>
      {SITE_SOCIAL_NAV.map((link) => (
        <a key={link.href} href={link.href} className="home-links__link" rel="me">
          {link.label}
        </a>
      ))}
      <ThemeToggle />
    </div>
  );
}

function MenuIcon() {
  return <span className="home-menu__icon" aria-hidden="true" />;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path
        d="M13 13 23 23M23 13 13 23"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type HomeMenuProps = {
  sections?: NavSection[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  page?: HomePage;
};

export function HomeMenu({ sections, activeId = null, onSelect, page }: HomeMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open() {
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function handleSelect(id: string) {
    close();
    onSelect?.(id);
  }

  function handleBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) close();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    close();
  }

  return (
    <>
      <button
        type="button"
        className="home-menu__button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={open}
      >
        <MenuIcon />
      </button>
      <dialog
        ref={dialogRef}
        className="home-menu"
        aria-label="Menu"
        onClick={handleBackdrop}
        onCancel={handleCancel}
      >
        <div className="home-menu__sheet">
          <div className="home-menu__header">
            <PageHeadline className="page-headline--chip" />
            <button
              type="button"
              className="home-menu__button"
              aria-label="Close menu"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>
          {sections?.length ? (
            <nav aria-label="Projects" className="home-menu__nav">
              <p className="home-nav__label">Projects</p>
              <HomeNavList sections={sections} activeId={activeId} onSelect={handleSelect} />
            </nav>
          ) : null}
          <HomePageLinks className="home-menu__links" page={page} />
        </div>
      </dialog>
    </>
  );
}
