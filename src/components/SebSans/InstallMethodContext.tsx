'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type InstallChannel = 'agent' | 'cli' | 'download';

type InstallMethodContextValue = {
  channel: InstallChannel;
  setChannel: (channel: InstallChannel) => void;
};

const InstallMethodContext = createContext<InstallMethodContextValue | null>(
  null,
);

function channelFromHash(hash: string): InstallChannel | null {
  if (hash === '#install-agent' || hash === '#install') return 'agent';
  if (hash === '#install-download') return 'download';
  if (hash === '#install-cli') return 'cli';
  return null;
}

export function InstallMethodProvider({ children }: { children: ReactNode }) {
  const [channel, setChannelState] = useState<InstallChannel>('agent');

  useEffect(() => {
    function syncFromHash() {
      const next = channelFromHash(window.location.hash);
      if (next) setChannelState(next);
    }

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const setChannel = useCallback((next: InstallChannel) => {
    setChannelState(next);
    const hash =
      next === 'cli'
        ? '#install-cli'
        : next === 'agent'
          ? '#install-agent'
          : '#install-download';
    if (window.location.hash !== hash) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${hash}`,
      );
    }
  }, []);

  const value = useMemo(
    () => ({ channel, setChannel }),
    [channel, setChannel],
  );

  return (
    <InstallMethodContext.Provider value={value}>
      {children}
    </InstallMethodContext.Provider>
  );
}

export function useInstallMethod() {
  const context = useContext(InstallMethodContext);
  if (!context) {
    throw new Error('useInstallMethod must be used within InstallMethodProvider');
  }
  return context;
}
