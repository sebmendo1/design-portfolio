export const DOWNLOAD_CLICK_EVENT = 'seb-sans:download-click';

export type DownloadClickDetail = {
  source: 'nav';
};

export type DownloadClickEvent = CustomEvent<DownloadClickDetail>;

export function dispatchDownloadClick(
  detail: DownloadClickDetail = { source: 'nav' },
) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent<DownloadClickDetail>(DOWNLOAD_CLICK_EVENT, { detail }),
  );
}

export function onDownloadClick(
  listener: (event: DownloadClickEvent) => void,
) {
  if (typeof window === 'undefined') return () => {};

  const handler = listener as EventListener;
  window.addEventListener(DOWNLOAD_CLICK_EVENT, handler);
  return () => window.removeEventListener(DOWNLOAD_CLICK_EVENT, handler);
}
