"use client";

import type { ChangeEvent, RefObject } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import { Button } from "@/app/components/ui/button";
import { themeModeAtom, toggleThemeModeAtom } from "@/lib/resume-builder/state";

import { ThemeSwitch } from "./theme-switch";
import { ToolbarMenu } from "./toolbar-menu";

type ResumeToolbarProps = {
  canManageRecord?: boolean;
  importInputRef: RefObject<HTMLInputElement | null>;
  isAutoSaving: boolean;
  isDeleting: boolean;
  isDuplicating: boolean;
  isDirty: boolean;
  isExportingPdf: boolean;
  isSaving: boolean;
  onBackToList: () => void;
  onClearResume: () => void;
  onDelete: () => void;
  onDownloadPdf: () => void;
  onDuplicate: () => void;
  onExportJson: () => void;
  onImportJson: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenImport: () => void;
  onSave: () => void;
  onSignOut: () => void;
};

export function ResumeToolbar({
  canManageRecord = false,
  importInputRef,
  isAutoSaving,
  isDeleting,
  isDuplicating,
  isDirty,
  isExportingPdf,
  isSaving,
  onBackToList,
  onClearResume,
  onDelete,
  onDownloadPdf,
  onDuplicate,
  onExportJson,
  onImportJson,
  onOpenImport,
  onSave,
  onSignOut
}: ResumeToolbarProps) {
  const themeMode = useAtomValue(themeModeAtom);
  const toggleThemeMode = useSetAtom(toggleThemeModeAtom);
  const themeToggleLabel =
    themeMode === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <div className="toolbar" aria-label="문서 제어">
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        className="visually-hidden"
        onChange={onImportJson}
      />
      <ThemeSwitch
        checked={themeMode === "dark"}
        label={themeToggleLabel}
        onToggle={() => toggleThemeMode()}
      />
      <ToolbarMenu
        canManageRecord={canManageRecord}
        isDeleting={isDeleting}
        isDuplicating={isDuplicating}
        onBackToList={onBackToList}
        onClearResume={onClearResume}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onExportJson={onExportJson}
        onOpenImport={onOpenImport}
        onSignOut={onSignOut}
      />
      <Button
        type="button"
        variant="ghost"
        onClick={onBackToList}
      >
        목록
      </Button>
      <Button
        data-disabled-cursor={isSaving || isAutoSaving ? "wait" : "forbidden"}
        type="button"
        variant="primary"
        onClick={onSave}
        disabled={isSaving || isAutoSaving || !isDirty}
      >
        {isSaving ? "저장 중..." : isAutoSaving ? "자동 저장 중..." : isDirty ? "저장" : "저장됨"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onDownloadPdf}
        disabled={isExportingPdf}
      >
        {isExportingPdf ? "PDF 생성 중..." : "PDF 다운로드"}
      </Button>
    </div>
  );
}
