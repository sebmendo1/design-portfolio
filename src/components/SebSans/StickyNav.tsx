'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { InstallMethodSwitch } from '@/components/SebSans/InstallMethodSwitch';
import { useInstallMethod } from '@/components/SebSans/InstallMethodContext';
import { dispatchDownloadClick } from '@/lib/seb-sans/download-click';
import { FONT_RELEASE_ZIP_URL } from '@/lib/seb-sans/install-commands';
import { SEB_SANS_BASE_PATH } from '@/lib/seb-sans/site-url';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';

export function StickyNav() {
  const { channel, setChannel } = useInstallMethod();
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    function onScroll() {
      setAtTop(window.scrollY <= 0);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleDownload() {
    dispatchDownloadClick({ source: 'nav' });
    setChannel('download');
  }

  return (
    <header className={`site-nav${atTop ? '' : ' site-nav--hidden'}`}>
      <div className="site-shell site-nav-inner">
        <div className="brand-cluster">
          <Link className="brand-mark" href={SEB_SANS_BASE_PATH} aria-label="Seb Sans home">
            <span className="brand-dot" aria-hidden="true" />
          </Link>
          <ThemeToggle className="theme-toggle--seb-sans" />
        </div>

        <InstallMethodSwitch className="nav-segmented" />

        <a
          href={FONT_RELEASE_ZIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-get-it${channel === 'download' ? ' btn-get-it--active' : ''}`}
          onClick={handleDownload}
          aria-label="Download Seb Sans v0.7.2"
        >
          <span>Download</span>
          <span className="btn-get-it-icon" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </header>
  );
}
