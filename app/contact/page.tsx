import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Sugandha Saxena for freelance collaborations and full-time opportunities.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      description="Open for freelance and full-time opportunities. A full contact form arrives in a later phase."
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={`mailto:${siteConfig.email}`}>Email</a>
        </Button>
        <Button asChild variant="outline">
          <Link href={siteConfig.links.behance} target="_blank">
            Behance
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
