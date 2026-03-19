import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResumeBuilder } from "@/app/components/resume-builder";
import { SupabaseSetupNotice } from "@/app/components/setup/supabase-setup-notice";
import { createNoIndexMetadata } from "@/lib/site-config";
import { getCurrentUser } from "@/lib/resumes/server";
import { createEmptyResumeDocument } from "@/lib/resumes/utils";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createNoIndexMetadata(
  "새 이력서",
  "새 이력서를 작성하는 비공개 페이지입니다."
);

export default async function NewResumePage({
  searchParams
}: {
  searchParams: Promise<{ fresh?: string }>;
}) {
  if (!hasSupabaseEnv()) {
    return <SupabaseSetupNotice />;
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const initialDocument = createEmptyResumeDocument();
  const { fresh } = await searchParams;

  return (
    <ResumeBuilder
      freshStart={fresh === "1"}
      initialPresentation={initialDocument.presentation}
      initialResume={initialDocument.resume}
      initialResumeName={initialDocument.resumeName}
      resumeId={null}
    />
  );
}
