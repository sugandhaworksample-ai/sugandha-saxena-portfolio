"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import type { WorkEventGroup, WorkEventsTree, WorkMedia } from "@/types/work-tree";

type EventsShowcaseProps = {
  tree: WorkEventsTree;
};

function previewStrip(group: WorkEventGroup): WorkMedia[] {
  const fromStacks = group.stacks.flatMap((stack) => [
    stack.hero,
    ...stack.items.slice(0, 3),
  ]);
  const seen = new Set<string>();
  const out: WorkMedia[] = [];
  for (const item of [...group.media, ...fromStacks]) {
    if (seen.has(item.src)) continue;
    seen.add(item.src);
    out.push(item);
    if (out.length >= 14) break;
  }
  return out;
}

export function EventsShowcase({ tree }: EventsShowcaseProps) {
  const reduceMotion = usePrefersReducedMotion();
  const groups = tree.groups.slice(0, 2);

  if (!groups.length) return null;

  return (
    <section
      data-chapter
      data-rise-skip
      className="relative overflow-x-clip bg-[var(--background)] py-20 md:py-28"
    >
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 opacity-50"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="text-muted-foreground text-xs tracking-[0.22em] uppercase">
            Live environments
          </p>
          <h2 className="kinetic-display mt-4 text-[clamp(2.6rem,8vw,5.5rem)]">
            Event{" "}
            <span className="text-accent inline-block translate-y-[-0.06em] font-normal italic">
              &
            </span>{" "}
            Exhibition
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            Boards, gates, badges, and glimpses — work made for rooms full of
            people.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2 md:items-center md:gap-6 lg:gap-10">
          {groups.map((group, index) => (
            <EventSemicircle
              key={group.slug}
              group={group}
              side={index === 0 ? "left" : "right"}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventSemicircle({
  group,
  side,
  reduceMotion,
}: {
  group: WorkEventGroup;
  side: "left" | "right";
  reduceMotion: boolean;
}) {
  const cover = useMemo(
    () => group.hero ?? group.media[0] ?? group.stacks[0]?.hero,
    [group],
  );
  const strip = useMemo(() => previewStrip(group), [group]);

  return (
    <Link
      href={`/projects/events/${group.slug}`}
      className={cn(
        "group relative block outline-none",
        "focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]",
      )}
    >
      <div
        className={cn(
          "bg-muted relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden md:max-w-none",
          side === "left"
            ? "rounded-l-full rounded-r-[2.5rem] md:rounded-r-[3rem]"
            : "rounded-r-full rounded-l-[2.5rem] md:rounded-l-[3rem]",
        )}
      >
        {cover ? (
          cover.kind === "video" ? (
            <video
              src={cover.src}
              muted
              loop
              playsInline
              autoPlay={!reduceMotion}
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
            />
          ) : (
            <Image
              src={cover.thumbSrc ?? cover.src}
              alt=""
              fill
              quality={60}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
              sizes="(max-width: 768px) min(90vw, 420px), min(40vw, 320px)"
            />
          )
        ) : null}

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-6 md:p-8">
          <p className="font-display text-2xl text-white md:text-3xl">
            {group.title}
          </p>

          {group.stacks.length ? (
            <ul className="flex max-h-0 flex-wrap gap-1.5 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100">
              {group.stacks.map((stack) => (
                <li
                  key={stack.id}
                  className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase text-white backdrop-blur"
                >
                  {stack.title}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-h-36 group-hover:opacity-100 group-focus-visible:max-h-36 group-focus-visible:opacity-100">
            {strip.length ? (
              reduceMotion ? (
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {strip.slice(0, 6).map((item) => (
                    <Thumb key={item.src} item={item} />
                  ))}
                </div>
              ) : (
                <Marquee speed={32} className="py-1">
                  {strip.map((item) => (
                    <div key={item.src} className="mx-1.5 shrink-0">
                      <Thumb item={item} />
                    </div>
                  ))}
                </Marquee>
              )
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Thumb({ item }: { item: WorkMedia }) {
  return (
    <div className="bg-muted relative h-20 w-28 overflow-hidden rounded-lg border border-white/15 shadow-sm">
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
          alt=""
          fill
          quality={50}
          className="object-cover"
          sizes="120px"
        />
      )}
    </div>
  );
}
