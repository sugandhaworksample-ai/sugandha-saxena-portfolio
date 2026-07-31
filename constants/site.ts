export const siteConfig = {
  name: "Sugandha Saxena",
  title: "Sugandha Saxena — Creative Designer & Technologist",
  description:
    "Portfolio of Sugandha Saxena — Sr. Creative Designer specializing in motion design, UI/UX, branding, generative AI, and frontend craft. Based in Noida. Available for freelance and full-time.",
  url: "https://sugandha-saxena-portfolio.vercel.app",
  ogImage: "/og.svg",
  locale: "en_IN",
  author: "Sugandha Saxena",
  role: "Sr. Creative Designer",
  location: "Noida, India",
  availability: "Available for freelance & full-time",
  email: "hello@sugandhasaxena.com",
  links: {
    behance: "https://www.behance.net/saxenasugu7614",
    github:
      "https://github.com/sugandhaworksample-ai/sugandha-saxena-portfolio",
  },
} as const;

export type SiteConfig = typeof siteConfig;
