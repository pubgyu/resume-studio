import "server-only";

import {
  SPELLCHECK_MAX_CHARS,
  SPELLCHECK_MAX_ISSUES,
  type SpellcheckIssue
} from "@/lib/resume-builder/spellcheck";

const DAUM_URL = "https://dic.daum.net/grammar_checker.do";
const DAUM_REQUEST_INTERVAL_MS = 420;
const SPELLCHECK_CACHE_TTL_MS = 1000 * 60 * 5;

const spellcheckCache = new Map<string, { expiresAt: number; issues: SpellcheckIssue[] }>();
const inflightSpellchecks = new Map<string, Promise<SpellcheckIssue[]>>();
let daumRequestQueue = Promise.resolve();
let lastDaumRequestAt = 0;

export async function requestDaumSpellcheck(text: string) {
  const normalizedText = normalizeSpellcheckText(text);
  const cached = spellcheckCache.get(normalizedText);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.issues;
  }

  const inflightRequest = inflightSpellchecks.get(normalizedText);

  if (inflightRequest) {
    return inflightRequest;
  }

  const spellcheckPromise = enqueueDaumSpellcheck(async () => {
    const dedupedIssues = await fetchDaumSpellcheck(normalizedText);

    spellcheckCache.set(normalizedText, {
      expiresAt: Date.now() + SPELLCHECK_CACHE_TTL_MS,
      issues: dedupedIssues
    });
    trimExpiredCache();

    return dedupedIssues;
  }).finally(() => {
    inflightSpellchecks.delete(normalizedText);
  });

  inflightSpellchecks.set(normalizedText, spellcheckPromise);

  return spellcheckPromise;
}

async function fetchDaumSpellcheck(normalizedText: string) {
  const chunks = splitSpellcheckText(normalizedText, SPELLCHECK_MAX_CHARS);
  const issues: SpellcheckIssue[] = [];

  for (const chunk of chunks) {
    await waitForDaumWindow();

    const response = await fetch(DAUM_URL, {
      body: new URLSearchParams({ sentence: chunk }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 Resume Room Spellcheck"
      },
      method: "POST"
    });

    if (!response.ok) {
      throw new Error("spellcheck-upstream-error");
    }

    const html = await response.text();

    if (!html.includes("맞춤법 검사기 본문")) {
      throw new Error("spellcheck-invalid-response");
    }

    issues.push(...parseDaumIssues(html));

    if (issues.length >= SPELLCHECK_MAX_ISSUES) {
      break;
    }
  }

  return dedupeIssues(issues).slice(0, SPELLCHECK_MAX_ISSUES);
}

function normalizeSpellcheckText(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/<[^>]+>/g, "").trim();
}

function splitSpellcheckText(value: string, limit: number) {
  if (value.length <= limit) {
    return [value];
  }

  const segments = value.match(/[^\n.!?]+[\n.!?]*/g) ?? [value];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const rawSegment of segments) {
    const segment = rawSegment.trimStart();

    if (!segment) {
      continue;
    }

    if (segment.length <= limit) {
      if (!currentChunk) {
        currentChunk = segment;
        continue;
      }

      if (currentChunk.length + segment.length <= limit) {
        currentChunk += segment;
        continue;
      }

      chunks.push(currentChunk.trim());
      currentChunk = segment;
      continue;
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }

    let cursor = 0;

    while (cursor < segment.length) {
      let nextCursor = Math.min(cursor + limit, segment.length);

      if (nextCursor < segment.length) {
        const lastWhitespace = segment.lastIndexOf(" ", nextCursor);

        if (lastWhitespace > cursor + Math.floor(limit * 0.4)) {
          nextCursor = lastWhitespace;
        }
      }

      chunks.push(segment.slice(cursor, nextCursor).trim());
      cursor = nextCursor;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(Boolean);
}

function parseDaumIssues(html: string) {
  const blocks = html.match(/<a[^>]*data-error-type="[^"]+"[\s\S]*?<\/a>/g) ?? [];

  return blocks
    .map((block) => {
      const openingTag = block.slice(0, block.indexOf(">") + 1);
      const token = decodeHtmlEntities(readDataAttribute(openingTag, "data-error-input"));
      const suggestion = decodeHtmlEntities(readDataAttribute(openingTag, "data-error-output"));

      if (!token || !suggestion || token === suggestion) {
        return null;
      }

      const infoMatch = block.match(
        /<span[^>]*name="contents"[^>]*>([\s\S]*?)<\/span>\s*<span class="inner_spell">/i
      );

      return {
        context: decodeHtmlEntities(readDataAttribute(openingTag, "data-error-context")),
        info: infoMatch ? stripHtml(infoMatch[1]) : "",
        suggestion,
        token,
        type: decodeHtmlEntities(readDataAttribute(openingTag, "data-error-type"))
      } satisfies SpellcheckIssue;
    })
    .filter((issue): issue is SpellcheckIssue => issue !== null);
}

function readDataAttribute(tag: string, attributeName: string) {
  const match = tag.match(new RegExp(`${attributeName}="([^"]*)"`, "i"));

  return match?.[1] ?? "";
}

function stripHtml(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/li>\s*<li>/gi, "\n")
      .replace(/<\/(div|ul|ol|li|p)>/gi, "\n")
      .replace(/<strong[^>]*>[^<]*<\/strong>/gi, "")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\t/g, "")
    .replace(/\n[ \n]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/gi, "·")
    .replace(/&apos;/gi, "'")
    .replace(/&lsquo;|&rsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&hellip;/gi, "…")
    .replace(/&bull;/gi, "•")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function dedupeIssues(issues: SpellcheckIssue[]) {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = [issue.type, issue.token, issue.suggestion, issue.context].join("::");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function trimExpiredCache() {
  if (spellcheckCache.size <= 32) {
    return;
  }

  for (const [key, value] of spellcheckCache.entries()) {
    if (value.expiresAt <= Date.now()) {
      spellcheckCache.delete(key);
    }
  }
}

function enqueueDaumSpellcheck<T>(task: () => Promise<T>) {
  const scheduledTask = daumRequestQueue.then(task, task);

  daumRequestQueue = scheduledTask.then(
    () => undefined,
    () => undefined
  );

  return scheduledTask;
}

async function waitForDaumWindow() {
  const elapsed = Date.now() - lastDaumRequestAt;

  if (elapsed < DAUM_REQUEST_INTERVAL_MS) {
    await wait(DAUM_REQUEST_INTERVAL_MS - elapsed);
  }

  lastDaumRequestAt = Date.now();
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
