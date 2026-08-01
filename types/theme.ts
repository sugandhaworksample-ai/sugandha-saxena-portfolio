import { z } from "zod";

/**
 * Theme token bag — every field is optional.
 * Missing values fall back to :root / .dark in styles/globals.css.
 * Values are raw CSS (hex, oklch, rem, unitless numbers, etc.).
 */
export const themeTokensSchema = z
  .object({
    background: z.string().optional(),
    foreground: z.string().optional(),
    card: z.string().optional(),
    cardForeground: z.string().optional(),
    popover: z.string().optional(),
    popoverForeground: z.string().optional(),
    primary: z.string().optional(),
    primaryForeground: z.string().optional(),
    secondary: z.string().optional(),
    secondaryForeground: z.string().optional(),
    muted: z.string().optional(),
    mutedForeground: z.string().optional(),
    accent: z.string().optional(),
    accentForeground: z.string().optional(),
    destructive: z.string().optional(),
    destructiveForeground: z.string().optional(),
    border: z.string().optional(),
    input: z.string().optional(),
    ring: z.string().optional(),
    radius: z.string().optional(),
    heroGlow: z.string().optional(),
    heroVeil: z.string().optional(),
    spotlight: z.string().optional(),
    grainOpacity: z.union([z.string(), z.number()]).optional(),
    motionScale: z.union([z.string(), z.number()]).optional(),
    displayTracking: z.string().optional(),
  })
  .default({});

export const themePresetSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "Theme id must be lowercase letters, numbers, dashes",
    ),
  label: z.string().min(1),
  description: z.string().default(""),
  preferredMode: z.enum(["light", "dark"]).default("dark"),
  light: themeTokensSchema,
  dark: themeTokensSchema,
});

export const themeConfigSchema = z.object({
  default: z.string().min(1).default("ink"),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;
export type ThemePreset = z.infer<typeof themePresetSchema>;
export type ThemeConfig = z.infer<typeof themeConfigSchema>;

/** Lightweight meta passed to the client switcher (no color bags). */
export type ThemePresetMeta = Pick<
  ThemePreset,
  "id" | "label" | "description" | "preferredMode"
>;
