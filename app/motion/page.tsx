import type { Metadata } from "next";
import Link from "next/link";

import { HoverLift } from "@/components/motion/hover-lift";
import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { TiltMedia } from "@/components/motion/tilt-media";
import { getMotionPage } from "@/lib/pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Motion Design",
  description:
    "Motion design work by Sugandha Saxena — storytelling through timing, typography, and cinematic craft.",
  path: "/motion",
});

export default function MotionPage() {
  // All content for this page is configured in content/pages/motion.yaml
  const { eyebrow, headline, subtitle, items } = getMotionPage();

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
      </Reveal>

      <StaggerList
        className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3"
        as="ul"
      >
        {items.map((item) => (
          <StaggerItem key={item.title}>
            <HoverLift>
              <TiltMedia>
                <Link
                  href={item.href ?? "/projects"}
                  className="border-border/60 bg-card/50 group hover:border-accent relative block overflow-hidden rounded-3xl border p-6 transition-colors duration-200"
                >
                  <div className="bg-accent/20 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    {item.subtitle ? (
                      <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                        {item.subtitle}
                      </p>
                    ) : null}
                    <h2 className="font-display mt-4 text-2xl font-semibold">
                      {item.title}
                    </h2>
                    {item.body ? (
                      <p className="text-muted-foreground mt-3 text-sm">
                        {item.body}
                      </p>
                    ) : null}
                    <p className="text-accent mt-6 text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {item.videoUrl ? "Play →" : "View →"}
                    </p>
                  </div>
                </Link>
              </TiltMedia>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
