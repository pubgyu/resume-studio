"use client";

import Image from "next/image";
import { ChangeEvent, Fragment, useRef, useState, useSyncExternalStore } from "react";

import {
  cloneResume,
  createCertification,
  createEducation,
  createEmptyResume,
  createExperience,
  createPortfolio,
  createProject,
  defaultResume,
  normalizeResume,
  ResumeData,
  splitLines,
  splitTags
} from "@/lib/resume-template";

const STORAGE_KEY = "resume-studio-data";
const STORAGE_EVENT = "resume-studio-updated";
const DEFAULT_SERIALIZED_RESUME = JSON.stringify(defaultResume);
const PDF_PAGE_MARGIN_MM = 0;
const LINK_PATTERN =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

const parseResume = (serialized: string): ResumeData =>
  normalizeResume(JSON.parse(serialized));

const readResumeSnapshot = () => {
  if (typeof window === "undefined") {
    return DEFAULT_SERIALIZED_RESUME;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return DEFAULT_SERIALIZED_RESUME;
  }

  try {
    JSON.parse(saved);
    return saved;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_SERIALIZED_RESUME;
  }
};

const subscribeToResume = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

const persistResume = (nextResume: ResumeData) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResume));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    window.alert("저장 용량을 초과했습니다. 더 작은 사진이나 짧은 내용을 사용해 주세요.");
  }
};

export function ResumeBuilder() {
  const serializedResume = useSyncExternalStore(
    subscribeToResume,
    readResumeSnapshot,
    () => DEFAULT_SERIALIZED_RESUME
  );
  const resume = parseResume(serializedResume);
  const importInputRef = useRef<HTMLInputElement>(null);
  const resumePaperRef = useRef<HTMLElement>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const setResume = (updater: (current: ResumeData) => ResumeData) => {
    const nextResume = updater(parseResume(readResumeSnapshot()));
    persistResume(nextResume);
  };

  const updateField = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setResume((current) => ({
      ...current,
      [key]: value
    }));
  };

  const updateContact = (
    key: keyof ResumeData["contact"],
    value: ResumeData["contact"][keyof ResumeData["contact"]]
  ) => {
    setResume((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [key]: value
      }
    }));
  };

  const updateExperience = (
    index: number,
    key: keyof ResumeData["experience"][number],
    value: string
  ) => {
    setResume((current) => ({
      ...current,
      experience: current.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const updateEducation = (
    index: number,
    key: keyof ResumeData["education"][number],
    value: string
  ) => {
    setResume((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const updateProject = (
    index: number,
    key: keyof ResumeData["projects"][number],
    value: string
  ) => {
    setResume((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const updateCertification = (
    index: number,
    key: keyof ResumeData["certifications"][number],
    value: string
  ) => {
    setResume((current) => ({
      ...current,
      certifications: current.certifications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const updatePortfolio = (
    index: number,
    key: keyof ResumeData["portfolios"][number],
    value: string
  ) => {
    setResume((current) => ({
      ...current,
      portfolios: current.portfolios.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const addExperience = () => {
    setResume((current) => ({
      ...current,
      experience: [...current.experience, createExperience()]
    }));
  };

  const addEducation = () => {
    setResume((current) => ({
      ...current,
      education: [...current.education, createEducation()]
    }));
  };

  const addProject = () => {
    setResume((current) => ({
      ...current,
      projects: [...current.projects, createProject()]
    }));
  };

  const addCertification = () => {
    setResume((current) => ({
      ...current,
      certifications: [...current.certifications, createCertification()]
    }));
  };

  const addPortfolio = () => {
    setResume((current) => ({
      ...current,
      portfolios: [...current.portfolios, createPortfolio()]
    }));
  };

  const removeExperience = (index: number) => {
    setResume((current) => ({
      ...current,
      experience: current.experience.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeEducation = (index: number) => {
    setResume((current) => ({
      ...current,
      education: current.education.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeProject = (index: number) => {
    setResume((current) => ({
      ...current,
      projects: current.projects.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeCertification = (index: number) => {
    setResume((current) => ({
      ...current,
      certifications: current.certifications.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removePortfolio = (index: number) => {
    setResume((current) => ({
      ...current,
      portfolios: current.portfolios.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const resetResume = () => {
    const initial = cloneResume(defaultResume);
    persistResume(initial);
  };

  const clearResume = () => {
    persistResume(createEmptyResume());
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      resume,
      version: 1
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${createDataFileName(resume.name)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleOpenImport = () => {
    importInputRef.current?.click();
  };

  const handleImportJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const importedResume = parseImportedResume(JSON.parse(text));
      persistResume(importedResume);
    } catch {
      window.alert("불러오기에 실패했습니다. 올바른 JSON 파일인지 확인해 주세요.");
    } finally {
      event.target.value = "";
    }
  };

  const handleDownloadPdf = async () => {
    const element = resumePaperRef.current;

    if (!element || isExportingPdf) {
      return;
    }

    setIsExportingPdf(true);
    document.body.classList.add("exporting-pdf");

    try {
      if ("fonts" in document) {
        await document.fonts.ready;
      }

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ]);
      const { cleanup, height, target, width } = createPdfCaptureTarget(element);

      try {
        const canvas = await html2canvas(target, {
          backgroundColor: "#fffdf8",
          height,
          scale: 2,
          useCORS: true,
          width,
          windowHeight: height,
          windowWidth: width
        });

        const pdf = new jsPDF({
          format: "a4",
          orientation: "portrait",
          unit: "mm"
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const contentWidth = pageWidth - PDF_PAGE_MARGIN_MM * 2;
        const contentHeight = pageHeight - PDF_PAGE_MARGIN_MM * 2;
        const pageHeightPx = Math.floor((canvas.width * contentHeight) / contentWidth);
        let renderedHeightPx = 0;
        let pageIndex = 0;

        while (renderedHeightPx < canvas.height) {
          const remainingHeightPx = canvas.height - renderedHeightPx;
          const sliceHeightPx = Math.min(pageHeightPx, remainingHeightPx);

          const pageCanvas = document.createElement("canvas");
          const pageContext = pageCanvas.getContext("2d");

          if (!pageContext) {
            throw new Error("page context unavailable");
          }

          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeightPx;
          pageContext.drawImage(
            canvas,
            0,
            renderedHeightPx,
            canvas.width,
            sliceHeightPx,
            0,
            0,
            canvas.width,
            sliceHeightPx
          );

          if (pageIndex > 0) {
            pdf.addPage();
          }

          pdf.addImage(
            pageCanvas.toDataURL("image/png"),
            "PNG",
            PDF_PAGE_MARGIN_MM,
            PDF_PAGE_MARGIN_MM,
            contentWidth,
            (sliceHeightPx * contentWidth) / canvas.width,
            undefined,
            "FAST"
          );

          renderedHeightPx += sliceHeightPx;
          pageIndex += 1;
        }

        pdf.save(`${createPdfFileName(resume.name)}.pdf`);
      } finally {
        cleanup();
      }
    } catch {
      window.alert("PDF 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      document.body.classList.remove("exporting-pdf");
      setIsExportingPdf(false);
    }
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const photo = await readImageAsDataUrl(file);
      updateField("photo", photo);
    } catch {
      window.alert("사진 파일을 읽지 못했습니다.");
    } finally {
      event.target.value = "";
    }
  };

  const removePhoto = () => {
    updateField("photo", "");
  };

  const handleInput =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
    };

  const strengthLines = splitLines(resume.strengths);
  const skillTags = splitTags(resume.skills);

  return (
    <main className="studio-page">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />

      <section className="studio-shell">
        <header className="studio-topbar">
          <div className="hero-copy">
            <p className="eyebrow">Resume Studio</p>
            <h1>붙여 넣고 바로 PDF로 저장하는 이력서 템플릿</h1>
            <p className="intro">
              왼쪽에서 내용을 수정하면 오른쪽 이력서가 즉시 갱신됩니다. 저장된
              내용은 브라우저에 자동 보관됩니다.
            </p>
          </div>

          <div className="toolbar" aria-label="문서 제어">
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="visually-hidden"
              onChange={handleImportJson}
            />
            <button type="button" className="ghost-button" onClick={resetResume}>
              샘플 채우기
            </button>
            <button type="button" className="ghost-button" onClick={clearResume}>
              빈 템플릿
            </button>
            <button type="button" className="ghost-button" onClick={handleOpenImport}>
              JSON 불러오기
            </button>
            <button type="button" className="ghost-button" onClick={handleExportJson}>
              JSON 내보내기
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={handlePrint}
            >
              브라우저 인쇄
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
            >
              {isExportingPdf ? "PDF 생성 중..." : "PDF 다운로드"}
            </button>
          </div>
        </header>

        <div className="studio-grid">
          <aside className="editor-panel">
            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>기본 정보</h2>
                  <p>이름, 포지션, 소개 문구를 입력하세요.</p>
                </div>
              </div>

              <div className="field-grid">
                <label className="field">
                  <span>이름</span>
                  <input
                    value={resume.name}
                    onChange={handleInput((value) => updateField("name", value))}
                    placeholder="홍길동"
                  />
                </label>

                <label className="field">
                  <span>희망 포지션</span>
                  <input
                    value={resume.title}
                    onChange={handleInput((value) => updateField("title", value))}
                    placeholder="Frontend Developer"
                  />
                </label>
              </div>

              <label className="field">
                <span>한 줄 소개</span>
                <textarea
                  value={resume.summary}
                  onChange={handleInput((value) => updateField("summary", value))}
                  rows={4}
                  placeholder="핵심 경력과 강점을 간단히 정리하세요."
                />
              </label>
            </section>

            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>프로필 사진</h2>
                  <p>증명사진이나 프로필 이미지를 넣으면 PDF에도 같이 출력됩니다.</p>
                </div>
                {resume.photo ? (
                  <button type="button" className="text-button" onClick={removePhoto}>
                    사진 제거
                  </button>
                ) : null}
              </div>

              <div className="photo-editor">
                <div className="photo-thumb">
                  {resume.photo ? (
                    <Image
                      className="photo-thumb-image"
                      src={resume.photo}
                      alt={`${resume.name || "프로필"} 사진`}
                      width={384}
                      height={480}
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <div className="photo-thumb-placeholder">
                      {getInitials(resume.name)}
                    </div>
                  )}
                </div>

                <label className="upload-button">
                  <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  사진 업로드
                </label>
              </div>
            </section>

            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>연락처</h2>
                  <p>출력 시 상단에 한 줄로 표시됩니다.</p>
                </div>
              </div>

              <div className="field-grid">
                <label className="field">
                  <span>이메일</span>
                  <input
                    value={resume.contact.email}
                    onChange={handleInput((value) => updateContact("email", value))}
                    placeholder="email@example.com"
                  />
                </label>

                <label className="field">
                  <span>전화번호</span>
                  <input
                    value={resume.contact.phone}
                    onChange={handleInput((value) => updateContact("phone", value))}
                    placeholder="010-0000-0000"
                  />
                </label>

                <label className="field">
                  <span>웹사이트</span>
                  <input
                    value={resume.contact.website}
                    onChange={handleInput((value) => updateContact("website", value))}
                    placeholder="https://portfolio.com"
                  />
                </label>
              </div>
            </section>

            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>강점과 기술</h2>
                  <p>강점은 줄바꿈, 기술은 쉼표로 구분하면 됩니다.</p>
                </div>
              </div>

              <label className="field">
                <span>핵심 강점</span>
                <textarea
                  value={resume.strengths}
                  onChange={handleInput((value) => updateField("strengths", value))}
                  rows={4}
                  placeholder={"문제 해결\n협업 문서화\nUI 완성도"}
                />
              </label>

              <label className="field">
                <span>기술 스택</span>
                <textarea
                  value={resume.skills}
                  onChange={handleInput((value) => updateField("skills", value))}
                  rows={3}
                  placeholder="Next.js, React, JavaScript, CSS"
                />
              </label>
            </section>

            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>경력</h2>
                  <p>주요 성과는 줄바꿈으로 여러 개 적을 수 있습니다.</p>
                </div>
                <button type="button" className="tiny-button" onClick={addExperience}>
                  경력 추가
                </button>
              </div>

              <div className="stack-group">
                {resume.experience.map((item, index) => (
                  <article className="repeat-card" key={`experience-${index}`}>
                    <div className="repeat-card-header">
                      <strong>경력 {index + 1}</strong>
                      {resume.experience.length > 1 ? (
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => removeExperience(index)}
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>

                    <div className="field-grid">
                      <label className="field">
                        <span>회사명</span>
                        <input
                          value={item.company}
                          onChange={handleInput((value) =>
                            updateExperience(index, "company", value)
                          )}
                        />
                      </label>

                      <label className="field">
                        <span>직무</span>
                        <input
                          value={item.role}
                          onChange={handleInput((value) =>
                            updateExperience(index, "role", value)
                          )}
                        />
                      </label>

                      <label className="field">
                        <span>기간</span>
                        <input
                          value={item.period}
                          onChange={handleInput((value) =>
                            updateExperience(index, "period", value)
                          )}
                          placeholder="2024.01 - 2025.03"
                        />
                      </label>
                    </div>

                    <label className="field">
                      <span>설명</span>
                      <textarea
                        value={item.description}
                        onChange={handleInput((value) =>
                          updateExperience(index, "description", value)
                        )}
                        rows={3}
                      />
                    </label>

                    <label className="field">
                      <span>주요 성과</span>
                      <textarea
                        value={item.highlights}
                        onChange={handleInput((value) =>
                          updateExperience(index, "highlights", value)
                        )}
                        rows={4}
                        placeholder={"성과 1\n성과 2"}
                      />
                    </label>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>학력</h2>
                  <p>필요한 만큼 항목을 추가하세요.</p>
                </div>
                <button type="button" className="tiny-button" onClick={addEducation}>
                  학력 추가
                </button>
              </div>

              <div className="stack-group">
                {resume.education.map((item, index) => (
                  <article className="repeat-card" key={`education-${index}`}>
                    <div className="repeat-card-header">
                      <strong>학력 {index + 1}</strong>
                      {resume.education.length > 1 ? (
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => removeEducation(index)}
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>

                    <div className="field-grid">
                      <label className="field">
                        <span>학교명</span>
                        <input
                          value={item.school}
                          onChange={handleInput((value) =>
                            updateEducation(index, "school", value)
                          )}
                        />
                      </label>

                      <label className="field">
                        <span>전공/학위</span>
                        <input
                          value={item.degree}
                          onChange={handleInput((value) =>
                            updateEducation(index, "degree", value)
                          )}
                        />
                      </label>

                      <label className="field">
                        <span>기간</span>
                        <input
                          value={item.period}
                          onChange={handleInput((value) =>
                            updateEducation(index, "period", value)
                          )}
                        />
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>프로젝트</h2>
                  <p>포트폴리오용 프로젝트를 정리하세요.</p>
                </div>
                <button type="button" className="tiny-button" onClick={addProject}>
                  프로젝트 추가
                </button>
              </div>

              <div className="stack-group">
                {resume.projects.map((item, index) => (
                  <article className="repeat-card" key={`project-${index}`}>
                    <div className="repeat-card-header">
                      <strong>프로젝트 {index + 1}</strong>
                      {resume.projects.length > 1 ? (
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => removeProject(index)}
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>

                    <div className="field-grid">
                      <label className="field">
                        <span>이름</span>
                        <input
                          value={item.name}
                          onChange={handleInput((value) =>
                            updateProject(index, "name", value)
                          )}
                        />
                      </label>

                      <label className="field">
                        <span>기간</span>
                        <input
                          value={item.period}
                          onChange={handleInput((value) =>
                            updateProject(index, "period", value)
                          )}
                        />
                      </label>

                      <label className="field">
                        <span>링크</span>
                        <input
                          value={item.link}
                          onChange={handleInput((value) =>
                            updateProject(index, "link", value)
                          )}
                          placeholder="https://..."
                        />
                      </label>
                    </div>

                    <label className="field">
                      <span>설명</span>
                      <textarea
                        value={item.description}
                        onChange={handleInput((value) =>
                          updateProject(index, "description", value)
                        )}
                        rows={3}
                      />
                    </label>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>자격증</h2>
                  <p>이름, 취득일, 제공 단체를 항목으로 관리합니다.</p>
                </div>
                <button type="button" className="tiny-button" onClick={addCertification}>
                  자격증 추가
                </button>
              </div>

              <div className="stack-group">
                {resume.certifications.map((item, index) => (
                  <article className="repeat-card" key={`certification-${index}`}>
                    <div className="repeat-card-header">
                      <strong>자격증 {index + 1}</strong>
                      {resume.certifications.length > 1 ? (
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => removeCertification(index)}
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>

                    <div className="field-grid">
                      <label className="field">
                        <span>자격증 이름</span>
                        <input
                          value={item.name}
                          onChange={handleInput((value) =>
                            updateCertification(index, "name", value)
                          )}
                          placeholder="정보처리기사"
                        />
                      </label>

                      <label className="field">
                        <span>날짜</span>
                        <input
                          value={item.date}
                          onChange={handleInput((value) =>
                            updateCertification(index, "date", value)
                          )}
                          placeholder="2024.06"
                        />
                      </label>

                      <label className="field">
                        <span>제공 단체</span>
                        <input
                          value={item.issuer}
                          onChange={handleInput((value) =>
                            updateCertification(index, "issuer", value)
                          )}
                          placeholder="한국산업인력공단"
                        />
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel-card">
              <div className="section-header">
                <div>
                  <h2>포트폴리오</h2>
                  <p>URL만 입력하면 미리보기와 PDF에서 링크로 표시됩니다.</p>
                </div>
                <button type="button" className="tiny-button" onClick={addPortfolio}>
                  포트폴리오 추가
                </button>
              </div>

              <div className="stack-group">
                {resume.portfolios.map((item, index) => (
                  <article className="repeat-card" key={`portfolio-${index}`}>
                    <div className="repeat-card-header">
                      <strong>포트폴리오 {index + 1}</strong>
                      {resume.portfolios.length > 1 ? (
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => removePortfolio(index)}
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>

                    <label className="field">
                      <span>URL</span>
                      <input
                        value={item.url}
                        onChange={handleInput((value) =>
                          updatePortfolio(index, "url", value)
                        )}
                        placeholder="https://portfolio.example.com"
                      />
                    </label>
                  </article>
                ))}
              </div>
            </section>
          </aside>

          <section className="preview-panel">
            <div className="preview-note">
              인쇄 시 편집 패널은 숨겨지고 오른쪽 문서만 A4 기준으로 출력됩니다.
            </div>

            <article className="resume-paper" ref={resumePaperRef}>
              <header className="resume-header">
                <div className="resume-identity">
                  {resume.photo ? (
                    <Image
                      className="resume-avatar"
                      src={resume.photo}
                      alt={`${resume.name || "프로필"} 사진`}
                      width={384}
                      height={480}
                      sizes="90px"
                      unoptimized
                    />
                  ) : (
                    <div className="resume-avatar resume-avatar-placeholder">
                      {getInitials(resume.name)}
                    </div>
                  )}

                  <div className="resume-person">
                    <p className="resume-kicker">Resume</p>
                    <h2>{resume.name || "이름을 입력하세요"}</h2>
                    <p className="resume-title">
                      {resume.title || "희망 포지션을 입력하세요"}
                    </p>
                  </div>
                </div>

                <ul className="contact-list">
                  {resume.contact.email ? (
                    <ContactLinkItem
                      href={`mailto:${resume.contact.email}`}
                      label={resume.contact.email}
                    />
                  ) : null}
                  {resume.contact.phone ? (
                    <ContactLinkItem
                      href={toPhoneHref(resume.contact.phone)}
                      label={resume.contact.phone}
                    />
                  ) : null}
                  {resume.contact.website ? (
                    <ContactLinkItem
                      href={toWebsiteHref(resume.contact.website)}
                      label={resume.contact.website}
                    />
                  ) : null}
                </ul>
              </header>

              {resume.summary ? (
                <ResumeSection title="소개">
                  <p>
                    <LinkedText text={resume.summary} />
                  </p>
                </ResumeSection>
              ) : null}

              {strengthLines.length > 0 ? (
                <ResumeSection title="핵심 강점">
                  <ul className="bullet-list">
                    {strengthLines.map((line) => (
                      <li key={line}>
                        <LinkedText text={line} />
                      </li>
                    ))}
                  </ul>
                </ResumeSection>
              ) : null}

              {skillTags.length > 0 ? (
                <ResumeSection title="기술 스택">
                  <div className="tag-row">
                    {skillTags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </ResumeSection>
              ) : null}

              {resume.experience.some(
                (item) =>
                  item.company || item.role || item.description || item.highlights
              ) ? (
                <ResumeSection title="경력">
                  <div className="resume-stack">
                    {resume.experience.map((item, index) =>
                      item.company || item.role || item.description || item.highlights ? (
                        <article className="resume-item" key={`preview-experience-${index}`}>
                          <div className="item-heading">
                            <div>
                              <h3>{item.role || "직무"}</h3>
                              <p>{item.company || "회사명"}</p>
                            </div>
                            <span>{item.period}</span>
                          </div>
                          {item.description ? (
                            <p>
                              <LinkedText text={item.description} />
                            </p>
                          ) : null}
                          {splitLines(item.highlights).length > 0 ? (
                            <ul className="bullet-list">
                              {splitLines(item.highlights).map((line) => (
                                <li key={line}>
                                  <LinkedText text={line} />
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </article>
                      ) : null
                    )}
                  </div>
                </ResumeSection>
              ) : null}

              {resume.projects.some((item) => item.name || item.description || item.link) ? (
                <ResumeSection title="프로젝트">
                  <div className="resume-stack">
                    {resume.projects.map((item, index) =>
                      item.name || item.description || item.link ? (
                        <article className="resume-item" key={`preview-project-${index}`}>
                          <div className="item-heading">
                            <div>
                              <h3>
                                {item.link ? (
                                  <InlineLink href={toWebsiteHref(item.link)}>
                                    {item.name || "프로젝트명"}
                                  </InlineLink>
                                ) : (
                                  item.name || "프로젝트명"
                                )}
                              </h3>
                              {item.link ? (
                                <p>
                                  <InlineLink
                                    className="resume-link subtle-link"
                                    href={toWebsiteHref(item.link)}
                                  >
                                    {item.link}
                                  </InlineLink>
                                </p>
                              ) : null}
                            </div>
                            <span>{item.period}</span>
                          </div>
                          {item.description ? (
                            <p>
                              <LinkedText text={item.description} />
                            </p>
                          ) : null}
                        </article>
                      ) : null
                    )}
                  </div>
                </ResumeSection>
              ) : null}

              {resume.education.some((item) => item.school || item.degree || item.period) ? (
                <ResumeSection title="학력">
                  <div className="resume-stack">
                    {resume.education.map((item, index) =>
                      item.school || item.degree || item.period ? (
                        <article className="resume-item" key={`preview-education-${index}`}>
                          <div className="item-heading">
                            <div>
                              <h3>{item.school || "학교명"}</h3>
                              <p>{item.degree || "전공 / 학위"}</p>
                            </div>
                            <span>{item.period}</span>
                          </div>
                        </article>
                      ) : null
                    )}
                  </div>
                </ResumeSection>
              ) : null}

              {resume.certifications.some((item) => item.name || item.date || item.issuer) ? (
                <ResumeSection title="자격증">
                  <div className="resume-stack">
                    {resume.certifications.map((item, index) =>
                      item.name || item.date || item.issuer ? (
                        <article className="resume-item" key={`preview-certification-${index}`}>
                          <div className="item-heading">
                            <div>
                              <h3>{item.name || "자격증 이름"}</h3>
                              <p>{item.issuer || "제공 단체"}</p>
                            </div>
                            <span>{item.date}</span>
                          </div>
                        </article>
                      ) : null
                    )}
                  </div>
                </ResumeSection>
              ) : null}

              {resume.portfolios.some((item) => item.url) ? (
                <ResumeSection title="포트폴리오">
                  <ul className="bullet-list">
                    {resume.portfolios.map((item, index) =>
                      item.url ? (
                        <li key={`preview-portfolio-${index}`}>
                          <InlineLink href={toWebsiteHref(item.url)}>{item.url}</InlineLink>
                        </li>
                      ) : null
                    )}
                  </ul>
                </ResumeSection>
              ) : null}
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}

function ResumeSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="resume-section">
      <div className="resume-section-title">
        <span />
        <h3>{title}</h3>
      </div>
      <div className="resume-section-body">{children}</div>
    </section>
  );
}

function ContactLinkItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <InlineLink className="contact-link" href={href}>
        {label}
      </InlineLink>
    </li>
  );
}

function LinkedText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, lineIndex, lines) => (
        <Fragment key={`line-${lineIndex}`}>
          {line.split(LINK_PATTERN).map((part, partIndex) => {
            if (!part) {
              return null;
            }

            const { core, suffix } = splitTrailingPunctuation(part);
            const href = getInlineHref(core);

            if (!href) {
              return (
                <Fragment key={`text-${lineIndex}-${partIndex}`}>
                  {part}
                </Fragment>
              );
            }

            return (
              <Fragment key={`link-${lineIndex}-${partIndex}`}>
                <InlineLink href={href}>{core}</InlineLink>
                {suffix}
              </Fragment>
            );
          })}
          {lineIndex < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </>
  );
}

function InlineLink({
  href,
  children,
  className = "resume-link"
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <a
      className={className}
      href={href}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        resolve(result);
        return;
      }

      reject(new Error("invalid image"));
    };

    reader.onerror = () => reject(new Error("image read failed"));
    reader.readAsDataURL(file);
  });
}

function getInitials(name: string) {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length === 0) {
    return "사진";
  }

  return tokens.map((token) => token.slice(0, 1).toUpperCase()).join("");
}

function toWebsiteHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "#";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function toPhoneHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

function getInlineHref(value: string) {
  const trimmed = value.trim();

  if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  if (/^(https?:\/\/|www\.)/i.test(trimmed)) {
    return toWebsiteHref(trimmed);
  }

  return "";
}

function splitTrailingPunctuation(value: string) {
  const match = value.match(/^(.*?)([),.;!?]+)?$/);

  if (!match) {
    return { core: value, suffix: "" };
  }

  return {
    core: match[1] || value,
    suffix: match[2] || ""
  };
}

function createPdfFileName(name: string) {
  const trimmed = name.trim() || "resume";

  return trimmed.replace(/[\\/:*?"<>|]/g, "-");
}

function createDataFileName(name: string) {
  return `${createPdfFileName(name)}-resume-data`;
}

function createPdfCaptureTarget(element: HTMLElement) {
  const stage = document.createElement("div");
  const target = element.cloneNode(true) as HTMLElement;
  const width = Math.ceil(element.getBoundingClientRect().width);

  stage.className = "pdf-capture-stage";
  stage.style.width = `${width}px`;

  target.style.width = `${width}px`;
  target.style.maxWidth = "none";
  target.style.minHeight = "auto";
  target.style.margin = "0";
  target.style.boxShadow = "none";

  stage.appendChild(target);
  document.body.appendChild(stage);

  const height = Math.ceil(target.scrollHeight);

  return {
    cleanup: () => stage.remove(),
    height,
    target,
    width
  };
}

function parseImportedResume(value: unknown) {
  if (isResumeFilePayload(value)) {
    return normalizeResume(value.resume);
  }

  return normalizeResume(value);
}

function isResumeFilePayload(
  value: unknown
): value is {
  resume: unknown;
} {
  return typeof value === "object" && value !== null && "resume" in value;
}
