"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { ExpandableStackCard } from "@/features/work/expandable-stack-card";
import { cn } from "@/lib/utils";
import type { WorkMedia, WorkStackNode } from "@/types/work-tree";

type FocusMediaGridProps = {
  media: WorkMedia[];
  stacks: WorkStackNode[];
  title: string;
};

export function FocusMediaGrid({ media, stacks, title }: FocusMediaGridProps) {
  const [focused, setFocused] = useState<WorkMedia | null>(null);
  const [grown, setGrown] = useState<string | null>(null);

  const close = useCallback(() => setFocused(null), []);

  useEffect(() => {
    if (!focused) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [focused, close]);

  return (
    <>
      <StaggerList
        as="ul"
        className="mt-12 grid list-none gap-5 md:grid-cols-12 md:gap-6"
      >
        {stacks.map((stack) => (
          <StaggerItem key={stack.id} as="li" className="md:col-span-4">
            <ExpandableStackCard
              stack={stack}
              onFocusMedia={(item) => setFocused(item)}
            />
          </StaggerItem>
        ))}

        {media.map((item, index) => {
          const isGrown = grown === item.src;
          const span = isGrown
            ? "md:col-span-8"
            : index % 5 === 0
              ? "md:col-span-6"
              : "md:col-span-4";
          const aspect = isGrown
            ? "aspect-[16/10]"
            : index % 3 === 0
              ? "aspect-[4/5]"
              : "aspect-[4/3]";

          return (
            <StaggerItem key={item.src} as="li" className={span}>
              <motion.button
                type="button"
                layout
                onMouseEnter={() => setGrown(item.src)}
                onMouseLeave={() => setGrown(null)}
                onClick={() => setFocused(item)}
                className={cn(
                  "bg-muted group relative w-full overflow-hidden rounded-2xl text-left transition-[flex] duration-300 ease-out",
                  aspect,
                )}
                aria-label={`View ${item.alt}`}
              >
                {item.kind === "video" ? (
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <Image
                    src={item.thumbSrc ?? item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                {item.kind === "video" ? (
                  <span className="bg-background/70 absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] tracking-[0.16em] uppercase backdrop-blur">
                    Video
                  </span>
                ) : null}
              </motion.button>
            </StaggerItem>
          );
        })}
      </StaggerList>

      {focused ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} focused view`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="text-background/80 hover:text-background absolute top-4 right-4 z-10 text-sm tracking-[0.14em] uppercase"
          >
            Close
          </button>
          <div
            className="relative max-h-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            {focused.kind === "video" ? (
              <video
                src={focused.src}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] w-auto max-w-full rounded-xl"
              />
            ) : (
              <div className="relative h-[85vh] w-[min(92vw,1100px)]">
                <Image
                  src={focused.src}
                  alt={focused.alt}
                  fill
                  className="object-contain"
                  sizes="92vw"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
