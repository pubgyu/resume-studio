"use client";

import { useEffect } from "react";

import {
  clearActiveDraftKey,
  clearDraftValue,
  readActiveDraftKey
} from "@/lib/resume-builder/utils";

export function DraftCleanupOnMount() {
  useEffect(() => {
    const activeDraftKey = readActiveDraftKey();

    if (!activeDraftKey) {
      return;
    }

    clearDraftValue(activeDraftKey);
    clearActiveDraftKey();
  }, []);

  return null;
}
