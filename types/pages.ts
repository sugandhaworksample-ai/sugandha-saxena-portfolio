import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** A single "stat card" that appears on the About page */
export const statCardSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

/** A generic showcase card used by Motion, AI, Gallery, Blog, Development */
export const showcaseItemSchema = z.object({
  /** Title displayed in the card heading */
  title: z.string().min(1),
  /** Small label shown above the title (e.g. "Freelance Designer", "Tool") */
  subtitle: z.string().optional(),
  /** Body copy shown below the title */
  body: z.string().optional(),
  /** Optional URL that makes the card a link */
  href: z.string().optional(),
  /** Optional image/thumbnail path (relative to /public) */
  image: z.string().optional(),
  /** Optional video embed URL (YouTube, Vimeo, etc.) */
  videoUrl: z.string().optional(),
  /** Optional tag list for filtering */
  tags: z.array(z.string()).default([]),
});

// ---------------------------------------------------------------------------
// Per-page schemas
// ---------------------------------------------------------------------------

/** content/pages/about.yaml */
export const aboutPageSchema = z.object({
  /** The four stat cards shown in the right column of the About hero */
  stats: z.array(statCardSchema).default([]),
});

/** content/pages/motion.yaml */
export const motionPageSchema = z.object({
  /** Text shown in the small eyebrow label above the H1 */
  eyebrow: z.string().default("Motion"),
  /** Main headline on the page */
  headline: z.string().default("Frames that breathe"),
  /** Subtitle / body copy below the headline */
  subtitle: z.string().default(""),
  /** Showcase grid items (videos, reel excerpts, case study previews) */
  items: z.array(showcaseItemSchema).default([]),
});

/** content/pages/ai.yaml */
export const aiPageSchema = z.object({
  eyebrow: z.string().default("AI"),
  headline: z.string().default("AI Experiments"),
  subtitle: z.string().default(""),
  items: z.array(showcaseItemSchema).default([]),
});

/** content/pages/gallery.yaml */
export const galleryPageSchema = z.object({
  eyebrow: z.string().default("Gallery"),
  headline: z.string().default("Gallery"),
  subtitle: z.string().default(""),
  /** Gallery image items. Set image: "/path/to/image.jpg" for each photo. */
  items: z.array(showcaseItemSchema).default([]),
});

/** content/pages/blog.yaml */
export const blogPageSchema = z.object({
  eyebrow: z.string().default("Blog"),
  headline: z.string().default("Blog"),
  subtitle: z.string().default(""),
  /** Blog post entries. Set href to the external URL or future internal route. */
  posts: z.array(showcaseItemSchema).default([]),
});

/** content/pages/development.yaml */
export const developmentPageSchema = z.object({
  eyebrow: z.string().default("Development"),
  headline: z.string().default("Development"),
  subtitle: z.string().default(""),
  /** Code / creative-tech projects */
  projects: z.array(showcaseItemSchema).default([]),
});

/** content/pages/contact.yaml */
export const contactPageSchema = z.object({
  /** Small eyebrow label */
  eyebrow: z.string().default("Contact"),
  /** Large display headline */
  headline: z.string().default("Say hello"),
  /** Subtitle / availability copy */
  subtitle: z
    .string()
    .default(
      "Available for freelance and full-time. Let's build something that moves people.",
    ),
});

// ---------------------------------------------------------------------------
// Inferred TypeScript types
// ---------------------------------------------------------------------------

export type StatCard = z.infer<typeof statCardSchema>;
export type ShowcaseItem = z.infer<typeof showcaseItemSchema>;
export type AboutPage = z.infer<typeof aboutPageSchema>;
export type MotionPage = z.infer<typeof motionPageSchema>;
export type AiPage = z.infer<typeof aiPageSchema>;
export type GalleryPage = z.infer<typeof galleryPageSchema>;
export type BlogPage = z.infer<typeof blogPageSchema>;
export type DevelopmentPage = z.infer<typeof developmentPageSchema>;
export type ContactPage = z.infer<typeof contactPageSchema>;
