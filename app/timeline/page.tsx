import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Timeline",
  description: "A chronological view of Sugandha Saxena's creative journey.",
  path: "/timeline",
});

export default function TimelinePage() {
  return (
    <PageShell
      title="Timeline"
      description="Milestones and selected moments across career and craft."
    />
  );
}
