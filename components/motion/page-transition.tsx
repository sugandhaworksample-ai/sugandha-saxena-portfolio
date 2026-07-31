"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { durations, easings, pageTransitionVariants } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageTransitionVariants}
      transition={{ duration: durations.page, ease: easings.out }}
    >
      {children}
    </motion.div>
  );
}
