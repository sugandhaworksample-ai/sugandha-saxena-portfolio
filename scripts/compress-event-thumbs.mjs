/**
 * compress-event-thumbs.mjs
 *
 * Creates a `compressed/` subfolder next to every image file
 * inside `public/projects/EVENTS & EXHIBITIONS/`.
 *
 * - Originals are NEVER touched or deleted.
 * - The gallery continues to show originals at full quality.
 * - `findThumb()` in lib/work-tree.ts automatically picks up
 *   `compressed/<filename>` as the thumb for cards & marquees.
 *
 * Usage:
 *   node scripts/compress-event-thumbs.mjs
 *
 * Max width: 900px  |  JPEG quality: 70  |  Strips EXIF
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Sharp ships with Next.js — resolve from next's own dependencies.
let sharp;
try {
  sharp = require("sharp");
} catch {
  // Fallback: try workspace node_modules directly
  const sharpPath = path.join(
    process.cwd(),
    "node_modules",
    "next",
    "node_modules",
    "sharp",
  );
  if (fs.existsSync(sharpPath)) {
    sharp = require(sharpPath);
  } else {
    console.error("sharp not found. Run: npm install sharp");
    process.exit(1);
  }
}

const EVENTS_DIR = path.join(
  process.cwd(),
  "public",
  "projects",
  "EVENTS & EXHIBITIONS",
);

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const THUMB_MAX_WIDTH = 900;
const JPEG_QUALITY = 70;

let processed = 0;
let skipped = 0;
let errors = 0;

async function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const imageFiles = entries.filter(
    (e) =>
      e.isFile() &&
      IMAGE_EXTS.has(path.extname(e.name).toLowerCase()) &&
      !e.name.startsWith("."),
  );

  if (imageFiles.length > 0) {
    const compressedDir = path.join(dir, "compressed");
    fs.mkdirSync(compressedDir, { recursive: true });

    for (const file of imageFiles) {
      const srcPath = path.join(dir, file.name);
      const ext = path.extname(file.name).toLowerCase();
      // Always write as jpg for best compression ratio
      const destName =
        ext === ".png" ? file.name.replace(/\.png$/i, ".jpg") : file.name;
      const destPath = path.join(compressedDir, destName);

      // Skip if compressed version is newer than source
      if (fs.existsSync(destPath)) {
        const srcMtime = fs.statSync(srcPath).mtimeMs;
        const destMtime = fs.statSync(destPath).mtimeMs;
        if (destMtime >= srcMtime) {
          skipped++;
          console.log(`  skip (up-to-date)  ${file.name}`);
          continue;
        }
      }

      const srcSizeKB = Math.round(fs.statSync(srcPath).size / 1024);

      try {
        await sharp(srcPath)
          .resize({ width: THUMB_MAX_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .withMetadata(false)
          .toFile(destPath);

        const destSizeKB = Math.round(fs.statSync(destPath).size / 1024);
        const saving = Math.round((1 - destSizeKB / srcSizeKB) * 100);
        console.log(
          `  OK  ${file.name.padEnd(50)} ${srcSizeKB}KB -> ${destSizeKB}KB  (${saving}% smaller)`,
        );
        processed++;
      } catch (err) {
        console.error(`  ERR  ${file.name}: ${err.message}`);
        errors++;
      }
    }
  }

  // Recurse into subdirectories, skip compressed/ dirs
  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      entry.name !== "compressed" &&
      !entry.name.startsWith(".")
    ) {
      await processDir(path.join(dir, entry.name));
    }
  }
}

console.log("Compressing event thumbnails...");
console.log("Source: " + EVENTS_DIR + "\n");

if (!fs.existsSync(EVENTS_DIR)) {
  console.error("Events directory not found:", EVENTS_DIR);
  process.exit(1);
}

await processDir(EVENTS_DIR);

console.log(
  "\nDone. processed=" +
    processed +
    "  skipped=" +
    skipped +
    "  errors=" +
    errors,
);
console.log(
  "Originals are untouched. The site auto-uses compressed/ for cards and marquees.\n",
);
