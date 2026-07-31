import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Awards",
  description: "Awards and recognition for Sugandha Saxena.",
  path: "/awards",
});

export default function AwardsPage() {
  return (
    <PageShell
      title="Awards"
      description="Selected recognitions and featured placements will be listed here."
    />
  );
}
