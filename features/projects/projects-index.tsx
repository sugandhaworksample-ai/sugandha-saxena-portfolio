"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageShell } from "@/components/page-shell";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

type ProjectsIndexProps = {
  projects: Project[];
};

export function ProjectsIndex({ projects }: ProjectsIndexProps) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      for (const tag of project.tags) set.add(tag);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? projects.filter((project) => project.tags.includes(activeTag))
    : projects;

  return (
    <PageShell
      title="Projects"
      description="Case studies structured for process, craft, and outcomes. Content expands as Behance work is imported."
    >
      {tags.length > 0 ? (
        <div className="mb-10 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeTag === null ? "default" : "outline"}
            className="pressable"
            onClick={() => setActiveTag(null)}
          >
            All
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag}
              type="button"
              size="sm"
              variant={activeTag === tag ? "default" : "outline"}
              className="pressable"
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      ) : null}

      <StaggerList
        key={activeTag ?? "all"}
        className="grid gap-10 md:grid-cols-2"
        as="ul"
      >
        {filtered.map((project) => (
          <StaggerItem key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group block space-y-4"
            >
              <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                {project.cover ? (
                  <Image
                    src={project.cover}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : null}
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  {project.tags.slice(0, 3).join(" · ")}
                </p>
                <h2
                  className={cn(
                    "font-display text-2xl font-semibold tracking-tight",
                    "transition-opacity duration-200 group-hover:opacity-70",
                  )}
                >
                  {project.title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerList>
    </PageShell>
  );
}
