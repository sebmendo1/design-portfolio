export type AboutPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const ABOUT_ALBUM: readonly AboutPhoto[] = [
  {
    src: '/assets/about/chase-jd-power.jpg',
    alt: 'Sebastian and colleagues at a Chase event with a JD Power mortgage award',
    width: 1200,
    height: 1600,
  },
  {
    src: '/assets/about/seb-portrait.jpg',
    alt: 'Sebastian sitting on a sofa wearing a SpaceXAI shirt',
    width: 1200,
    height: 1600,
  },
  {
    src: '/assets/about/herbs-house.jpg',
    alt: 'Sebastian and two colleagues outside Herb’s House Coffee',
    width: 1200,
    height: 1600,
  },
  {
    src: '/assets/about/office-stairs.jpg',
    alt: 'Sebastian and colleagues sitting on an office staircase',
    width: 1200,
    height: 1600,
  },
];
