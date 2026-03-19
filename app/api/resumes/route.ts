import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeResumeDocument, serializeResumeDocument } from "@/lib/resumes/utils";

type ResumeMutationRequest = {
  presentation?: unknown;
  resume?: unknown;
  resumeName?: unknown;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ message: "supabase-not-configured" }, { status: 500 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as ResumeMutationRequest;
  const document = normalizeResumeDocument(body);

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      resume_json: serializeResumeDocument(document),
      resume_name: document.resumeName,
      user_id: user.id
    })
    .select("id, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ message: "create-failed" }, { status: 500 });
  }

  return NextResponse.json({
    resumeId: data.id,
    updatedAt: data.updated_at
  });
}
