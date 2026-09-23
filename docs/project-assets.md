# Project assets — folder-driven work tree

The site reads **folders under `public/projects/`**, not MDX, for Scroll-to-Explore and Events.

## Scroll to explore

Path: `public/projects/scroll to explore/`

| Rule          | Detail                                                                         |
| ------------- | ------------------------------------------------------------------------------ |
| Order         | Leading number on the folder (`1`, `02`, `07`…)                                |
| Category      | Each numbered folder (e.g. `1 Branding`)                                       |
| Subsection    | Direct child folders (e.g. `1 Logo`, `Stationery → …`)                         |
| Nested stacks | Folders inside a subsection (e.g. `1 Logo/DPS/`) become expandable stack cards |
| Loose media   | Images/videos sitting in a subsection folder appear in the bento grid          |

### Hero image names (any of these)

- `hero.jpg` / `hero.png` / `hero.webp` / `hero.jpeg`
- `hero_image.*` / `hero-image.*`
- `* Hero Image.*` (e.g. `Animalpedia Hero Image.jpg`)

If none exist, the first image in the folder (or first nested hero) is used.

### Optional thumbs for cards

Place smaller files in a sibling folder named `compressed`, `thumb`, `thumbs`, or `small`, **or** name siblings `foo.thumb.jpg` / `foo-small.jpg`.

### Skipped files

`.psd`, `.pdf`, `.ai`, `.eps`, `.zip`, and dotfiles are ignored in the gallery (PDFs can be added later as downloads).

### URLs

| Folder              | URL                       |
| ------------------- | ------------------------- |
| `1 Branding`        | `/projects/branding`      |
| `1 Branding/1 Logo` | `/projects/branding/logo` |
| `07 illustrations`  | `/projects/illustrations` |

## Events & Exhibitions (home section)

Path: `public/projects/EVENTS & EXHIBITIONS/`

- Top-level folders → event groups (Didac Event 2025, SIL Event Creatives)
- Nested folders → stacks on the home showcase and `/projects/events/[event]`
- Shown on the home page **below Tools of obsession**, not inside Scroll to explore

## Day-to-day

1. Drop a numbered category folder under `scroll to explore` → it appears in order
2. Add subsection folders + heroes
3. Nest client folders inside a subsection for stack cards
4. Rebuild / refresh

No MDX required for this tree.
