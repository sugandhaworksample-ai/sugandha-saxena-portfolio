import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { mainNav } from "@/constants/nav";
import { siteConfig } from "@/constants/site";

export function SiteHeader() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight transition-opacity duration-200 hover:opacity-70"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
