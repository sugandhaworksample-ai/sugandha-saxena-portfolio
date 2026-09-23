import type { Metadata } from "next";

import { siteConfig } from "@/constants/site";
import { ScrollStory } from "@/features/home/scroll-story";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";
import { getEventsTree, getWorkCategories } from "@/lib/work-tree";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const categories = getWorkCategories();
  const events = getEventsTree();
  const resume = getResume();
  const skills = resume.skills.flatMap((group) => group.items).slice(0, 16);
  const blurb =
    resume.summary.split(". ").slice(0, 2).join(". ").replace(/\.$/, "") + ".";

  return (
    <ScrollStory
      categories={categories}
      events={events}
      skills={skills}
      blurb={blurb}
    />
  );
}
