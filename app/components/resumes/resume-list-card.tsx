"use client";

import Link from "next/link";
import type { ResumeListItem } from "@/lib/resumes/types";

type ResumeListCardProps = {
  isSelected?: boolean;
  onSelect: () => void;
  resume: ResumeListItem;
};

export function ResumeListCard({ isSelected = false, onSelect, resume }: ResumeListCardProps) {
  return (
    <Link
      href={`/resumes/${resume.id}`}
      className={`strict-list-row ${isSelected ? "is-selected" : ""}`.trim()}
      onFocus={onSelect}
      onMouseEnter={onSelect}
    >
      <span className="strict-list-row-thumb" aria-hidden="true" />
      <span className="strict-list-row-copy">
        <strong className="strict-list-row-title">{resume.resumeName}</strong>
        <span className="strict-list-row-meta">최근 수정</span>
      </span>
      <span className="strict-list-row-trailing">
        {new Date(resume.updatedAt).toLocaleDateString("ko-KR")}
      </span>
    </Link>
  );
}
