"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { NameRibbon } from "@/features/home/name-ribbon";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  ensureGsapPlugins,
  gsap,
  killScrollTriggers,
  ScrollTrigger,
} from "@/lib/gsap";
import type { Project } from "@/types/project";

type ScrollStoryProps = {
  projects: Project[];
  skills: string[];
  blurb: string;
};

export function ScrollStory({ projects, skills, blurb }: ScrollStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion || !rootRef.current) return;

    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      chapters.forEach((chapter, index) => {
        const media = chapter.querySelectorAll("[data-parallax]");
        const lines = chapter.querySelectorAll("[data-line]");

        gsap.fromTo(
          lines,
          { y: 80, opacity: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: chapter,
              start: "top 75%",
              end: "top 25%",
              scrub: 1,
            },
          },
        );

        if (media.length) {
          gsap.fromTo(
            media,
            { yPercent: 18, scale: 1.12 },
            {
              yPercent: -8,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }

        if (index === 2 && projects.length > 0) {
          const track = chapter.querySelector<HTMLElement>("[data-work-track]");
          if (track) {
            const amount = Math.max(track.scrollWidth - window.innerWidth, 0);
            gsap.to(track, {
              x: () => -amount,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "top top",
                end: () => `+=${amount + window.innerHeight}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
          }
        }
      });

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });
      }
    }, rootRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      killScrollTriggers(rootRef.current ?? undefined);
    };
  }, [reduceMotion, projects.length]);

  const skillItems = skills.length
    ? skills
    : ["Motion", "Branding", "UI/UX", "Generative AI", "Creative Direction"];

  if (reduceMotion) {
    return (
      <div className="space-y-24 px-6 py-20">
        <section className="mx-auto max-w-6xl">
          <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
            {siteConfig.role}
          </p>
          <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg">{blurb}</p>
        </section>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="bg-border fixed top-0 right-0 left-0 z-[60] h-[2px]">
        <div
          ref={progressRef}
          className="bg-accent h-full origin-left scale-x-0"
        />
      </div>

      {/* Chapter 1 — Brand */}
      <section
        data-chapter
        className="chapter-screen relative overflow-visible"
      >
        <div
          aria-hidden
          data-hero-atmosphere
          className="hero-atmosphere absolute inset-0 origin-center will-change-transform"
        />
        <div aria-hidden data-hero-grain className="grain-overlay" />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
          <p
            data-hero-role
            className="text-muted-foreground mb-6 text-sm tracking-[0.22em] uppercase"
          >
            {siteConfig.role} · {siteConfig.location}
          </p>
          <NameRibbon />
          <div data-brand-ctas className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <Button asChild size="lg" className="pressable text-base">
                <Link href="/projects">Enter the work</Link>
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button asChild variant="outline" size="lg" className="pressable">
                <Link href="/contact">Start a project</Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Chapter 2 — Positioning */}
      <section data-chapter className="chapter-screen relative overflow-hidden">
        <div
          aria-hidden
          data-parallax
          className="bg-accent/10 absolute -top-20 -right-20 size-[40vw] rounded-full blur-3xl"
        />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p
              data-line
              className="text-muted-foreground mb-4 text-xs tracking-[0.2em] uppercase"
            >
              Approach
            </p>
            <h2
              data-line
              className="kinetic-display text-4xl md:text-6xl lg:text-7xl"
            >
              Design that feels like motion.
            </h2>
          </div>
          <p
            data-line
            className="text-muted-foreground self-end text-lg text-pretty md:text-xl"
          >
            {blurb}
          </p>
        </div>
      </section>

      {/* Chapter 3 — Selected work horizontal scrub */}
      <section data-chapter className="relative overflow-hidden">
        <div className="flex h-screen items-center">
          <div
            data-work-track
            className="flex gap-8 px-6 will-change-transform"
          >
            <div className="flex w-[70vw] shrink-0 flex-col justify-center md:w-[40vw]">
              <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                Selected work
              </p>
              <h2 className="kinetic-display mt-4 text-4xl md:text-6xl">
                Stories in frames
              </h2>
              <p className="text-muted-foreground mt-4 max-w-sm">
                Scroll to travel through projects — each frame is a world.
              </p>
            </div>
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group relative h-[60vh] w-[75vw] shrink-0 overflow-hidden md:w-[42vw]"
              >
                <div data-parallax className="absolute inset-0">
                  {project.cover ? (
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      sizes="42vw"
                    />
                  ) : (
                    <div className="bg-muted absolute inset-0" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute right-6 bottom-6 left-6 text-white">
                  <p className="text-xs tracking-[0.16em] uppercase opacity-80">
                    {project.tags.slice(0, 2).join(" · ")}
                  </p>
                  <h3 className="font-display mt-2 text-2xl md:text-3xl">
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
            <div className="flex w-[40vw] shrink-0 items-center">
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="pressable"
                >
                  <Link href="/projects">All projects</Link>
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 4 — Skills marquee */}
      <section data-chapter className="chapter-screen relative overflow-hidden">
        <div className="w-full space-y-10">
          <div className="mx-auto max-w-6xl px-6">
            <p
              data-line
              className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
            >
              Craft
            </p>
            <h2 data-line className="kinetic-display mt-3 text-4xl md:text-6xl">
              Tools of obsession
            </h2>
          </div>
          <Marquee speed={40} className="py-4">
            {skillItems.map((skill) => (
              <span
                key={skill}
                className="border-border/70 hover:border-accent hover:text-accent font-display rounded-full border px-6 py-3 text-2xl tracking-tight transition-colors duration-200 md:text-4xl"
              >
                {skill}
              </span>
            ))}
          </Marquee>
          <Marquee speed={48} reverse className="py-4">
            {[...skillItems].reverse().map((skill) => (
              <span
                key={`rev-${skill}`}
                className="text-muted-foreground/80 font-display text-xl tracking-tight md:text-3xl"
              >
                {skill}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Chapter 5 — Invite */}
      <section data-chapter className="chapter-screen relative overflow-hidden">
        <div aria-hidden className="hero-atmosphere absolute inset-0" />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start px-6">
          <h2
            data-line
            className="kinetic-display text-[clamp(2.8rem,10vw,7rem)]"
          >
            Let’s make
            <br />
            something that
            <br />
            <span className="text-accent">moves.</span>
          </h2>
          <div data-line className="mt-10">
            <Magnetic strength={0.4}>
              <Button asChild size="lg" className="pressable px-8 text-base">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}
