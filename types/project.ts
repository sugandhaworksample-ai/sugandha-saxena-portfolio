import { z } from "zod";

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  role: z.string().optional(),
  team: z.array(z.string()).optional(),
  duration: z.string().optional(),
  skills: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  challenge: z.string().optional(),
  process: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  cover: z.string().optional(),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  beforeAfter: z
    .array(
      z.object({
        before: z.string(),
        after: z.string(),
        caption: z.string().optional(),
      }),
    )
    .default([]),
  links: z
    .object({
      live: z.string().url().optional(),
      github: z.string().url().optional(),
      figma: z.string().url().optional(),
      behance: z.string().url().optional(),
      youtube: z.string().url().optional(),
    })
    .default({}),
  tags: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  publishedAt: z.string().optional(),
  status: z.enum(["draft", "published"]).default("published"),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export type Project = ProjectFrontmatter & {
  slug: string;
  content: string;
};
