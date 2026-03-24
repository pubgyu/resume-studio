import { createEmptyResume, normalizeResume, type ResumeData } from "@/lib/resume-template";

import {
  RESUME_SECTION_ORDER_KEYS,
  RESUME_TEMPLATE_IDS,
  RESUME_VISIBILITY_KEYS,
  type ResumeDraftDocument,
  type ResumePresentation,
  type ResumeSectionOrderKey,
  type ResumeSectionVisibility,
  type ResumeVisibilityKey,
  type ResumeTemplateId
} from "./types";

export const DEFAULT_RESUME_NAME = "새 이력서";

type ResumeImportFilePayload = {
  presentation?: unknown;
  resume?: unknown;
  resumeName?: unknown;
  sectionOrder?: unknown;
  sectionVisibility?: unknown;
  templateId?: unknown;
};

export function createEmptyResumeDocument(
  resumeName = DEFAULT_RESUME_NAME
): ResumeDraftDocument {
  return {
    presentation: createDefaultResumePresentation(),
    resume: createEmptyResume(),
    resumeName
  };
}

export function normalizeResumeDocument(input: unknown): ResumeDraftDocument {
  const source = isResumeImportFilePayload(input) ? input : {};
  const hasWrappedResume =
    "resume" in source || "resumeName" in source || "presentation" in source;
  const resumeSource = hasWrappedResume ? source.resume : input;

  return {
    presentation: normalizeResumePresentation(source.presentation),
    resume: normalizeResume(resumeSource),
    resumeName: normalizeResumeName(source.resumeName)
  };
}

export function normalizeResumeName(value: unknown) {
  if (typeof value !== "string") {
    return DEFAULT_RESUME_NAME;
  }

  const trimmed = value.trim();

  return trimmed || DEFAULT_RESUME_NAME;
}

export function createDuplicatedResumeName(value: unknown) {
  const normalized = normalizeResumeName(value);
  const match = normalized.match(/^(.*?)(?: 사본(?: (\d+))?)?$/);

  if (!match) {
    return `${normalized} 사본`;
  }

  const baseName = match[1]?.trim() || normalized;
  const nextIndex = match[2] ? Number(match[2]) + 1 : normalized.endsWith(" 사본") ? 2 : 1;

  return nextIndex === 1 ? `${baseName} 사본` : `${baseName} 사본 ${nextIndex}`;
}

export function createDefaultSectionVisibility(): ResumeSectionVisibility {
  return RESUME_VISIBILITY_KEYS.reduce(
    (accumulator, key) => {
      accumulator[key] = true;
      return accumulator;
    },
    {} as ResumeSectionVisibility
  );
}

export function createDefaultResumePresentation(): ResumePresentation {
  return {
    sectionOrder: [...RESUME_SECTION_ORDER_KEYS],
    sectionVisibility: createDefaultSectionVisibility(),
    templateId: "default"
  };
}

export function normalizeResumePresentation(value: unknown): ResumePresentation {
  const input = isResumeImportFilePayload(value) ? value : {};
  const rawVisibility: Record<string, unknown> = isResumeImportFilePayload(input.sectionVisibility)
    ? input.sectionVisibility
    : {};
  const rawSectionOrder = Array.isArray(input.sectionOrder) ? input.sectionOrder : [];
  const normalizedSectionOrder = rawSectionOrder
    .filter(isResumeSectionOrderKey)
    .filter((key, index, keys) => keys.indexOf(key) === index);
  const missingSectionOrder = RESUME_SECTION_ORDER_KEYS.filter(
    (key) => !normalizedSectionOrder.includes(key)
  );

  return {
    sectionOrder: [...normalizedSectionOrder, ...missingSectionOrder],
    sectionVisibility: RESUME_VISIBILITY_KEYS.reduce(
      (accumulator, key) => {
        accumulator[key] = readSectionVisibility(rawVisibility, key);
        return accumulator;
      },
      {} as ResumeSectionVisibility
    ),
    templateId: isResumeTemplateId(input.templateId) ? input.templateId : "default"
  };
}

export function serializeResumeDocument(document: ResumeDraftDocument) {
  return JSON.stringify({
    presentation: normalizeResumePresentation(document.presentation),
    resume: document.resume,
    resumeName: normalizeResumeName(document.resumeName),
    version: 4
  });
}

export function parseStoredResumeDocument(value: string): ResumeDraftDocument | null {
  try {
    return normalizeResumeDocument(JSON.parse(value));
  } catch {
    return null;
  }
}

export function parseImportedResumeFile(value: unknown): ResumeDraftDocument {
  return normalizeResumeDocument(value);
}

export function parseResumeDocumentJson(value: string): ResumeDraftDocument {
  return normalizeResumeDocument(JSON.parse(value));
}

export function parseResumeJson(value: string): ResumeData {
  return parseResumeDocumentJson(value).resume;
}

function isResumeImportFilePayload(value: unknown): value is ResumeImportFilePayload {
  return typeof value === "object" && value !== null;
}

function isResumeTemplateId(value: unknown): value is ResumeTemplateId {
  return typeof value === "string" && RESUME_TEMPLATE_IDS.includes(value as ResumeTemplateId);
}

function isResumeSectionOrderKey(value: unknown): value is ResumeSectionOrderKey {
  return (
    typeof value === "string" &&
    RESUME_SECTION_ORDER_KEYS.includes(value as ResumeSectionOrderKey)
  );
}

function readSectionVisibility(
  rawVisibility: Record<string, unknown>,
  key: ResumeVisibilityKey
) {
  const directValue = rawVisibility[key];

  if (typeof directValue === "boolean") {
    return directValue;
  }

  const legacyFallbackMap: Partial<Record<ResumeVisibilityKey, string[]>> = {
    strengths: ["skills"],
    summary: ["basic"],
    totalExperience: ["experience"]
  };
  const fallbackKeys = legacyFallbackMap[key] ?? [];

  for (const fallbackKey of fallbackKeys) {
    const fallbackValue = rawVisibility[fallbackKey];

    if (typeof fallbackValue === "boolean") {
      return fallbackValue;
    }
  }

  return true;
}
