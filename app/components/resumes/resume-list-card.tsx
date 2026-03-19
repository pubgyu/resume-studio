"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import type { ResumeListItem } from "@/lib/resumes/types";

type ResumeListCardProps = {
  resume: ResumeListItem;
};

export function ResumeListCard({ resume }: ResumeListCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDuplicate = async () => {
    if (isDeleting || isDuplicating) {
      return;
    }

    setIsDuplicating(true);

    try {
      const response = await fetch(`/api/resumes/${resume.id}/duplicate`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("duplicate-failed");
      }

      await response.json();
      router.refresh();
    } catch {
      window.alert("이력서 복제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || isDuplicating) {
      return;
    }

    if (!window.confirm(`"${resume.resumeName}" 이력서를 삭제할까요? 삭제 후 되돌릴 수 없습니다.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
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
    <article className="panel-card resume-card">
      <Link className="resume-card-main" href={`/resumes/${resume.id}`}>
        <div className="resume-card-copy">
          <p className="resume-card-label">Resume</p>
          <h2>{resume.resumeName}</h2>
        </div>
        <p className="resume-card-meta">
          마지막 저장 {new Date(resume.updatedAt).toLocaleString("ko-KR")}
        </p>
      </Link>

      <div className="resume-card-actions">
        <Button
          type="button"
          variant="ghost"
          size="small"
          disabled={isDeleting || isDuplicating}
          onClick={handleDuplicate}
        >
          {isDuplicating ? "복제 중..." : "복제"}
        </Button>
        <Button
          className="resume-card-delete"
          type="button"
          variant="ghost"
          size="small"
          disabled={isDeleting || isDuplicating}
          onClick={handleDelete}
        >
          {isDeleting ? "삭제 중..." : "삭제"}
        </Button>
      </div>
    </article>
  );
}
