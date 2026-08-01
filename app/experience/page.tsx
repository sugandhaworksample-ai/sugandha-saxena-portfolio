import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { ExperienceTimeline } from "@/features/experience/experience-timeline";
import { getExperience } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Experience",
  description:
    "Professional experience and roles for Sugandha Saxena across creative design and technology.",
  path: "/experience",
});

export default function ExperiencePage() {
  const roles = getExperience();

  return (
    <div className="relative overflow-hidden pb-28">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-60"
      />
      <Reveal className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          Career
        </p>
        <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">
          Experience
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg">
          Roles that shaped the craft — scroll the line as chapters unlock.
        </p>
      </Reveal>
      <div className="mt-16 px-6">
        <ExperienceTimeline roles={roles} />
      </div>
    </div>
  );
}
