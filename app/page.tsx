import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { FeaturedWork } from "@/features/home/featured-work";
import { GsapHeroIntro } from "@/features/home/gsap-hero-intro";
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
        <div aria-hidden className="hero-atmosphere absolute inset-0 -z-10" />
        <div aria-hidden className="grain-overlay -z-10" />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-end px-6 pt-28 pb-20 md:justify-center md:pb-28">
          <GsapHeroIntro
            eyebrow={`${siteConfig.role} · ${siteConfig.location}`}
            title={siteConfig.name}
            description={siteConfig.description}
            actions={
              <>
                <Button asChild size="lg" className="pressable">
                  <Link href="/projects">View work</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="pressable"
                >
                  <Link href="/contact">Start a project</Link>
                </Button>
              </>
            }
          />
        </div>
      </section>

      {featured.length > 0 ? <FeaturedWork projects={featured} /> : null}
    </>
  );
}
