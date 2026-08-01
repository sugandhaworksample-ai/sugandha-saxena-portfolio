/**
 * lib/theme.ts
 *
 * Reads content/themes/*.yaml and content/theme.yaml.
 * Builds CSS for [data-theme="…"] selectors injected from the root layout.
 */

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import {
  themeConfigSchema,
  themePresetSchema,
  type ThemeConfig,
  type ThemePreset,
  type ThemePresetMeta,
  type ThemeTokens,
} from "@/types/theme";

const themesDir = path.join(process.cwd(), "content/themes");
const themeConfigPath = path.join(process.cwd(), "content/theme.yaml");

const TOKEN_TO_CSS: Record<keyof ThemeTokens, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  radius: "--radius",
  heroGlow: "--hero-glow",
  heroVeil: "--hero-veil",
  spotlight: "--spotlight",
  grainOpacity: "--grain-opacity",
  motionScale: "--motion-scale",
  displayTracking: "--display-tracking",
};

let themesCache: ThemePreset[] | null = null;
let configCache: ThemeConfig | null = null;

function readYamlFile(filePath: string): Record<string, unknown> {
  const raw = fs.readFileSync(filePath, "utf8");
  const wrapped = raw.startsWith("---") ? raw : `---\n${raw}\n---`;
  const { data } = matter(wrapped);
  return data as Record<string, unknown>;
}

function loadThemesFromDisk(): ThemePreset[] {
  if (!fs.existsSync(themesDir)) return [];

  const files = fs
    .readdirSync(themesDir)
    .filter((name) => name.endsWith(".yaml") && !name.startsWith("_"))
    .sort((a, b) => a.localeCompare(b));

  const themes: ThemePreset[] = [];

  for (const file of files) {
    const data = readYamlFile(path.join(themesDir, file));
    const parsed = themePresetSchema.parse(data);
    themes.push(parsed);
  }

  return themes;
}

function loadConfigFromDisk(): ThemeConfig {
  if (!fs.existsSync(themeConfigPath)) {
    return themeConfigSchema.parse({});
  }
  return themeConfigSchema.parse(readYamlFile(themeConfigPath));
}

/** All theme presets from content/themes/*.yaml */
export function getAllThemes(): ThemePreset[] {
  if (!themesCache) themesCache = loadThemesFromDisk();
  return themesCache;
}

/** content/theme.yaml — default preset id */
export function getThemeConfig(): ThemeConfig {
  if (!configCache) configCache = loadConfigFromDisk();
  return configCache;
}

/** Default id, falling back to first theme if config points at a missing file */
export function getDefaultThemeId(): string {
  const themes = getAllThemes();
  const config = getThemeConfig();
  if (themes.some((t) => t.id === config.default)) return config.default;
  return themes[0]?.id ?? "ink";
}

export function getThemeById(id: string): ThemePreset | undefined {
  return getAllThemes().find((theme) => theme.id === id);
}

/** Meta only — safe to pass into client components */
export function getThemePresetMetas(): ThemePresetMeta[] {
  return getAllThemes().map(({ id, label, description, preferredMode }) => ({
    id,
    label,
    description,
    preferredMode,
  }));
}

function tokensToDeclarations(tokens: ThemeTokens): string {
  const lines: string[] = [];
  for (const [key, cssVar] of Object.entries(TOKEN_TO_CSS) as [
    keyof ThemeTokens,
    string,
  ][]) {
    const value = tokens[key];
    if (value === undefined || value === null || value === "") continue;
    lines.push(`  ${cssVar}: ${value};`);
  }
  return lines.join("\n");
}

/**
 * CSS for all document themes — inject in <head> via root layout.
 * Light tokens → [data-theme="id"]
 * Dark tokens  → [data-theme="id"].dark
 */
export function buildThemeCss(themes: ThemePreset[] = getAllThemes()): string {
  const blocks: string[] = [];

  for (const theme of themes) {
    const light = tokensToDeclarations(theme.light);
    const dark = tokensToDeclarations(theme.dark);

    if (light) {
      blocks.push(`[data-theme="${theme.id}"] {\n${light}\n}`);
    }
    if (dark) {
      blocks.push(`[data-theme="${theme.id}"].dark {\n${dark}\n}`);
    }
  }

  return blocks.join("\n\n");
}
