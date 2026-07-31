import { siteConfig } from "@/constants/site";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: [
      siteConfig.links.behance,
      siteConfig.links.linkedin,
      siteConfig.links.github,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
