import type { Metadata } from "next";
import Link from "next/link";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { Button } from "@/components/ui/button";
import { getResume } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description: "Resume and professional summary for Sugandha Saxena.",
  path: "/resume",
});

export default function ResumePage() {
  const resume = getResume();

  return (
    <div className="relative overflow-hidden pb-28">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-50"
      />
      <Reveal className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Resume
            </p>
            <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">
              {resume.name}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
              {resume.summary}
            </p>
          </div>
          <Magnetic>
            <Button asChild className="pressable">
              <a href={`mailto:${resume.email}`}>Email CV</a>
            </Button>
          </Magnetic>
        </div>
      </Reveal>

      <section className="mx-auto mt-16 max-w-6xl px-6">
        <h2 className="font-display text-2xl font-semibold">Skills</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {resume.skills.map((group) => (
            <div key={group.category}>
              <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                {group.category}
              </p>
              <ul className="mt-4 space-y-3">
                {group.items.map((item, index) => (
                  <li key={item} className="group">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span>{item}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {Math.min(96, 62 + ((index * 7) % 30))}%
                      </span>
                    </div>
                    <div className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
                      <div
                        className="bg-accent h-full origin-left rounded-full transition-transform duration-500 ease-out group-hover:scale-x-105"
                        style={{
                          width: `${Math.min(96, 62 + ((index * 7) % 30))}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <h2 className="font-display text-2xl font-semibold">Experience</h2>
        <StaggerList className="mt-8 space-y-6" as="ul">
          {resume.experience.map((role) => (
            <StaggerItem key={`${role.company}-${role.role}`}>
              <article className="border-border/60 hover:border-accent rounded-2xl border p-6 transition-colors duration-200">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold">
                    {role.role}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {role.start} — {role.end}
                  </p>
                </div>
                <p className="text-accent mt-1 text-sm">{role.company}</p>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {role.responsibilities.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      <section className="mx-auto mt-16 flex max-w-6xl gap-3 px-6">
        <Button asChild variant="outline" className="pressable">
          <Link href="/experience">Experience page</Link>
        </Button>
        <Button asChild variant="outline" className="pressable">
          <Link href="/contact">Contact</Link>
        </Button>
      </section>
    </div>
  );
}
