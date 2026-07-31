"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";

import {
  DEFAULT_THEME_PRESET,
  THEME_PRESET_STORAGE_KEY,
  getThemePreset,
  isThemePresetId,
  type ThemePresetId,
  themePresets,
} from "@/constants/theme";

type ThemeConfigContextValue = {
  preset: ThemePresetId;
  setPreset: (id: ThemePresetId) => void;
  cyclePreset: () => void;
  presets: typeof themePresets;
};

const ThemeConfigContext = createContext<ThemeConfigContextValue | null>(null);

function applyPresetAttribute(id: ThemePresetId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}

export function ThemeConfigProvider({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  const [preset, setPresetState] =
    useState<ThemePresetId>(DEFAULT_THEME_PRESET);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_PRESET_STORAGE_KEY);
    const initial =
      stored && isThemePresetId(stored) ? stored : DEFAULT_THEME_PRESET;
    setPresetState(initial);
    applyPresetAttribute(initial);
    setMounted(true);
  }, []);

  const setPreset = useCallback(
    (id: ThemePresetId) => {
      setPresetState(id);
      applyPresetAttribute(id);
      window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, id);
      const config = getThemePreset(id);
      setTheme(config.preferredMode);
    },
    [setTheme],
  );

  const cyclePreset = useCallback(() => {
    const index = themePresets.findIndex((item) => item.id === preset);
    const next = themePresets[(index + 1) % themePresets.length];
    setPreset(next.id);
  }, [preset, setPreset]);

  const value = useMemo(
    () => ({
      preset: mounted ? preset : DEFAULT_THEME_PRESET,
      setPreset,
      cyclePreset,
      presets: themePresets,
    }),
    [mounted, preset, setPreset, cyclePreset],
  );

  return (
    <ThemeConfigContext.Provider value={value}>
      {children}
    </ThemeConfigContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeConfigContext);
  if (!context) {
    throw new Error("useThemeConfig must be used within ThemeConfigProvider");
  }
  return context;
}
