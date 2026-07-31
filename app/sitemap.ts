import type { MetadataRoute } from "next";

import { mainNav, secondaryNav } from "@/constants/nav";
import { siteConfig } from "@/constants/site";
import { getAllProjects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    ...mainNav.map((item) => item.href),
    ...secondaryNav.map((item) => item.href),
  ];

  const pages = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const projects = getAllProjects().map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: project.publishedAt
      ? new Date(project.publishedAt)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...pages, ...projects];
}
