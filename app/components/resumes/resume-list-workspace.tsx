"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { SignOutButton } from "@/app/components/auth/sign-out-button";
import { AppThemeToggle } from "@/app/components/theme/app-theme-toggle";
import { Button } from "@/app/components/ui/button";
import type { ResumeRecord } from "@/lib/resumes/types";
import { parseResumeDocumentJson } from "@/lib/resumes/utils";

import { ResumeListCard } from "./resume-list-card";
import { ResumePdfPreview } from "./resume-pdf-preview";

type ResumeListWorkspaceProps = {
  resumes: ResumeRecord[];
};

export function ResumeListWorkspace({ resumes }: ResumeListWorkspaceProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(resumes[0]?.id ?? null);

  const filteredResumes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return resumes;
    }

    return resumes.filter((resume) =>
      resume.resumeName.toLowerCase().includes(normalizedQuery)
    );
  }, [query, resumes]);

  const selectedResume =
    filteredResumes.find((resume) => resume.id === selectedId) ?? filteredResumes[0] ?? null;
  const recentResume = filteredResumes[0] ?? null;
  const otherResumes = filteredResumes.filter((resume) => resume.id !== recentResume?.id);
  const selectedDocument = useMemo(
    () => (selectedResume ? parseResumeDocumentJson(selectedResume.resumeJson) : null),
    [selectedResume]
  );

  const selectResume = (resumeId: string) => {
    setSelectedId(resumeId);
  };

  const handleOpen = () => {
    if (!selectedResume) {
      return;
    }

    router.push(`/resumes/${selectedResume.id}`);
  };

  const handleDuplicate = async () => {
    if (!selectedResume || isDeleting || isDuplicating) {
      return;
    }

    setIsDuplicating(true);

    try {
      const response = await fetch(`/api/resumes/${selectedResume.id}/duplicate`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("duplicate-failed");
      }

      await response.json();
      router.refresh();
    } catch {
      window.alert("이력서 복제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedResume || isDeleting || isDuplicating) {
      return;
    }

    if (
      !window.confirm(`"${selectedResume.resumeName}" 이력서를 삭제할까요? 삭제 후 되돌릴 수 없습니다.`)
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/resumes/${selectedResume.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("delete-failed");
      }

      router.refresh();
    } catch {
      window.alert("이력서 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="strict-list-window" aria-label="이력서 작업 창">
        <header className="studio-topbar resumes-topbar strict-window-bar">
          <div className="window-meta">
            <span className="window-location">Documents</span>
          </div>

          <label className="strict-search-field">
            <Search aria-hidden="true" size={14} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="문서 검색"
            />
          </label>

          <div className="window-actions">
            <AppThemeToggle />
            <SignOutButton />
            <Button asChild className="strict-list-create-button-desktop" type="button" variant="primary">
              <Link href="/resumes/new?fresh=1">새 이력서</Link>
            </Button>
          </div>

          <Button
            asChild
            className="strict-list-create-button-mobile"
            type="button"
            variant="primary"
          >
            <Link href="/resumes/new?fresh=1">새 이력서</Link>
          </Button>
        </header>

        <div className="strict-list-body">
          <div className="strict-list-pane">
            <section className="strict-list-section">
              <p className="strict-section-label">최근 작업</p>
              {recentResume ? (
                <ResumeListCard
                  isSelected={selectedResume?.id === recentResume.id}
                  resume={recentResume}
                  onSelect={() => selectResume(recentResume.id)}
                />
              ) : (
                <div className="strict-empty-row">저장된 이력서가 없습니다.</div>
              )}
            </section>

            <section className="strict-list-section">
              <p className="strict-section-label">모든 문서</p>
              <div className="strict-row-stack">
                {otherResumes.map((resume) => (
                  <ResumeListCard
                    key={resume.id}
                    isSelected={selectedResume?.id === resume.id}
                    resume={resume}
                    onSelect={() => selectResume(resume.id)}
                  />
                ))}

                {!recentResume ? (
                  <Button asChild className="strict-inline-create" type="button" variant="ghost">
                    <Link href="/resumes/new?fresh=1">새 이력서 만들기</Link>
                  </Button>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="strict-list-preview-pane">
            {selectedResume && selectedDocument ? (
              <>
                <div className="strict-preview-meta">
                  <span>{selectedResume.resumeName}</span>
                  <span>{new Date(selectedResume.updatedAt).toLocaleDateString("ko-KR")}</span>
                </div>
                <div className="strict-preview-stage strict-preview-stage-pdf">
                  <ResumePdfPreview
                    presentation={selectedDocument.presentation}
                    resume={selectedDocument.resume}
                    resumeName={selectedResume.resumeName}
                  />
                </div>
              </>
            ) : (
              <div className="strict-preview-empty">선택한 문서가 이곳에 표시됩니다.</div>
            )}
          </aside>
        </div>

        <div className="strict-action-bar" aria-label="문서 액션 바">
          <div className="strict-action-context">
            {selectedResume ? `선택됨: ${selectedResume.resumeName}` : "선택된 이력서 없음"}
          </div>

          <div className="strict-action-buttons">
            {selectedResume ? (
              <>
                <Button type="button" variant="primary" onClick={handleOpen}>
                  열기
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDuplicate}
                  disabled={isDeleting || isDuplicating}
                >
                  {isDuplicating ? "복제 중..." : "복제"}
                </Button>
                <Button
                  className="danger-action"
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={isDeleting || isDuplicating}
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </Button>
              </>
            ) : (
              <Button asChild type="button" variant="ghost">
                <Link href="/resumes/new?fresh=1">새 이력서</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className={`resumes-mobile-dock ${selectedResume ? "" : "is-single-action"}`.trim()}>
        {selectedResume ? (
          <>
            <Button type="button" variant="primary" onClick={handleOpen}>
              열기
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleDuplicate}
              disabled={isDeleting || isDuplicating}
            >
              {isDuplicating ? "복제 중..." : "복제"}
            </Button>
            <Button
              className="danger-action"
              type="button"
              variant="ghost"
              onClick={handleDelete}
              disabled={isDeleting || isDuplicating}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </>
        ) : (
          <Button asChild className="resumes-new-button" type="button" variant="primary">
            <Link href="/resumes/new?fresh=1">새 이력서</Link>
          </Button>
        )}
      </div>
    </>
  );
}
