# Project assets — folder-driven work tree

The site reads **folders under `public/projects/`**, not MDX, for Scroll-to-Explore and Events.

## Scroll to explore

Path: `public/projects/scroll to explore/`

| Rule | Detail |
|------|--------|
| Order | Leading number on the folder (`1`, `02`, `07`…) |
| Category | Each numbered folder (e.g. `1 Branding`) |
| Subsection | Direct child folders (e.g. `1 Logo`, `Stationery → …`) |
| Nested folders | Become **gallery sections** — images keep their real aspect (2 per row from small screens, 3 from large). Not cropped, no full-width hero tile |
| Loose media | Images/videos sitting in a subsection folder use that same row layout |
| Carousel | A nested folder named `Name - carousel` uses the same stacked image card as a subsection. The count sits under the title. Click opens a fullscreen slideshow with Previous / Next (and arrow keys) |

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

- Subsection and event pages show images at their **real aspect**: 1 per row on phones, 2 from `sm`, 3 from `lg`. `object-contain` / intrinsic height — nothing is cropped into a 16:9 banner.
- Hover does not change column span. Click an image for a fullscreen view (Esc, ←/→).
- Videos sit in the same cells with controls.
- A nested folder whose name ends with ` - carousel` (for example `Javnic - carousel`) is a stacked card, same as a subsection. The image count stays under the title. Clicking the stack opens that folder in a fullscreen carousel with Previous and Next.

## Loose files in a category

Motion and AI videos live directly in the category folder (next to `Hero.png`), with no subsection folders.

- `Hero.png` is the category cover only — it is not repeated in the gallery.
- Other images and every video in that folder appear on `/projects/[category]` under the title.
- If the category also has subsection folders, those cards stay, and the loose files render below them.

## Events & Exhibitions

Path: `public/projects/EVENTS & EXHIBITIONS/`

- Top-level folders → event groups (Didac Event 2025, SIL Event Creatives)
- Nested folders → gallery sections on `/projects/events/[event]`
- **Home** (below Tools of obsession): two equal portrait panels (soft facing radii). Hover shows stack titles + a small thumbnail marquee (or a static thumb grid when reduced-motion is on). Didac (left) aligns copy/marquee to the right toward center. Click opens the event gallery.
- Events are **not** listed inside Scroll to explore

## Day-to-day

1. Drop a numbered category folder under `scroll to explore` → it appears in order  
2. Add subsection folders + heroes  
3. Nest client folders inside a subsection → they become gallery sections  
   Name a folder `Client - carousel` when those frames should open as a slideshow  
4. Drop videos or images directly in a category folder (Motion, AI) → they show on that category page  
5. Drop Didac/SIL files under `EVENTS & EXHIBITIONS/...` → home panels + event pages update on rebuild  
6. Optionally add `compressed/` thumbs next to large event creatives  

No MDX required for this tree.
