"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  hasLoadedThemeAtom,
  themeModeAtom
} from "@/lib/resume-builder/state";
import {
  RESUME_AUTOSAVE_DEBOUNCE_MS,
  THEME_STORAGE_KEY,
  clearActiveDraftKey,
  clearAllResumeDrafts,
  clearDraftValue,
  createDataFileName,
  createPdfFileName,
  getResumeDraftStorageKey,
  persistDraftValue,
  readActiveDraftKey,
  readDraftValue,
  readImageAsDataUrl,
  readThemePreference,
  setActiveDraftKey
} from "@/lib/resume-builder/utils";
import {
  createCertification,
  createEducation,
  createEmptyResume,
  createExperience,
  createLanguageStudy,
  createPortfolio,
  createProject,
  formatResumePeriod,
  type ResumeData
} from "@/lib/resume-template";
import type {
  ResumeDraftDocument,
  ResumePresentation,
  ResumeSectionOrderKey,
  ResumeTemplateId,
  ResumeVisibilityKey
} from "@/lib/resumes/types";
import {
  createDuplicatedResumeName,
  createEmptyResumeDocument,
  normalizeResumeName,
  parseImportedResumeFile,
  parseStoredResumeDocument,
  serializeResumeDocument
} from "@/lib/resumes/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { EditorPanel } from "./editor/editor-panel";
import { ResumePreview } from "./preview/resume-preview";
import { ResumeToolbar } from "./toolbar/resume-toolbar";

const DB_AUTOSAVE_IDLE_MS = 10000;

type RepeatableSectionKey =
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "languageStudies"
  | "portfolios";

type ResumeBuilderProps = {
  freshStart?: boolean;
  initialPresentation: ResumePresentation;
  initialResume: ResumeData;
  initialResumeName: string;
  initialUpdatedAt?: string | null;
  resumeId: string | null;
};

export function ResumeBuilder({
  freshStart = false,
  initialPresentation,
  initialResume,
  initialResumeName,
  initialUpdatedAt = null,
  resumeId
}: ResumeBuilderProps) {
  const router = useRouter();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [themeMode, setThemeMode] = useAtom(themeModeAtom);
  const [hasLoadedTheme, setHasLoadedTheme] = useAtom(hasLoadedThemeAtom);
  const [hasHydratedDocument, setHasHydratedDocument] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [presentation, setPresentationState] = useState<ResumePresentation>(initialPresentation);
  const [resume, setResumeState] = useState<ResumeData>(initialResume);
  const [resumeName, setResumeNameState] = useState(initialResumeName);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialUpdatedAt);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [saveStatusNow, setSaveStatusNow] = useState(() => Date.now());
  const deferredResume = useDeferredValue(resume);
  const deferredPresentation = useDeferredValue(presentation);

  const documentRef = useRef<ResumeDraftDocument>({
    presentation: initialPresentation,
    resume: initialResume,
    resumeName: initialResumeName
  });
  const lastSavedSnapshotRef = useRef("");
  const draftStorageKeyRef = useRef("");
  const draftSaveTimerRef = useRef<number | null>(null);
  const hasShownStorageAlertRef = useRef(false);
  const ignoreNextPopStateRef = useRef(false);

  const currentSnapshot = useMemo(
    () =>
      serializeResumeDocument({
        presentation,
        resume,
        resumeName
      }),
    [presentation, resume, resumeName]
  );
  const isDirty = hasHydratedDocument && currentSnapshot !== lastSavedSnapshotRef.current;
  const lastSavedLabel = useMemo(
    () => formatLastSavedLabel(lastSavedAt, saveStatusNow),
    [lastSavedAt, saveStatusNow]
  );

  const clearScheduledDraftPersist = useCallback(() => {
    if (draftSaveTimerRef.current !== null) {
      window.clearTimeout(draftSaveTimerRef.current);
      draftSaveTimerRef.current = null;
    }
  }, []);

  const persistDraftNow = useCallback((nextDocument: ResumeDraftDocument) => {
    if (!draftStorageKeyRef.current) {
      return;
    }

    try {
      persistDraftValue(draftStorageKeyRef.current, serializeResumeDocument(nextDocument));
      hasShownStorageAlertRef.current = false;
    } catch {
      if (!hasShownStorageAlertRef.current) {
        hasShownStorageAlertRef.current = true;
        window.alert("임시 저장 용량을 초과했습니다. 더 작은 사진이나 짧은 내용을 사용해 주세요.");
      }
    }
  }, []);

  const scheduleDraftPersist = useCallback(
    (nextDocument: ResumeDraftDocument) => {
      clearScheduledDraftPersist();
      draftSaveTimerRef.current = window.setTimeout(() => {
        persistDraftNow(nextDocument);
        draftSaveTimerRef.current = null;
      }, RESUME_AUTOSAVE_DEBOUNCE_MS);
    },
    [clearScheduledDraftPersist, persistDraftNow]
  );

  const flushDraftPersist = useCallback(
    (nextDocument: ResumeDraftDocument = documentRef.current) => {
      clearScheduledDraftPersist();
      persistDraftNow(nextDocument);
    },
    [clearScheduledDraftPersist, persistDraftNow]
  );

  const clearCurrentDraft = useCallback(() => {
    clearScheduledDraftPersist();

    if (draftStorageKeyRef.current) {
      clearDraftValue(draftStorageKeyRef.current);
    }

    if (readActiveDraftKey() === draftStorageKeyRef.current) {
      clearActiveDraftKey();
    }
  }, [clearScheduledDraftPersist]);

  const setDocument = useCallback(
    (
      updater:
        | ResumeDraftDocument
        | ((current: ResumeDraftDocument) => ResumeDraftDocument),
      options?: { flushDraft?: boolean }
    ) => {
      const nextDocument =
        typeof updater === "function"
          ? updater(documentRef.current)
          : updater;

      documentRef.current = nextDocument;
      setPresentationState(nextDocument.presentation);
      setResumeState(nextDocument.resume);
      setResumeNameState(nextDocument.resumeName);
      setSaveErrorMessage("");

      if (options?.flushDraft) {
        flushDraftPersist(nextDocument);
        return;
      }

      scheduleDraftPersist(nextDocument);
    },
    [flushDraftPersist, scheduleDraftPersist]
  );

  useEffect(() => {
    const savedTheme = readThemePreference();
    const savedDocument = {
      presentation: initialPresentation,
      resume: initialResume,
      resumeName: normalizeResumeName(initialResumeName)
    };
    const draftStorageKey = getResumeDraftStorageKey(resumeId);
    const previousActiveDraftKey = readActiveDraftKey();

    if (previousActiveDraftKey && previousActiveDraftKey !== draftStorageKey) {
      clearDraftValue(previousActiveDraftKey);
    }

    if (freshStart && resumeId === null) {
      clearAllResumeDrafts();
      clearActiveDraftKey();
    }

    setActiveDraftKey(draftStorageKey);
    draftStorageKeyRef.current = draftStorageKey;

    const restoredDraft =
      freshStart && resumeId === null
        ? savedDocument
        : (parseStoredResumeDocument(readDraftValue(draftStorageKey) ?? "") ?? savedDocument);

    documentRef.current = restoredDraft;
    lastSavedSnapshotRef.current = serializeResumeDocument(savedDocument);
    setPresentationState(restoredDraft.presentation);
    setResumeState(restoredDraft.resume);
    setResumeNameState(restoredDraft.resumeName);
    setLastSavedAt(initialUpdatedAt);
    setThemeMode(savedTheme);
    setHasLoadedTheme(true);
    setHasHydratedDocument(true);
  }, [
    initialPresentation,
    initialResume,
    initialResumeName,
    initialUpdatedAt,
    freshStart,
    resumeId,
    setHasLoadedTheme,
    setThemeMode
  ]);

  useEffect(() => {
    if (!freshStart || resumeId !== null || typeof window === "undefined") {
      return;
    }

    window.history.replaceState(window.history.state, "", "/resumes/new");
  }, [freshStart, resumeId]);

  useEffect(() => {
    if (!hasLoadedTheme) {
      return;
    }

    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode === "dark" ? "dark" : "light";
    document.body.dataset.theme = themeMode;
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [hasLoadedTheme, themeMode]);

  useEffect(() => {
    if (!lastSavedAt) {
      return;
    }

    setSaveStatusNow(Date.now());
    const timer = window.setInterval(() => {
      setSaveStatusNow(Date.now());
    }, 60000);

    return () => {
      window.clearInterval(timer);
    };
  }, [lastSavedAt]);

  useEffect(() => {
    if (!hasHydratedDocument) {
      return;
    }

    const handlePageHide = () => {
      flushDraftPersist();
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      flushDraftPersist();
    };
  }, [flushDraftPersist, hasHydratedDocument]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty || typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      if (ignoreNextPopStateRef.current) {
        ignoreNextPopStateRef.current = false;
        return;
      }

      if (
        !window.confirm(
          "저장되지 않은 변경사항이 있습니다. 저장하지 않고 나가면 현재 편집 내용이 사라집니다."
        )
      ) {
        ignoreNextPopStateRef.current = true;
        window.history.go(1);
        return;
      }

      clearCurrentDraft();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [clearCurrentDraft, isDirty]);

  const confirmLeaveIfDirty = useCallback(() => {
    if (!isDirty) {
      return true;
    }

    return window.confirm(
      "저장되지 않은 변경사항이 있습니다. 저장하지 않고 나가면 현재 편집 내용이 사라집니다."
    );
  }, [isDirty]);

  const leaveEditor = useCallback(
    (path: string) => {
      if (!confirmLeaveIfDirty()) {
        return;
      }

      clearCurrentDraft();
      router.push(path);
    },
    [clearCurrentDraft, confirmLeaveIfDirty, router]
  );

  const saveStateLabel = saveErrorMessage
    ? saveErrorMessage
    : isSaving
      ? "저장 중..."
      : isAutoSaving
        ? "자동 저장 중..."
        : isDirty
          ? resumeId
            ? "임시 저장됨 · 자동 저장 대기"
            : "저장되지 않은 변경사항"
          : lastSavedLabel ?? "새 이력서";

  const updateField = (
    key: "name" | "title" | "summary" | "strengths" | "skills" | "photo",
    value: string
  ) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        [key]: value
      }
    }));
  };

  const updateResumeName = (value: string) => {
    setDocument((current) => ({
      ...current,
      resumeName: value
    }));
  };

  const updateTemplateId = (templateId: ResumeTemplateId) => {
    setDocument((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        templateId
      }
    }));
  };

  const toggleSectionVisibility = (sectionKey: ResumeVisibilityKey) => {
    setDocument((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        sectionVisibility: {
          ...current.presentation.sectionVisibility,
          [sectionKey]: !current.presentation.sectionVisibility[sectionKey]
        }
      }
    }));
  };

  const updateContact = (key: keyof ResumeData["contact"], value: string) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        contact: {
          ...current.resume.contact,
          [key]: value
        }
      }
    }));
  };

  const updateSalary = (key: keyof ResumeData["salary"], value: string) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        salary: {
          ...current.resume.salary,
          [key]: value
        }
      }
    }));
  };

  const updateExperience = (
    index: number,
    key: keyof ResumeData["experience"][number],
    value: string
  ) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        experience: current.resume.experience.map((item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          const nextItem = { ...item, [key]: value };

          if (key === "startDate" || key === "endDate") {
            nextItem.period = formatResumePeriod(nextItem.startDate, nextItem.endDate);
          }

          return nextItem;
        })
      }
    }));
  };

  const updateEducation = (
    index: number,
    key: keyof ResumeData["education"][number],
    value: string
  ) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        education: current.resume.education.map((item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          const nextItem = { ...item, [key]: value };

          if (key === "startDate" || key === "endDate") {
            nextItem.period = formatResumePeriod(nextItem.startDate, nextItem.endDate);
          }

          return nextItem;
        })
      }
    }));
  };

  const updateProject = (
    index: number,
    key: keyof ResumeData["projects"][number],
    value: string
  ) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        projects: current.resume.projects.map((item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          const nextItem = { ...item, [key]: value };

          if (key === "startDate" || key === "endDate") {
            nextItem.period = formatResumePeriod(nextItem.startDate, nextItem.endDate);
          }

          return nextItem;
        })
      }
    }));
  };

  const updateCertification = (
    index: number,
    key: keyof ResumeData["certifications"][number],
    value: string
  ) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        certifications: current.resume.certifications.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item
        )
      }
    }));
  };

  const updatePortfolio = (
    index: number,
    key: keyof ResumeData["portfolios"][number],
    value: string
  ) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        portfolios: current.resume.portfolios.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item
        )
      }
    }));
  };

  const updateLanguageStudy = (
    index: number,
    key: keyof ResumeData["languageStudies"][number],
    value: string
  ) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        languageStudies: current.resume.languageStudies.map((item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          const nextItem = { ...item, [key]: value };

          if (key === "startDate" || key === "endDate") {
            nextItem.period = formatResumePeriod(nextItem.startDate, nextItem.endDate);
          }

          return nextItem;
        })
      }
    }));
  };

  const moveSection = (
    draggedKey: ResumeSectionOrderKey,
    targetKey: ResumeSectionOrderKey
  ) => {
    setDocument((current) => {
      const currentOrder = current.presentation.sectionOrder;
      const draggedIndex = currentOrder.indexOf(draggedKey);
      const targetIndex = currentOrder.indexOf(targetKey);

      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
        return current;
      }

      const nextOrder = [...currentOrder];
      const [draggedItem] = nextOrder.splice(draggedIndex, 1);

      nextOrder.splice(targetIndex, 0, draggedItem);

      return {
        ...current,
        presentation: {
          ...current.presentation,
          sectionOrder: nextOrder
        }
      };
    });
  };

  const toggleItemVisibility = (sectionKey: RepeatableSectionKey, itemId: string) => {
    setDocument((current) => ({
      ...current,
      resume: {
        ...current.resume,
        [sectionKey]: current.resume[sectionKey].map((item) =>
          item.id === itemId ? { ...item, visible: !item.visible } : item
        )
      }
    }));
  };

  const persistResumeDocument = useCallback(
    async (mode: "manual" | "auto") => {
      if (mode === "manual") {
        if (isSaving || isAutoSaving || isDeleting || isDuplicating) {
          return false;
        }

        setIsSaving(true);
      } else {
        if (
          !resumeId ||
          !isDirty ||
          isSaving ||
          isAutoSaving ||
          isDeleting ||
          isDuplicating
        ) {
          return false;
        }

        setIsAutoSaving(true);
      }

      setSaveErrorMessage("");

      try {
        const currentDocument = documentRef.current;
        const response = await fetch(resumeId ? `/api/resumes/${resumeId}` : "/api/resumes", {
          body: JSON.stringify({
            presentation: currentDocument.presentation,
            resume: currentDocument.resume,
            resumeName: currentDocument.resumeName
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: resumeId ? "PUT" : "POST"
        });

        if (!response.ok) {
          throw new Error("save-failed");
        }

        const data = (await response.json()) as {
          resumeId: string;
          updatedAt: string;
        };

        lastSavedSnapshotRef.current = serializeResumeDocument({
          presentation: currentDocument.presentation,
          resume: currentDocument.resume,
          resumeName: normalizeResumeName(currentDocument.resumeName)
        });
        setLastSavedAt(data.updatedAt);
        setSaveStatusNow(Date.now());
        flushDraftPersist(currentDocument);

        if (!resumeId) {
          clearCurrentDraft();
          router.replace(`/resumes/${data.resumeId}`);
          router.refresh();
        }

        return true;
      } catch {
        const nextMessage =
          mode === "manual"
            ? "저장에 실패했습니다. 잠시 후 다시 시도해 주세요."
            : "자동 저장에 실패했습니다. 저장 버튼으로 다시 시도해 주세요.";

        setSaveErrorMessage(nextMessage);

        if (mode === "manual") {
          window.alert(nextMessage);
        }

        return false;
      } finally {
        if (mode === "manual") {
          setIsSaving(false);
        } else {
          setIsAutoSaving(false);
        }
      }
    },
    [
      clearCurrentDraft,
      flushDraftPersist,
      isAutoSaving,
      isDeleting,
      isDirty,
      isDuplicating,
      isSaving,
      resumeId,
      router
    ]
  );

  useEffect(() => {
    if (
      !resumeId ||
      !hasHydratedDocument ||
      !isDirty ||
      isSaving ||
      isAutoSaving ||
      isDeleting ||
      isDuplicating
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void persistResumeDocument("auto");
    }, DB_AUTOSAVE_IDLE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    currentSnapshot,
    hasHydratedDocument,
    isAutoSaving,
    isDeleting,
    isDirty,
    isDuplicating,
    isSaving,
    persistResumeDocument,
    resumeId
  ]);

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      presentation: documentRef.current.presentation,
      resume: documentRef.current.resume,
      resumeName: normalizeResumeName(documentRef.current.resumeName),
      version: 3
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${createDataFileName(documentRef.current.resumeName)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      setDocument(parseImportedResumeFile(JSON.parse(text)), { flushDraft: true });
    } catch {
      window.alert("불러오기에 실패했습니다. 올바른 이력서 data 파일인지 확인해 주세요.");
    } finally {
      event.target.value = "";
    }
  };

  const handleDownloadPdf = async () => {
    if (isExportingPdf) {
      return;
    }

    setIsExportingPdf(true);

    try {
      const [{ pdf }, { ResumePdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./pdf/resume-pdf-document")
      ]);
      const currentDocument = documentRef.current;
      const blob = await pdf(
        <ResumePdfDocument
          presentation={currentDocument.presentation}
          resume={currentDocument.resume}
          resumeName={normalizeResumeName(currentDocument.resumeName)}
        />
      ).toBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${createPdfFileName(currentDocument.resumeName)}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      window.alert("PDF 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSave = async () => {
    await persistResumeDocument("manual");
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      updateField("photo", await readImageAsDataUrl(file));
    } catch {
      window.alert("사진 파일을 읽지 못했습니다.");
    } finally {
      event.target.value = "";
    }
  };

  const handleClearResume = () => {
    setDocument((current) => ({
      presentation: current.presentation,
      resume: createEmptyResume(),
      resumeName: current.resumeName || createEmptyResumeDocument().resumeName
    }));
  };

  const handleDuplicate = async () => {
    if (!resumeId || isSaving || isAutoSaving || isDeleting || isDuplicating) {
      return;
    }

    setIsDuplicating(true);
    setSaveErrorMessage("");

    try {
      const currentDocument = documentRef.current;
      const response = await fetch("/api/resumes", {
        body: JSON.stringify({
          presentation: currentDocument.presentation,
          resume: currentDocument.resume,
          resumeName: createDuplicatedResumeName(currentDocument.resumeName)
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("duplicate-failed");
      }

      const data = (await response.json()) as {
        resumeId: string;
      };

      clearCurrentDraft();
      router.push(`/resumes/${data.resumeId}`);
      router.refresh();
    } catch {
      const nextMessage = "이력서 복제에 실패했습니다. 잠시 후 다시 시도해 주세요.";

      setSaveErrorMessage(nextMessage);
      window.alert(nextMessage);
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!resumeId || isSaving || isAutoSaving || isDeleting || isDuplicating) {
      return;
    }

    const confirmMessage = isDirty
      ? "저장되지 않은 변경사항이 있습니다. 이 이력서를 삭제하면 편집 내용도 함께 사라집니다. 계속할까요?"
      : "이 이력서를 삭제할까요? 삭제 후 되돌릴 수 없습니다.";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    setSaveErrorMessage("");

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("delete-failed");
      }

      clearCurrentDraft();
      router.replace("/resumes");
      router.refresh();
    } catch {
      const nextMessage = "이력서 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.";

      setSaveErrorMessage(nextMessage);
      window.alert(nextMessage);
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    if (!confirmLeaveIfDirty()) {
      return;
    }

    try {
      clearCurrentDraft();
      const supabase = createSupabaseBrowserClient();

      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      window.alert("로그아웃하지 못했습니다.");
    }
  };

  if (!hasLoadedTheme || !hasHydratedDocument) {
    return (
      <main className="studio-page">
        <div className="page-glow page-glow-left" />
        <div className="page-glow page-glow-right" />
        <div className="page-glow page-glow-center" />

        <section className="studio-shell studio-shell-loading">
          <div className="panel-card loading-card">
            <p className="eyebrow hero-brand">Resume Room</p>
            <h1 className="loading-title">저장된 이력서를 불러오는 중</h1>
            <p className="intro loading-copy">
              브라우저 임시 저장본과 테마를 준비한 뒤 바로 이어서 보여줍니다.
            </p>
            <div className="loading-bar" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="studio-page">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />
      <div className="page-glow page-glow-center" />

      <section className="studio-shell">
        <header className="studio-topbar">
          <div className="hero-copy">
            <div className="hero-heading-row">
              <h1 className="eyebrow hero-brand">Resume Room</h1>
              <span className={`editor-save-state ${isDirty ? "is-dirty" : ""}`}>
                {saveStateLabel}
              </span>
            </div>

            <label className="resume-name-field">
              <span>이력서 이름</span>
              <input
                value={resumeName}
                onChange={(event) => updateResumeName(event.target.value)}
                placeholder="예: 프론트엔드 이력서"
              />
            </label>

            <p className="intro">
              왼쪽에서 내용을 편집하면 오른쪽 문서가 즉시 갱신되고, 저장된 이력서는 잠시
              멈추면 자동으로 DB에 반영됩니다.
            </p>

            {saveErrorMessage ? <p className="editor-error-banner">{saveErrorMessage}</p> : null}
          </div>

          <ResumeToolbar
            canManageRecord={Boolean(resumeId)}
            importInputRef={importInputRef}
            isDeleting={isDeleting}
            isDuplicating={isDuplicating}
            isDirty={isDirty}
            isExportingPdf={isExportingPdf}
            isAutoSaving={isAutoSaving}
            isSaving={isSaving}
            onBackToList={() => leaveEditor("/resumes")}
            onClearResume={handleClearResume}
            onDelete={handleDelete}
            onDownloadPdf={handleDownloadPdf}
            onDuplicate={handleDuplicate}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onOpenImport={() => importInputRef.current?.click()}
            onSave={handleSave}
            onSignOut={handleSignOut}
          />
        </header>

        <div className="studio-grid">
          <EditorPanel
            onAddLanguageStudy={() =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  languageStudies: [...current.resume.languageStudies, createLanguageStudy()]
                }
              }))
            }
            onAddCertification={() =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  certifications: [...current.resume.certifications, createCertification()]
                }
              }))
            }
            onAddEducation={() =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  education: [...current.resume.education, createEducation()]
                }
              }))
            }
            onAddExperience={() =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  experience: [...current.resume.experience, createExperience()]
                }
              }))
            }
            onAddPortfolio={() =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  portfolios: [...current.resume.portfolios, createPortfolio()]
                }
              }))
            }
            onAddProject={() =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  projects: [...current.resume.projects, createProject()]
                }
              }))
            }
            onCertificationChange={updateCertification}
            onContactChange={updateContact}
            onEducationChange={updateEducation}
            onExperienceChange={updateExperience}
            onFieldChange={updateField}
            onLanguageStudyChange={updateLanguageStudy}
            onMoveSection={moveSection}
            onPhotoChange={handlePhotoChange}
            onPortfolioChange={updatePortfolio}
            onProjectChange={updateProject}
            onRemoveCertification={(index) =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  certifications: current.resume.certifications.filter(
                    (_, itemIndex) => itemIndex !== index
                  )
                }
              }))
            }
            onRemoveEducation={(index) =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  education: current.resume.education.filter(
                    (_, itemIndex) => itemIndex !== index
                  )
                }
              }))
            }
            onRemoveExperience={(index) =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  experience: current.resume.experience.filter(
                    (_, itemIndex) => itemIndex !== index
                  )
                }
              }))
            }
            onRemovePhoto={() => updateField("photo", "")}
            onRemoveLanguageStudy={(index) =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  languageStudies: current.resume.languageStudies.filter(
                    (_, itemIndex) => itemIndex !== index
                  )
                }
              }))
            }
            onRemovePortfolio={(index) =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  portfolios: current.resume.portfolios.filter(
                    (_, itemIndex) => itemIndex !== index
                  )
                }
              }))
            }
            onRemoveProject={(index) =>
              setDocument((current) => ({
                ...current,
                resume: {
                  ...current.resume,
                  projects: current.resume.projects.filter(
                    (_, itemIndex) => itemIndex !== index
                  )
                }
              }))
            }
            onSalaryChange={updateSalary}
            onTemplateChange={updateTemplateId}
            onToggleItemVisibility={toggleItemVisibility}
            onToggleSectionVisibility={toggleSectionVisibility}
            presentation={presentation}
            resume={resume}
          />

          <ResumePreview presentation={deferredPresentation} resume={deferredResume} />
        </div>
      </section>
    </main>
  );
}

function formatLastSavedLabel(value: string | null, now: number) {
  if (!value) {
    return null;
  }

  const savedAt = new Date(value);

  if (Number.isNaN(savedAt.getTime())) {
    return null;
  }

  const diffMs = Math.max(0, now - savedAt.getTime());
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "방금 저장됨";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전 저장`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}시간 전 저장`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}일 전 저장`;
  }

  return `저장됨 · ${savedAt.toLocaleString("ko-KR")}`;
}
