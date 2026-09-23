import type { MetadataRoute } from "next";

import { mainNav, secondaryNav } from "@/constants/nav";
import { siteConfig } from "@/constants/site";
import { getEventsTree, getWorkCategories } from "@/lib/work-tree";

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

  const categories = getWorkCategories();
  const categoryUrls = categories.map((category) => ({
    url: `${siteConfig.url}/projects/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const subsectionUrls = categories.flatMap((category) =>
    category.subsections.map((subsection) => ({
      url: `${siteConfig.url}/projects/${category.slug}/${subsection.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  );

  const eventUrls = getEventsTree().groups.map((group) => ({
    url: `${siteConfig.url}/projects/events/${group.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...pages, ...categoryUrls, ...subsectionUrls, ...eventUrls];
}
