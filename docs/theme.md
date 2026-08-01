# Theme configuration

Configurable **Ink / Paper / Studio** presets with dramatic contrast for cinematic pages.

## Controls

- Palette icon — cycle presets
- Sun / Moon — light / dark

Storage key: `portfolio-theme-preset`.

## Drama tokens

Edit in [`styles/globals.css`](../styles/globals.css):

| Token                         | Purpose                    |
| ----------------------------- | -------------------------- |
| `--accent` / `--ring`         | Interactive accent         |
| `--hero-glow` / `--spotlight` | Atmosphere and cursor glow |
| `--grain-opacity`             | Film grain strength        |
| `--display-tracking`          | Display type tightness     |
| `--motion-scale`              | Duration multiplier        |

Presets live under `[data-theme="ink|paper|studio"]`.
