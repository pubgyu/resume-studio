import { notFound, redirect } from "next/navigation";

import { ResumeBuilder } from "@/app/components/resume-builder";
import { SupabaseSetupNotice } from "@/app/components/setup/supabase-setup-notice";
import {
  getCurrentUser,
  getUserResume,
  mapResumeRowToEditorDocument
} from "@/lib/resumes/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function ResumeDetailPage({
  params
}: {
  params: Promise<{ resumeId: string }>;
}) {
  if (!hasSupabaseEnv()) {
    return <SupabaseSetupNotice />;
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { resumeId } = await params;
  const record = await getUserResume(resumeId, user.id);

  if (!record) {
    notFound();
  }

  const initialDocument = mapResumeRowToEditorDocument(record);

  return (
    <ResumeBuilder
      initialPresentation={initialDocument.presentation}
      initialResume={initialDocument.resume}
      initialResumeName={initialDocument.resumeName}
      initialUpdatedAt={record.updatedAt}
      resumeId={record.id}
    />
  );
}
