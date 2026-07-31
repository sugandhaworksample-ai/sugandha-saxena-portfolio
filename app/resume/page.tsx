import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { PageShell } from "@/components/page-shell";
import {
  EducationList,
  SkillGroups,
} from "@/components/resume/education-skills";
import {
  ClientList,
  ExperienceList,
} from "@/components/resume/experience-list";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "Full professional resume for Sugandha Saxena — experience, education, skills, and selected clients.",
  path: "/resume",
});

export default function ResumePage() {
  const resume = getResume();

  return (
    <PageShell
      title="Resume"
      description="A structured overview of experience, education, and craft — aligned with the latest resume."
    >
      <div className="space-y-16">
        <Reveal as="section" className="max-w-3xl space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Summary
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            {resume.summary}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <a href={`mailto:${siteConfig.email}`}>Email resume inquiry</a>
            </Button>
            <Button asChild variant="outline">
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal as="section" className="space-y-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Experience
          </h2>
          <ExperienceList items={resume.experience} />
        </Reveal>

        <Reveal as="section" className="space-y-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Selected clients
          </h2>
          <ClientList items={resume.projects} />
        </Reveal>

        <Reveal as="section" className="space-y-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Education
          </h2>
          <EducationList items={resume.education} />
        </Reveal>

        <Reveal as="section" className="space-y-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Skills
          </h2>
          <SkillGroups groups={resume.skills} />
        </Reveal>

        {resume.languages.length > 0 ? (
          <Reveal as="section" className="space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Languages
            </h2>
            <p className="text-muted-foreground text-sm">
              {resume.languages.join(", ")}
            </p>
          </Reveal>
        ) : null}
      </div>
    </PageShell>
  );
}
