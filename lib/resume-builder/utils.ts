"use client";

import {
  ACTIVE_DRAFT_STORAGE_KEY,
  RESUME_AUTOSAVE_DEBOUNCE_MS,
  RESUME_DRAFT_STORAGE_PREFIX,
  THEME_STORAGE_KEY
} from "./constants";
import type { ThemeMode } from "./state";

export const LINK_PATTERN =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;
export {
  ACTIVE_DRAFT_STORAGE_KEY,
  RESUME_AUTOSAVE_DEBOUNCE_MS,
  RESUME_DRAFT_STORAGE_PREFIX,
  THEME_STORAGE_KEY
} from "./constants";

const MAX_IMAGE_EDGE = 960;
const MAX_INLINE_IMAGE_BYTES = 450_000;
const JPEG_OUTPUT_QUALITY = 0.84;

export function readThemePreference(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getResumeDraftStorageKey(resumeId: string | null) {
  return `${RESUME_DRAFT_STORAGE_PREFIX}:${resumeId ?? "new"}`;
}

export function readDraftValue(storageKey: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(storageKey);
}

export function persistDraftValue(storageKey: string, value: string) {
  window.localStorage.setItem(storageKey, value);
}

export function clearDraftValue(storageKey: string) {
  window.localStorage.removeItem(storageKey);
}

export function clearAllResumeDrafts() {
  if (typeof window === "undefined") {
    return;
  }

  const draftKeys: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (key && key.startsWith(`${RESUME_DRAFT_STORAGE_PREFIX}:`)) {
      draftKeys.push(key);
    }
  }

  draftKeys.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

export function readActiveDraftKey() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(ACTIVE_DRAFT_STORAGE_KEY);
}

export function setActiveDraftKey(storageKey: string) {
  window.sessionStorage.setItem(ACTIVE_DRAFT_STORAGE_KEY, storageKey);
}

export function clearActiveDraftKey() {
  window.sessionStorage.removeItem(ACTIVE_DRAFT_STORAGE_KEY);
}

export async function readImageAsDataUrl(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("invalid image");
  }

  if (file.size <= MAX_INLINE_IMAGE_BYTES) {
    return readFileAsDataUrl(file);
  }

  const image = await loadImageFromFile(file);
  const { height, width } = getScaledDimensions(image.naturalWidth, image.naturalHeight);

  if (width === image.naturalWidth && height === image.naturalHeight) {
    return readFileAsDataUrl(file);
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return readFileAsDataUrl(file);
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

  return canvas.toDataURL(
    outputType,
    outputType === "image/png" ? undefined : JPEG_OUTPUT_QUALITY
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        resolve(result);
        return;
      }

      reject(new Error("invalid image"));
    };

    reader.onerror = () => reject(new Error("image read failed"));
    reader.readAsDataURL(file);
  });
}

function loadImageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };

    image.src = url;
  });
}

function getScaledDimensions(width: number, height: number) {
  const largestEdge = Math.max(width, height);

  if (largestEdge <= MAX_IMAGE_EDGE) {
    return { height, width };
  }

  const scale = MAX_IMAGE_EDGE / largestEdge;

  return {
    height: Math.max(1, Math.round(height * scale)),
    width: Math.max(1, Math.round(width * scale))
  };
}

export function getInitials(value: string, fallback = "RS") {
  const tokens = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length === 0) {
    return fallback;
  }

  return tokens.map((token) => token.slice(0, 1).toUpperCase()).join("");
}

export function toWebsiteHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export function toPhoneHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

export function getInlineHref(value: string) {
  const trimmed = value.trim();

  if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  if (/^(https?:\/\/|www\.)/i.test(trimmed)) {
    return toWebsiteHref(trimmed);
  }

  return "";
}

export function splitTrailingPunctuation(value: string) {
  const match = value.match(/^(.*?)([),.;!?]+)?$/);

  if (!match) {
    return { core: value, suffix: "" };
  }

  return {
    core: match[1] || value,
    suffix: match[2] || ""
  };
}

export function createPdfFileName(name: string) {
  const trimmed = name.trim() || "resume";

  return trimmed.replace(/[\\/:*?"<>|]/g, "-");
}

export function createDataFileName(name: string) {
  return `${createPdfFileName(name)}-resume-data`;
}
