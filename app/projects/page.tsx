import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { getAllProjects } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected projects by Sugandha Saxena across branding, UI, packaging, and AI-driven visual storytelling.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <PageShell
      title="Projects"
      description="Case studies structured for process, craft, and outcomes. Content expands as Behance work is imported."
    >
      <ul className="grid gap-10 md:grid-cols-2">
        {projects.map((project) => (
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
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  {project.tags.slice(0, 3).join(" · ")}
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-tight transition-opacity duration-200 group-hover:opacity-70">
                  {project.title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
