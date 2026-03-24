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
    <div className="toolbar toolbar-clustered" aria-label="문서 제어">
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        className="visually-hidden"
        onChange={onImportJson}
      />
      <div className="toolbar-group toolbar-group-secondary toolbar-group-mobile-utility">
        <ThemeSwitch
          checked={themeMode === "dark"}
          label={themeToggleLabel}
          onToggle={() => toggleThemeMode()}
        />
        <ToolbarMenu
          canManageRecord={canManageRecord}
          isDeleting={isDeleting}
          isDuplicating={isDuplicating}
          isExportingPdf={isExportingPdf}
          onBackToList={onBackToList}
          onClearResume={onClearResume}
          onDelete={onDelete}
          onDownloadPdf={onDownloadPdf}
          onDuplicate={onDuplicate}
          onExportJson={onExportJson}
          onOpenImport={onOpenImport}
          onSignOut={onSignOut}
        />
        <Button className="toolbar-list-button" type="button" variant="ghost" onClick={onBackToList}>
          목록
        </Button>
      </div>
      <div className="toolbar-group toolbar-group-primary toolbar-group-mobile-primary">
        <Button
          className="toolbar-save-button"
          data-disabled-cursor={isSaving || isAutoSaving ? "wait" : "forbidden"}
          type="button"
          variant="primary"
          onClick={onSave}
          disabled={isSaving || isAutoSaving || !isDirty}
        >
          {isSaving
            ? "저장 중..."
            : isAutoSaving
              ? "자동 저장 중..."
              : isDirty
                ? "저장"
                : "저장됨"}
        </Button>
      </div>
    </div>
  );
}
