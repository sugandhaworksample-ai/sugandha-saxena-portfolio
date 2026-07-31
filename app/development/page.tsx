import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Development",
  description: "Frontend and creative coding experiments from Sugandha Saxena.",
  path: "/development",
});

export default function DevelopmentPage() {
  return (
    <PageShell
      title="Development"
      description="Interactive builds and creative coding experiments will be documented here."
    />
  );
}
