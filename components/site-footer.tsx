import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { mainNav, secondaryNav } from "@/constants/nav";
import { siteConfig } from "@/constants/site";

export function SiteFooter() {
  return (
    <footer className="border-border/60 mt-auto border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-3">
            <p className="font-display text-xl font-semibold tracking-tight">
              {siteConfig.name}
            </p>
            <p className="text-muted-foreground max-w-sm text-sm">
              {siteConfig.role} · {siteConfig.location}
              <br />
              {siteConfig.availability}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
              More
            </p>
            <ul className="space-y-2 text-sm">
              {secondaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.links.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Behance
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Separator />
        <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built with Next.js · Designed for craft.</p>
        </div>
      </div>
    </footer>
  );
}
