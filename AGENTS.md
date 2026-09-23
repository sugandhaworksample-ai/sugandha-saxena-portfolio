<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# RSC boundaries

Do not call helpers exported from `"use client"` modules inside Server Components. Put shared helpers in `lib/`. Details: `docs/nextjs-rsc-boundaries.md`.
<!-- END:nextjs-agent-rules -->
