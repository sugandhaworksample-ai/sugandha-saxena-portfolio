# Theme configuration

The portfolio supports **light/dark mode** and **three visual presets**. Tune look-and-feel without rewriting components.

## Quick controls (UI)

- **Palette icon** in the header — cycles presets: Ink → Paper → Studio
- **Sun / Moon** — toggles light / dark within the current preset

Preferences persist in `localStorage` (`portfolio-theme-preset`).

## Presets

| Id       | Feel                      | Default mode |
| -------- | ------------------------- | ------------ |
| `ink`    | Charcoal + steel accent   | dark         |
| `paper`  | Editorial bone + warm ink | light        |
| `studio` | Cool slate + cyan accent  | dark         |

Defined in [`constants/theme.ts`](../constants/theme.ts).  
Color tokens live in [`styles/globals.css`](../styles/globals.css) under `[data-theme="…"]`.

## Change an accent (common edit)

1. Open `styles/globals.css`
2. Find `[data-theme="ink"]` / `.dark` block (or paper / studio)
3. Edit `--accent`, `--ring`, `--hero-glow`, `--radius`, `--grain-opacity`, `--motion-scale`

Example — warmer ink accent:

```css
[data-theme="ink"].dark {
  --accent: oklch(0.78 0.08 70);
  --ring: oklch(0.78 0.08 70);
  --hero-glow: oklch(0.55 0.08 70 / 0.35);
}
```

## Motion scale

`--motion-scale` multiplies Framer/GSAP durations via helpers in [`lib/motion.ts`](../lib/motion.ts).  
`paper` is slightly snappier (`0.95`); `studio` slightly more expressive (`1.05`).

## Add a fourth preset

1. Append to `themePresets` in `constants/theme.ts`
2. Add matching `[data-theme="your-id"]` (+ `.dark`) rules in `globals.css`
3. Reload — the header cycle includes it automatically

## Related

- Mode provider: `next-themes` in `app/layout.tsx`
- Preset provider: `components/theme-config-provider.tsx`
