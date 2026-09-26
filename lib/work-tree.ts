/**
 * Folder-driven work tree scanner (RSC-safe).
 * Reads public/projects/scroll to explore + EVENTS & EXHIBITIONS.
 */

import fs from "node:fs";
import path from "node:path";

import { isImageSrc, isVideoSrc } from "@/lib/project-gallery";
import type {
  WorkCategory,
  WorkEventGroup,
  WorkEventsTree,
  WorkMedia,
  WorkStackNode,
  WorkSubsection,
} from "@/types/work-tree";

const PUBLIC = path.join(process.cwd(), "public");
const SCROLL_DIR = path.join(PUBLIC, "projects", "scroll to explore");
const EVENTS_DIR = path.join(PUBLIC, "projects", "EVENTS & EXHIBITIONS");

const SKIP_EXT = new Set([".psd", ".pdf", ".ai", ".eps", ".zip", ".ds_store"]);

const THUMB_DIR_NAMES = new Set(["compressed", "thumb", "thumbs", "small"]);

let categoriesCache: WorkCategory[] | null = null;
let eventsCache: WorkEventsTree | null = null;

function toPublicSrc(absPath: string): string {
  const rel = path.relative(PUBLIC, absPath).split(path.sep);
  return `/${rel.map(encodeURIComponent).join("/")}`;
}

function parseOrder(name: string): number {
  const m = name.match(/^(\d+)\b/);
  return m ? Number.parseInt(m[1], 10) : 999;
}

function orderLabel(order: number): string {
  return String(order).padStart(2, "0");
}

/** "1 Branding" → "Branding"; "Stationery → foo" → title/subtitle */
function parseFolderTitle(name: string): { title: string; subtitle?: string } {
  let rest = name.replace(/^\d+\s*/, "").trim();
  const arrow = rest.split(/\s*[→\-–—]\s+/);
  if (arrow.length >= 2) {
    return {
      title: arrow[0].trim(),
      subtitle: arrow.slice(1).join(" — ").trim(),
    };
  }
  // Normalize double spaces like "UI  WEB"
  rest = rest.replace(/\s{2,}/g, " / ");
  return { title: rest };
}

function slugify(name: string): string {
  const { title } = parseFolderTitle(name);
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-+/g, "-");
}

function isMediaFile(fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  if (SKIP_EXT.has(ext)) return false;
  if (fileName.startsWith(".")) return false;
  return isImageSrc(fileName) || isVideoSrc(fileName);
}

function isHeroName(fileName: string): boolean {
  const base = path.basename(fileName, path.extname(fileName)).toLowerCase();
  if (base === "hero" || base === "hero_image" || base === "hero-image") {
    return true;
  }
  return /hero\s*image/i.test(fileName);
}

function listDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name)
    .sort((a, b) => {
      const oa = parseOrder(a);
      const ob = parseOrder(b);
      if (oa !== ob) return oa - ob;
      return a.localeCompare(b);
    });
}

function listMediaFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && isMediaFile(d.name))
    .map((d) => d.name)
    .sort((a, b) => {
      const ha = isHeroName(a) ? 0 : 1;
      const hb = isHeroName(b) ? 0 : 1;
      if (ha !== hb) return ha - hb;
      return a.localeCompare(b, undefined, { numeric: true });
    });
}

function findThumb(absFile: string): string | undefined {
  const dir = path.dirname(absFile);
  const base = path.basename(absFile);
  const ext = path.extname(base);
  const stem = path.basename(base, ext);

  for (const thumbDir of THUMB_DIR_NAMES) {
    const candidate = path.join(dir, thumbDir, base);
    if (fs.existsSync(candidate)) return toPublicSrc(candidate);
    const stemCandidate = path.join(dir, thumbDir, `${stem}${ext}`);
    if (fs.existsSync(stemCandidate)) return toPublicSrc(stemCandidate);
  }

  // sibling naming: foo.thumb.jpg / foo-small.jpg
  for (const suffix of [".thumb", "-thumb", "_thumb", "-small", "_small"]) {
    const candidate = path.join(dir, `${stem}${suffix}${ext}`);
    if (fs.existsSync(candidate)) return toPublicSrc(candidate);
  }
  return undefined;
}

function toMedia(absPath: string, alt: string): WorkMedia {
  const src = toPublicSrc(absPath);
  const kind = isVideoSrc(absPath) ? "video" : "image";
  const thumbSrc = kind === "image" ? findThumb(absPath) : undefined;
  return { src, alt, kind, thumbSrc };
}

function pickHero(
  files: string[],
  dir: string,
  alt: string,
): WorkMedia | undefined {
  if (!files.length) return undefined;
  const heroFile = files.find((f) => isHeroName(f)) ?? files[0];
  return toMedia(path.join(dir, heroFile), alt);
}

function isCarouselName(dirName: string): boolean {
  const { subtitle } = parseFolderTitle(dirName);
  if (subtitle?.toLowerCase() === "carousel") return true;
  return /\bcarousel$/i.test(dirName.trim());
}

function buildStackNode(dirName: string, parentDir: string): WorkStackNode {
  const abs = path.join(parentDir, dirName);
  const { title } = parseFolderTitle(dirName);
  const slug = slugify(dirName);
  const layout = isCarouselName(dirName) ? "carousel" : "gallery";
  const files = listMediaFiles(abs);
  const items = files.map((f, i) =>
    toMedia(path.join(abs, f), `${title} — ${i + 1}`),
  );
  const hero =
    items.find((m) => isHeroName(path.basename(m.src))) ??
    items[0] ??
    ({
      src: "/og.svg",
      alt: title,
      kind: "image" as const,
    } satisfies WorkMedia);

  return {
    id: slug,
    slug,
    title,
    layout,
    hero,
    items: items.length ? items : [hero],
  };
}

function buildSubsection(dirName: string, categoryDir: string): WorkSubsection {
  const abs = path.join(categoryDir, dirName);
  const { title, subtitle } = parseFolderTitle(dirName);
  const slug = slugify(dirName);
  const order = parseOrder(dirName);

  const nested = listDirs(abs).filter(
    (d) => !THUMB_DIR_NAMES.has(d.toLowerCase()),
  );
  const stacks = nested.map((d) => buildStackNode(d, abs));

  const files = listMediaFiles(abs);
  const media = files.map((f, i) =>
    toMedia(path.join(abs, f), `${title} — ${i + 1}`),
  );

  const cover =
    pickHero(files, abs, title) ??
    stacks[0]?.hero ??
    ({
      src: "/og.svg",
      alt: title,
      kind: "image" as const,
    } satisfies WorkMedia);

  const stackPreview: WorkMedia[] = [];
  for (const m of media) {
    if (stackPreview.length >= 4) break;
    if (m.src === cover.src) continue;
    stackPreview.push(m);
  }
  for (const s of stacks) {
    if (stackPreview.length >= 4) break;
    if (s.hero.src === cover.src) continue;
    stackPreview.push(s.hero);
  }

  return {
    id: slug,
    slug,
    title,
    subtitle,
    order,
    folder: path.relative(PUBLIC, abs).split(path.sep).join("/"),
    cover,
    stackPreview,
    media,
    stacks,
  };
}

function buildCategory(dirName: string): WorkCategory {
  const abs = path.join(SCROLL_DIR, dirName);
  const { title } = parseFolderTitle(dirName);
  const slug = slugify(dirName);
  const order = parseOrder(dirName);
  const subsections = listDirs(abs).map((d) => buildSubsection(d, abs));

  const catFiles = listMediaFiles(abs);
  const hero =
    pickHero(catFiles, abs, title) ?? subsections[0]?.cover ?? undefined;
  const looseMedia = catFiles
    .filter((file) => isVideoSrc(file) || !isHeroName(file))
    .map((file, index) =>
      toMedia(path.join(abs, file), `${title} — ${index + 1}`),
    );

  return {
    id: slug,
    slug,
    title,
    label: orderLabel(order === 999 ? 0 : order),
    order,
    folder: path.relative(PUBLIC, abs).split(path.sep).join("/"),
    hero,
    looseMedia,
    subsections,
  };
}

function buildEventGroup(dirName: string): WorkEventGroup {
  const abs = path.join(EVENTS_DIR, dirName);
  const { title } = parseFolderTitle(dirName);
  const slug = slugify(dirName);

  const nested = listDirs(abs).filter(
    (d) => !THUMB_DIR_NAMES.has(d.toLowerCase()),
  );
  const stacks = nested.map((d) => buildStackNode(d, abs));

  // One more level: SIL Event Creatives → SIL 2025 → Designs
  const deepStacks: WorkStackNode[] = [];
  for (const mid of nested) {
    const midAbs = path.join(abs, mid);
    const kids = listDirs(midAbs).filter(
      (d) => !THUMB_DIR_NAMES.has(d.toLowerCase()),
    );
    if (kids.length) {
      for (const kid of kids) {
        const node = buildStackNode(kid, midAbs);
        node.title = `${parseFolderTitle(mid).title} — ${node.title}`;
        node.id = `${slugify(mid)}-${node.slug}`;
        node.slug = node.id;
        deepStacks.push(node);
      }
      // Also treat mid-level loose files as a stack
      const midFiles = listMediaFiles(midAbs);
      if (midFiles.length) {
        deepStacks.unshift(buildStackNode(mid, abs));
      }
    } else {
      deepStacks.push(buildStackNode(mid, abs));
    }
  }

  const files = listMediaFiles(abs);
  const media = files.map((f, i) =>
    toMedia(path.join(abs, f), `${title} — ${i + 1}`),
  );

  const hero =
    pickHero(files, abs, title) ?? deepStacks[0]?.hero ?? stacks[0]?.hero;

  return {
    id: slug,
    slug,
    title,
    folder: path.relative(PUBLIC, abs).split(path.sep).join("/"),
    hero,
    media,
    stacks: deepStacks.length ? deepStacks : stacks,
  };
}

/** Scroll-to-explore categories, sorted by folder number */
export function getWorkCategories(): WorkCategory[] {
  if (categoriesCache) return categoriesCache;
  if (!fs.existsSync(SCROLL_DIR)) {
    categoriesCache = [];
    return categoriesCache;
  }
  categoriesCache = listDirs(SCROLL_DIR).map(buildCategory);
  return categoriesCache;
}

export function getWorkCategory(slug: string): WorkCategory | undefined {
  return getWorkCategories().find((c) => c.slug === slug);
}

export function getWorkSubsection(
  categorySlug: string,
  subsectionSlug: string,
): { category: WorkCategory; subsection: WorkSubsection } | undefined {
  const category = getWorkCategory(categorySlug);
  if (!category) return undefined;
  const subsection = category.subsections.find(
    (s) => s.slug === subsectionSlug,
  );
  if (!subsection) return undefined;
  return { category, subsection };
}

export function getEventsTree(): WorkEventsTree {
  if (eventsCache) return eventsCache;
  if (!fs.existsSync(EVENTS_DIR)) {
    eventsCache = {
      title: "Event & Exhibition",
      folder: "projects/EVENTS & EXHIBITIONS",
      groups: [],
    };
    return eventsCache;
  }
  eventsCache = {
    title: "Event & Exhibition",
    folder: path.relative(PUBLIC, EVENTS_DIR).split(path.sep).join("/"),
    groups: listDirs(EVENTS_DIR).map(buildEventGroup),
  };
  return eventsCache;
}
