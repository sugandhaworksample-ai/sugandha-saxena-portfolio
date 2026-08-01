"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Stacks full-viewport sections so the next one rises up and covers the current.
 * Home-only: requires [data-chapter] or [data-section-rise] (≥2 panels).
 * Never hijacks normal page <section> elements.
 */
export function SectionRise() {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const panels = collectPanels();
    if (panels.length < 2) return;

    panels.forEach((panel, index) => {
      const z = String(index + 1);
      panel.style.setProperty("--rise-z", z);

      if (
        panel.matches("[data-rise-skip]") ||
        panel.querySelector("[data-work-track], [data-timeline-track]")
      ) {
        panel.classList.add("section-rise-solid");
        return;
      }

      panel.classList.add("section-rise");
    });

    return () => {
      panels.forEach((panel) => {
        panel.classList.remove("section-rise", "section-rise-solid");
        panel.style.removeProperty("--rise-z");
      });
    };
  }, [pathname, reduceMotion]);

  return null;
}

function collectPanels(): HTMLElement[] {
  const chapters = Array.from(
    document.querySelectorAll<HTMLElement>("[data-chapter]"),
  );
  if (chapters.length >= 2) return chapters;

  const explicit = Array.from(
    document.querySelectorAll<HTMLElement>("[data-section-rise]"),
  );
  if (explicit.length >= 2) return explicit;

  return [];
}
