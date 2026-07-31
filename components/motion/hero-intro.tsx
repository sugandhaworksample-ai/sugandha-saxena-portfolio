"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { durations, easings, stagger } from "@/lib/motion";

type HeroIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions: ReactNode;
};

export function HeroIntro({
  eyebrow,
  title,
  description,
  actions,
}: HeroIntroProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div>
        <p className="text-muted-foreground mb-4 text-sm tracking-[0.18em] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">
          {description}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">{actions}</div>
      </div>
    );
  }

  const item = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger.slow },
        },
      }}
    >
      <motion.p
        className="text-muted-foreground mb-4 text-sm tracking-[0.18em] uppercase"
        variants={item}
        transition={{ duration: durations.base, ease: easings.out }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className="font-display max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl"
        variants={item}
        transition={{ duration: durations.slow, ease: easings.out }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty"
        variants={item}
        transition={{ duration: durations.base, ease: easings.out }}
      >
        {description}
      </motion.p>
      <motion.div
        className="mt-10 flex flex-wrap gap-3"
        variants={item}
        transition={{ duration: durations.base, ease: easings.out }}
      >
        {actions}
      </motion.div>
    </motion.div>
  );
}
