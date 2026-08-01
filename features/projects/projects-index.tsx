"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { HoverLift } from "@/components/motion/hover-lift";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { TiltMedia } from "@/components/motion/tilt-media";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

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
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-70"
      />
      <div aria-hidden className="grain-overlay -z-10 opacity-60" />
      <div className="mx-auto w-full max-w-6xl px-6 pt-24 pb-10 md:pt-32">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          Archive
        </p>
        <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">Projects</h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg">
          Case studies built for craft, process, and outcomes — hover to feel
          the material.
        </p>

        {tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
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
      </div>

      <StaggerList
        key={activeTag ?? "all"}
        className="mx-auto grid max-w-6xl gap-8 px-6 pb-28 md:grid-cols-2"
        as="ul"
      >
        {filtered.map((project) => (
          <StaggerItem key={project.slug}>
            <HoverLift>
              <SpotlightCard className="rounded-2xl">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <TiltMedia className="bg-muted relative aspect-[16/10] overflow-hidden rounded-2xl">
                    {project.cover ? (
                      <Image
                        src={project.cover}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : null}
                  </TiltMedia>
                  <div className="space-y-2 px-1 pt-5">
                    <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                      {project.tags.slice(0, 3).join(" · ")}
                    </p>
                    <h2 className="font-display text-2xl font-semibold tracking-tight transition-opacity duration-200 group-hover:opacity-75">
                      {project.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {project.description}
                    </p>
                  </div>
                </Link>
              </SpotlightCard>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerList>
    </section>
  );
}
