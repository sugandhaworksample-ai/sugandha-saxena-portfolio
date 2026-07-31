import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Experience",
  description:
    "Professional experience and roles for Sugandha Saxena across creative design and technology.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <PageShell
      title="Experience"
      description="Roles, responsibilities, and impact timelines will be populated here."
    />
  );
}
