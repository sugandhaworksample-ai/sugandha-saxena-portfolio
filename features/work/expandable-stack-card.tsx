"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { durations, easings } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { WorkMedia, WorkStackNode } from "@/types/work-tree";

type ExpandableStackCardProps = {
  stack: WorkStackNode;
  onFocusMedia?: (media: WorkMedia) => void;
  className?: string;
};

export function ExpandableStackCard({
  stack,
  onFocusMedia,
  className,
}: ExpandableStackCardProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const preview = stack.items.slice(0, 5);
  const behind = preview.filter((m) => m.src !== stack.hero.src).slice(0, 3);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group relative block w-full text-left"
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} ${stack.title}`}
      >
        <div className="relative aspect-[4/5] overflow-visible">
          {behind.map((layer, index) => {
            const n = index + 1;
            return (
              <div
                key={layer.src}
                aria-hidden
                className="bg-muted absolute inset-0 overflow-hidden rounded-2xl border border-white/10 transition-transform duration-300 ease-out group-hover:-translate-y-1"
                style={{
                  transform: `translate(${n * 8}px, ${n * 6}px) rotate(${n % 2 === 0 ? -3 : 3}deg) scale(${1 - n * 0.03})`,
                  zIndex: 5 - n,
                  opacity: 0.75,
                }}
              >
                <Image
                  src={layer.thumbSrc ?? layer.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            );
          })}
          <div className="bg-muted relative z-10 aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]">
            {stack.hero.kind === "video" ? (
              <video
                src={stack.hero.src}
                muted
                playsInline
                className="size-full object-cover"
              />
            ) : (
              <Image
                src={stack.hero.thumbSrc ?? stack.hero.src}
                alt={stack.hero.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 28vw"
              />
            )}
            <span className="bg-background/75 absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] tracking-[0.16em] uppercase backdrop-blur">
              {stack.items.length} inside
            </span>
          </div>
        </div>
        <p className="font-display mt-4 text-lg font-semibold tracking-tight">
          {stack.title}
        </p>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: durations.base, ease: easings.out }}
            className="mt-4 grid list-none grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {stack.items.map((item, index) => (
              <motion.li
                key={item.src}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 16, rotate: index % 2 === 0 ? -4 : 4 }
                }
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  duration: durations.base,
                  ease: easings.out,
                  delay: reduceMotion ? 0 : index * 0.04,
                }}
              >
                <button
                  type="button"
                  className="bg-muted relative aspect-square w-full overflow-hidden rounded-xl"
                  onClick={() => onFocusMedia?.(item)}
                  aria-label={`Focus ${item.alt}`}
                >
                  {item.kind === "video" ? (
                    <video
                      src={item.src}
                      muted
                      playsInline
                      className="size-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.thumbSrc ?? item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 ease-out hover:scale-105"
                      sizes="160px"
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
