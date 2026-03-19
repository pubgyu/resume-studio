export const SPELLCHECK_DEBOUNCE_MS = 700;
export const SPELLCHECK_MAX_CHARS = 1000;
export const SPELLCHECK_MAX_ISSUES = 5;

export type SpellcheckIssue = {
  context: string;
  info: string;
  suggestion: string;
  token: string;
  type: string;
};

export type SpellcheckResponse = {
  issues: SpellcheckIssue[];
  provider: "daum";
};

export type SpellcheckFieldStatus = "idle" | "checking" | "ready" | "error";

export type SpellcheckFieldState = {
  errorMessage: string;
  issues: SpellcheckIssue[];
  lastText: string;
  status: SpellcheckFieldStatus;
};

export const createSpellcheckFieldState = (): SpellcheckFieldState => ({
  errorMessage: "",
  issues: [],
  lastText: "",
  status: "idle"
});

export function shouldSpellcheckText(value: string) {
  return value.trim().length >= 2 && /[가-힣]/.test(value);
}

export function applySpellcheckIssue(text: string, issue: SpellcheckIssue) {
  const token = normalizeIssueText(issue.token);
  const suggestion = normalizeIssueText(issue.suggestion);
  const context = normalizeIssueText(issue.context);

  if (!text || !token || !suggestion || token === suggestion) {
    return text;
  }

  const contextIndex = text.indexOf(context);
  const tokenIndexInContext = context.indexOf(token);

  if (contextIndex !== -1 && tokenIndexInContext !== -1) {
    const tokenIndex = contextIndex + tokenIndexInContext;

    if (text.slice(tokenIndex, tokenIndex + token.length) === token) {
      return (
        text.slice(0, tokenIndex) +
        suggestion +
        text.slice(tokenIndex + token.length)
      );
    }
  }

  const tokenIndex = text.indexOf(token);

  if (tokenIndex === -1) {
    return text;
  }

  return (
    text.slice(0, tokenIndex) +
    suggestion +
    text.slice(tokenIndex + token.length)
  );
}

export function applyAllSpellcheckIssues(text: string, issues: SpellcheckIssue[]) {
  return issues.reduce((currentText, issue) => applySpellcheckIssue(currentText, issue), text);
}

export function getSpellcheckInfoPreview(info: string) {
  return info
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
}

function normalizeIssueText(value: string) {
  return value
    .replace(/&middot;/gi, "·")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}
