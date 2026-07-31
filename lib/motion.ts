/**
 * Motion tokens aligned with Emil Kowalski design-engineering principles:
 * UI under ~300ms, ease-out / custom curves, never ease-in for enters.
 */
export const easings = {
  out: [0.16, 1, 0.3, 1] as const,
  outSoft: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
};

export const durations = {
  instant: 0.1,
  fast: 0.18,
  base: 0.24,
  slow: 0.32,
  story: 0.8,
} as const;

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
