"use client";

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  gsap.defaults({
    ease: "power3.out",
    duration: 0.8,
  });
  registered = true;
}

export function refreshScrollTrigger() {
  if (typeof window === "undefined") return;
  ensureGsapPlugins();
  ScrollTrigger.refresh();
}

export function killScrollTriggers(scope?: HTMLElement | string) {
  if (typeof window === "undefined") return;
  ensureGsapPlugins();
  const triggers = ScrollTrigger.getAll();
  for (const trigger of triggers) {
    if (!scope) {
      trigger.kill();
      continue;
    }
    const triggerEl = trigger.trigger;
    if (typeof scope === "string") {
      if (triggerEl?.closest?.(scope) || trigger.vars.id?.includes(scope)) {
        trigger.kill();
      }
      continue;
    }
    if (
      triggerEl === scope ||
      (triggerEl instanceof Node && scope.contains(triggerEl))
    ) {
      trigger.kill();
    }
  }
}

export { gsap, MotionPathPlugin, ScrollTrigger };
