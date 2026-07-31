import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Notes on design, motion, AI workflows, and creative process by Sugandha Saxena.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <PageShell
      title="Blog"
      description="Writing and process notes will appear here once MDX posts are added."
    />
  );
}
