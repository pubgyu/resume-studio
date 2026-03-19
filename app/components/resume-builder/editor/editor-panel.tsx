"use client";

import Image from "next/image";
import type { ChangeEvent, DragEvent } from "react";
import { useState } from "react";
import { Eye, EyeOff, GripVertical } from "lucide-react";

import { useAtomValue, useSetAtom } from "jotai";

import { Accordion } from "@/app/components/ui/accordion";
import { Button } from "@/app/components/ui/button";
import {
  openSectionIdsAtom,
  setOpenSectionIdsAtom
} from "@/lib/resume-builder/state";
import { getInitials } from "@/lib/resume-builder/utils";
import type { ResumeData } from "@/lib/resume-template";
import type {
  ResumePresentation,
  ResumeSectionOrderKey,
  ResumeTemplateId,
  ResumeVisibilityKey
} from "@/lib/resumes/types";

import { AccordionCard } from "./accordion-card";
import { SpellcheckFeedback } from "./spellcheck-feedback";

const TEMPLATE_OPTIONS: Array<{
  description: string;
  id: ResumeTemplateId;
  label: string;
}> = [
  {
    description: "현재 문서형 레이아웃으로 가장 안정적인 기본 템플릿입니다.",
    id: "default",
    label: "디폴트"
  },
  {
    description: "여백과 간격을 줄여 정보 밀도를 높인 압축형 템플릿입니다.",
    id: "compact",
    label: "컴팩트"
  },
  {
    description: "좌우 영역을 나눠 핵심 정보와 경력을 분리하는 2단 템플릿입니다.",
    id: "split",
    label: "스플릿"
  }
];

const SECTION_ORDER_LABELS: Record<ResumeSectionOrderKey, string> = {
  certifications: "자격증",
  education: "학력",
  experience: "경력",
  languageStudies: "어학연수",
  portfolios: "포트폴리오",
  projects: "프로젝트",
  salary: "연봉",
  skills: "기술 스택",
  strengths: "핵심 강점",
  summary: "소개",
  totalExperience: "총 경력"
};

const SECTION_ORDER_VISIBILITY_MAP: Record<ResumeSectionOrderKey, ResumeVisibilityKey> = {
  certifications: "certifications",
  education: "education",
  experience: "experience",
  languageStudies: "languageStudies",
  portfolios: "portfolios",
  projects: "projects",
  salary: "salary",
  skills: "skills",
  strengths: "skills",
  summary: "basic",
  totalExperience: "experience"
};

type RepeatableSectionKey =
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "languageStudies"
  | "portfolios";

type ResumeFieldKey =
  | "name"
  | "title"
  | "summary"
  | "strengths"
  | "skills"
  | "photo";
type ContactFieldKey = keyof ResumeData["contact"];
type SalaryFieldKey = keyof ResumeData["salary"];
type ExperienceFieldKey = Exclude<
  keyof ResumeData["experience"][number],
  "id" | "period" | "visible"
>;
type EducationFieldKey = Exclude<
  keyof ResumeData["education"][number],
  "id" | "period" | "visible"
>;
type ProjectFieldKey = Exclude<
  keyof ResumeData["projects"][number],
  "id" | "period" | "visible"
>;
type CertificationFieldKey = Exclude<
  keyof ResumeData["certifications"][number],
  "id" | "visible"
>;
type LanguageStudyFieldKey = Exclude<
  keyof ResumeData["languageStudies"][number],
  "id" | "period" | "visible"
>;
type PortfolioFieldKey = Exclude<keyof ResumeData["portfolios"][number], "id" | "visible">;

type EditorPanelProps = {
  onAddCertification: () => void;
  onAddEducation: () => void;
  onAddExperience: () => void;
  onAddLanguageStudy: () => void;
  onAddPortfolio: () => void;
  onAddProject: () => void;
  onCertificationChange: (
    index: number,
    key: CertificationFieldKey,
    value: string
  ) => void;
  onContactChange: (key: ContactFieldKey, value: string) => void;
  onEducationChange: (index: number, key: EducationFieldKey, value: string) => void;
  onExperienceChange: (index: number, key: ExperienceFieldKey, value: string) => void;
  onFieldChange: (key: ResumeFieldKey, value: string) => void;
  onLanguageStudyChange: (
    index: number,
    key: LanguageStudyFieldKey,
    value: string
  ) => void;
  onMoveSection: (
    draggedKey: ResumeSectionOrderKey,
    targetKey: ResumeSectionOrderKey
  ) => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPortfolioChange: (index: number, key: PortfolioFieldKey, value: string) => void;
  onProjectChange: (index: number, key: ProjectFieldKey, value: string) => void;
  onRemoveCertification: (index: number) => void;
  onRemoveEducation: (index: number) => void;
  onRemoveExperience: (index: number) => void;
  onRemoveLanguageStudy: (index: number) => void;
  onRemovePhoto: () => void;
  onRemovePortfolio: (index: number) => void;
  onRemoveProject: (index: number) => void;
  onSalaryChange: (key: SalaryFieldKey, value: string) => void;
  onTemplateChange: (templateId: ResumeTemplateId) => void;
  onToggleItemVisibility: (sectionKey: RepeatableSectionKey, itemId: string) => void;
  onToggleSectionVisibility: (sectionKey: ResumeVisibilityKey) => void;
  presentation: ResumePresentation;
  resume: ResumeData;
};

export function EditorPanel({
  onAddCertification,
  onAddEducation,
  onAddExperience,
  onAddLanguageStudy,
  onAddPortfolio,
  onAddProject,
  onCertificationChange,
  onContactChange,
  onEducationChange,
  onExperienceChange,
  onFieldChange,
  onLanguageStudyChange,
  onMoveSection,
  onPhotoChange,
  onPortfolioChange,
  onProjectChange,
  onRemoveCertification,
  onRemoveEducation,
  onRemoveExperience,
  onRemoveLanguageStudy,
  onRemovePhoto,
  onRemovePortfolio,
  onRemoveProject,
  onSalaryChange,
  onTemplateChange,
  onToggleItemVisibility,
  onToggleSectionVisibility,
  presentation,
  resume
}: EditorPanelProps) {
  const openSectionIds = useAtomValue(openSectionIdsAtom);
  const setOpenSectionIds = useSetAtom(setOpenSectionIdsAtom);
  const [draggedSectionKey, setDraggedSectionKey] = useState<ResumeSectionOrderKey | null>(null);
  const [dragOverSectionKey, setDragOverSectionKey] = useState<ResumeSectionOrderKey | null>(null);

  const handleInput =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
    };

  const visibility = presentation.sectionVisibility;

  const handleSectionDrop =
    (targetKey: ResumeSectionOrderKey) => (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!draggedSectionKey || draggedSectionKey === targetKey) {
        setDraggedSectionKey(null);
        setDragOverSectionKey(null);
        return;
      }

      onMoveSection(draggedSectionKey, targetKey);
      setDraggedSectionKey(null);
      setDragOverSectionKey(null);
    };

  return (
    <aside className="editor-panel">
      <Accordion
        type="multiple"
        className="editor-accordion"
        value={openSectionIds}
        onValueChange={(values) => setOpenSectionIds(values)}
      >
        <AccordionCard
          description="템플릿을 고르고, 아래 문서 순서를 드래그로 바꿀 수 있습니다."
          title="문서 템플릿"
          value="template"
        >
          <div className="template-option-list">
            {TEMPLATE_OPTIONS.map((option) => {
              const isActive = presentation.templateId === option.id;

              return (
                <button
                  key={option.id}
                  aria-pressed={isActive}
                  className={`template-option ${isActive ? "is-active" : ""}`}
                  type="button"
                  onClick={() => onTemplateChange(option.id)}
                >
                  <span className="template-option-title">{option.label}</span>
                  <span className="template-option-description">{option.description}</span>
                </button>
              );
            })}
          </div>

          <div className="section-order-block">
            <div className="section-order-header">
              <h3>문서 순서</h3>
              <p>드래그해서 미리보기와 PDF 섹션 순서를 바꿉니다.</p>
            </div>

            <div className="section-order-list">
              {presentation.sectionOrder.map((sectionKey) => {
                const relatedVisibilityKey = SECTION_ORDER_VISIBILITY_MAP[sectionKey];
                const isHidden = !visibility[relatedVisibilityKey];
                const draggedIndex = draggedSectionKey
                  ? presentation.sectionOrder.indexOf(draggedSectionKey)
                  : -1;
                const currentIndex = presentation.sectionOrder.indexOf(sectionKey);
                const dragPositionClass =
                  dragOverSectionKey === sectionKey && draggedIndex !== -1
                    ? draggedIndex < currentIndex
                      ? "is-drop-after"
                      : "is-drop-before"
                    : "";

                return (
                  <button
                    key={sectionKey}
                    className={`section-order-item ${draggedSectionKey === sectionKey ? "is-dragging" : ""} ${isHidden ? "is-hidden" : ""} ${dragPositionClass}`.trim()}
                    draggable
                    type="button"
                    onDragEnd={() => {
                      setDraggedSectionKey(null);
                      setDragOverSectionKey(null);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (draggedSectionKey && draggedSectionKey !== sectionKey) {
                        setDragOverSectionKey(sectionKey);
                      }
                    }}
                    onDragStart={() => {
                      setDraggedSectionKey(sectionKey);
                      setDragOverSectionKey(null);
                    }}
                    onDrop={handleSectionDrop(sectionKey)}
                  >
                    <span className="section-order-grip" aria-hidden="true">
                      <GripVertical />
                    </span>
                    <span className="section-order-label">
                      {SECTION_ORDER_LABELS[sectionKey]}
                    </span>
                    {isHidden ? (
                      <span className="section-order-hidden-badge">숨김</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </AccordionCard>

        <AccordionCard
          description="이름, 포지션과 소개 문구를 입력하세요."
          isVisible={visibility.basic}
          title="기본 정보"
          value="basic"
          onToggleVisibility={() => onToggleSectionVisibility("basic")}
        >
          <div className="field-grid">
            <label className="field">
              <span>이름</span>
              <input
                value={resume.name}
                onChange={handleInput((value) => onFieldChange("name", value))}
                placeholder="홍길동"
              />
            </label>

            <label className="field">
              <span>희망 포지션</span>
              <input
                value={resume.title}
                onChange={handleInput((value) => onFieldChange("title", value))}
                placeholder="Frontend Developer"
              />
            </label>
          </div>

          <label className="field">
            <span>한 줄 소개</span>
            <textarea
              value={resume.summary}
              onChange={handleInput((value) => onFieldChange("summary", value))}
              lang="ko"
              rows={4}
              spellCheck
              placeholder="핵심 경력과 강점을 간단히 정리하세요."
            />
            <SpellcheckFeedback
              fieldId="summary"
              onApplyText={(value) => onFieldChange("summary", value)}
              text={resume.summary}
            />
          </label>
        </AccordionCard>

        <AccordionCard
          action={
            resume.photo ? (
              <Button type="button" variant="link" onClick={onRemovePhoto}>
                사진 제거
              </Button>
            ) : null
          }
          description="증명사진이나 프로필 이미지를 넣으면 PDF에도 같이 출력됩니다."
          isVisible={visibility.photo}
          title="프로필 사진"
          value="photo"
          onToggleVisibility={() => onToggleSectionVisibility("photo")}
        >
          <div className="photo-editor">
            <div className="photo-thumb">
              {resume.photo ? (
                <Image
                  className="photo-thumb-image"
                  src={resume.photo}
                  alt={`${resume.name || resume.title || "프로필"} 사진`}
                  width={384}
                  height={480}
                  sizes="96px"
                  unoptimized
                />
              ) : (
                <div className="photo-thumb-placeholder">
                  {getInitials(resume.name || resume.title)}
                </div>
              )}
            </div>

            <label className="upload-button">
              <input type="file" accept="image/*" onChange={onPhotoChange} />
              사진 업로드
            </label>
          </div>
        </AccordionCard>

        <AccordionCard
          description="출력 시 상단에 한 줄로 표시됩니다."
          isVisible={visibility.contact}
          title="연락처"
          value="contact"
          onToggleVisibility={() => onToggleSectionVisibility("contact")}
        >
          <div className="field-grid">
            <label className="field">
              <span>이메일</span>
              <input
                value={resume.contact.email}
                onChange={handleInput((value) => onContactChange("email", value))}
                placeholder="email@example.com"
              />
            </label>

            <label className="field">
              <span>전화번호</span>
              <input
                value={resume.contact.phone}
                onChange={handleInput((value) => onContactChange("phone", value))}
                placeholder="010-0000-0000"
              />
            </label>

            <label className="field">
              <span>웹사이트</span>
              <input
                value={resume.contact.website}
                onChange={handleInput((value) => onContactChange("website", value))}
                placeholder="https://portfolio.com"
              />
            </label>
          </div>
        </AccordionCard>

        <AccordionCard
          description="강점은 줄바꿈, 기술은 쉼표로 구분하면 됩니다."
          isVisible={visibility.skills}
          title="강점과 기술"
          value="skills"
          onToggleVisibility={() => onToggleSectionVisibility("skills")}
        >
          <label className="field">
            <span>핵심 강점</span>
            <textarea
              value={resume.strengths}
              onChange={handleInput((value) => onFieldChange("strengths", value))}
              lang="ko"
              rows={4}
              spellCheck
              placeholder={"문제 해결\n협업 문서화\nUI 완성도"}
            />
            <SpellcheckFeedback
              fieldId="strengths"
              onApplyText={(value) => onFieldChange("strengths", value)}
              text={resume.strengths}
            />
          </label>

          <label className="field">
            <span>기술 스택</span>
            <textarea
              value={resume.skills}
              onChange={handleInput((value) => onFieldChange("skills", value))}
              rows={3}
              placeholder="Next.js, React, JavaScript, CSS"
            />
          </label>
        </AccordionCard>

        <AccordionCard
          action={
            <Button type="button" size="small" variant="soft" onClick={onAddExperience}>
              경력 추가
            </Button>
          }
          description="기간은 달력으로 선택하고, 종료일을 비우면 진행 중으로 표시됩니다."
          isVisible={visibility.experience}
          title="경력"
          value="experience"
          onToggleVisibility={() => onToggleSectionVisibility("experience")}
        >
          <div className="stack-group">
            {resume.experience.map((item, index) => (
              <article
                className={`repeat-card ${item.visible ? "" : "is-hidden"}`.trim()}
                key={item.id}
              >
                <RepeatCardHeader
                  hidden={!item.visible}
                  label={`경력 ${index + 1}`}
                  showRemove={resume.experience.length > 1}
                  onRemove={() => onRemoveExperience(index)}
                  onToggleVisibility={() => onToggleItemVisibility("experience", item.id)}
                />

                <div className="field-grid">
                  <label className="field">
                    <span>회사명</span>
                    <input
                      value={item.company}
                      onChange={handleInput((value) =>
                        onExperienceChange(index, "company", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>직무</span>
                    <input
                      value={item.role}
                      onChange={handleInput((value) => onExperienceChange(index, "role", value))}
                    />
                  </label>

                  <label className="field">
                    <span>시작일</span>
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={handleInput((value) =>
                        onExperienceChange(index, "startDate", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>종료일</span>
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={handleInput((value) =>
                        onExperienceChange(index, "endDate", value)
                      )}
                    />
                  </label>
                </div>

                <p className="field-note">종료일을 비우면 `진행 중`으로 표시됩니다.</p>

                <label className="field">
                  <span>설명</span>
                  <textarea
                    value={item.description}
                    onChange={handleInput((value) =>
                      onExperienceChange(index, "description", value)
                    )}
                    lang="ko"
                    rows={3}
                    spellCheck
                  />
                  <SpellcheckFeedback
                    fieldId={`experience-${item.id}-description`}
                    onApplyText={(value) => onExperienceChange(index, "description", value)}
                    text={item.description}
                  />
                </label>

                <label className="field">
                  <span>주요 성과</span>
                  <textarea
                    value={item.highlights}
                    onChange={handleInput((value) =>
                      onExperienceChange(index, "highlights", value)
                    )}
                    lang="ko"
                    rows={4}
                    spellCheck
                    placeholder={"성과 1\n성과 2"}
                  />
                  <SpellcheckFeedback
                    fieldId={`experience-${item.id}-highlights`}
                    onApplyText={(value) => onExperienceChange(index, "highlights", value)}
                    text={item.highlights}
                  />
                </label>
              </article>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard
          action={
            <Button type="button" size="small" variant="soft" onClick={onAddEducation}>
              학력 추가
            </Button>
          }
          description="기간은 달력으로 선택하고, 학점도 함께 표시할 수 있습니다."
          isVisible={visibility.education}
          title="학력"
          value="education"
          onToggleVisibility={() => onToggleSectionVisibility("education")}
        >
          <div className="stack-group">
            {resume.education.map((item, index) => (
              <article
                className={`repeat-card ${item.visible ? "" : "is-hidden"}`.trim()}
                key={item.id}
              >
                <RepeatCardHeader
                  hidden={!item.visible}
                  label={`학력 ${index + 1}`}
                  showRemove={resume.education.length > 1}
                  onRemove={() => onRemoveEducation(index)}
                  onToggleVisibility={() => onToggleItemVisibility("education", item.id)}
                />

                <div className="field-grid">
                  <label className="field">
                    <span>학교명</span>
                    <input
                      value={item.school}
                      onChange={handleInput((value) =>
                        onEducationChange(index, "school", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>전공/학위</span>
                    <input
                      value={item.degree}
                      onChange={handleInput((value) =>
                        onEducationChange(index, "degree", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>학점</span>
                    <input
                      value={item.gpa}
                      onChange={handleInput((value) => onEducationChange(index, "gpa", value))}
                      placeholder="4.2 / 4.5"
                    />
                  </label>

                  <label className="field">
                    <span>시작일</span>
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={handleInput((value) =>
                        onEducationChange(index, "startDate", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>종료일</span>
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={handleInput((value) =>
                        onEducationChange(index, "endDate", value)
                      )}
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard
          action={
            <Button type="button" size="small" variant="soft" onClick={onAddProject}>
              프로젝트 추가
            </Button>
          }
          description="프로젝트 기간도 달력으로 선택합니다."
          isVisible={visibility.projects}
          title="프로젝트"
          value="projects"
          onToggleVisibility={() => onToggleSectionVisibility("projects")}
        >
          <div className="stack-group">
            {resume.projects.map((item, index) => (
              <article
                className={`repeat-card ${item.visible ? "" : "is-hidden"}`.trim()}
                key={item.id}
              >
                <RepeatCardHeader
                  hidden={!item.visible}
                  label={`프로젝트 ${index + 1}`}
                  showRemove={resume.projects.length > 1}
                  onRemove={() => onRemoveProject(index)}
                  onToggleVisibility={() => onToggleItemVisibility("projects", item.id)}
                />

                <div className="field-grid">
                  <label className="field">
                    <span>이름</span>
                    <input
                      value={item.name}
                      onChange={handleInput((value) => onProjectChange(index, "name", value))}
                    />
                  </label>

                  <label className="field">
                    <span>링크</span>
                    <input
                      value={item.link}
                      onChange={handleInput((value) => onProjectChange(index, "link", value))}
                      placeholder="https://..."
                    />
                  </label>

                  <label className="field">
                    <span>시작일</span>
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={handleInput((value) =>
                        onProjectChange(index, "startDate", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>종료일</span>
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={handleInput((value) => onProjectChange(index, "endDate", value))}
                    />
                  </label>
                </div>

                <label className="field">
                  <span>설명</span>
                  <textarea
                    value={item.description}
                    onChange={handleInput((value) =>
                      onProjectChange(index, "description", value)
                    )}
                    lang="ko"
                    rows={3}
                    spellCheck
                  />
                  <SpellcheckFeedback
                    fieldId={`project-${item.id}-description`}
                    onApplyText={(value) => onProjectChange(index, "description", value)}
                    text={item.description}
                  />
                </label>
              </article>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard
          action={
            <Button type="button" size="small" variant="soft" onClick={onAddCertification}>
              자격증 추가
            </Button>
          }
          description="취득일은 달력으로 선택합니다."
          isVisible={visibility.certifications}
          title="자격증"
          value="certifications"
          onToggleVisibility={() => onToggleSectionVisibility("certifications")}
        >
          <div className="stack-group">
            {resume.certifications.map((item, index) => (
              <article
                className={`repeat-card ${item.visible ? "" : "is-hidden"}`.trim()}
                key={item.id}
              >
                <RepeatCardHeader
                  hidden={!item.visible}
                  label={`자격증 ${index + 1}`}
                  showRemove={resume.certifications.length > 1}
                  onRemove={() => onRemoveCertification(index)}
                  onToggleVisibility={() => onToggleItemVisibility("certifications", item.id)}
                />

                <div className="field-grid">
                  <label className="field">
                    <span>자격증 이름</span>
                    <input
                      value={item.name}
                      onChange={handleInput((value) =>
                        onCertificationChange(index, "name", value)
                      )}
                      placeholder="정보처리기사"
                    />
                  </label>

                  <label className="field">
                    <span>취득일</span>
                    <input
                      type="date"
                      value={item.date}
                      onChange={handleInput((value) =>
                        onCertificationChange(index, "date", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>제공 단체</span>
                    <input
                      value={item.issuer}
                      onChange={handleInput((value) =>
                        onCertificationChange(index, "issuer", value)
                      )}
                      placeholder="한국산업인력공단"
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard
          action={
            <Button type="button" size="small" variant="soft" onClick={onAddLanguageStudy}>
              어학연수 추가
            </Button>
          }
          description="프로그램, 기관, 지역과 기간을 같이 정리할 수 있습니다."
          isVisible={visibility.languageStudies}
          title="어학연수"
          value="languageStudies"
          onToggleVisibility={() => onToggleSectionVisibility("languageStudies")}
        >
          <div className="stack-group">
            {resume.languageStudies.map((item, index) => (
              <article
                className={`repeat-card ${item.visible ? "" : "is-hidden"}`.trim()}
                key={item.id}
              >
                <RepeatCardHeader
                  hidden={!item.visible}
                  label={`어학연수 ${index + 1}`}
                  showRemove={resume.languageStudies.length > 1}
                  onRemove={() => onRemoveLanguageStudy(index)}
                  onToggleVisibility={() => onToggleItemVisibility("languageStudies", item.id)}
                />

                <div className="field-grid">
                  <label className="field">
                    <span>프로그램명</span>
                    <input
                      value={item.program}
                      onChange={handleInput((value) =>
                        onLanguageStudyChange(index, "program", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>기관</span>
                    <input
                      value={item.institution}
                      onChange={handleInput((value) =>
                        onLanguageStudyChange(index, "institution", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>지역</span>
                    <input
                      value={item.location}
                      onChange={handleInput((value) =>
                        onLanguageStudyChange(index, "location", value)
                      )}
                      placeholder="Canada, Vancouver"
                    />
                  </label>

                  <label className="field">
                    <span>시작일</span>
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={handleInput((value) =>
                        onLanguageStudyChange(index, "startDate", value)
                      )}
                    />
                  </label>

                  <label className="field">
                    <span>종료일</span>
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={handleInput((value) =>
                        onLanguageStudyChange(index, "endDate", value)
                      )}
                    />
                  </label>
                </div>

                <label className="field">
                  <span>설명</span>
                  <textarea
                    value={item.description}
                    onChange={handleInput((value) =>
                      onLanguageStudyChange(index, "description", value)
                    )}
                    lang="ko"
                    rows={3}
                    spellCheck
                    placeholder="과정 특징이나 수료 내용"
                  />
                  <SpellcheckFeedback
                    fieldId={`language-study-${item.id}-description`}
                    onApplyText={(value) =>
                      onLanguageStudyChange(index, "description", value)
                    }
                    text={item.description}
                  />
                </label>
              </article>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard
          description="이전 연봉과 희망 연봉을 별도로 적을 수 있습니다."
          isVisible={visibility.salary}
          title="연봉"
          value="salary"
          onToggleVisibility={() => onToggleSectionVisibility("salary")}
        >
          <div className="field-grid">
            <label className="field">
              <span>전 직장 연봉</span>
              <input
                value={resume.salary.previous}
                onChange={handleInput((value) => onSalaryChange("previous", value))}
                placeholder="4,200만 원"
              />
            </label>

            <label className="field">
              <span>희망 연봉</span>
              <input
                value={resume.salary.desired}
                onChange={handleInput((value) => onSalaryChange("desired", value))}
                placeholder="5,000만 원"
              />
            </label>
          </div>
        </AccordionCard>

        <AccordionCard
          action={
            <Button type="button" size="small" variant="soft" onClick={onAddPortfolio}>
              포트폴리오 추가
            </Button>
          }
          description="URL만 입력하면 미리보기와 PDF에서 링크로 표시됩니다."
          isVisible={visibility.portfolios}
          title="포트폴리오"
          value="portfolios"
          onToggleVisibility={() => onToggleSectionVisibility("portfolios")}
        >
          <div className="stack-group">
            {resume.portfolios.map((item, index) => (
              <article
                className={`repeat-card ${item.visible ? "" : "is-hidden"}`.trim()}
                key={item.id}
              >
                <RepeatCardHeader
                  hidden={!item.visible}
                  label={`포트폴리오 ${index + 1}`}
                  showRemove={resume.portfolios.length > 1}
                  onRemove={() => onRemovePortfolio(index)}
                  onToggleVisibility={() => onToggleItemVisibility("portfolios", item.id)}
                />

                <label className="field">
                  <span>URL</span>
                  <input
                    value={item.url}
                    onChange={handleInput((value) => onPortfolioChange(index, "url", value))}
                    placeholder="https://portfolio.example.com"
                  />
                </label>
              </article>
            ))}
          </div>
        </AccordionCard>
      </Accordion>
    </aside>
  );
}

function RepeatCardHeader({
  hidden,
  label,
  onRemove,
  onToggleVisibility,
  showRemove
}: {
  hidden: boolean;
  label: string;
  onRemove: () => void;
  onToggleVisibility: () => void;
  showRemove: boolean;
}) {
  return (
    <div className="repeat-card-header">
      <div className="repeat-card-title-row">
        <strong>{label}</strong>
        {hidden ? <span className="repeat-card-hidden-badge">숨김</span> : null}
      </div>

      <div className="repeat-card-actions">
        <Button
          aria-label={hidden ? `${label} 보이기` : `${label} 숨기기`}
          className="item-visibility-toggle"
          size="icon"
          type="button"
          variant="ghost"
          onClick={onToggleVisibility}
        >
          {hidden ? <EyeOff /> : <Eye />}
        </Button>
        {showRemove ? (
          <Button type="button" variant="link" onClick={onRemove}>
            삭제
          </Button>
        ) : null}
      </div>
    </div>
  );
}
