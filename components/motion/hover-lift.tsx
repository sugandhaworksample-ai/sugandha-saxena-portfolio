"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { durations, easings } from "@/lib/motion";
import { cn } from "@/lib/utils";

type HoverLiftProps = {
  children: ReactNode;
  className?: string;
};

export function HoverLift({ children, className }: HoverLiftProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{ y: -4 }}
      transition={{ duration: durations.fast, ease: easings.out }}
    >
      {children}
    </motion.div>
  );
}
