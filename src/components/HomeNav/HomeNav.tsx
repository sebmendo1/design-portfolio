'use client';

import { useRef, type MouseEvent, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { HomeLogo } from '@/components/HomeProjectCard/HomeProjectCard';
import { StudyToc } from '@/components/StudyToc/StudyToc';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import type { HomeSection } from '@/lib/home-sections';
import { getMenuProjectGroups } from '@/lib/menu-projects';
import { SITE_SOCIAL_NAV } from '@/lib/site';
import './HomeNav.css';

type NavSection = Pick<HomeSection, 'label'> & { id: string };

type HomeNavListProps = {
  sections: NavSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

/** Sidebar pills (homepage / about). The header menu uses the project list instead. */
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

type MenuProjectListProps = {
  currentSlug: string | null;
  onNavigate: () => void;
};

function MenuProjectList({ currentSlug, onNavigate }: MenuProjectListProps) {
  const groups = getMenuProjectGroups();
  const showGroupLabels = groups.some((group) => group.items.length > 1);

  return (
    <ul className="home-menu-projects">
      {groups.map((group) => (
        <li key={group.company} className="home-menu-projects__group">
          {showGroupLabels && group.items.length > 1 ? (
            <p className="home-menu-projects__company">{group.company}</p>
          ) : null}
          <ul className="home-menu-projects__list">
            {group.items.map((item) => {
              const active = item.slug === currentSlug;
              return (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className={`home-menu-projects__row${active ? ' is-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={onNavigate}
                  >
                    {item.logo ? <HomeLogo logo={item.logo} /> : null}
                    <span className="home-menu-projects__title">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

type HomeMenuProps = {
  /** In-page sections for optional TOC (case studies) or legacy callers. */
  sections?: NavSection[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  page?: HomePage;
  /** Label for the optional in-page TOC block. */
  label?: string;
  /**
   * `toc` keeps an "On this page" block under the project list (case-study phone).
   * Project links always replace the old pills.
   */
  variant?: 'pills' | 'toc';
};

export function HomeMenu({
  sections,
  activeId = null,
  onSelect,
  page,
  label = 'On this page',
  variant = 'pills',
}: HomeMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const currentSlug = pathname?.startsWith('/work/') ? (pathname.split('/')[2] ?? null) : null;

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

  const showToc = variant === 'toc' && !!sections?.length;

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
          <nav aria-label="Projects" className="home-menu__nav">
            <p className="home-nav__label">Projects</p>
            <MenuProjectList currentSlug={currentSlug} onNavigate={close} />
          </nav>
          {showToc ? (
            <nav aria-label={label} className="home-menu__nav home-menu__nav--toc">
              <p className="home-nav__label">{label}</p>
              <div className="home-menu__toc">
                <StudyToc sections={sections!} activeId={activeId} onSelect={handleSelect} />
              </div>
            </nav>
          ) : null}
          <HomePageLinks className="home-menu__links" page={page} />
        </div>
      </dialog>
    </>
  );
}
