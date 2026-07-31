import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { PageShell } from "@/components/page-shell";
import { SkillGroups } from "@/components/resume/education-skills";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About Sugandha Saxena — Sr. Creative Designer working across motion, brand, UI/UX, and generative AI.",
  path: "/about",
});

export default function AboutPage() {
  const resume = getResume();

  return (
    <PageShell
      title="About"
      description="Creative designer building brand systems, campaigns, and digital experiences with clarity and craft."
    >
      <div className="space-y-16">
        <Reveal as="section" className="max-w-3xl space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Biography
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            {resume.summary}
          </p>
        </Reveal>

        <Reveal as="section" className="space-y-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Tools & craft
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
