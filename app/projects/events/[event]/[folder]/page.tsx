import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { WorkGallery } from "@/features/work/work-gallery";
import { createPageMetadata } from "@/lib/seo";
import { getEventFolder, getEventsTree } from "@/lib/work-tree";

type EventFolderPageProps = {
  params: Promise<{ event: string; folder: string }>;
};

export function generateStaticParams() {
  return getEventsTree().groups.flatMap((group) =>
    group.subsections.map((folder) => ({
      event: group.slug,
      folder: folder.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: EventFolderPageProps): Promise<Metadata> {
  const { event, folder } = await params;
  const hit = getEventFolder(event, folder);
  if (!hit) {
    return createPageMetadata({
      title: "Collection not found",
      description: "This event collection could not be found.",
      path: `/projects/events/${event}/${folder}`,
    });
  }
  return createPageMetadata({
    title: `${hit.folder.title} · ${hit.group.title}`,
    description:
      hit.folder.subtitle ?? `${hit.folder.title} in ${hit.group.title}`,
    path: `/projects/events/${hit.group.slug}/${hit.folder.slug}`,
    image: hit.folder.cover.src,
  });
}

export default async function EventFolderPage({
  params,
}: EventFolderPageProps) {
  const { event, folder } = await params;
  const hit = getEventFolder(event, folder);
  if (!hit) notFound();

  const { group, folder: sub } = hit;

  return (
    <article className="relative overflow-x-clip">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-40"
      />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-24 md:pt-36">
        <Reveal className="max-w-3xl space-y-4">
          <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
            <Link href="/" className="hover:text-foreground">
              Event & Exhibition
            </Link>
            <span className="mx-2 opacity-40">/</span>
            <Link
              href={`/projects/events/${group.slug}`}
              className="hover:text-foreground"
            >
              {group.title}
            </Link>
          </p>
          <h1 className="kinetic-display text-4xl md:text-6xl lg:text-7xl">
            {sub.title}
          </h1>
          {sub.subtitle ? (
            <p className="text-muted-foreground text-lg">{sub.subtitle}</p>
          ) : null}
        </Reveal>

        <WorkGallery media={sub.media} stacks={sub.stacks} title={sub.title} />
      </div>
    </article>
  );
}
