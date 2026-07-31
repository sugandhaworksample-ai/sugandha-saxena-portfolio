import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About Sugandha Saxena — Sr. Creative Designer working across motion, brand, UI/UX, and generative AI.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageShell
      title="About"
      description="Biography, philosophy, and craft approach will live here. For now this route establishes the structure."
    />
  );
}
