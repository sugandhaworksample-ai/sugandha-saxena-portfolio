/**
 * Motion tokens — Emil Kowalski aligned.
 * UI under ~300ms, custom ease-out, never ease-in for enters.
 * Durations respect CSS --motion-scale when read from the client helper.
 */

export const easings = {
  out: [0.23, 1, 0.32, 1] as const,
  outSoft: [0.22, 1, 0.36, 1] as const,
  inOut: [0.77, 0, 0.175, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
  drawer: [0.32, 0.72, 0, 1] as const,
};

/** Seconds — multiply by getMotionScale() on the client when needed */
export const durations = {
  instant: 0.1,
  press: 0.14,
  fast: 0.18,
  base: 0.22,
  slow: 0.3,
  page: 0.28,
  story: 0.85,
} as const;

export const stagger = {
  fast: 0.04,
  base: 0.055,
  slow: 0.08,
} as const;

export const cssEasings = {
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
} as const;

export function getMotionScale(): number {
  if (typeof window === "undefined") return 1;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--motion-scale")
    .trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

export function scaledDuration(seconds: number): number {
  return seconds * getMotionScale();
}

export const motion = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: durations.base, ease: easings.out },
  },
  fadeUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: durations.base, ease: easings.out },
  },
} as const;

export const revealVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
} as const;

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
} as const;

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.base,
    },
  },
} as const;

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.out },
  },
} as const;

/** GSAP-friendly cubic-bezier string for story moments */
export const gsapEaseOut = "power3.out";
