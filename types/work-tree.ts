export type MediaKind = "image" | "video";

export type WorkMedia = {
  src: string;
  alt: string;
  kind: MediaKind;
  /** Prefer for cards when present */
  thumbSrc?: string;
  /** Intrinsic dimensions for next/image */
  width?: number;
  height?: number;
};

export type WorkStackLayout = "gallery" | "carousel";

export type WorkStackNode = {
  id: string;
  slug: string;
  title: string;
  /** "Name - carousel" folders open a fullscreen slideshow */
  layout: WorkStackLayout;
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
  /** Files sitting in the category folder (not inside a subsection). Hero stills excluded. */
  looseMedia: WorkMedia[];
  subsections: WorkSubsection[];
};

export type WorkEventGroup = {
  id: string;
  slug: string;
  title: string;
  folder: string;
  hero?: WorkMedia;
  /** Top-level creatives. A root hero file is cover-only and is not included. */
  media: WorkMedia[];
  /** Direct child folders, shown as stacked cards */
  subsections: WorkSubsection[];
};

export type WorkEventsTree = {
  title: string;
  folder: string;
  groups: WorkEventGroup[];
};
