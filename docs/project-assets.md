# Project assets — folder-driven work tree

The site reads **folders under `public/projects/`**, not MDX, for Scroll-to-Explore and Events.

## Scroll to explore

Path: `public/projects/scroll to explore/`

| Rule | Detail |
|------|--------|
| Order | Leading number on the folder (`1`, `02`, `07`…) |
| Category | Each numbered folder (e.g. `1 Branding`) |
| Subsection | Direct child folders (e.g. `1 Logo`, `Stationery → …`) |
| Nested folders | Become **gallery sections** — every image/video inside is a full tile (same size language as loose media) |
| Loose media | Images/videos sitting in a subsection folder appear in the first gallery section |

### Hero image names (any of these)

- `hero.jpg` / `hero.png` / `hero.webp` / `hero.jpeg`
- `hero_image.*` / `hero-image.*`
- `* Hero Image.*` (e.g. `Animalpedia Hero Image.jpg`)

If none exist, the first image in the folder (or first nested hero) is used.

### Optional thumbs for cards

Place smaller files in a sibling folder named `compressed`, `thumb`, `thumbs`, or `small`, **or** name siblings `foo.thumb.jpg` / `foo-small.jpg`.

Home Events and gallery grids prefer `thumbSrc` when present; otherwise Next.js downscales with tight `sizes` + lower `quality`. For huge event boards (multi‑MB print files), adding a `compressed/` sibling makes hover marquees much sharper.

### Skipped files

`.psd`, `.pdf`, `.ai`, `.eps`, `.zip`, and dotfiles are ignored in the gallery (PDFs can be added later as downloads).

### URLs

| Folder | URL |
|--------|-----|
| `1 Branding` | `/projects/branding` |
| `1 Branding/1 Logo` | `/projects/branding/logo` |
| `07 illustrations` | `/projects/illustrations` |

## Gallery UI notes

- Subsection and event detail pages use a **fixed-aspect bento** (`WorkGallery`): spans and aspects do **not** change on hover.
- Hover = lift / slight scale only. Click opens a lightbox (Esc, ←/→).
- Do **not** reintroduce hover `col-span` / aspect reflow — mixed resolutions make the grid fight itself.
- Nested folder images are flattened into labeled sections, not tiny fan-out stacks.

## Events & Exhibitions

Path: `public/projects/EVENTS & EXHIBITIONS/`

- Top-level folders → event groups (Didac Event 2025, SIL Event Creatives)
- Nested folders → gallery sections on `/projects/events/[event]`
- **Home** (below Tools of obsession): two equal semicircle teasers. Hover shows stack titles + a small thumbnail marquee (or a static thumb grid when reduced-motion is on). Click opens the event gallery.
- Events are **not** listed inside Scroll to explore

## Day-to-day

1. Drop a numbered category folder under `scroll to explore` → it appears in order  
2. Add subsection folders + heroes  
3. Nest client folders inside a subsection → they become gallery sections  
4. Drop Didac/SIL files under `EVENTS & EXHIBITIONS/...` → home semicircles + event pages update on rebuild  
5. Optionally add `compressed/` thumbs next to large event creatives  

No MDX required for this tree.
