"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getMotionScale, gsapEaseOut } from "@/lib/motion";

type GsapHeroIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions: ReactNode;
};

export function GsapHeroIntro({
  eyebrow,
  title,
  description,
  actions,
}: GsapHeroIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion || !rootRef.current) return;

      const scale = getMotionScale();
      const items = rootRef.current.querySelectorAll("[data-hero-item]");

      gsap.fromTo(
        items,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85 * scale,
          ease: gsapEaseOut,
          stagger: 0.09 * scale,
          clearProps: "transform",
        },
      );
    },
    { dependencies: [reduceMotion], scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <p
        data-hero-item
        className="text-muted-foreground mb-4 text-sm tracking-[0.18em] uppercase"
        style={reduceMotion ? undefined : { opacity: 0 }}
      >
        {eyebrow}
      </p>
      <h1
        data-hero-item
        className="font-display max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl"
        style={reduceMotion ? undefined : { opacity: 0 }}
      >
        {title}
      </h1>
      <p
        data-hero-item
        className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty md:text-xl"
        style={reduceMotion ? undefined : { opacity: 0 }}
      >
        {description}
      </p>
      <div
        data-hero-item
        className="mt-10 flex flex-wrap gap-3"
        style={reduceMotion ? undefined : { opacity: 0 }}
      >
        {actions}
      </div>
    </div>
  );
}
