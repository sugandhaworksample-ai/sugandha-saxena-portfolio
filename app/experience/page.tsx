import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { PageShell } from "@/components/page-shell";
import {
  ClientList,
  ExperienceList,
} from "@/components/resume/experience-list";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Experience",
  description:
    "Professional experience and freelance collaborations for Sugandha Saxena across creative design, branding, and motion.",
  path: "/experience",
});

export default function ExperiencePage() {
  const resume = getResume();

  return (
    <PageShell
      title="Experience"
      description="Roles, impact, and selected client collaborations across branding, digital, and motion."
    >
      <div className="space-y-16">
        <Reveal as="section" className="space-y-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Work experience
          </h2>
          <ExperienceList items={resume.experience} />
        </Reveal>

        <Reveal as="section" className="space-y-8" delay={0.05}>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Selected clients
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm text-pretty">
              Freelance collaborations spanning entertainment brands, political
              campaigns, and brand systems.
            </p>
          </div>
          <ClientList items={resume.projects} />
        </Reveal>
      </div>
    </PageShell>
  );
}
