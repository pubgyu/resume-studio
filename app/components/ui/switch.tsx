"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode
} from "react";

import { cn } from "@/lib/utils";

import styles from "./switch.module.scss";

type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
  thumbChildren?: ReactNode;
  thumbClassName?: string;
};

export const Switch = forwardRef<
  ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, thumbChildren, thumbClassName, ...props }, ref) => (
  <SwitchPrimitive.Root ref={ref} className={cn(styles.root, className)} {...props}>
    <SwitchPrimitive.Thumb className={cn(styles.thumb, thumbClassName)}>
      {thumbChildren}
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
));

Switch.displayName = SwitchPrimitive.Root.displayName;
