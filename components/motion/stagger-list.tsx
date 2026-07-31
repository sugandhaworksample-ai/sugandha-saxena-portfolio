"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  durations,
  easings,
  stagger,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerListProps = {
  children: ReactNode;
  className?: string;
  as?: "ul" | "ol" | "div";
};

const containers = {
  ul: motion.ul,
  ol: motion.ol,
  div: motion.div,
} as const;

export function StaggerList({
  children,
  className,
  as = "ul",
}: StaggerListProps) {
  const reduceMotion = useReducedMotion();
  const Comp = containers[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Comp
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      variants={{
        ...staggerContainerVariants,
        visible: {
          transition: { staggerChildren: stagger.base },
        },
      }}
    >
      {children}
    </Comp>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "li" | "div";
};

const items = {
  li: motion.li,
  div: motion.div,
} as const;

export function StaggerItem({
  children,
  className,
  as = "li",
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  const Comp = items[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Comp
      className={cn(className)}
      variants={staggerItemVariants}
      transition={{ duration: durations.base, ease: easings.out }}
    >
      {children}
    </Comp>
  );
}
