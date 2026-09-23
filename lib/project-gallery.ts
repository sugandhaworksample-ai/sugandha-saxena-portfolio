/**
 * Shared gallery helpers — safe for Server and Client Components.
 * Keep this file free of "use client" / React hooks.
 */

export type GalleryItem = {
  src: string;
  alt?: string;
  kind: "image" | "video";
};

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i;

export function isVideoSrc(src: string) {
  return VIDEO_EXT.test(src);
}

export function isImageSrc(src: string) {
  return IMAGE_EXT.test(src);
}

export function buildGalleryItems(
  images: string[],
  videos: string[],
  title: string,
): GalleryItem[] {
  const fromImages = images.map((src, i) => ({
    src,
    alt: `${title} — ${i + 1}`,
    kind: (isVideoSrc(src) ? "video" : "image") as GalleryItem["kind"],
  }));
  const fromVideos = videos.map((src, i) => ({
    src,
    alt: `${title} — video ${i + 1}`,
    kind: "video" as const,
  }));
  return [...fromImages, ...fromVideos];
}
