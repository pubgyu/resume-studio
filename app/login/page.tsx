import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/app/components/auth/google-sign-in-button";
import { LoginBackground } from "@/app/components/auth/login-background";
import { DraftCleanupOnMount } from "@/app/components/resume-builder/draft-cleanup-on-mount";
import { SupabaseSetupNotice } from "@/app/components/setup/supabase-setup-notice";
import { AppThemeToggle } from "@/app/components/theme/app-theme-toggle";
import { absoluteUrl, SITE_NAME } from "@/lib/site-config";
import { getCurrentUser } from "@/lib/resumes/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
const LOGIN_DESCRIPTION = "Google 계정으로 로그인하고 저장된 이력서를 이어서 편집하세요.";
const LOGIN_OG_IMAGE = absoluteUrl("/og/resume-room-og.png");

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
    images: [LOGIN_OG_IMAGE],
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
      <section className="studio-shell studio-shell-loading auth-stage">
        <div className="auth-stage-content">
          <div className="panel-card loading-card auth-card">
            <div className="auth-card-toolbar">
              <p className="auth-card-brand">Resume Room</p>
              <AppThemeToggle />
            </div>
            <h1 className="loading-title">Google 계정으로 시작</h1>
            <p className="intro loading-copy">
              로그인하면 저장된 이력서를 다시 열고, 새 이력서를 저장해서 이어서 편집할 수
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
