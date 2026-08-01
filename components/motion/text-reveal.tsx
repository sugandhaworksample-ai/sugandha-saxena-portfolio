"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { durations, easings } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

export function TextReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const Comp = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Comp
      className={cn("overflow-hidden", className)}
      initial={{ y: "110%", opacity: 0 }}
      whileInView={{ y: "0%", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: durations.slow,
        ease: easings.out,
        delay,
      }}
    >
      {children}
    </Comp>
  );
}
