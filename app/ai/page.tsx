import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "AI Experiments",
  description:
    "Generative AI and AI-assisted visual experiments by Sugandha Saxena.",
  path: "/ai",
});

export default function AiExperimentsPage() {
  return (
    <PageShell
      title="AI Experiments"
      description="Prompted worlds, generative sequences, and hybrid AI workflows will land here."
    />
  );
}
