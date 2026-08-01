import type { Metadata } from "next";
import Link from "next/link";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";

type EmptyAtmosphereProps = {
  title: string;
  description: string;
  path: string;
  eyebrow?: string;
};

function EmptyAtmosphere({
  title,
  description,
  path,
  eyebrow = "Soon",
}: EmptyAtmosphereProps) {
  return (
    <div className="relative min-h-[70vh] overflow-hidden">
      <div aria-hidden className="hero-atmosphere absolute inset-0 -z-10" />
      <div aria-hidden className="grain-overlay -z-10" />
      <Reveal className="mx-auto flex max-w-6xl flex-col justify-center px-6 pt-28 pb-24 md:min-h-[65vh]">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
        <h1 className="kinetic-display mt-4 text-5xl md:text-7xl">{title}</h1>
        <p className="text-muted-foreground mt-5 max-w-lg text-lg">
          {description}
        </p>
        <div className="mt-10">
          <Magnetic>
            <Button asChild className="pressable">
              <Link href="/projects">Explore projects</Link>
            </Button>
          </Magnetic>
        </div>
        <p className="text-muted-foreground mt-6 text-xs">{path}</p>
      </Reveal>
    </div>
  );
}

export function createEmptyPage(
  title: string,
  description: string,
  path: string,
) {
  const Page = () => (
    <EmptyAtmosphere title={title} description={description} path={path} />
  );
  return Page;
}

export function emptyMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return createPageMetadata({ title, description, path });
}
