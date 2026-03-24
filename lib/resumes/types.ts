import type { ResumeData } from "@/lib/resume-template";

export const RESUME_TEMPLATE_IDS = ["default", "compact", "split"] as const;
export const RESUME_VISIBILITY_KEYS = [
  "basic",
  "summary",
  "photo",
  "contact",
  "strengths",
  "skills",
  "totalExperience",
  "experience",
  "education",
  "projects",
  "certifications",
  "languageStudies",
  "salary",
  "portfolios"
] as const;
export const RESUME_SECTION_ORDER_KEYS = [
  "summary",
  "strengths",
  "skills",
  "totalExperience",
  "experience",
  "projects",
  "education",
  "certifications",
  "languageStudies",
  "salary",
  "portfolios"
] as const;

export type ResumeTemplateId = (typeof RESUME_TEMPLATE_IDS)[number];
export type ResumeVisibilityKey = (typeof RESUME_VISIBILITY_KEYS)[number];
export type ResumeSectionOrderKey = (typeof RESUME_SECTION_ORDER_KEYS)[number];
export type ResumeSectionVisibility = Record<ResumeVisibilityKey, boolean>;
export type ResumePresentation = {
  sectionOrder: ResumeSectionOrderKey[];
  sectionVisibility: ResumeSectionVisibility;
  templateId: ResumeTemplateId;
};

export type ResumeDraftDocument = {
  presentation: ResumePresentation;
  resume: ResumeData;
  resumeName: string;
};

export type ResumeListItem = {
  createdAt: string;
  id: string;
  resumeName: string;
  updatedAt: string;
};

export type ResumeRecord = ResumeListItem & {
  resumeJson: string;
};
