# Next.js RSC boundaries (avoid client/server call errors)

## What broke

Runtime error on `/projects/[slug]`:

> Attempted to call `buildGalleryItems()` from the server but `buildGalleryItems` is on the client.

Cause: a pure helper lived in `features/projects/project-gallery.tsx`, which starts with `"use client"`. Importing that helper into a Server Component (`app/projects/[slug]/page.tsx`) is illegal in the App Router — **everything exported from a client module is treated as client-only**.

## Fix (what we did)

1. Move pure helpers + types to a **shared module with no `"use client"`**:
   - [`lib/project-gallery.ts`](../lib/project-gallery.ts) — `buildGalleryItems`, `isVideoSrc`, `GalleryItem`
2. Keep interactive UI in the client file:
   - [`features/projects/project-gallery.tsx`](../features/projects/project-gallery.tsx) — `"use client"` + `ProjectGallery`
3. Server page imports:
   - `buildGalleryItems` from `@/lib/project-gallery`
   - `ProjectGallery` from `@/features/projects/project-gallery` (render as JSX only)

## Rules (do not break again)

1. **`"use client"` is contagious** — if a file has it, do not export helpers for server use from that file.
2. **Split by concern**:
   - Pure TS (no hooks, no DOM, no browser APIs) → `lib/`
   - Components with state/effects/event handlers → `"use client"` feature/component file
3. **Server pages may**:
   - Import from `lib/`, `types/`, other Server Components
   - Render Client Components as `<ClientThing props={data} />`
4. **Server pages may not**:
   - Call functions imported from a `"use client"` module
   - Pass non-serializable values (functions, class instances) into client props
5. **When adding a utility used by both server and client**, put it in `lib/` first. Only put it next to a client component if it is never imported by a server file.
6. **Smoke check after changes**: open the project detail route in the browser (or run `npm run build`) — RSC boundary errors often show at runtime/build, not in `tsc`.

## Quick decision tree

```
Need hooks / onClick / browser APIs?
  YES → "use client" component file
  NO  → lib/*.ts (or server-only module)
Need both?
  → shared types/helpers in lib/
  → thin client wrapper imports from lib/
```
