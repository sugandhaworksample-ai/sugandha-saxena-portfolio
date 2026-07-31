import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description: "Resume and professional summary for Sugandha Saxena.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <PageShell
      title="Resume"
      description="A downloadable resume and role summary will be added here."
    />
  );
}
