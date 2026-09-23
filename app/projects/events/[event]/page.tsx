import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { FocusMediaGrid } from "@/features/work/focus-media-grid";
import { createPageMetadata } from "@/lib/seo";
import { getEventsTree } from "@/lib/work-tree";

type EventPageProps = {
  params: Promise<{ event: string }>;
};

export function generateStaticParams() {
  return getEventsTree().groups.map((group) => ({ event: group.slug }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { event } = await params;
  const group = getEventsTree().groups.find((g) => g.slug === event);
  if (!group) {
    return createPageMetadata({
      title: "Event not found",
      description: "This event gallery could not be found.",
      path: `/projects/events/${event}`,
    });
  }
  return createPageMetadata({
    title: group.title,
    description: `${group.title} — event & exhibition work`,
    path: `/projects/events/${group.slug}`,
    image: group.hero?.src,
  });
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { event } = await params;
  const group = getEventsTree().groups.find((g) => g.slug === event);
  if (!group) notFound();

  return (
    <article className="relative overflow-x-clip">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-45"
      />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-24 md:pt-36">
        <Reveal className="max-w-3xl space-y-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-xs tracking-[0.18em] uppercase"
          >
            Event & Exhibition
          </Link>
          <h1 className="kinetic-display text-4xl md:text-6xl lg:text-7xl">
            {group.title}
          </h1>
        </Reveal>

        {group.hero ? (
          <Reveal className="bg-muted relative mt-12 aspect-[21/9] overflow-hidden rounded-3xl">
            <Image
              src={group.hero.src}
              alt={group.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1152px"
            />
          </Reveal>
        ) : null}

        <FocusMediaGrid
          media={group.media}
          stacks={group.stacks}
          title={group.title}
        />
      </div>
    </article>
  );
}
