import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { StackedSubsectionCard } from "@/features/work/stacked-subsection-card";
import { createPageMetadata } from "@/lib/seo";
import { getWorkCategories, getWorkCategory } from "@/lib/work-tree";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getWorkCategories().map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getWorkCategory(slug);
  if (!category) {
    return createPageMetadata({
      title: "Category not found",
      description: "This work category could not be found.",
      path: `/projects/${slug}`,
    });
  }
  return createPageMetadata({
    title: category.title,
    description: `${category.title} — ${category.subsections.map((s) => s.title).join(", ")}`,
    path: `/projects/${category.slug}`,
    image: category.hero?.src,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getWorkCategory(slug);
  if (!category) notFound();

  return (
    <article className="relative overflow-x-clip">
      <div
        aria-hidden
        className="hero-atmosphere absolute inset-0 -z-10 opacity-50"
      />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-24 md:pt-36">
        <Reveal className="max-w-3xl">
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground text-xs tracking-[0.18em] uppercase transition-colors"
          >
            Scroll to explore
          </Link>
          <p className="text-accent font-display mt-6 text-sm tracking-[0.2em]">
            {category.label}
          </p>
          <h1 className="kinetic-display mt-3 text-5xl md:text-7xl">
            {category.title}
          </h1>
          <p className="text-muted-foreground mt-5 text-lg">
            {category.subsections.map((s) => s.title).join(" · ")}
          </p>
        </Reveal>

        {category.hero ? (
          <Reveal className="bg-muted relative mt-12 aspect-[21/9] overflow-hidden rounded-3xl">
            <Image
              src={category.hero.src}
              alt={category.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1152px"
            />
          </Reveal>
        ) : null}

        <StaggerList
          as="ul"
          className="mt-14 grid list-none gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {category.subsections.map((subsection) => (
            <StaggerItem key={subsection.slug} as="li">
              <StackedSubsectionCard
                categorySlug={category.slug}
                subsection={subsection}
              />
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </article>
  );
}
