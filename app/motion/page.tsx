import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Motion Design",
  description:
    "Motion design work by Sugandha Saxena — storytelling through timing, typography, and cinematic craft.",
  path: "/motion",
});

export default function MotionPage() {
  return (
    <PageShell
      title="Motion Design"
      description="Motion case studies and showreels will be featured in this section."
    />
  );
}
