# Sugandha Saxena Portfolio

Premium personal portfolio for **Sugandha Saxena** — Sr. Creative Designer & Creative Technologist based in Noida.

This is not a template site. The goal is a digital experience with editorial typography, intentional motion, structured case studies, and excellent performance.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion + GSAP
- React Three Fiber (used only where meaningful)
- MDX case studies
- ESLint + Prettier + Husky + lint-staged

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                                    | Purpose                                             |
| ----------------------------------------- | --------------------------------------------------- |
| `npm run dev`                             | Local development server                            |
| `npm run build`                           | Production build                                    |
| `npm run start`                           | Serve production build                              |
| `npm run lint`                            | ESLint                                              |
| `npm run format`                          | Prettier write                                      |
| `npm run typecheck`                       | TypeScript check                                    |
| `node scripts/compress-event-thumbs.mjs`  | Generate compressed thumbs for Events & Exhibitions |
| `node scripts/compress-scroll-thumbs.mjs` | Generate compressed thumbs for Scroll to Explore    |

## Content workflow

The portfolio uses two content workflows:

### 1. Folder-driven Work Tree (Primary for visual galleries)

Used for **Scroll-to-Explore** and **Events & Exhibitions**.

- Drop categorized project folders under `public/projects/scroll to explore/` or `public/projects/EVENTS & EXHIBITIONS/`.
- No MDX required; categories, subsections, and galleries are read directly from filesystem structure via `lib/work-tree.ts`.
- Supports dual-resolution asset loading: high-performance `compressed/` thumbnails for grids + full-resolution images for carousels and modals.
- Detailed rules: [`docs/project-assets.md`](docs/project-assets.md).

### 2. MDX Case Studies

Projects live in `content/projects/*.mdx` with Zod-validated frontmatter for deep-dive case studies.

- Route `/projects/[slug]` is generated automatically.
- Source of truth for Phase 2 imports: [Behance profile](https://www.behance.net/saxenasugu7614).

### 3. Resume & About Sync

- Master LaTeX file: `public/resume/resume.tex`
- Web content: `content/resume.md` (parsed by `lib/resume.ts` for the `/about` page)
- PDF download: `public/resume/Sugandha CV.pdf` (linked directly via "Download CV" on the home page)
- Conversion rules: [`.agents/rules/latex-to-markdown-resume.md`](.agents/rules/latex-to-markdown-resume.md)

## Documentation

- [`docs/project-assets.md`](docs/project-assets.md) — Folder-driven work tree, naming conventions, and image compression pipeline.
- [`docs/theme.md`](docs/theme.md) — Document-driven theme system (YAML presets in `content/themes/`).
- [`docs/nextjs-rsc-boundaries.md`](docs/nextjs-rsc-boundaries.md) — RSC boundaries and client/server separation rules.
- [`docs/work-log.md`](docs/work-log.md) — Detailed log of daily tasks, performance optimizations, bug fixes, and architectural decisions.

## Architecture

```
app/            App Router pages + SEO routes
components/     Shared UI, layout, MDX renderers
features/       Feature-level compositions
content/        MDX projects
lib/            Projects loader, SEO, motion tokens, utils
constants/      Site + navigation config
hooks/          Shared hooks
public/         Static assets + project media
styles/         Global CSS + design tokens
types/          Shared TypeScript types
utils/          Convenience re-exports
```

## Design system

- Display font: Syne
- Body font: Instrument Sans
- Dark mode default via `next-themes`
- Motion tokens in `lib/motion.ts` (Emil Kowalski-aligned: UI under ~300ms, ease-out)

## Deployment

Vercel-ready. Set the production domain in `constants/site.ts` before launch.

## License

Private portfolio content. All project work © Sugandha Saxena.
