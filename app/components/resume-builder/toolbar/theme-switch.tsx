"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { Switch } from "@/app/components/ui/switch";

import styles from "./theme-switch.module.scss";

type ThemeSwitchProps = {
  checked: boolean;
  label: string;
  onToggle: (checked: boolean) => void;
};

export function ThemeSwitch({ checked, label, onToggle }: ThemeSwitchProps) {
  const ThemeIcon = checked ? MoonStar : SunMedium;

  return (
    <div className={styles.themeToggle} title={label}>
      <span className="visually-hidden">{label}</span>
      <Switch
        aria-label={label}
        checked={checked}
        className={styles.switchRoot}
        onCheckedChange={onToggle}
        thumbClassName={styles.switchThumb}
        thumbChildren={
          <ThemeIcon
            aria-hidden="true"
            className={styles.switchIcon}
          />
        }
      />
    </div>
  );
}
