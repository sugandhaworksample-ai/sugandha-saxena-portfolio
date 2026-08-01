"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
};

export function Marquee({
  children,
  className,
  speed = 35,
  reverse = false,
}: MarqueeProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={cn("flex flex-wrap gap-4", className)}>{children}</div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="flex w-max gap-8"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="flex gap-8">{children}</div>
        <div className="flex gap-8" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
