export type Beat = {
  id: string;
  label?: string;   // section label e.g. "CHALLENGE" — omit for unlabelled beats like Summary
  headline: string; // punchy one-liner for animated stage
  body?: string;    // full paragraph for text-scroll mode
  range: [number, number];
};

export type ArtifactCard = {
  id: string;
  src?: string;
  label?: string;
  seed: number;
  enterAt: number;
  clusterId?: string;
  bgColor?: string;
};

export type Cluster = {
  id: string;
  label: string;
  anchor: { x: number; y: number }; // percentage of stage (0-100)
};

export type CaseStudyDevice = {
  src?: string;
  video?: string;
  screenAspectRatio?: number;
};

export type CaseStudyCenterpiece = {
  src?: string;
  video?: string;
  url?: string;
  width: number;
  frame: 'phone' | 'browser' | 'none';
  screenAspectRatio?: number;
  /** Extra phones shown beside the primary in a horizontal stack. */
  companions?: CaseStudyDevice[];
};

export type CaseStudyConfig = {
  slug: string;
  title: string;
  trackHeightVh: number;
  stage: {
    centerpiece: CaseStudyCenterpiece;
  };
  beats: Beat[];
  cards: ArtifactCard[];
  clusters: Cluster[];
};
