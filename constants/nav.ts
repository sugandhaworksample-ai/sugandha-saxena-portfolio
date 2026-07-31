export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

export const mainNav: NavItem[] = [
  { title: "Work", href: "/projects" },
  { title: "About", href: "/about" },
  { title: "Experience", href: "/experience" },
  { title: "Motion", href: "/motion" },
  { title: "AI", href: "/ai" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export const secondaryNav: NavItem[] = [
  { title: "Development", href: "/development" },
  { title: "Timeline", href: "/timeline" },
  { title: "Gallery", href: "/gallery" },
  { title: "Awards", href: "/awards" },
  { title: "Resume", href: "/resume" },
];
