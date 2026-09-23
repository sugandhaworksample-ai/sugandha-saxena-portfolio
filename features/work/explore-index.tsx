"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import type { WorkCategory } from "@/types/work-tree";

type ExploreIndexProps = {
  categories: WorkCategory[];
};

export function ExploreIndex({ categories }: ExploreIndexProps) {
  return (
    <section className="relative overflow-x-clip">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-70"
      />
      <div aria-hidden className="grain-overlay -z-10 opacity-50" />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-10 md:pt-36">
        <Reveal>
          <p className="text-muted-foreground text-xs tracking-[0.22em] uppercase">
            Scroll to explore
          </p>
          <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">Work</h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg">
            Categories first — open a world, then a collection, then the work.
          </p>
        </Reveal>
      </div>

      <StaggerList
        as="ol"
        className="mx-auto max-w-6xl list-none space-y-2 px-6 pb-28"
      >
        {categories.map((category) => (
          <StaggerItem key={category.slug} as="li">
            <Link
              href={`/projects/${category.slug}`}
              className="group border-border/50 hover:border-accent/50 grid gap-4 border-b py-8 transition-colors duration-200 md:grid-cols-[5rem_1fr_minmax(0,16rem)] md:items-center"
            >
              <span className="text-muted-foreground font-display text-sm tracking-[0.2em]">
                {category.label}
              </span>
              <div>
                <h2 className="kinetic-display text-3xl transition-opacity duration-200 group-hover:opacity-80 md:text-5xl">
                  {category.title}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">
                  {category.subsections.map((s) => s.title).join(" / ") ||
                    "Open collection"}
                </p>
              </div>
              <div className="bg-muted relative hidden aspect-[16/10] overflow-hidden rounded-xl md:block">
                {category.hero ? (
                  <Image
                    src={category.hero.thumbSrc ?? category.hero.src}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    sizes="280px"
                  />
                ) : null}
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerList>
    </section>
  );
}
