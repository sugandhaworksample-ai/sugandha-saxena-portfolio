export type MediaKind = "image" | "video";

export type WorkMedia = {
  src: string;
  alt: string;
  kind: MediaKind;
  /** Prefer for cards when present */
  thumbSrc?: string;
};

export type WorkStackNode = {
  id: string;
  slug: string;
  title: string;
  hero: WorkMedia;
  items: WorkMedia[];
};

export type WorkSubsection = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  order: number;
  /** Folder path relative to public/ */
  folder: string;
  cover: WorkMedia;
  /** Peek images for stacked category cards */
  stackPreview: WorkMedia[];
  media: WorkMedia[];
  stacks: WorkStackNode[];
};

export type WorkCategory = {
  id: string;
  slug: string;
  title: string;
  /** Display order label e.g. "01" */
  label: string;
  order: number;
  folder: string;
  hero?: WorkMedia;
  subsections: WorkSubsection[];
};

export type WorkEventGroup = {
  id: string;
  slug: string;
  title: string;
  folder: string;
  hero?: WorkMedia;
  /** Top-level creatives */
  media: WorkMedia[];
  /** Nested folders e.g. Glimps, Designs, SIL 2025 */
  stacks: WorkStackNode[];
};

export type WorkEventsTree = {
  title: string;
  folder: string;
  groups: WorkEventGroup[];
};
