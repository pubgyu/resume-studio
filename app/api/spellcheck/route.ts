import { NextResponse } from "next/server";

import { requestDaumSpellcheck } from "@/lib/resume-builder/daum-spellcheck";
import { type SpellcheckResponse } from "@/lib/resume-builder/spellcheck";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: { text?: unknown };

  try {
    payload = (await request.json()) as { text?: unknown };
  } catch {
    return NextResponse.json({ message: "invalid-json" }, { status: 400 });
  }

  if (typeof payload.text !== "string") {
    return NextResponse.json({ message: "invalid-text" }, { status: 400 });
  }

  const text = payload.text.trim();

  if (!text) {
    return NextResponse.json(
      {
        issues: [],
        provider: "daum"
      } satisfies SpellcheckResponse,
      { status: 200 }
    );
  }

  try {
    const issues = await requestDaumSpellcheck(text);

    return NextResponse.json(
      {
        issues,
        provider: "daum"
      } satisfies SpellcheckResponse,
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "spellcheck-failed" }, { status: 502 });
  }
}
