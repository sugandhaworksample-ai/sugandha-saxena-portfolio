"use client";

import { useEffect, useRef } from "react";

import { HoverLift } from "@/components/motion/hover-lift";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ensureGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import type { TimelineEvent } from "@/types/resume";

export function HorizontalTimeline({ events }: { events: TimelineEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion || !sectionRef.current || !trackRef.current) return;
    ensureGsapPlugins();
    const track = trackRef.current;
    const ctx = gsap.context(() => {
      const amount = Math.max(track.scrollWidth - window.innerWidth + 64, 0);
      gsap.to(track, {
        x: () => -amount,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${amount + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduceMotion, events.length]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="flex h-[80vh] items-center md:h-screen">
        <div
          ref={trackRef}
          className="flex gap-6 px-6 will-change-transform md:gap-10"
        >
          <div className="flex w-[70vw] shrink-0 flex-col justify-center md:w-[36vw]">
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Journey
            </p>
            <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">
              Timeline
            </h1>
            <p className="text-muted-foreground mt-4 max-w-sm">
              Scroll to travel years — roles, education, and highlights in one
              continuous line.
            </p>
          </div>
          {events.map((event) => (
            <HoverLift key={event.id}>
              <article className="border-border/60 bg-card/70 flex h-[50vh] w-[78vw] shrink-0 flex-col justify-between rounded-3xl border p-8 backdrop-blur md:w-[28vw]">
                <div>
                  <p className="text-accent text-xs tracking-[0.16em] uppercase">
                    {event.kind}
                  </p>
                  <h2 className="font-display mt-4 text-2xl font-semibold md:text-3xl">
                    {event.title}
                  </h2>
                  <p className="text-muted-foreground mt-2">{event.subtitle}</p>
                </div>
                <p className="text-sm tracking-[0.12em] uppercase">
                  {event.start}
                  {event.end && event.end !== event.start
                    ? ` — ${event.end}`
                    : ""}
                </p>
              </article>
            </HoverLift>
          ))}
        </div>
      </div>
    </section>
  );
}
