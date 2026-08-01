import type { Metadata } from "next";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { getContactPage } from "@/lib/pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Sugandha Saxena for freelance collaborations and full-time opportunities.",
  path: "/contact",
});

export default function ContactPage() {
  // Hero copy is configured in content/pages/contact.yaml
  // Email, phone, and social links come from constants/site.ts
  const { eyebrow, headline, subtitle } = getContactPage();

  return (
    <div className="relative min-h-[80vh] overflow-x-clip">
      <div aria-hidden className="hero-atmosphere absolute inset-0 -z-10" />
      <div aria-hidden className="grain-overlay -z-10" />
      <section className="mx-auto flex max-w-6xl flex-col items-end justify-center px-6 pt-28 pb-24 text-right md:min-h-[75vh] md:pt-36">
        <Reveal className="w-full">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {eyebrow}
          </p>
          <h1 className="kinetic-display mt-6 text-[clamp(3rem,11vw,8rem)]">
            {headline}
          </h1>
          <p className="text-muted-foreground mt-6 ml-auto max-w-xl text-lg md:text-xl">
            {subtitle}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-end">
          <Magnetic strength={0.4}>
            <Button
              asChild
              size="lg"
              className="pressable focus-visible:ring-accent"
            >
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </Button>
          </Magnetic>
          {siteConfig.phone ? (
            <Magnetic strength={0.3}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="pressable focus-visible:ring-accent"
              >
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                  {siteConfig.phone}
                </a>
              </Button>
            </Magnetic>
          ) : null}
          <Magnetic strength={0.25}>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="underline-draw pressable"
            >
              <a
                href={siteConfig.links.behance}
                target="_blank"
                rel="noopener noreferrer"
              >
                Behance
              </a>
            </Button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="underline-draw pressable"
            >
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
          </Magnetic>
        </div>
      </section>
    </div>
  );
}
