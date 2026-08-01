import type { Metadata } from "next";

import { HoverLift } from "@/components/motion/hover-lift";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { Button } from "@/components/ui/button";
import { getDevelopmentPage } from "@/lib/pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Development",
  description: "Creative coding and interactive builds by Sugandha Saxena.",
  path: "/development",
});

export default function DevelopmentPage() {
  // All content for this page is configured in content/pages/development.yaml
  const { eyebrow, headline, subtitle, projects } = getDevelopmentPage();

  return (
    <div className="relative overflow-hidden pb-28">
      <div aria-hidden className="hero-atmosphere absolute inset-0 -z-10" />
      <Reveal className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
        <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">
          {headline}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg">
          {subtitle}
        </p>
        {projects.length === 0 && (
          <div className="mt-10">
            <Magnetic>
              <Button asChild className="pressable">
                <a
                  href="https://www.behance.net/saxenasugu7614"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Behance
                </a>
              </Button>
            </Magnetic>
          </div>
        )}
      </Reveal>

      {projects.length > 0 && (
        <StaggerList
          className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 md:grid-cols-2"
          as="ul"
        >
          {projects.map((project) => (
            <StaggerItem key={project.title}>
              <HoverLift>
                <a
                  href={project.href ?? "#"}
                  target={
                    project.href?.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    project.href?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="border-border/60 bg-card/50 group hover:border-accent block rounded-3xl border p-6 transition-colors duration-200 md:p-8"
                >
                  <div className="bg-accent/20 absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    {project.subtitle ? (
                      <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                        {project.subtitle}
                      </p>
                    ) : null}
                    <h2 className="font-display mt-3 text-xl font-semibold md:text-2xl">
                      {project.title}
                    </h2>
                    {project.body ? (
                      <p className="text-muted-foreground mt-3 text-sm text-pretty md:text-base">
                        {project.body}
                      </p>
                    ) : null}
                    {project.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border-border/60 text-muted-foreground rounded-full border px-3 py-1 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.href ? (
                      <p className="text-accent mt-5 text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        View →
                      </p>
                    ) : null}
                  </div>
                </a>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
