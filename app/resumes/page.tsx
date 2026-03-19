import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/components/auth/sign-out-button";
import { DraftCleanupOnMount } from "@/app/components/resume-builder/draft-cleanup-on-mount";
import { ResumeListCard } from "@/app/components/resumes/resume-list-card";
import { Button } from "@/app/components/ui/button";
import { SupabaseSetupNotice } from "@/app/components/setup/supabase-setup-notice";
import { AppThemeToggle } from "@/app/components/theme/app-theme-toggle";
import { createNoIndexMetadata } from "@/lib/site-config";
import { getCurrentUser, listUserResumes } from "@/lib/resumes/server";
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

  const resumes = await listUserResumes(user.id);

  return (
    <main className="studio-page">
      <DraftCleanupOnMount />
      <section className="studio-shell resumes-shell">
        <header className="studio-topbar resumes-topbar">
          <div className="hero-copy">
            <h1 className="eyebrow hero-brand">Resume Room</h1>
            <p className="intro">
              저장된 이력서를 다시 열거나 새 이력서를 만들어 계속 관리할 수 있습니다.
            </p>
            <div className="topbar-meta">
              <span className="topbar-meta-badge">{resumes.length}개 저장됨</span>
              <span className="topbar-meta-text">저장된 이력서 목록</span>
            </div>
          </div>

          <div className="toolbar">
            <AppThemeToggle />
            <Button asChild type="button" variant="primary">
              <Link href="/resumes/new?fresh=1">새 이력서</Link>
            </Button>
            <SignOutButton />
          </div>
        </header>

        {resumes.length === 0 ? (
          <section className="panel-card resumes-empty">
            <h2>아직 저장된 이력서가 없습니다</h2>
            <p>첫 이력서를 만들면 여기서 카드 형식으로 다시 열 수 있습니다.</p>
            <Button asChild type="button" variant="primary">
              <Link href="/resumes/new?fresh=1">첫 이력서 만들기</Link>
            </Button>
          </section>
        ) : (
          <section className="resume-list-grid">
            {resumes.map((resume) => (
              <ResumeListCard key={resume.id} resume={resume} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
