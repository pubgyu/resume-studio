"use client";

import { Ellipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/app/components/ui/button";

import styles from "./toolbar-menu.module.scss";

type ToolbarMenuProps = {
  canManageRecord?: boolean;
  isDeleting?: boolean;
  isDuplicating?: boolean;
  isExportingPdf?: boolean;
  onBackToList: () => void;
  onClearResume: () => void;
  onDelete?: () => void;
  onDownloadPdf: () => void;
  onDuplicate?: () => void;
  onExportJson: () => void;
  onOpenImport: () => void;
  onSignOut: () => void;
};

export function ToolbarMenu({
  canManageRecord = false,
  isDeleting = false,
  isDuplicating = false,
  isExportingPdf = false,
  onBackToList,
  onClearResume,
  onDelete,
  onDownloadPdf,
  onDuplicate,
  onExportJson,
  onOpenImport,
  onSignOut
}: ToolbarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const runAndClose = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div className={styles.menu} ref={rootRef}>
      <Button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={styles.trigger}
        size="icon"
        type="button"
        variant="ghost"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Ellipsis aria-hidden="true" size={16} />
        <span className="visually-hidden">메뉴</span>
      </Button>

      {isOpen ? (
        <div aria-label="문서 메뉴" className={styles.panel} role="menu">
          <Button
            className={styles.item}
            size="small"
            type="button"
            variant="ghost"
            onClick={() => runAndClose(onBackToList)}
          >
            목록으로
          </Button>
          <Button
            className={styles.item}
            size="small"
            type="button"
            variant="ghost"
            onClick={() => runAndClose(onClearResume)}
          >
            빈 템플릿
          </Button>
          <Button
            className={styles.item}
            size="small"
            type="button"
            variant="ghost"
            onClick={() => runAndClose(onDownloadPdf)}
          >
            {isExportingPdf ? "PDF 생성 중..." : "PDF 다운로드"}
          </Button>
          <Button
            className={styles.item}
            size="small"
            type="button"
            variant="ghost"
            onClick={() => runAndClose(onOpenImport)}
          >
            이력서 data import
          </Button>
          <Button
            className={styles.item}
            size="small"
            type="button"
            variant="ghost"
            onClick={() => runAndClose(onExportJson)}
          >
            이력서 data export
          </Button>
          {canManageRecord && onDuplicate ? (
            <Button
              className={styles.item}
              disabled={isDeleting || isDuplicating}
              size="small"
              type="button"
              variant="ghost"
              onClick={() => runAndClose(onDuplicate)}
            >
              {isDuplicating ? "복제 중..." : "복제"}
            </Button>
          ) : null}
          {canManageRecord && onDelete ? (
            <Button
              className={`${styles.item} ${styles.danger}`}
              disabled={isDeleting || isDuplicating}
              size="small"
              type="button"
              variant="ghost"
              onClick={() => runAndClose(onDelete)}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          ) : null}
          <Button
            className={styles.item}
            size="small"
            type="button"
            variant="ghost"
            onClick={() => runAndClose(onSignOut)}
          >
            로그아웃
          </Button>
        </div>
      ) : null}
    </div>
  );
}
