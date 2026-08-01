# Theme configuration (document-driven)

Themes live in **YAML files** — same idea as page content. You do not need to edit React or `globals.css` to change colors or add a new look.

## Files

| File                                                                | Purpose                                   |
| ------------------------------------------------------------------- | ----------------------------------------- |
| [`content/theme.yaml`](../content/theme.yaml)                       | Default theme id for new visitors         |
| [`content/themes/*.yaml`](../content/themes/)                       | One file per look (Ink, Paper, Studio, …) |
| [`content/themes/_template.yaml`](../content/themes/_template.yaml) | Copy this to create a new theme           |

Files starting with `_` are ignored by the site (templates only).

## Site controls

- **Palette icon** — cycle through every theme in `content/themes/`
- **Sun / Moon** — light / dark (independent of which palette you picked)

Your last palette choice is saved in the browser (`portfolio-theme-preset`).

## Tweak an existing theme

1. Open e.g. `content/themes/ink.yaml`
2. Change a color under `light:` or `dark:`
3. Save and refresh (or rebuild if production)

Example:

```yaml
dark:
  accent: "#e8d5a3" # hex is fine
  background: "oklch(0.07 0.012 270)" # oklch also fine
  grainOpacity: 0.1
```

## Add a new theme

1. Copy `_template.yaml` → `ember.yaml` (no leading underscore)
2. Set `id: ember` (must match the filename without `.yaml`)
3. Set `label`, `description`, `preferredMode` (`light` or `dark`)
4. Fill in `light:` / `dark:` colors
5. Rebuild — it appears in the palette cycle automatically

Optional: set `default: ember` in `content/theme.yaml` to make it the landing look.

## Token cheat sheet

Leave any field out to keep the base site color from `styles/globals.css`.

| YAML key                              | What it controls                            |
| ------------------------------------- | ------------------------------------------- |
| `background` / `foreground`           | Page surface and body text                  |
| `card` / `cardForeground`             | Cards and panels                            |
| `primary` / `primaryForeground`       | Strong UI / buttons                         |
| `muted` / `mutedForeground`           | Soft backgrounds and secondary text         |
| `accent` / `accentForeground`         | Highlights, links, brand spark              |
| `border` / `input` / `ring`           | Lines, form fields, focus ring              |
| `radius`                              | Corner roundness (`0.5rem`, `1rem`, …)      |
| `heroGlow` / `heroVeil` / `spotlight` | Atmosphere washes                           |
| `grainOpacity`                        | Film grain strength (`0`–`1`)               |
| `motionScale`                         | How snappy/slow motion feels (`1` = normal) |
| `displayTracking`                     | Big headline letter-spacing (`-0.04em`)     |

`preferredMode` on the theme: when someone selects that palette, the site also switches to light or dark mode.
