import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { Separator } from "@/components/ui/separator";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return createPageMetadata({
      title: "Project not found",
      description: "This project could not be found.",
      path: `/projects/${slug}`,
    });
  }

  return createPageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${slug}`,
    image: project.cover ?? undefined,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.status !== "published") {
    notFound();
  }

  const related = getAllProjects()
    .filter(
      (item) =>
        project.related.includes(item.slug) ||
        (item.slug !== project.slug &&
          item.tags.some((tag) => project.tags.includes(tag))),
    )
    .slice(0, 3);

  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
      <div className="max-w-3xl space-y-6">
        <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
          {project.role ?? "Project"}
          {project.duration ? ` · ${project.duration}` : ""}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {project.title}
        </h1>
        <p className="text-muted-foreground text-lg">{project.description}</p>
        {project.links.behance ? (
          <a
            href={project.links.behance}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent inline-flex text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline"
          >
            View on Behance
          </a>
        ) : null}
      </div>

      {project.cover ? (
        <div className="bg-muted relative mt-12 aspect-[16/9] overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1152px"
          />
        </div>
      ) : null}

      <div className="mt-12 grid gap-10 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-6 text-sm">
          {project.skills.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-xs tracking-[0.16em] uppercase">
                Skills
              </p>
              <ul className="text-foreground space-y-1">
                {project.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.tools.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-xs tracking-[0.16em] uppercase">
                Tools
              </p>
              <ul className="text-foreground space-y-1">
                {project.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.tags.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-2 text-xs tracking-[0.16em] uppercase">
                Tags
              </p>
              <p className="text-foreground">{project.tags.join(", ")}</p>
            </div>
          ) : null}
        </aside>
        <div className="prose-portfolio max-w-none">
          <MDXRemote source={project.content} components={mdxComponents} />
        </div>
      </div>

      {related.length > 0 ? (
        <>
          <Separator className="my-16" />
          <section>
            <h2 className="font-display mb-8 text-2xl font-semibold tracking-tight">
              Related projects
            </h2>
            <ul className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/projects/${item.slug}`}
                    className="text-sm transition-opacity duration-200 hover:opacity-70"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </article>
  );
}
