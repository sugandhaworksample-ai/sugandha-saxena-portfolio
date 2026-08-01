import type { Metadata } from "next";

import { HoverLift } from "@/components/motion/hover-lift";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { Button } from "@/components/ui/button";
import { getBlogPage } from "@/lib/pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description: "Notes on design, motion, and AI workflows by Sugandha Saxena.",
  path: "/blog",
});

export default function BlogPage() {
  // All content for this page is configured in content/pages/blog.yaml
  const { eyebrow, headline, subtitle, posts } = getBlogPage();

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
        {posts.length === 0 && (
          <div className="mt-10">
            <Magnetic>
              <Button asChild className="pressable">
                <a
                  href="https://www.behance.net/saxenasugu7614"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Behance
                </a>
              </Button>
            </Magnetic>
          </div>
        )}
      </Reveal>

      {posts.length > 0 && (
        <StaggerList className="mx-auto mt-14 max-w-4xl space-y-5 px-6" as="ul">
          {posts.map((post, index) => (
            <StaggerItem key={post.title}>
              <HoverLift>
                <a
                  href={post.href ?? "#"}
                  target={post.href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    post.href?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="border-border/60 bg-card/50 group hover:border-accent flex items-start gap-6 rounded-3xl border p-6 transition-colors duration-200 md:p-8"
                >
                  <span className="font-display text-accent text-4xl tabular-nums opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    {post.subtitle ? (
                      <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                        {post.subtitle}
                      </p>
                    ) : null}
                    <h2 className="font-display mt-2 text-xl font-semibold md:text-2xl">
                      {post.title}
                    </h2>
                    {post.body ? (
                      <p className="text-muted-foreground mt-3 text-sm text-pretty md:text-base">
                        {post.body}
                      </p>
                    ) : null}
                    {post.href ? (
                      <p className="text-accent mt-4 text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Read →
                      </p>
                    ) : null}
                  </div>
                </a>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
