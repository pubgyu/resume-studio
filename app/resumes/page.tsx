import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DraftCleanupOnMount } from "@/app/components/resume-builder/draft-cleanup-on-mount";
import { ResumeListWorkspace } from "@/app/components/resumes/resume-list-workspace";
import { SupabaseSetupNotice } from "@/app/components/setup/supabase-setup-notice";
import { createNoIndexMetadata } from "@/lib/site-config";
import { getCurrentUser, listUserResumeRecords } from "@/lib/resumes/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createNoIndexMetadata(
  "내 이력서",
  "저장된 이력서를 관리하는 개인 작업 공간입니다."
);

export default async function ResumesPage() {
  if (!hasSupabaseEnv()) {
    return <SupabaseSetupNotice />;
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const resumes = await listUserResumeRecords(user.id);

  return (
    <main className="studio-page resumes-page">
      <DraftCleanupOnMount />
      <section className="studio-shell resumes-shell">
        <ResumeListWorkspace resumes={resumes} />
      </section>
    </main>
  );
}
