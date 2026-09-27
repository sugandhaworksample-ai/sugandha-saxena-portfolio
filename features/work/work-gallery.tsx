"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { StackedSubsectionCard } from "@/features/work/stacked-subsection-card";
import type { WorkMedia, WorkStackNode } from "@/types/work-tree";

type MediaSection = {
  kind: "media";
  id: string;
  label?: string;
  items: WorkMedia[];
};

type CarouselSection = {
  kind: "carousel";
  stack: WorkStackNode;
};

type GallerySection = MediaSection | CarouselSection;

type WorkGalleryProps = {
  media: WorkMedia[];
  stacks?: WorkStackNode[];
  title: string;
};

const cellClass =
  "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]";

export function WorkGallery({
  media,
  stacks = [],
  title,
}: WorkGalleryProps) {
  const sections = useMemo((): GallerySection[] => {
    const out: GallerySection[] = [];
    if (media.length) {
      out.push({ kind: "media", id: "loose", items: media });
    }
    for (const stack of stacks) {
      if (!stack.items.length) continue;
      if (stack.layout === "carousel") {
        out.push({ kind: "carousel", stack });
      } else {
        out.push({
          kind: "media",
          id: stack.id,
          label: stack.title,
          items: stack.items,
        });
      }
    }
    return out;
  }, [media, stacks]);

  const flat = useMemo(
    () =>
      sections.flatMap((section) =>
        section.kind === "media" ? section.items : [],
      ),
    [sections],
  );

  const [active, setActive] = useState<number | null>(null);
  const [carousel, setCarousel] = useState<WorkStackNode | null>(null);
  const [slide, setSlide] = useState(0);

  const close = useCallback(() => {
    setActive(null);
    setCarousel(null);
  }, []);

  const openCarousel = useCallback((stack: WorkStackNode) => {
    setActive(null);
    setSlide(0);
    setCarousel(stack);
  }, []);

  useEffect(() => {
    const viewing = active !== null || carousel !== null;
    if (!viewing) return;
    const length = carousel ? carousel.items.length : flat.length;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") {
        if (carousel) {
          setSlide((i) => (i + 1) % length);
        } else {
          setActive((i) => (i === null ? i : (i + 1) % length));
        }
      }
      if (event.key === "ArrowLeft") {
        if (carousel) {
          setSlide((i) => (i - 1 + length) % length);
        } else {
          setActive((i) => (i === null ? i : (i - 1 + length) % length));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, carousel, close, flat.length]);

  if (!sections.length) return null;

  const blocks: Array<
    | { kind: "carousels"; stacks: WorkStackNode[] }
    | { kind: "media"; section: MediaSection; start: number }
  > = [];
  let carouselRun: WorkStackNode[] = [];
  let flatIndex = 0;
  const flushCarousels = () => {
    if (!carouselRun.length) return;
    blocks.push({ kind: "carousels", stacks: carouselRun });
    carouselRun = [];
  };
  for (const section of sections) {
    if (section.kind === "carousel") {
      carouselRun.push(section.stack);
      continue;
    }
    flushCarousels();
    blocks.push({ kind: "media", section, start: flatIndex });
    flatIndex += section.items.length;
  }
  flushCarousels();

  return (
    <>
      <div className="mt-12 space-y-14">
        {blocks.map((block) => {
          if (block.kind === "carousels") {
            return (
              <ul
                key={block.stacks.map((stack) => stack.id).join("-")}
                className="grid list-none gap-10 sm:grid-cols-2 lg:grid-cols-3"
              >
                {block.stacks.map((stack) => (
                  <li key={stack.id}>
                    <StackedSubsectionCard
                      stack={stack}
                      onOpen={() => openCarousel(stack)}
                    />
                  </li>
                ))}
              </ul>
            );
          }

          const { section, start } = block;
          return (
            <section key={section.id}>
              {section.label ? (
                <h2 className="text-muted-foreground mb-6 text-xs tracking-[0.18em] uppercase">
                  {section.label}
                </h2>
              ) : null}
              <ul className="flex list-none flex-wrap items-start gap-4">
                {section.items.map((item, index) => {
                  const globalIndex = start + index;
                  return (
                    <li key={`${item.src}-${globalIndex}`} className={cellClass}>
                      {item.kind === "video" ? (
                        <video
                          src={item.src}
                          controls
                          playsInline
                          preload="metadata"
                          className="h-auto w-full rounded-2xl bg-black"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActive(globalIndex)}
                          className="block w-full cursor-zoom-in text-left"
                          aria-label={`Open ${item.alt || title}`}
                        >
                          {/* Native img keeps the file's real aspect — no crop box. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="h-auto w-full rounded-2xl"
                          />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {active !== null && flat[active] ? (
        <Lightbox
          title={title}
          item={flat[active]}
          index={active}
          total={flat.length}
          onClose={close}
          onPrev={() =>
            setActive((i) => (i === null ? i : (i - 1 + flat.length) % flat.length))
          }
          onNext={() =>
            setActive((i) => (i === null ? i : (i + 1) % flat.length))
          }
        />
      ) : null}

      {carousel && carousel.items[slide] ? (
        <Lightbox
          title={carousel.title}
          item={carousel.items[slide]}
          index={slide}
          total={carousel.items.length}
          onClose={close}
          onPrev={() =>
            setSlide((i) => (i - 1 + carousel.items.length) % carousel.items.length)
          }
          onNext={() => setSlide((i) => (i + 1) % carousel.items.length)}
        />
      ) : null}
    </>
  );
}

function Lightbox({
  title,
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  title: string;
  item: WorkMedia;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black p-4 md:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-sm tracking-[0.14em] text-white/80 uppercase hover:text-white"
      >
        Close
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full border border-white/30 px-4 py-3 text-sm tracking-[0.14em] text-white uppercase hover:bg-white/10 md:left-8"
        aria-label="Previous"
      >
        Prev
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full border border-white/30 px-4 py-3 text-sm tracking-[0.14em] text-white uppercase hover:bg-white/10 md:right-8"
        aria-label="Next"
      >
        Next
      </button>
      <div
        className="flex max-h-full max-w-6xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        {item.kind === "video" ? (
          <video
            key={item.src}
            src={item.src}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] w-auto max-w-full rounded-xl"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.alt || title}
            className="max-h-[85vh] w-auto max-w-full object-contain"
          />
        )}
        <p className="mt-4 text-center text-xs tracking-[0.16em] text-white/70 uppercase">
          {index + 1} / {total}
        </p>
      </div>
    </div>
  );
}
