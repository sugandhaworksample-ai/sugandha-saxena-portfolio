import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { projectFrontmatterSchema, type Project } from "@/types/project";

const projectsDirectory = path.join(process.cwd(), "content/projects");

function ensureProjectsDirectory() {
  if (!fs.existsSync(projectsDirectory)) {
    fs.mkdirSync(projectsDirectory, { recursive: true });
  }
}

export function getProjectSlugs(): string[] {
  ensureProjectsDirectory();
  return fs
    .readdirSync(projectsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getProjectBySlug(slug: string): Project | null {
  ensureProjectsDirectory();
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = projectFrontmatterSchema.parse(data);

  return {
    slug,
    content,
    ...frontmatter,
  };
}

export function getAllProjects(): Project[] {
  return getProjectSlugs()
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is Project => project !== null)
    .filter((project) => project.status === "published")
    .sort((a, b) => {
      const aDate = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const bDate = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return bDate - aDate;
    });
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectsByTag(tag: string): Project[] {
  const normalized = tag.toLowerCase();
  return getAllProjects().filter((project) =>
    project.tags.some((item) => item.toLowerCase() === normalized),
  );
}
