import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SupabaseSetupNotice } from "@/app/components/setup/supabase-setup-notice";
import { createNoIndexMetadata } from "@/lib/site-config";
import { getCurrentUser, listUserResumes } from "@/lib/resumes/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createNoIndexMetadata(
  "홈",
  "로그인 상태에 따라 이력서 목록 또는 편집 화면으로 이동합니다."
);

export default async function Home() {
  if (!hasSupabaseEnv()) {
    return <SupabaseSetupNotice />;
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const resumes = await listUserResumes(user.id);

  if (resumes.length === 0) {
    redirect("/resumes/new?fresh=1");
  }

  redirect("/resumes");
}
