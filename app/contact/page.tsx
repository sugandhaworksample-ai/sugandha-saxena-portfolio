import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
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
  const telHref = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

  return (
    <PageShell
      title="Contact"
      description="Open for freelance and full-time opportunities. Reach out by email, phone, or LinkedIn."
    >
      <Reveal className="space-y-8">
        <div className="text-muted-foreground max-w-md space-y-2 text-sm">
          <p>
            <span className="text-foreground font-medium">Email</span>
            <br />
            <a
              href={`mailto:${siteConfig.email}`}
              className="hover:text-foreground transition-colors duration-200"
            >
              {siteConfig.email}
            </a>
          </p>
          <p>
            <span className="text-foreground font-medium">Phone</span>
            <br />
            <a
              href={telHref}
              className="hover:text-foreground transition-colors duration-200"
            >
              {siteConfig.phone}
            </a>
          </p>
          <p>
            <span className="text-foreground font-medium">Location</span>
            <br />
            {siteConfig.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={`mailto:${siteConfig.email}`}>Email</a>
          </Button>
          <Button asChild variant="outline">
            <a href={telHref}>Call</a>
          </Button>
          <Button asChild variant="outline">
            <Link
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href={siteConfig.links.behance}
              target="_blank"
              rel="noopener noreferrer"
            >
              Behance
            </Link>
          </Button>
        </div>
      </Reveal>
    </PageShell>
  );
}
