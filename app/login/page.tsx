import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/app/components/auth/google-sign-in-button";
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
      <section className="studio-shell strict-login-shell">
        <div className="strict-login-window">
          <header className="studio-topbar strict-window-bar">
            <div className="window-meta">
              <span className="window-location">Login</span>
            </div>
            <div className="window-actions">
              <AppThemeToggle />
            </div>
          </header>

          <div className="strict-login-body">
            <div className="strict-login-copy">
              <h1 className="strict-login-title">
                <span>Resume Room</span>
              </h1>
              <p className="strict-login-description">
                저장, 버전 관리, PDF 정리까지 한 흐름으로 이어지는 온라인 이력서 작업 공간입니다.
              </p>
              <div className="strict-login-chips">
                <span>저장</span>
                <span>PDF</span>
              </div>
            </div>

            <section className="strict-login-panel" aria-label="로그인 패널">
              <p className="eyebrow strict-panel-kicker">Google Login</p>
              <h2 className="strict-panel-title">Google 계정으로 시작</h2>
              <p className="strict-panel-copy">로그인 후 저장된 이력서를 바로 열 수 있습니다.</p>
              <GoogleSignInButton className="strict-login-button" variant="primary">
                Google로 로그인
              </GoogleSignInButton>
              <p className="strict-panel-caption">처음 로그인하면 새 이력서로 바로 시작할 수 있습니다.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
