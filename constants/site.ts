export const siteConfig = {
  name: "Sugandha Saxena",
  title: "Sugandha Saxena — Creative Designer & Technologist",
  description:
    "Portfolio of Sugandha Saxena — Sr. Creative Designer with 7+ years across branding, motion graphics, UI/UX, print, and generative AI. Based in Uttar Pradesh, India. Available for freelance and full-time.",
  url: "https://sugandha-saxena-portfolio.vercel.app",
  ogImage: "/og.svg",
  locale: "en_IN",
  author: "Sugandha Saxena",
  role: "Sr. Creative Designer",
  location: "Uttar Pradesh, India",
  availability: "Available for freelance & full-time",
  email: "saxenasugu23@gmail.com",
  phone: "+91 78382 92838",
  links: {
    behance: "https://www.behance.net/saxenasugu7614",
    linkedin: "https://www.linkedin.com/in/sugandhasaxena/",
    github:
      "https://github.com/sugandhaworksample-ai/sugandha-saxena-portfolio",
  },
} as const;

export type SiteConfig = typeof siteConfig;
