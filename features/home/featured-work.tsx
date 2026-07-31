"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import type { Project } from "@/types/project";

type FeaturedWorkProps = {
  projects: Project[];
};

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  return (
    <Reveal
      as="section"
      className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
    >
      <div className="mb-14 flex items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground mb-3 text-xs tracking-[0.18em] uppercase">
            Selected
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Work that carries a story
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md text-pretty">
            Brand systems, packaging, and visual craft — case studies expand as
            Behance assets land.
          </p>
        </div>
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground pressable hidden text-sm sm:inline-flex"
        >
          All projects
        </Link>
      </div>

      <StaggerList className="flex flex-col gap-16 md:gap-24" as="ul">
        {projects.map((project, index) => {
          const reverse = index % 2 === 1;
          return (
            <StaggerItem key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className={`group grid items-center gap-8 md:grid-cols-12 md:gap-10 ${
                  reverse ? "md:[direction:rtl]" : ""
                }`}
              >
                <div
                  className={`bg-muted relative aspect-[16/10] overflow-hidden md:col-span-7 ${
                    reverse ? "md:[direction:ltr]" : ""
                  }`}
                >
                  {project.cover ? (
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 58vw"
                    />
                  ) : null}
                </div>
                <div
                  className={`space-y-3 md:col-span-5 ${
                    reverse ? "md:[direction:ltr]" : ""
                  }`}
                >
                  <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                    {project.tags.slice(0, 3).join(" · ") || project.role}
                  </p>
                  <h3 className="font-display text-2xl font-semibold tracking-tight transition-opacity duration-200 group-hover:opacity-70 md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm text-pretty md:text-base">
                    {project.description}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerList>

      <div className="mt-12 sm:hidden">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          All projects
        </Link>
      </div>
    </Reveal>
  );
}
