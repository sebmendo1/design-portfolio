const LOGO_VERSION = '4';

const LOGO_PATHS: Record<string, string> = {
  'JPMorgan Chase': '/assets/logos/chase.png',
  Salesforce: '/assets/logos/salesforce.png',
  'Writer.com': '/assets/logos/writer.png',
  'Chorus AI': '/assets/logos/chorus-ai.svg',
  Shift: '/assets/logos/shift.png',
};

export function getCompanyLogo(company?: string): string | undefined {
  if (!company) return undefined;
  const path = LOGO_PATHS[company];
  if (!path) return undefined;
  return `${path}?v=${LOGO_VERSION}`;
}
