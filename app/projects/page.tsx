import type { Metadata } from "next";

import { ProjectsIndex } from "@/features/projects/projects-index";
import { getAllProjects } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected projects by Sugandha Saxena across branding, UI, packaging, and AI-driven visual storytelling.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects();
  return <ProjectsIndex projects={projects} />;
}
