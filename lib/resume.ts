import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import {
  resumeFrontmatterSchema,
  type Experience,
  type Resume,
  type TimelineEvent,
} from "@/types/resume";

const resumePath = path.join(process.cwd(), "content/resume.md");

let cached: Resume | null = null;

export function getResume(): Resume {
  if (cached) return cached;

  const fileContents = fs.readFileSync(resumePath, "utf8");
  const { data } = matter(fileContents);
  cached = resumeFrontmatterSchema.parse(data);
  return cached;
}

export function getExperience(): Experience[] {
  return getResume().experience;
}

function parseSortKey(value: string): number {
  if (/present/i.test(value)) return Number.POSITIVE_INFINITY;
  const match = value.match(/(\d{4})/);
  return match ? Number(match[1]) : 0;
}

export function getTimelineEvents(): TimelineEvent[] {
  const resume = getResume();
  const events: TimelineEvent[] = [];

  for (const role of resume.experience) {
    events.push({
      id: `role-${role.company}`,
      kind: "role",
      title: role.role,
      subtitle: role.company,
      start: role.start,
      end: role.end,
      description: role.location,
    });
  }

  for (const edu of resume.education) {
    events.push({
      id: `edu-${edu.institution}-${edu.degree}`,
      kind: "education",
      title: edu.degree,
      subtitle: edu.institution,
      start: edu.start,
      end: edu.end,
      description: edu.location,
    });
  }

  for (const highlight of resume.highlights) {
    const year = highlight.year?.toString() ?? "";
    events.push({
      id: `highlight-${highlight.name}`,
      kind: "highlight",
      title: highlight.name,
      subtitle: "Highlight",
      start: year,
      end: year,
      description: highlight.description,
    });
  }

  for (const project of resume.projects) {
    events.push({
      id: `freelance-${project.title}`,
      kind: "freelance",
      title: project.title,
      subtitle: project.role ?? "Freelance",
      start: project.duration ?? "",
      description: project.description,
    });
  }

  return events.sort((a, b) => {
    const aKey = parseSortKey(a.end ?? a.start);
    const bKey = parseSortKey(b.end ?? b.start);
    if (bKey !== aKey) return bKey - aKey;
    return parseSortKey(b.start) - parseSortKey(a.start);
  });
}
