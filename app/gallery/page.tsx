import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Gallery",
  description: "Visual gallery of selected work by Sugandha Saxena.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <PageShell
      title="Gallery"
      description="A curated visual archive will expand here as assets are imported."
    />
  );
}
