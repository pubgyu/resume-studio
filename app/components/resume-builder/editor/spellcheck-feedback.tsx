"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

import { Button } from "@/app/components/ui/button";
import {
  clearSpellcheckFieldStateAtom,
  setSpellcheckFieldStateAtom,
  spellcheckFieldStatesAtom
} from "@/lib/resume-builder/state";
import {
  applyAllSpellcheckIssues,
  applySpellcheckIssue,
  getSpellcheckInfoPreview,
  shouldSpellcheckText,
  SPELLCHECK_DEBOUNCE_MS,
  type SpellcheckResponse
} from "@/lib/resume-builder/spellcheck";

import styles from "./spellcheck-feedback.module.scss";

type SpellcheckFeedbackProps = {
  fieldId: string;
  onApplyText: (value: string) => void;
  text: string;
};

export function SpellcheckFeedback({
  fieldId,
  onApplyText,
  text
}: SpellcheckFeedbackProps) {
  const fieldStates = useAtomValue(spellcheckFieldStatesAtom);
  const setFieldState = useSetAtom(setSpellcheckFieldStateAtom);
  const clearFieldState = useSetAtom(clearSpellcheckFieldStateAtom);
  const fieldState = fieldStates[fieldId];
  const normalizedText = text.trim();
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    if (!shouldSpellcheckText(normalizedText)) {
      clearFieldState(fieldId);
      return;
    }

    timerRef.current = window.setTimeout(async () => {
      const controller = new AbortController();

      abortControllerRef.current = controller;
      setFieldState({
        fieldId,
        nextState: {
          errorMessage: "",
          issues: [],
          lastText: normalizedText,
          status: "checking"
        }
      });

      try {
        const response = await fetch("/api/spellcheck", {
          body: JSON.stringify({ text: normalizedText }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("spellcheck-request-failed");
        }

        const data = (await response.json()) as SpellcheckResponse;

        setFieldState({
          fieldId,
          nextState: {
            errorMessage: "",
            issues: data.issues,
            lastText: normalizedText,
            status: "ready"
          }
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setFieldState({
          fieldId,
          nextState: {
            errorMessage: "맞춤법 검사를 완료하지 못했습니다.",
            issues: [],
            lastText: normalizedText,
            status: "error"
          }
        });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    }, SPELLCHECK_DEBOUNCE_MS);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, [clearFieldState, fieldId, normalizedText, setFieldState]);

  if (!fieldState || fieldState.status === "idle") {
    return null;
  }

  if (fieldState.status === "checking") {
    return (
      <div className={styles.feedback}>
        <p className={styles.checking}>맞춤법 검사 중...</p>
      </div>
    );
  }

  if (fieldState.status === "error") {
    return (
      <div className={styles.feedback}>
        <p className={styles.error}>{fieldState.errorMessage}</p>
      </div>
    );
  }

  if (fieldState.issues.length === 0) {
    return null;
  }

  const resetFieldState = () => {
    clearFieldState(fieldId);
  };

  const handleApplyIssue = (issueIndex: number) => {
    const issue = fieldState.issues[issueIndex];
    const nextText = applySpellcheckIssue(text, issue);

    onApplyText(nextText);
    resetFieldState();
  };

  const handleApplyAll = () => {
    const nextText = applyAllSpellcheckIssues(text, fieldState.issues);

    onApplyText(nextText);
    resetFieldState();
  };

  return (
    <div className={styles.feedback}>
      <div className={styles.summary}>
        <span className={styles.count}>맞춤법 제안 {fieldState.issues.length}건</span>
        {fieldState.issues.length > 1 ? (
          <Button type="button" size="small" variant="link" onClick={handleApplyAll}>
            모두 적용
          </Button>
        ) : null}
      </div>

      <div className={styles.issueList}>
        {fieldState.issues.map((issue, index) => (
          <div className={styles.issue} key={`${fieldId}-${issue.token}-${issue.suggestion}-${index}`}>
            <div className={styles.pair}>
              <span className={styles.token}>{issue.token}</span>
              <span className={styles.arrow}>→</span>
              <span className={styles.suggestion}>{issue.suggestion}</span>
              <Button
                type="button"
                size="small"
                variant="link"
                onClick={() => handleApplyIssue(index)}
              >
                적용
              </Button>
            </div>
            {getSpellcheckInfoPreview(issue.info) ? (
              <p className={styles.info}>{getSpellcheckInfoPreview(issue.info)}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
