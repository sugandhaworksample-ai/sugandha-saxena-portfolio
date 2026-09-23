"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
};

function track(children: ReactNode, prefix: string) {
  return Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    const element = child as ReactElement<{ key?: string | null }>;
    return cloneElement(element, {
      key: `${prefix}-${element.key ?? index}`,
    });
  });
}

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
        <div className="flex gap-8">{track(children, "a")}</div>
        <div className="flex gap-8" aria-hidden>
          {track(children, "b")}
        </div>
      </motion.div>
    </div>
  );
}
