import type { Metadata } from "next";

import { ExploreIndex } from "@/features/work/explore-index";
import { createPageMetadata } from "@/lib/seo";
import { getWorkCategories } from "@/lib/work-tree";

export const metadata: Metadata = createPageMetadata({
  title: "Work",
  description:
    "Scroll to explore — branding, print, social, UI, motion, AI, and illustration by Sugandha Saxena.",
  path: "/projects",
});

export default function ProjectsPage() {
  const categories = getWorkCategories();
  return <ExploreIndex categories={categories} />;
}
