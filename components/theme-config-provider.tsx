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
  THEME_PRESET_STORAGE_KEY,
  getThemePreset,
  isThemePresetId,
  type ThemePresetId,
} from "@/constants/theme";
import type { ThemePresetMeta } from "@/types/theme";

type ThemeConfigContextValue = {
  preset: ThemePresetId;
  setPreset: (id: ThemePresetId) => void;
  cyclePreset: () => void;
  presets: ThemePresetMeta[];
};

const ThemeConfigContext = createContext<ThemeConfigContextValue | null>(null);

function applyPresetAttribute(id: ThemePresetId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}

type ThemeConfigProviderProps = {
  children: ReactNode;
  presets: ThemePresetMeta[];
  defaultPreset: string;
};

export function ThemeConfigProvider({
  children,
  presets,
  defaultPreset,
}: ThemeConfigProviderProps) {
  const { setTheme } = useTheme();
  const fallbackId = presets[0]?.id ?? defaultPreset;
  const initialDefault = presets.some((p) => p.id === defaultPreset)
    ? defaultPreset
    : fallbackId;

  const [preset, setPresetState] = useState<ThemePresetId>(initialDefault);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_PRESET_STORAGE_KEY);
    const initial =
      stored && isThemePresetId(stored, presets) ? stored : initialDefault;
    setPresetState(initial);
    applyPresetAttribute(initial);
    setMounted(true);
  }, [presets, initialDefault]);

  const setPreset = useCallback(
    (id: ThemePresetId) => {
      if (!isThemePresetId(id, presets)) return;
      setPresetState(id);
      applyPresetAttribute(id);
      window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, id);
      const config = getThemePreset(id, presets);
      if (config) setTheme(config.preferredMode);
    },
    [setTheme, presets],
  );

  const cyclePreset = useCallback(() => {
    if (presets.length === 0) return;
    const index = presets.findIndex((item) => item.id === preset);
    const next = presets[(index + 1) % presets.length];
    setPreset(next.id);
  }, [preset, setPreset, presets]);

  const value = useMemo(
    () => ({
      preset: mounted ? preset : initialDefault,
      setPreset,
      cyclePreset,
      presets,
    }),
    [mounted, preset, setPreset, cyclePreset, presets, initialDefault],
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
