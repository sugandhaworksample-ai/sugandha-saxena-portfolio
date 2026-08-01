import type { ThemePresetMeta } from "@/types/theme";

/** localStorage key for the visitor's chosen palette */
export const THEME_PRESET_STORAGE_KEY = "portfolio-theme-preset";

export type ThemePresetId = string;

export function isThemePresetId(
  value: string,
  presets: ThemePresetMeta[],
): boolean {
  return presets.some((preset) => preset.id === value);
}

export function getThemePreset(
  id: string,
  presets: ThemePresetMeta[],
): ThemePresetMeta {
  return presets.find((preset) => preset.id === id) ?? presets[0];
}
