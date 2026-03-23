import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/app/components/auth/google-sign-in-button";
import { LoginBackground } from "@/app/components/auth/login-background";
import { DraftCleanupOnMount } from "@/app/components/resume-builder/draft-cleanup-on-mount";
import { SupabaseSetupNotice } from "@/app/components/setup/supabase-setup-notice";
import { AppThemeToggle } from "@/app/components/theme/app-theme-toggle";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";
import { getCurrentUser } from "@/lib/resumes/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
const LOGIN_DESCRIPTION = SITE_DESCRIPTION;
const LOGIN_OG_IMAGE = absoluteUrl("/og/resume-room-og.png");
const LOGIN_TWITTER_IMAGE = absoluteUrl("/og/resume-room-og.png");

export const metadata: Metadata = {
  alternates: {
    canonical: "/login"
  },
  description: LOGIN_DESCRIPTION,
  openGraph: {
    description: LOGIN_DESCRIPTION,
    images: [
      {
        alt: SITE_NAME,
        height: 630,
        url: LOGIN_OG_IMAGE,
        width: 1200
      }
    ],
    siteName: SITE_NAME,
    title: SITE_NAME,
    type: "website",
    url: "/login"
  },
  title: "로그인",
  twitter: {
    card: "summary_large_image",
    description: LOGIN_DESCRIPTION,
    images: [LOGIN_TWITTER_IMAGE],
    title: `${SITE_NAME} 로그인`
  }
};

export default async function LoginPage() {
  if (!hasSupabaseEnv()) {
    return <SupabaseSetupNotice />;
  }

  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="studio-page login-page">
      <DraftCleanupOnMount />
      <LoginBackground />
      <section className="studio-shell auth-stage">
        <div className="auth-stage-grid">
          <div className="auth-stage-copy">
            <p className="eyebrow auth-kicker">Resume Room</p>
            <h1 className="auth-hero-title">이력서를 저장하고 버전별로 관리하는 온라인 작업 공간</h1>
            <p className="auth-hero-copy">
              Resume Room은 이력서를 작성하고 저장해 두었다가, 여러 버전으로 관리하고
              원하는 시점에 PDF로 정리할 수 있는 온라인 이력서 서비스입니다.
            </p>
            <div className="auth-proof-chips" aria-label="주요 기능">
              <span>저장된 이력서 이어쓰기</span>
              <span>다중 버전 관리</span>
              <span>PDF 내보내기</span>
            </div>
          </div>

          <div className="panel-card loading-card auth-card">
            <div className="auth-card-toolbar">
              <p className="auth-card-brand">Resume Room</p>
              <AppThemeToggle />
            </div>
            <p className="eyebrow auth-card-kicker">Google 로그인</p>
            <h2 className="loading-title auth-card-title">Google 계정으로 시작</h2>
            <p className="intro loading-copy">
              로그인하면 저장된 이력서를 다시 불러오고, 새 이력서를 만들어 바로 작성할 수
              있습니다.
            </p>
            <div className="auth-actions">
              <GoogleSignInButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
