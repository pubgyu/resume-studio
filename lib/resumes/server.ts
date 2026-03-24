import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { ResumeListItem, ResumeRecord } from "./types";
import { normalizeResumeName, parseResumeDocumentJson } from "./utils";

type ResumeRow = {
  created_at: string;
  id: string;
  resume_json: string;
  resume_name: string;
  updated_at: string;
  user_id: string;
};

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
});

export async function listUserResumes(userId: string): Promise<ResumeListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("id, resume_name, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    createdAt: item.created_at,
    id: item.id,
    resumeName: normalizeResumeName(item.resume_name),
    updatedAt: item.updated_at
  }));
}

export async function listUserResumeRecords(userId: string): Promise<ResumeRecord[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("id, resume_name, resume_json, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    createdAt: item.created_at,
    id: item.id,
    resumeJson: item.resume_json,
    resumeName: normalizeResumeName(item.resume_name),
    updatedAt: item.updated_at
  }));
}

export async function getUserResume(
  resumeId: string,
  userId: string
): Promise<ResumeRecord | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("id, resume_name, resume_json, created_at, updated_at")
    .eq("id", resumeId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    createdAt: data.created_at,
    id: data.id,
    resumeJson: data.resume_json,
    resumeName: normalizeResumeName(data.resume_name),
    updatedAt: data.updated_at
  };
}

export function mapResumeRowToEditorDocument(record: ResumeRecord) {
  const document = parseResumeDocumentJson(record.resumeJson);

  return {
    ...document,
    resumeName: record.resumeName
  };
}
