"use client";

import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import type { Experience, FreelanceProject } from "@/types/resume";

type ExperienceListProps = {
  items: Experience[];
};

export function ExperienceList({ items }: ExperienceListProps) {
  return (
    <StaggerList as="ol" className="space-y-12">
      {items.map((job) => (
        <StaggerItem key={`${job.company}-${job.start}`} className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {job.role}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {job.company}
                <span className="text-border mx-2">·</span>
                {job.location}
              </p>
            </div>
            <p className="text-muted-foreground shrink-0 text-sm tabular-nums">
              {job.start} – {job.end}
            </p>
          </div>
          {job.responsibilities.length > 0 ? (
            <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </StaggerItem>
      ))}
    </StaggerList>
  );
}

type ClientListProps = {
  items: FreelanceProject[];
};

export function ClientList({ items }: ClientListProps) {
  return (
    <StaggerList className="space-y-8">
      {items.map((project) => (
        <StaggerItem key={project.title} className="space-y-1">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            {project.title}
          </h3>
          {project.role ? (
            <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
              {project.role}
            </p>
          ) : null}
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.description}
          </p>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
