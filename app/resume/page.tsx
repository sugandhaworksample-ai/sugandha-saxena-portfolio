import type { Metadata } from "next";
import Link from "next/link";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import {
  EducationList,
  SkillGroups,
} from "@/components/resume/education-skills";
import {
  ClientList,
  ExperienceList,
} from "@/components/resume/experience-list";
import { Button } from "@/components/ui/button";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description: "Resume and professional summary for Sugandha Saxena.",
  path: "/resume",
});

export default function ResumePage() {
  const resume = getResume();

  return (
    <div className="relative overflow-x-clip pb-28">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-50"
      />
      <Reveal className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Resume
            </p>
            <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">
              {resume.name}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
              {resume.summary}
            </p>
            {(resume.location || resume.phone) && (
              <p className="text-muted-foreground mt-3 text-sm">
                {[resume.location, resume.phone].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <Magnetic>
            <Button asChild className="pressable">
              <a href={`mailto:${resume.email}`}>Email CV</a>
            </Button>
          </Magnetic>
        </div>
      </Reveal>

      <section className="mx-auto mt-16 max-w-6xl px-6">
        <h2 className="font-display text-2xl font-semibold">Skills</h2>
        <div className="mt-8">
          <SkillGroups groups={resume.skills} />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <h2 className="font-display text-2xl font-semibold">Experience</h2>
        <div className="mt-8">
          <ExperienceList items={resume.experience} />
        </div>
      </section>

      {resume.education.length > 0 ? (
        <section className="mx-auto mt-20 max-w-6xl px-6">
          <h2 className="font-display text-2xl font-semibold">Education</h2>
          <div className="mt-8">
            <EducationList items={resume.education} />
          </div>
        </section>
      ) : null}

      {resume.projects.length > 0 ? (
        <section className="mx-auto mt-20 max-w-6xl px-6">
          <h2 className="font-display text-2xl font-semibold">
            Freelance & clients
          </h2>
          <div className="mt-8">
            <ClientList items={resume.projects} />
          </div>
        </section>
      ) : null}

      {resume.languages.length > 0 ? (
        <section className="mx-auto mt-20 max-w-6xl px-6">
          <h2 className="font-display text-2xl font-semibold">Languages</h2>
          <p className="text-muted-foreground mt-4 text-sm">
            {resume.languages.join(" · ")}
          </p>
        </section>
      ) : null}

      <section className="mx-auto mt-16 flex max-w-6xl flex-wrap gap-3 px-6">
        <Button asChild variant="outline" className="pressable">
          <Link href="/experience">Experience page</Link>
        </Button>
        <Button asChild variant="outline" className="pressable">
          <Link href="/contact">Contact</Link>
        </Button>
      </section>
    </div>
  );
}
