"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { durations, easings, revealVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  delay?: number;
};

export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Comp =
    as === "section"
      ? motion.section
      : as === "article"
        ? motion.article
        : motion.div;

  return (
    <Comp
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={revealVariants}
      transition={{
        duration: durations.base,
        ease: easings.out,
        delay,
      }}
    >
      {children}
    </Comp>
  );
}
