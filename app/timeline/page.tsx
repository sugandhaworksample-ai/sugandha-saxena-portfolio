import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { PageShell } from "@/components/page-shell";
import { getTimelineEvents } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Timeline",
  description: "A chronological view of Sugandha Saxena's creative journey.",
  path: "/timeline",
});

const kindLabel: Record<string, string> = {
  role: "Role",
  education: "Education",
  highlight: "Highlight",
  freelance: "Freelance",
};

export default function TimelinePage() {
  const events = getTimelineEvents();
  const primary = events.filter((e) => e.kind !== "freelance");
  const freelance = events.filter((e) => e.kind === "freelance");
  const ordered = [...primary, ...freelance];

  return (
    <PageShell
      title="Timeline"
      description="Milestones across roles, education, and selected collaborations."
    >
      <Reveal>
        <StaggerList
          as="ol"
          className="border-border/70 relative space-y-0 border-l pl-8"
        >
          {ordered.map((event) => {
            const range =
              event.start && event.end && event.start !== event.end
                ? `${event.start} – ${event.end}`
                : event.start || event.end || "Collaboration";

            return (
              <StaggerItem key={event.id} className="relative pb-12 last:pb-0">
                <span
                  aria-hidden
                  className="bg-foreground absolute top-1.5 -left-[2.05rem] size-2.5 rounded-full"
                />
                <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                  {kindLabel[event.kind] ?? event.kind}
                  {event.start || event.end ? (
                    <>
                      <span className="text-border mx-2">·</span>
                      <span className="tracking-normal normal-case tabular-nums">
                        {range}
                      </span>
                    </>
                  ) : null}
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold tracking-tight">
                  {event.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {event.subtitle}
                  {event.description &&
                  (event.kind === "role" || event.kind === "education") ? (
                    <>
                      <span className="text-border mx-2">·</span>
                      {event.description}
                    </>
                  ) : null}
                </p>
                {(event.kind === "highlight" || event.kind === "freelance") &&
                event.description ? (
                  <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                    {event.description}
                  </p>
                ) : null}
              </StaggerItem>
            );
          })}
        </StaggerList>
      </Reveal>
    </PageShell>
  );
}
