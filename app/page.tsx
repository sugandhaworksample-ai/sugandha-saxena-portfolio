import type { Metadata } from "next";

import { siteConfig } from "@/constants/site";
import { ScrollStory } from "@/features/home/scroll-story";
import { getAllProjects, getFeaturedProjects } from "@/lib/projects";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const featured = getFeaturedProjects();
  const projects =
    featured.length > 0 ? featured : getAllProjects().slice(0, 4);
  const resume = getResume();
  const skills = resume.skills.flatMap((group) => group.items).slice(0, 16);
  const blurb =
    resume.summary.split(". ").slice(0, 2).join(". ").replace(/\.$/, "") + ".";

  return <ScrollStory projects={projects} skills={skills} blurb={blurb} />;
}
