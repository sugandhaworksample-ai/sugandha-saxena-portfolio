"use client";

import { useEffect, useRef } from "react";

import { HoverLift } from "@/components/motion/hover-lift";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ensureGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import type { Experience } from "@/types/resume";

export function ExperienceTimeline({ roles }: { roles: Experience[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion || !rootRef.current || !lineRef.current) return;
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: true,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-role-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 55%",
              scrub: 1,
            },
          },
        );
      });
    }, rootRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduceMotion, roles.length]);

  return (
    <div ref={rootRef} className="relative mx-auto max-w-4xl">
      <div
        ref={lineRef}
        className="bg-accent/50 absolute top-0 left-3 origin-top md:left-1/2 md:-translate-x-px"
        style={{ width: 2, height: "100%", transform: "scaleY(0)" }}
      />
      <ul className="space-y-10">
        {roles.map((role, index) => (
          <li
            key={`${role.company}-${role.role}`}
            data-role-card
            className={`relative pl-10 md:w-[calc(50%-1.5rem)] md:pl-0 ${
              index % 2 === 0
                ? "md:mr-auto md:pr-8 md:text-right"
                : "md:ml-auto md:pl-8"
            }`}
          >
            <span className="bg-accent absolute top-3 left-2 size-2.5 rounded-full md:left-1/2 md:-translate-x-1/2" />
            <HoverLift>
              <SpotlightCard className="border-border/60 bg-card/60 rounded-2xl border p-6 backdrop-blur">
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  {role.start} — {role.end}
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold">
                  {role.role}
                </h3>
                <p className="text-accent mt-1 text-sm font-medium">
                  {role.company}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {role.location}
                </p>
                {role.responsibilities.length > 0 ? (
                  <ul className="text-muted-foreground mt-4 space-y-2 text-left text-sm">
                    {role.responsibilities.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                ) : null}
              </SpotlightCard>
            </HoverLift>
          </li>
        ))}
      </ul>
    </div>
  );
}
