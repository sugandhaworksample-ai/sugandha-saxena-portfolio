import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { PageShell } from "@/components/page-shell";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Awards",
  description:
    "Selected highlights and recognition for Sugandha Saxena's creative work.",
  path: "/awards",
});

export default function AwardsPage() {
  const { highlights } = getResume();

  return (
    <PageShell
      title="Highlights"
      description="Selected moments of recognition and national-level creative leadership — not a fabricated awards list."
    >
      {highlights.length > 0 ? (
        <Reveal>
          <StaggerList className="space-y-10">
            {highlights.map((item) => (
              <StaggerItem key={item.name} className="max-w-2xl space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                  {item.year ?? "Highlight"}
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  {item.name}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerList>
        </Reveal>
      ) : (
        <p className="text-muted-foreground text-sm">
          Highlights will appear here as they land.
        </p>
      )}
    </PageShell>
  );
}
