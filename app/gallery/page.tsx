import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { HoverLift } from "@/components/motion/hover-lift";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { Button } from "@/components/ui/button";
import { getGalleryPage } from "@/lib/pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Gallery",
  description:
    "A curated visual archive by Sugandha Saxena — frames, stills, and experiments.",
  path: "/gallery",
});

export default function GalleryPage() {
  // All content for this page is configured in content/pages/gallery.yaml
  const { eyebrow, headline, subtitle, items } = getGalleryPage();

  // Filter to only items that have an image set
  const galleryItems = items.filter((item) => item.image);

  return (
    <div className="relative overflow-hidden pb-28">
      <div aria-hidden className="hero-atmosphere absolute inset-0 -z-10" />
      <div aria-hidden className="grain-overlay -z-10" />
      <Reveal className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
        <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">
          {headline}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg">
          {subtitle}
        </p>
        {galleryItems.length === 0 && (
          <div className="mt-10">
            <Magnetic>
              <Button asChild className="pressable">
                <Link href="/projects">Explore projects</Link>
              </Button>
            </Magnetic>
          </div>
        )}
      </Reveal>

      {galleryItems.length > 0 && (
        <StaggerList
          className="mx-auto mt-14 grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3"
          as="ul"
        >
          {galleryItems.map((item) => (
            <StaggerItem key={item.title}>
              <HoverLift>
                <Link
                  href={item.href ?? "#"}
                  className="group relative block aspect-square overflow-hidden rounded-2xl"
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute right-4 bottom-4 left-4 translate-y-2 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.subtitle ? (
                      <p className="text-xs tracking-[0.16em] uppercase opacity-80">
                        {item.subtitle}
                      </p>
                    ) : null}
                    <p className="font-display mt-1 text-base font-semibold">
                      {item.title}
                    </p>
                  </div>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
