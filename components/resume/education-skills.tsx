"use client";

import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import type { Education, SkillGroup } from "@/types/resume";

type EducationListProps = {
  items: Education[];
};

export function EducationList({ items }: EducationListProps) {
  return (
    <StaggerList className="space-y-6">
      {items.map((edu) => (
        <StaggerItem
          key={`${edu.institution}-${edu.degree}`}
          className="space-y-1"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {edu.degree}
              </h3>
              <p className="text-muted-foreground text-sm">
                {edu.institution}
                <span className="text-border mx-2">·</span>
                {edu.location}
              </p>
            </div>
            <p className="text-muted-foreground shrink-0 text-sm tabular-nums">
              {edu.start === edu.end ? edu.end : `${edu.start} – ${edu.end}`}
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}

type SkillGroupsProps = {
  groups: SkillGroup[];
};

export function SkillGroups({ groups }: SkillGroupsProps) {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {groups.map((group) => (
        <div key={group.category} className="space-y-4">
          <h3 className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
            {group.category}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="border-border/70 text-foreground/90 rounded-md border px-3 py-1.5 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
