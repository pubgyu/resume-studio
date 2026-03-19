import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  normalizeResumeDocument,
  serializeResumeDocument
} from "@/lib/resumes/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ResumeMutationRequest = {
  presentation?: unknown;
  resume?: unknown;
  resumeName?: unknown;
};

export async function PUT(
  request: Request,
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
  const body = (await request.json()) as ResumeMutationRequest;
  const document = normalizeResumeDocument(body);

  const { data, error } = await supabase
    .from("resumes")
    .update({
      resume_json: serializeResumeDocument(document),
      resume_name: document.resumeName,
      updated_at: new Date().toISOString()
    })
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .select("id, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ message: "update-failed" }, { status: 500 });
  }

  return NextResponse.json({
    resumeId: data.id,
    updatedAt: data.updated_at
  });
}

export async function DELETE(
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
  const { data, error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: "delete-failed" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: "not-found" }, { status: 404 });
  }

  return NextResponse.json({ resumeId: data.id });
}
