import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { StackedSubsectionCard } from "@/features/work/stacked-subsection-card";
import { WorkGallery } from "@/features/work/work-gallery";
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

        {group.subsections.length ? (
          <StaggerList
            as="ul"
            className="mt-14 grid list-none gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {group.subsections.map((subsection) => (
              <StaggerItem key={subsection.slug} as="li">
                <StackedSubsectionCard
                  href={`/projects/events/${group.slug}/${subsection.slug}`}
                  subsection={subsection}
                />
              </StaggerItem>
            ))}
          </StaggerList>
        ) : null}

        {group.media.length ? (
          <WorkGallery media={group.media} title={group.title} />
        ) : null}
      </div>
    </article>
  );
}
