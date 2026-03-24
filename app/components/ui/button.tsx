"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import styles from "./button.module.scss";

export type ButtonVariant = "primary" | "ghost" | "soft" | "link";
export type ButtonSize = "default" | "small" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClassMap: Record<ButtonVariant, string> = {
  ghost: styles.ghost,
  link: styles.link,
  primary: styles.primary,
  soft: styles.soft
};

const sizeClassMap: Record<ButtonSize, string> = {
  default: styles.defaultSize,
  icon: styles.iconSize,
  small: styles.smallSize
};

export function Button({
  asChild = false,
  className,
  size = "default",
  variant = "ghost",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        styles.button,
        variantClassMap[variant],
        sizeClassMap[size],
        className
      )}
      {...props}
    />
  );
}
