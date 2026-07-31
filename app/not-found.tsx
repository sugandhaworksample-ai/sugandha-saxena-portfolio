import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  path: "/404",
});

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col justify-center px-6 py-20">
      <p className="text-muted-foreground text-sm tracking-[0.18em] uppercase">
        404
      </p>
      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        This page drifted off-canvas.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-md">
        The route may have moved, or the project is still being composed.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
