import { NextResponse } from "next/server";

import {
  createDuplicatedResumeName,
  parseResumeDocumentJson,
  serializeResumeDocument
} from "@/lib/resumes/utils";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ resumeId: string }> }
) {
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

  const { resumeId } = await context.params;
  const { data: currentResume, error: currentResumeError } = await supabase
    .from("resumes")
    .select("resume_json, resume_name")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (currentResumeError) {
    console.error("resume duplicate read failed", currentResumeError);
    return NextResponse.json({ message: "duplicate-read-failed" }, { status: 500 });
  }

  if (!currentResume) {
    return NextResponse.json({ message: "not-found" }, { status: 404 });
  }

  try {
    const document =
      typeof currentResume.resume_json === "string"
        ? parseResumeDocumentJson(currentResume.resume_json)
        : {
            ...parseResumeDocumentJson(JSON.stringify(currentResume.resume_json)),
            resumeName: createDuplicatedResumeName(currentResume.resume_name)
          };

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        resume_json: serializeResumeDocument({
          ...document,
          resumeName: createDuplicatedResumeName(currentResume.resume_name)
        }),
        resume_name: createDuplicatedResumeName(currentResume.resume_name),
        user_id: user.id
      })
      .select("id, updated_at")
      .single();

    if (error) {
      console.error("resume duplicate insert failed", error);
      return NextResponse.json({ message: "duplicate-failed" }, { status: 500 });
    }

    return NextResponse.json({
      resumeId: data.id,
      updatedAt: data.updated_at
    });
  } catch (error) {
    console.error("resume duplicate normalize failed", error);
    return NextResponse.json({ message: "duplicate-parse-failed" }, { status: 500 });
  }
}
