"use client";

import { useEffect, useRef, useState } from "react";

import type { ResumeData } from "@/lib/resume-template";
import type { ResumePresentation } from "@/lib/resumes/types";

type ResumePdfPreviewProps = {
  presentation: ResumePresentation;
  resume: ResumeData;
  resumeName: string;
};

export function ResumePdfPreview({
  presentation,
  resume,
  resumeName
}: ResumePdfPreviewProps) {
  const activeUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    return () => {
      if (activeUrlRef.current) {
        window.URL.revokeObjectURL(activeUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let pendingUrl: string | null = null;

    const replacePreviewUrl = (nextUrl: string | null) => {
      if (activeUrlRef.current) {
        window.URL.revokeObjectURL(activeUrlRef.current);
      }

      activeUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
    };

    const createPreview = async () => {
      setStatus("loading");

      try {
        const [{ pdf }, { ResumePdfDocument }] = await Promise.all([
          import("@react-pdf/renderer"),
          import("@/app/components/resume-builder/pdf/resume-pdf-document")
        ]);

        const blob = await pdf(
          <ResumePdfDocument
            presentation={presentation}
            resume={resume}
            resumeName={resumeName}
          />
        ).toBlob();

        pendingUrl = window.URL.createObjectURL(blob);

        if (isCancelled) {
          window.URL.revokeObjectURL(pendingUrl);
          return;
        }

        replacePreviewUrl(pendingUrl);
        pendingUrl = null;
        setStatus("ready");
      } catch {
        if (isCancelled) {
          return;
        }

        replacePreviewUrl(null);
        setStatus("error");
      }
    };

    void createPreview();

    return () => {
      isCancelled = true;

      if (pendingUrl) {
        window.URL.revokeObjectURL(pendingUrl);
      }
    };
  }, [presentation, resume, resumeName]);

  if (status === "loading") {
    return <div className="strict-preview-loading">PDF 미리보기를 준비하고 있습니다.</div>;
  }

  if (status === "error" || !previewUrl) {
    return <div className="strict-preview-empty">PDF 미리보기를 불러오지 못했습니다.</div>;
  }

  return (
    <iframe
      className="strict-preview-pdf-frame"
      src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
      title={`${resumeName} PDF 미리보기`}
    />
  );
}
