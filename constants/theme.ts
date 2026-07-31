export const themePresets = [
  {
    id: "ink",
    label: "Ink",
    description:
      "Charcoal surfaces with steel accent — default dark studio feel.",
    preferredMode: "dark" as const,
  },
  {
    id: "paper",
    label: "Paper",
    description: "Editorial bone and ink — light, print-inspired.",
    preferredMode: "light" as const,
  },
  {
    id: "studio",
    label: "Studio",
    description: "Cool slate surfaces with a sharper cyan accent.",
    preferredMode: "dark" as const,
  },
] as const;

export type ThemePresetId = (typeof themePresets)[number]["id"];

export const DEFAULT_THEME_PRESET: ThemePresetId = "ink";
export const THEME_PRESET_STORAGE_KEY = "portfolio-theme-preset";

export function isThemePresetId(value: string): value is ThemePresetId {
  return themePresets.some((preset) => preset.id === value);
}

export function getThemePreset(id: ThemePresetId) {
  return themePresets.find((preset) => preset.id === id) ?? themePresets[0];
}
