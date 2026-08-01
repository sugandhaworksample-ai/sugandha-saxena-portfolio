"use client";

import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useThemeConfig } from "@/components/theme-config-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { preset, cyclePreset, presets } = useThemeConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Theme preset" disabled>
          <Palette className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
          <Sun className="size-4" />
        </Button>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";
  const presetMeta = presets.find((item) => item.id === preset) ?? presets[0];

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Theme preset: ${presetMeta?.label ?? "Theme"}. Click to cycle.`}
        title={`Preset: ${presetMeta?.label ?? "Theme"}`}
        onClick={cyclePreset}
        className={cn("relative")}
      >
        <Palette className="size-4 transition-transform duration-150 ease-out active:scale-[0.97]" />
        <span className="bg-accent absolute top-1.5 right-1.5 size-1.5 rounded-full" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? (
          <Sun className="size-4 transition-transform duration-150 ease-out" />
        ) : (
          <Moon className="size-4 transition-transform duration-150 ease-out" />
        )}
      </Button>
    </div>
  );
}
