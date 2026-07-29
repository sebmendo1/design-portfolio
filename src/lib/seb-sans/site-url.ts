import { getSiteUrl } from '@/lib/site';

export const SEB_SANS_BASE_PATH = '/seb-sans';

export function getSebSansSiteUrl(): string {
  return `${getSiteUrl()}${SEB_SANS_BASE_PATH}`;
}

export function sebSansAbsoluteUrl(path: string): string {
  const base = getSebSansSiteUrl();
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
