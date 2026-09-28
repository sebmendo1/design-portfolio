import type { PortfolioIndexSection } from '@/data/portfolioIndex';

export type AboutPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  /** Homepage section whose logo tile sits in the caption row. */
  logoSection?: PortfolioIndexSection;
};

export const ABOUT_ALBUM: readonly AboutPhoto[] = [
  {
    src: '/assets/about/chase-jd-power.jpg',
    alt: 'Sebastian and colleagues at a Chase event with a JD Power mortgage award',
    width: 1200,
    height: 1600,
    title: 'JD Power award',
    caption: 'Celebrating a JD Power mortgage award at Chase',
    logoSection: 'chase-home-lending',
  },
  {
    src: '/assets/about/seb-portrait.jpg',
    alt: 'Sebastian sitting on a sofa wearing a SpaceXAI shirt',
    width: 1200,
    height: 1600,
    title: 'SpaceXAI ambassador',
    caption: 'Helping designers get fluent with AI-native tools',
  },
  {
    src: '/assets/about/herbs-house.jpg',
    alt: 'Sebastian and two colleagues outside Herb’s House Coffee',
    width: 1200,
    height: 1600,
    title: 'Herb’s House Coffee',
    caption: 'Coffee with colleagues',
  },
  {
    src: '/assets/about/office-stairs.jpg',
    alt: 'Sebastian and colleagues sitting on an office staircase',
    width: 1200,
    height: 1600,
    title: 'Office stairs',
    caption: 'Hanging out with the team',
  },
];
