import { redirect } from "next/navigation";

import { SupabaseSetupNotice } from "@/app/components/setup/supabase-setup-notice";
import { getCurrentUser, listUserResumes } from "@/lib/resumes/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

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
