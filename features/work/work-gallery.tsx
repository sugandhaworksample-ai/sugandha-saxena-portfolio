"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { HoverLift } from "@/components/motion/hover-lift";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { TiltMedia } from "@/components/motion/tilt-media";
import { cn } from "@/lib/utils";
import type { WorkMedia, WorkStackNode } from "@/types/work-tree";

type GallerySection = {
  id: string;
  label?: string;
  items: WorkMedia[];
};

type WorkGalleryProps = {
  media: WorkMedia[];
  stacks?: WorkStackNode[];
  title: string;
};

function tileClass(index: number) {
  const span =
    index % 5 === 0
      ? "md:col-span-12"
      : index % 5 === 1 || index % 5 === 2
        ? "md:col-span-6"
        : "md:col-span-4";
  const aspect =
    index % 5 === 0
      ? "aspect-[16/9]"
      : index % 5 === 3 || index % 5 === 4
        ? "aspect-[4/5]"
        : "aspect-[4/3]";
  return { span, aspect };
}

export function WorkGallery({
  media,
  stacks = [],
  title,
}: WorkGalleryProps) {
  const sections = useMemo((): GallerySection[] => {
    const out: GallerySection[] = [];
    if (media.length) {
      out.push({ id: "loose", items: media });
    }
    for (const stack of stacks) {
      if (!stack.items.length) continue;
      out.push({
        id: stack.id,
        label: stack.title,
        items: stack.items,
      });
    }
    return out;
  }, [media, stacks]);

  const flat = useMemo(
    () => sections.flatMap((section) => section.items),
    [sections],
  );

  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") {
        setActive((i) => (i === null ? i : (i + 1) % flat.length));
      }
      if (event.key === "ArrowLeft") {
        setActive((i) =>
          i === null ? i : (i - 1 + flat.length) % flat.length,
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
  }, [active, close, flat.length]);

  if (!flat.length) return null;

  let flatIndex = 0;

  return (
    <>
      <div className="mt-12 space-y-14">
        {sections.map((section) => {
          const start = flatIndex;
          flatIndex += section.items.length;

          return (
            <section key={section.id}>
              {section.label ? (
                <h2 className="text-muted-foreground mb-6 text-xs tracking-[0.18em] uppercase">
                  {section.label}
                </h2>
              ) : null}
              <StaggerList
                as="ul"
                className="grid list-none gap-5 md:grid-cols-12 md:gap-6"
              >
                {section.items.map((item, index) => {
                  const globalIndex = start + index;
                  const { span, aspect } = tileClass(index);
                  return (
                    <StaggerItem
                      key={`${item.src}-${globalIndex}`}
                      as="li"
                      className={span}
                    >
                      <HoverLift>
                        <button
                          type="button"
                          onClick={() => setActive(globalIndex)}
                          className="group block w-full cursor-zoom-in text-left"
                          aria-label={`Open ${item.alt || title}`}
                        >
                          <TiltMedia
                            className={cn(
                              "bg-muted relative overflow-hidden rounded-2xl",
                              aspect,
                            )}
                            maxTilt={6}
                          >
                            <TileMedia
                              item={item}
                              priority={globalIndex === 0}
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
            </section>
          );
        })}
      </div>

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
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActive((i) =>
                i === null ? i : (i - 1 + flat.length) % flat.length,
              );
            }}
            className="text-background/80 hover:text-background absolute top-1/2 left-3 z-10 -translate-y-1/2 text-sm tracking-[0.14em] uppercase md:left-8"
            aria-label="Previous"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActive((i) => (i === null ? i : (i + 1) % flat.length));
            }}
            className="text-background/80 hover:text-background absolute top-1/2 right-3 z-10 -translate-y-1/2 text-sm tracking-[0.14em] uppercase md:right-8"
            aria-label="Next"
          >
            Next
          </button>
          <div
            className="relative max-h-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            {flat[active].kind === "video" ? (
              <video
                key={flat[active].src}
                src={flat[active].src}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] w-auto max-w-full rounded-xl"
              />
            ) : (
              <div className="relative h-[85vh] w-[min(92vw,1100px)]">
                <Image
                  src={flat[active].src}
                  alt={flat[active].alt || title}
                  fill
                  className="object-contain"
                  sizes="92vw"
                  priority
                />
              </div>
            )}
            <p className="text-background/70 mt-4 text-center text-xs tracking-[0.16em] uppercase">
              {active + 1} / {flat.length}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function TileMedia({
  item,
  priority,
}: {
  item: WorkMedia;
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
        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
    );
  }

  return (
    <Image
      src={item.thumbSrc ?? item.src}
      alt={item.alt}
      fill
      priority={priority}
      quality={60}
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
    />
  );
}
