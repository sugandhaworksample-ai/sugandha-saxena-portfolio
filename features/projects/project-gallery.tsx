"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { HoverLift } from "@/components/motion/hover-lift";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { TiltMedia } from "@/components/motion/tilt-media";
import type { GalleryItem } from "@/lib/project-gallery";
import { cn } from "@/lib/utils";

type ProjectGalleryProps = {
  items: GalleryItem[];
  title: string;
};

export function ProjectGallery({ items, title }: ProjectGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") {
        setActive((i) => (i === null ? i : (i + 1) % items.length));
      }
      if (event.key === "ArrowLeft") {
        setActive((i) =>
          i === null ? i : (i - 1 + items.length) % items.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close, items.length]);

  if (!items.length) return null;

  return (
    <>
      <StaggerList
        as="ul"
        className="mt-14 grid list-none gap-5 md:grid-cols-12 md:gap-6"
      >
        {items.map((item, index) => {
          const span =
            index % 5 === 0
              ? "md:col-span-12"
              : index % 5 === 1 || index % 5 === 2
                ? "md:col-span-6"
                : "md:col-span-4";
          const tall = index % 5 === 3 || index % 5 === 4;

          return (
            <StaggerItem key={`${item.src}-${index}`} as="li" className={span}>
              <HoverLift>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className="group block w-full cursor-zoom-in text-left"
                  aria-label={`Open ${item.alt ?? title}`}
                >
                  <TiltMedia
                    className={cn(
                      "bg-muted relative overflow-hidden rounded-2xl",
                      index % 5 === 0
                        ? "aspect-[16/9]"
                        : tall
                          ? "aspect-[4/5]"
                          : "aspect-[4/3]",
                    )}
                    maxTilt={6}
                  >
                    <GalleryMedia
                      item={item}
                      priority={index === 0}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    {item.kind === "video" ? (
                      <span className="bg-background/70 absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] tracking-[0.16em] uppercase backdrop-blur">
                        Video
                      </span>
                    ) : null}
                  </TiltMedia>
                </button>
              </HoverLift>
            </StaggerItem>
          );
        })}
      </StaggerList>

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
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
            {items[active].kind === "video" ? (
              <video
                key={items[active].src}
                src={items[active].src}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] w-auto max-w-full rounded-xl"
              />
            ) : (
              <div className="relative h-[85vh] w-[min(92vw,1100px)]">
                <Image
                  src={items[active].src}
                  alt={items[active].alt ?? title}
                  fill
                  className="object-contain"
                  sizes="92vw"
                  priority
                />
              </div>
            )}
            <p className="text-background/70 mt-4 text-center text-xs tracking-[0.16em] uppercase">
              {active + 1} / {items.length}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function GalleryMedia({
  item,
  className,
  priority,
}: {
  item: GalleryItem;
  className?: string;
  priority?: boolean;
}) {
  if (item.kind === "video") {
    return (
      <video
        src={item.src}
        muted
        loop
        playsInline
        autoPlay
        className={cn("absolute inset-0 size-full", className)}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt ?? ""}
      fill
      priority={priority}
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1152px"
    />
  );
}
