"use client";

import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

import { ThemeSwitch } from "@/app/components/resume-builder/toolbar/theme-switch";
import { THEME_STORAGE_KEY, readThemePreference } from "@/lib/resume-builder/utils";
import {
  hasLoadedThemeAtom,
  themeModeAtom,
  toggleThemeModeAtom
} from "@/lib/resume-builder/state";

export function AppThemeToggle() {
  const [themeMode, setThemeMode] = useAtom(themeModeAtom);
  const [hasLoadedTheme, setHasLoadedTheme] = useAtom(hasLoadedThemeAtom);
  const toggleThemeMode = useSetAtom(toggleThemeModeAtom);
  const label = themeMode === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";

  useEffect(() => {
    const domTheme = document.documentElement.dataset.theme;
    const nextTheme =
      domTheme === "light" || domTheme === "dark" ? domTheme : readThemePreference();

    setThemeMode(nextTheme);
    setHasLoadedTheme(true);
  }, [setHasLoadedTheme, setThemeMode]);

  useEffect(() => {
    if (!hasLoadedTheme) {
      return;
    }

    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode === "dark" ? "dark" : "light";
    document.body.dataset.theme = themeMode;
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [hasLoadedTheme, themeMode]);

  if (!hasLoadedTheme) {
    return null;
  }

  return (
    <ThemeSwitch
      checked={themeMode === "dark"}
      label={label}
      onToggle={() => toggleThemeMode()}
    />
  );
}
