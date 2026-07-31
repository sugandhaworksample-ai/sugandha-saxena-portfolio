import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Motion Design",
  description:
    "Motion design work by Sugandha Saxena — storytelling through timing, typography, and cinematic craft.",
  path: "/motion",
});

export default function MotionPage() {
  const resume = getResume();
  const motionRole = resume.experience.find((job) => /motion/i.test(job.role));
  const motionClient = resume.projects.find((project) =>
    /motion/i.test(project.description),
  );
  const motionSkills = resume.skills
    .flatMap((group) => group.items)
    .filter((item) =>
      /motion|animation|video|after effects|premiere/i.test(item),
    );

  return (
    <PageShell
      title="Motion Design"
      description="Motion graphics, promotional video, and timed visual storytelling — from campaign spots to social systems."
    >
      <div className="space-y-14">
        <Reveal as="section" className="max-w-3xl space-y-4">
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            Motion is a core part of the craft — building brand presence through
            paced graphics, promotional edits, and social-first video. Showreel
            and case study media land here as assets are ready.
          </p>
          <Button asChild variant="outline">
            <Link href="/experience">See motion roles</Link>
          </Button>
        </Reveal>

        {motionRole ? (
          <Reveal as="section" className="space-y-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Featured role
            </h2>
            <div className="max-w-2xl space-y-2">
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {motionRole.role}
              </h3>
              <p className="text-muted-foreground text-sm">
                {motionRole.company}
                <span className="text-border mx-2">·</span>
                {motionRole.start} – {motionRole.end}
              </p>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm leading-relaxed">
                {motionRole.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}

        {motionClient ? (
          <Reveal as="section" className="space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Selected campaign
            </h2>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {motionClient.title}
            </h3>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              {motionClient.description}
            </p>
          </Reveal>
        ) : null}

        {motionSkills.length > 0 ? (
          <Reveal as="section" className="space-y-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Motion toolkit
            </h2>
            <ul className="flex flex-wrap gap-2">
              {motionSkills.map((item) => (
                <li
                  key={item}
                  className="border-border/70 rounded-md border px-3 py-1.5 text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </PageShell>
  );
}
