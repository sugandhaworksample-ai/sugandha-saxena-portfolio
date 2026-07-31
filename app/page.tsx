import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { getFeaturedProjects } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_oklch(0.35_0.04_230_/_0.35),_transparent_55%),linear-gradient(180deg,_var(--background),_oklch(0.16_0.012_260))]"
        />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-end px-6 pt-28 pb-20 md:justify-center md:pb-28">
          <p className="text-muted-foreground mb-4 text-sm tracking-[0.18em] uppercase">
            {siteConfig.role} · {siteConfig.location}
          </p>
          <h1 className="font-display max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">
            Motion, brand, UI, and generative craft — a portfolio built as a
            digital experience, not a template.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/projects">View work</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Start a project</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Selected work
            </h2>
            <p className="text-muted-foreground mt-2">
              Structured case studies ready for Behance assets and narratives.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
          >
            All projects
          </Link>
        </div>
        <ul className="grid gap-8 md:grid-cols-2">
          {featured.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block space-y-4"
              >
                <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                  {project.cover ? (
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : null}
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-semibold tracking-tight transition-opacity duration-200 group-hover:opacity-70">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
