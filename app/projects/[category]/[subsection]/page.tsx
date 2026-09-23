import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { WorkGallery } from "@/features/work/work-gallery";
import { createPageMetadata } from "@/lib/seo";
import { getWorkCategories, getWorkSubsection } from "@/lib/work-tree";

type SubsectionPageProps = {
  params: Promise<{ category: string; subsection: string }>;
};

export function generateStaticParams() {
  return getWorkCategories().flatMap((category) =>
    category.subsections.map((subsection) => ({
      category: category.slug,
      subsection: subsection.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: SubsectionPageProps): Promise<Metadata> {
  const { category, subsection } = await params;
  const hit = getWorkSubsection(category, subsection);
  if (!hit) {
    return createPageMetadata({
      title: "Collection not found",
      description: "This collection could not be found.",
      path: `/projects/${category}/${subsection}`,
    });
  }
  return createPageMetadata({
    title: `${hit.subsection.title} · ${hit.category.title}`,
    description:
      hit.subsection.subtitle ??
      `${hit.subsection.title} in ${hit.category.title}`,
    path: `/projects/${hit.category.slug}/${hit.subsection.slug}`,
    image: hit.subsection.cover.src,
  });
}

export default async function SubsectionPage({ params }: SubsectionPageProps) {
  const { category, subsection } = await params;
  const hit = getWorkSubsection(category, subsection);
  if (!hit) notFound();

  const { category: cat, subsection: sub } = hit;

  return (
    <article className="relative overflow-x-clip">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-40"
      />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-24 md:pt-36">
        <Reveal className="max-w-3xl space-y-4">
          <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
            <Link href="/projects" className="hover:text-foreground">
              Work
            </Link>
            <span className="mx-2 opacity-40">/</span>
            <Link
              href={`/projects/${cat.slug}`}
              className="hover:text-foreground"
            >
              {cat.title}
            </Link>
          </p>
          <h1 className="kinetic-display text-4xl md:text-6xl lg:text-7xl">
            {sub.title}
          </h1>
          {sub.subtitle ? (
            <p className="text-muted-foreground text-lg">{sub.subtitle}</p>
          ) : null}
        </Reveal>

        <WorkGallery
          media={sub.media}
          stacks={sub.stacks}
          title={sub.title}
        />
      </div>
    </article>
  );
}
