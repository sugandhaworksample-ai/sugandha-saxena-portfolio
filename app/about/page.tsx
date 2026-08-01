import type { Metadata } from "next";
import Link from "next/link";

import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { getAboutPage } from "@/lib/pages";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About Sugandha Saxena — Sr. Creative Designer working across motion, brand, UI/UX, and generative AI.",
  path: "/about",
});

export default function AboutPage() {
  const resume = getResume();
  const skills = resume.skills.flatMap((group) => group.items);
  // Stat cards are configured in content/pages/about.yaml
  const { stats } = getAboutPage();

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="hero-atmosphere absolute inset-0 -z-10" />
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-28 pb-16 md:grid-cols-[1.1fr_0.9fr] md:pt-36">
        <Reveal>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            About
          </p>
          <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">
            {resume.name}
          </h1>
          <p className="text-muted-foreground mt-6 text-lg text-pretty md:text-xl">
            {resume.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild className="pressable">
                <Link href="/resume">View resume</Link>
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button asChild variant="outline" className="pressable">
                <Link href="/experience">Experience</Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-border/60 bg-card/50 hover:border-accent group rounded-3xl border p-6 transition-colors duration-200"
            >
              <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                {stat.label}
              </p>
              <p className="font-display group-hover:text-accent mt-3 text-2xl transition-colors duration-200">
                {stat.value}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="pb-24">
        <p className="text-muted-foreground mb-6 px-6 text-center text-xs tracking-[0.2em] uppercase">
          Skills in motion
        </p>
        <Marquee speed={42}>
          {skills.slice(0, 20).map((skill) => (
            <span
              key={skill}
              className="border-border hover:border-accent hover:text-accent rounded-full border px-5 py-2 text-sm transition-colors duration-200"
            >
              {skill}
            </span>
          ))}
        </Marquee>
      </section>
    </div>
  );
}
