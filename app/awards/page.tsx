import type { Metadata } from "next";

import { HoverLift } from "@/components/motion/hover-lift";
import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Awards",
  description: "Awards and recognition for Sugandha Saxena.",
  path: "/awards",
});

export default function AwardsPage() {
  const { highlights } = getResume();

  return (
    <div className="relative overflow-hidden pb-28">
      <div aria-hidden className="hero-atmosphere absolute inset-0 -z-10" />
      <Reveal className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          Recognition
        </p>
        <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">Awards</h1>
      </Reveal>

      <StaggerList className="mx-auto mt-14 max-w-4xl space-y-5 px-6" as="ul">
        {highlights.map((item, index) => (
          <StaggerItem key={item.name}>
            <HoverLift>
              <article className="border-border/60 bg-card/50 group hover:border-accent flex items-start gap-6 rounded-3xl border p-6 transition-colors duration-200 md:p-8">
                <span className="font-display text-accent text-4xl tabular-nums opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                    {item.year ?? "Highlight"}
                  </p>
                  <h2 className="font-display mt-2 text-2xl font-semibold">
                    {item.name}
                  </h2>
                  <p className="text-muted-foreground mt-3 text-sm text-pretty md:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
