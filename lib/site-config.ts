import type { Metadata } from "next";

export const SITE_NAME = "Resume Room";
export const SITE_DESCRIPTION =
  "Resume Room은 이력서를 작성하고 저장하고 PDF로 내보낼 수 있는 온라인 이력서 작업 공간입니다.";
export const SITE_TAGLINE = "Create, save, and export resumes in one workspace.";
export const SITE_KEYWORDS = [
  "resume builder",
  "resume template",
  "cv template",
  "이력서 템플릿",
  "이력서 작성",
  "pdf 이력서",
  "resume room"
];

const FALLBACK_SITE_URL = "https://resume-studio-navy.vercel.app";

export function getSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    FALLBACK_SITE_URL;

  const normalized = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;

  return new URL(normalized);
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function createNoIndexMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false
      }
    }
  };
}
