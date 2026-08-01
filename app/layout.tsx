import type { Metadata } from "next";
import { Instrument_Sans, Syne } from "next/font/google";

import { PersonJsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SectionRise } from "@/components/motion/section-rise";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll";
import { ThemeConfigProvider } from "@/components/theme-config-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/constants/site";
import { DEFAULT_THEME_PRESET } from "@/constants/theme";

import "@/styles/globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme={DEFAULT_THEME_PRESET}
      className={`${instrumentSans.variable} ${syne.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeConfigProvider>
            <SmoothScrollProvider>
              <SectionRise />
              <PersonJsonLd />
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </SmoothScrollProvider>
          </ThemeConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
