/**
 * lib/pages.ts
 *
 * Reads and validates YAML content files from content/pages/*.yaml.
 * Every function is memoised so the file is read once per process.
 *
 * HOW TO USE:
 *   import { getAboutPage } from "@/lib/pages";
 *   const page = getAboutPage();
 */

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import type { z } from "zod";

import {
  aboutPageSchema,
  aiPageSchema,
  blogPageSchema,
  contactPageSchema,
  developmentPageSchema,
  galleryPageSchema,
  motionPageSchema,
  type AboutPage,
  type AiPage,
  type BlogPage,
  type ContactPage,
  type DevelopmentPage,
  type GalleryPage,
  type MotionPage,
} from "@/types/pages";

const pagesDir = path.join(process.cwd(), "content/pages");

// ---------------------------------------------------------------------------
// Internal helper — reads a YAML-only file and parses its frontmatter
// ---------------------------------------------------------------------------

function readYaml<T>(filename: string, schema: z.ZodType<T>): T {
  const filePath = path.join(pagesDir, filename);

  if (!fs.existsSync(filePath)) {
    // If the file doesn't exist yet, return the schema's defaults.
    // This makes the site safe even if a content file hasn't been created.
    return schema.parse({});
  }

  const raw = fs.readFileSync(filePath, "utf8");

  // gray-matter handles both "---\n key: value\n---" (frontmatter) format
  // and plain YAML files. We wrap plain YAML in frontmatter delimiters if
  // the file doesn't start with "---" so gray-matter can always parse it.
  const wrapped = raw.startsWith("---") ? raw : `---\n${raw}\n---`;
  const { data } = matter(wrapped);
  return schema.parse(data);
}

// ---------------------------------------------------------------------------
// Simple in-memory cache (one object per content file per server process)
// ---------------------------------------------------------------------------

const cache: Record<string, unknown> = {};

function cached<T>(key: string, loader: () => T): T {
  if (!(key in cache)) cache[key] = loader();
  return cache[key] as T;
}

// ---------------------------------------------------------------------------
// Public API — one function per page content file
// ---------------------------------------------------------------------------

/** Reads content/pages/about.yaml → controls stat cards on /about */
export function getAboutPage(): AboutPage {
  return cached("about", () => readYaml("about.yaml", aboutPageSchema));
}

/** Reads content/pages/motion.yaml → controls headline + items on /motion */
export function getMotionPage(): MotionPage {
  return cached("motion", () => readYaml("motion.yaml", motionPageSchema));
}

/** Reads content/pages/ai.yaml → controls headline + items on /ai */
export function getAiPage(): AiPage {
  return cached("ai", () => readYaml("ai.yaml", aiPageSchema));
}

/** Reads content/pages/gallery.yaml → controls headline + images on /gallery */
export function getGalleryPage(): GalleryPage {
  return cached("gallery", () => readYaml("gallery.yaml", galleryPageSchema));
}

/** Reads content/pages/blog.yaml → controls headline + posts on /blog */
export function getBlogPage(): BlogPage {
  return cached("blog", () => readYaml("blog.yaml", blogPageSchema));
}

/** Reads content/pages/development.yaml → controls headline + projects on /development */
export function getDevelopmentPage(): DevelopmentPage {
  return cached("development", () =>
    readYaml("development.yaml", developmentPageSchema),
  );
}

/** Reads content/pages/contact.yaml → controls copy on /contact */
export function getContactPage(): ContactPage {
  return cached("contact", () => readYaml("contact.yaml", contactPageSchema));
}
