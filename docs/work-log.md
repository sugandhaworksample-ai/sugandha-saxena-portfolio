# Work Log & Task Summary (September 27–28, 2026)

This document records all tasks, architectural decisions, bug fixes, and performance optimizations implemented during the portfolio modernization work session.

---

## 1. Executive Summary

Today's work centered on four critical objectives:

1. **Gallery Performance & Image Optimization:** Eliminating scroll lag and loading stutter across massive print, illustration, and exhibition galleries while maintaining uncompressed, high-fidelity views on zoom/modal click.
2. **Scanner Architecture & UI Hygiene:** Preventing internal optimization folders (e.g. `compressed/`) from leaking into client navigation, subheadings, or gallery grids.
3. **Resume & Career Content Sync:** Integrating updated LaTeX credentials (`resume.tex`) into structured web content (`content/resume.md`) and updating the home CTA to direct CV download.
4. **Dark Mode UI Consistency:** Resolving button hover contrast issues in dark theme variants.
5. **Git Push Stability:** Resolving large-payload network errors (`curl 55 Send failure: Connection was reset`) using atomic, batched commits and GitHub Desktop synchronization.

---

## 2. Tasks & Detailed Breakdown

### Task 1: Asset Compression & Optimization Pipeline

- **Problem:** Project directories in `public/projects/EVENTS & EXHIBITIONS` and `public/projects/scroll to explore` contained dozens of high-resolution, uncompressed assets (including multi-megabyte print standees and board game maps). Loading them all simultaneously caused browser lag, high memory consumption, and network strain.
- **Solution:** Built automated compression scripts using `sharp`:
  - [`scripts/compress-event-thumbs.mjs`](../scripts/compress-event-thumbs.mjs): Scans event folders (SIL 2025, Didac 2025) and generates compressed previews.
  - [`scripts/compress-scroll-thumbs.mjs`](../scripts/compress-scroll-thumbs.mjs): Scans scroll-to-explore sections (`1 Branding`, `02 Books`, `07 illustrations`, etc.) and produces web-optimized thumbnails in sibling `compressed/` folders.
- **Result:** Drastic reduction in initial payload size; carousel/grid rendering runs smoothly at 60fps.

### Task 2: Work Tree Scanner Fix (Excluding Thumbnail Directories)

- **Problem:** The dynamic folder reader in `lib/work-tree.ts` treats subdirectories as project subsections. Once `compressed/` folders were added, the UI began displaying `compressed` as visible subheadings and cards in galleries and the "scroll to explore" section.
- **Solution:** Updated `listDirs` in [`lib/work-tree.ts`](../lib/work-tree.ts#L86-L94) to filter out thumbnail folders:
  ```ts
  const THUMB_DIR_NAMES = new Set(["compressed", "thumb", "thumbs", "small"]);

  function listDirs(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (d) =>
          d.isDirectory() &&
          !d.name.startsWith(".") &&
          !THUMB_DIR_NAMES.has(d.name.toLowerCase()),
      )
      ...
  ```
- **Result:** `compressed/` folders are safely accessed by the scanner for thumbnail resolution (`thumbSrc`), but are never surfaced as navigation items, section headers, or standalone cards.

### Task 3: Dual-Resolution Gallery Architecture

- **Requirement:** Visitors should browse fast-loading, lightweight images without lag, but when clicking to view in a modal or carousel, they must see the full-resolution, uncompressed asset with crisp detail.
- **Implementation:** Updated [`features/work/work-gallery.tsx`](../features/work/work-gallery.tsx#L181):
  - **Grid Cards:** Render `<Image src={item.thumbSrc ?? item.src} ... />` for rapid layout rendering and smooth scrolling.
  - **Carousel & Lightbox Modal:** Open with the original `item.src` (full fidelity, uncompressed master) so visitors inspect the authentic work without blur or compression artifacts.

### Task 4: Resume & Career Data Synchronization

- **Source of Truth:** Master LaTeX file added to [`public/resume/resume.tex`](../public/resume/resume.tex).
- **Web Content:** Synced to [`content/resume.md`](../content/resume.md) following the rules in [`.agents/rules/latex-to-markdown-resume.md`](../.agents/rules/latex-to-markdown-resume.md):
  - 7+ years of experience across STEMROBO Technologies, TERABLOCK, BHARAT ARPANET, IBA CRAFTS, BRIDE AND BEAUTIFUL, and Freelance.
  - Added modern **AI Tools & Creative Suite** skills (Midjourney, ChatGPT, Magnific, Runway, Stable Diffusion, Claude, Photoshop, Illustrator, Premiere, InDesign, Blender).
  - Synced metadata (contact, email, website, phone, location).
- **Downloadable Asset:** Placed CV at `public/resume/Sugandha CV.pdf`.

### Task 5: Home CTA Update ("Download CV")

- **File:** [`features/home/scroll-story.tsx`](../features/home/scroll-story.tsx#L206)
- **Change:** Replaced the previous generic "Start a project" link with a direct CV download trigger:
  ```tsx
  <Button variant="outline" size="sm" asChild>
    <a href="/resume/Sugandha CV.pdf" target="_blank" rel="noopener noreferrer">
      Download CV
    </a>
  </Button>
  ```
- Opens the PDF cleanly in a new tab while allowing instant download.

### Task 6: Dark Mode Button Hover Contrast Fix

- **File:** [`components/ui/button.tsx`](../components/ui/button.tsx#L15)
- **Issue:** On dark mode, hovering over outline buttons applied dark hover styles which turned text near-black or unreadable against the surface.
- **Solution:** Added `dark:hover:text-foreground` to the outline variant in `buttonVariants`:
  ```tsx
  outline:
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 dark:hover:text-foreground",
  ```
- Ensured centered alignment and high-contrast white text across all dark theme presets.

### Task 7: Git Remote Push & Large File Best Practices

- **Issue:** Running `git push origin sugu:sugu` in terminal failed with `error: RPC failed; curl 55 Send failure: Connection was reset` when trying to push large image commits in a single massive HTTP burst.
- **Remedy:**
  - Split large media additions into small, atomic commits (e.g. by section: SIL 2025, Didac, Branding, Books, Board Game illustrations).
  - Used GitHub Desktop / optimized git buffers to sync changes to `origin/sugu` without remote disconnects.

---

## 3. Documentation Maintenance Standard

To maintain documentation responsibly going forward:

1. **Sync Code & Docs in the Same PR/Commit:** Whenever folder structures, scripts, or content pipelines change, update both [`README.md`](../README.md) and [`docs/project-assets.md`](../docs/project-assets.md).
2. **Follow Single Source of Truth:**
   - Visual folder trees → documented in `docs/project-assets.md`.
   - Theme presets → documented in `docs/theme.md`.
   - Architectural boundaries → documented in `docs/nextjs-rsc-boundaries.md`.
   - Historical log and session work → documented in `docs/work-log.md`.
3. **Maintain Relative Links:** Ensure markdown links use valid relative paths (e.g. `../lib/work-tree.ts`) for seamless navigation in GitHub, IDEs, and browser renderers.
