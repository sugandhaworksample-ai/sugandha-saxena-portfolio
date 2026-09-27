/**
 * compress-scroll-thumbs.mjs
 *
 * Creates a `compressed/` subfolder next to every image file
 * inside `public/projects/scroll to explore/`.
 *
 * - Originals are NEVER touched or deleted.
 * - The gallery uses `compressed/` for the grid.
 * - Lightbox clicks use the full original.
 *
 * Max width: 1400px  |  JPEG quality: 78-82
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let sharp;
try {
  sharp = require("sharp");
} catch {
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

const SCROLL_DIR = path.join(
  process.cwd(),
  "public",
  "projects",
  "scroll to explore",
);

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const THUMB_MAX_WIDTH = 1400; // Higher resolution for main gallery
const BASE_QUALITY = 78;

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
      const destName =
        ext === ".png" ? file.name.replace(/\.png$/i, ".jpg") : file.name;
      const destPath = path.join(compressedDir, destName);

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

      // Slightly higher quality for carousels
      const quality = dir.toLowerCase().includes("carousel")
        ? 82
        : BASE_QUALITY;

      try {
        await sharp(srcPath)
          .resize({ width: THUMB_MAX_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: quality, mozjpeg: true })
          .withMetadata(false)
          .toFile(destPath);

        const destSizeKB = Math.round(fs.statSync(destPath).size / 1024);
        const saving = Math.round((1 - destSizeKB / srcSizeKB) * 100);
        console.log(
          `  OK  ${file.name.padEnd(50)} ${srcSizeKB}KB -> ${destSizeKB}KB  (${saving}% smaller) [Q:${quality}]`,
        );
        processed++;
      } catch (err) {
        console.error(`  ERR  ${file.name}: ${err.message}`);
        errors++;
      }
    }
  }

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

console.log("Compressing scroll to explore thumbnails (High Quality)...");
console.log("Source: " + SCROLL_DIR + "\n");

if (!fs.existsSync(SCROLL_DIR)) {
  console.error("Directory not found:", SCROLL_DIR);
  process.exit(1);
}

await processDir(SCROLL_DIR);

console.log(
  "\nDone. processed=" +
    processed +
    "  skipped=" +
    skipped +
    "  errors=" +
    errors,
);
