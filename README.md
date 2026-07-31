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

| Script              | Purpose                  |
| ------------------- | ------------------------ |
| `npm run dev`       | Local development server |
| `npm run build`     | Production build         |
| `npm run start`     | Serve production build   |
| `npm run lint`      | ESLint                   |
| `npm run format`    | Prettier write           |
| `npm run typecheck` | TypeScript check         |

## Content workflow

Projects live in `content/projects/*.mdx` with Zod-validated frontmatter.

1. Add an MDX file: `content/projects/my-project.mdx`
2. Place media in `public/projects/my-project/`
3. The route `/projects/my-project` is generated automatically

Source of truth for Phase 2 imports: [Behance profile](https://www.behance.net/saxenasugu7614).

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
