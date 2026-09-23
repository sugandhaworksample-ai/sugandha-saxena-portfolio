"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { WorkEventGroup, WorkEventsTree } from "@/types/work-tree";

type EventsShowcaseProps = {
  tree: WorkEventsTree;
};

export function EventsShowcase({ tree }: EventsShowcaseProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(tree.groups[0]?.slug ?? "");

  const group = useMemo(
    () => tree.groups.find((g) => g.slug === active) ?? tree.groups[0],
    [active, tree.groups],
  );

  if (!tree.groups.length) return null;

  return (
    <section data-chapter className="chapter-screen relative overflow-hidden">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 opacity-50"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
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

        <div className="mt-10 flex flex-wrap gap-2">
          {tree.groups.map((g) => (
            <button
              key={g.slug}
              type="button"
              onClick={() => setActive(g.slug)}
              className={
                g.slug === group?.slug
                  ? "bg-foreground text-background pressable rounded-full px-4 py-2 text-xs tracking-[0.14em] uppercase"
                  : "border-border/70 pressable rounded-full border px-4 py-2 text-xs tracking-[0.14em] uppercase"
              }
            >
              {g.title}
            </button>
          ))}
        </div>

        {group ? (
          <EventGroupPanel
            key={group.slug}
            group={group}
            reduceMotion={!!reduceMotion}
          />
        ) : null}

        <div className="mt-10">
          <Link
            href={`/projects/events/${group?.slug ?? ""}`}
            className="underline-draw hover:text-accent text-sm font-medium"
          >
            Open full event gallery
          </Link>
        </div>
      </div>
    </section>
  );
}

function editionKeys(group: WorkEventGroup): string[] {
  const keys = new Set<string>();
  for (const stack of group.stacks) {
    const [prefix] = stack.title.split(/\s+[—–-]\s+/);
    if (prefix && prefix !== stack.title) keys.add(prefix.trim());
  }
  return [...keys];
}

function EventGroupPanel({
  group,
  reduceMotion,
}: {
  group: WorkEventGroup;
  reduceMotion: boolean;
}) {
  const editions = editionKeys(group);
  const [edition, setEdition] = useState(editions[0] ?? "");

  const stacks =
    edition && editions.length > 1
      ? group.stacks.filter((s) => s.title.startsWith(edition))
      : group.stacks;

  const hero =
    stacks[0]?.hero ?? group.hero ?? group.media[0] ?? group.stacks[0]?.hero;
  const strip = [
    ...group.media,
    ...stacks.flatMap((s) => s.items.slice(0, 2)),
  ].slice(0, 16);

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="bg-muted relative min-h-[50vh] overflow-hidden rounded-3xl">
        {hero ? (
          hero.kind === "video" ? (
            <video
              src={hero.src}
              muted
              loop
              playsInline
              autoPlay
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
          )
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <p className="font-display text-2xl text-white md:text-3xl">
            {edition && editions.length > 1 ? edition : group.title}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {editions.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {editions.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setEdition(key)}
                className={
                  key === edition
                    ? "bg-accent text-background pressable rounded-full px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase"
                    : "border-border/70 pressable rounded-full border px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase"
                }
              >
                {key}
              </button>
            ))}
          </div>
        ) : null}

        <StaggerList className="grid grid-cols-2 gap-3" as="ul">
          {stacks.slice(0, 4).map((stack) => (
            <StaggerItem key={stack.id} as="li">
              <Link
                href={`/projects/events/${group.slug}`}
                className="bg-muted relative block aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={stack.hero.thumbSrc ?? stack.hero.src}
                  alt={stack.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <span className="bg-background/70 absolute right-2 bottom-2 left-2 truncate rounded-full px-2 py-1 text-[10px] tracking-[0.12em] uppercase backdrop-blur">
                  {stack.title}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerList>

        {strip.length > 0 ? (
          reduceMotion ? (
            <div className="grid grid-cols-3 gap-2">
              {strip.slice(0, 6).map((item) => (
                <div
                  key={item.src}
                  className="bg-muted relative aspect-square overflow-hidden rounded-xl"
                >
                  {item.kind === "video" ? (
                    <video
                      src={item.src}
                      muted
                      className="size-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.thumbSrc ?? item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Marquee speed={36} className="py-2">
              {strip.map((item) => (
                <div
                  key={item.src}
                  className="bg-muted relative mx-2 h-28 w-40 shrink-0 overflow-hidden rounded-xl"
                >
                  {item.kind === "video" ? (
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="size-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.thumbSrc ?? item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  )}
                </div>
              ))}
            </Marquee>
          )
        ) : null}
      </div>
    </div>
  );
}
