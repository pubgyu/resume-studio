"use client";

import Image from "next/image";
import { Fragment, memo, useMemo, type ReactNode } from "react";

import {
  formatResumeDate,
  formatResumePeriod,
  formatTotalExperienceLabel,
  type CertificationItem,
  type ContactInfo,
  type EducationItem,
  type ExperienceItem,
  type LanguageStudyItem,
  type PortfolioItem,
  type ProjectItem,
  type ResumeData,
  splitLines,
  splitTags
} from "@/lib/resume-template";
import {
  LINK_PATTERN,
  getInitials,
  getInlineHref,
  splitTrailingPunctuation,
  toPhoneHref,
  toWebsiteHref
} from "@/lib/resume-builder/utils";
import type { ResumePresentation, ResumeSectionOrderKey } from "@/lib/resumes/types";

const SPLIT_TEMPLATE_COLUMN_MAP: Record<ResumeSectionOrderKey, "main" | "sidebar"> = {
  certifications: "sidebar",
  education: "main",
  experience: "main",
  languageStudies: "sidebar",
  portfolios: "sidebar",
  projects: "main",
  salary: "sidebar",
  skills: "sidebar",
  strengths: "sidebar",
  summary: "sidebar",
  totalExperience: "main"
};

type ResumePreviewProps = {
  presentation: ResumePresentation;
  resume: ResumeData;
};

export const ResumePreview = memo(function ResumePreview({
  presentation,
  resume
}: ResumePreviewProps) {
  const strengthLines = useMemo(() => splitLines(resume.strengths), [resume.strengths]);
  const skillTags = useMemo(() => splitTags(resume.skills), [resume.skills]);
  const experienceItems = useMemo(
    () => resume.experience.filter((item) => item.visible).filter(hasExperienceContent),
    [resume.experience]
  );
  const projectItems = useMemo(
    () => resume.projects.filter((item) => item.visible).filter(hasProjectContent),
    [resume.projects]
  );
  const educationItems = useMemo(
    () => resume.education.filter((item) => item.visible).filter(hasEducationContent),
    [resume.education]
  );
  const certificationItems = useMemo(
    () => resume.certifications.filter((item) => item.visible).filter(hasCertificationContent),
    [resume.certifications]
  );
  const languageStudyItems = useMemo(
    () => resume.languageStudies.filter((item) => item.visible).filter(hasLanguageStudyContent),
    [resume.languageStudies]
  );
  const portfolioItems = useMemo(
    () => resume.portfolios.filter((item) => item.visible && item.url.trim()),
    [resume.portfolios]
  );
  const visibility = presentation.sectionVisibility;
  const totalExperienceLabel = useMemo(
    () => formatTotalExperienceLabel(experienceItems),
    [experienceItems]
  );
  const showHeader = visibility.photo || visibility.basic || visibility.contact;

  const summarySection = visibility.basic ? (
    <SummarySection summary={resume.summary} />
  ) : null;
  const strengthsSection = visibility.skills ? <StrengthsSection lines={strengthLines} /> : null;
  const skillsSection = visibility.skills ? <SkillsSection tags={skillTags} /> : null;
  const totalExperienceSection =
    visibility.experience && totalExperienceLabel ? (
      <TotalExperienceSection label={totalExperienceLabel} />
    ) : null;
  const experienceSection = visibility.experience ? (
    <ExperienceSection items={experienceItems} />
  ) : null;
  const projectSection = visibility.projects ? <ProjectSection items={projectItems} /> : null;
  const educationSection = visibility.education ? (
    <EducationSection items={educationItems} />
  ) : null;
  const certificationSection = visibility.certifications ? (
    <CertificationSection items={certificationItems} />
  ) : null;
  const languageStudySection = visibility.languageStudies ? (
    <LanguageStudySection items={languageStudyItems} />
  ) : null;
  const salarySection = visibility.salary ? (
    <SalarySection
      desiredSalary={resume.salary.desired}
      previousSalary={resume.salary.previous}
    />
  ) : null;
  const portfolioSection = visibility.portfolios ? (
    <PortfolioSection items={portfolioItems} />
  ) : null;

  const orderedSections = presentation.sectionOrder
    .map((sectionKey) => {
      let sectionNode: ReactNode = null;

      switch (sectionKey) {
        case "summary":
          sectionNode = summarySection;
          break;
        case "strengths":
          sectionNode = strengthsSection;
          break;
        case "skills":
          sectionNode = skillsSection;
          break;
        case "totalExperience":
          sectionNode = totalExperienceSection;
          break;
        case "experience":
          sectionNode = experienceSection;
          break;
        case "projects":
          sectionNode = projectSection;
          break;
        case "education":
          sectionNode = educationSection;
          break;
        case "certifications":
          sectionNode = certificationSection;
          break;
        case "languageStudies":
          sectionNode = languageStudySection;
          break;
        case "salary":
          sectionNode = salarySection;
          break;
        case "portfolios":
          sectionNode = portfolioSection;
          break;
      }

      return sectionNode ? <Fragment key={sectionKey}>{sectionNode}</Fragment> : null;
    })
    .filter(Boolean);

  const splitSidebarSections = presentation.sectionOrder
    .filter((sectionKey) => SPLIT_TEMPLATE_COLUMN_MAP[sectionKey] === "sidebar")
    .map((sectionKey) => {
      let sectionNode: ReactNode = null;

      switch (sectionKey) {
        case "summary":
          sectionNode = summarySection;
          break;
        case "strengths":
          sectionNode = strengthsSection;
          break;
        case "skills":
          sectionNode = skillsSection;
          break;
        case "certifications":
          sectionNode = certificationSection;
          break;
        case "languageStudies":
          sectionNode = languageStudySection;
          break;
        case "salary":
          sectionNode = salarySection;
          break;
        case "portfolios":
          sectionNode = portfolioSection;
          break;
      }

      return sectionNode ? <Fragment key={sectionKey}>{sectionNode}</Fragment> : null;
    })
    .filter(Boolean);

  const splitMainSections = presentation.sectionOrder
    .filter((sectionKey) => SPLIT_TEMPLATE_COLUMN_MAP[sectionKey] === "main")
    .map((sectionKey) => {
      let sectionNode: ReactNode = null;

      switch (sectionKey) {
        case "totalExperience":
          sectionNode = totalExperienceSection;
          break;
        case "experience":
          sectionNode = experienceSection;
          break;
        case "projects":
          sectionNode = projectSection;
          break;
        case "education":
          sectionNode = educationSection;
          break;
      }

      return sectionNode ? <Fragment key={sectionKey}>{sectionNode}</Fragment> : null;
    })
    .filter(Boolean);

  return (
    <section className="preview-panel">
      <div className="preview-note">
        오른쪽 이력서는 항상 같은 문서 스타일을 유지하고, `PDF 다운로드`는 이 내용을
        기준으로 생성됩니다.
      </div>

      <div className="preview-document-frame">
        <article className={`resume-paper template-${presentation.templateId}`}>
          {showHeader ? (
            <ResumeHeader
              contact={resume.contact}
              name={resume.name}
              photo={resume.photo}
              showBasic={visibility.basic}
              showContact={visibility.contact}
              showPhoto={visibility.photo}
              title={resume.title}
            />
          ) : null}

          {presentation.templateId === "split" ? (
            <div className="resume-template-grid">
              <div className="resume-sidebar-column">{splitSidebarSections}</div>
              <div className="resume-main-column">{splitMainSections}</div>
            </div>
          ) : (
            orderedSections
          )}
        </article>
      </div>
    </section>
  );
});

ResumePreview.displayName = "ResumePreview";

const ResumeHeader = memo(function ResumeHeader({
  contact,
  name,
  photo,
  showBasic,
  showContact,
  showPhoto,
  title
}: {
  contact: ContactInfo;
  name: string;
  photo: string;
  showBasic: boolean;
  showContact: boolean;
  showPhoto: boolean;
  title: string;
}) {
  const placeholderLabel = showBasic ? name || title : "Resume";

  return (
    <header className="resume-header">
      {showPhoto || showBasic ? (
        <div className="resume-identity">
          {showPhoto ? (
            photo ? (
              <Image
                className="resume-avatar"
                src={photo}
                alt={`${name || title || "프로필"} 사진`}
                width={384}
                height={480}
                sizes="90px"
                unoptimized
              />
            ) : (
              <div className="resume-avatar resume-avatar-placeholder">
                {getInitials(placeholderLabel)}
              </div>
            )
          ) : null}

          {showBasic ? (
            <div className="resume-person">
              <p className="resume-kicker">Resume</p>
              <h2>{name || "이름을 입력하세요"}</h2>
              {title ? <p className="resume-title">{title}</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {showContact ? (
        <ul className="contact-list">
          {contact.email ? (
            <ContactLinkItem href={`mailto:${contact.email}`} label={contact.email} />
          ) : null}
          {contact.phone ? (
            <ContactLinkItem href={toPhoneHref(contact.phone)} label={contact.phone} />
          ) : null}
          {contact.website ? (
            <ContactLinkItem href={toWebsiteHref(contact.website)} label={contact.website} />
          ) : null}
        </ul>
      ) : null}
    </header>
  );
});

const SummarySection = memo(function SummarySection({ summary }: { summary: string }) {
  if (!summary) {
    return null;
  }

  return (
    <ResumeSection title="소개">
      <p>
        <LinkedText text={summary} />
      </p>
    </ResumeSection>
  );
});

const StrengthsSection = memo(function StrengthsSection({ lines }: { lines: string[] }) {
  if (lines.length === 0) {
    return null;
  }

  return (
    <ResumeSection title="핵심 강점">
      <ul className="bullet-list">
        {lines.map((line) => (
          <li key={line}>
            <LinkedText text={line} />
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
});

const SkillsSection = memo(function SkillsSection({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ResumeSection title="기술 스택">
      <div className="tag-row">
        {tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </ResumeSection>
  );
});

const TotalExperienceSection = memo(function TotalExperienceSection({
  label
}: {
  label: string;
}) {
  return (
    <ResumeSection className="total-experience-section" title="총 경력">
      <div className="total-experience-card">
        <strong>{label}</strong>
      </div>
    </ResumeSection>
  );
});

const ExperienceSection = memo(function ExperienceSection({
  items
}: {
  items: ExperienceItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSection title="경력">
      <div className="resume-stack">
        {items.map((item, index) => (
          <article className="resume-item" key={`preview-experience-${index}`}>
            <div className="item-heading">
              <div>
                <h3>{item.role || "직무"}</h3>
                <p>{item.company || "회사명"}</p>
              </div>
              <span>{formatResumePeriod(item.startDate, item.endDate, item.period)}</span>
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
        ))}
      </div>
    </ResumeSection>
  );
});

const ProjectSection = memo(function ProjectSection({ items }: { items: ProjectItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSection title="프로젝트">
      <div className="resume-stack">
        {items.map((item, index) => (
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
                    <InlineLink className="resume-link subtle-link" href={toWebsiteHref(item.link)}>
                      {item.link}
                    </InlineLink>
                  </p>
                ) : null}
              </div>
              <span>{formatResumePeriod(item.startDate, item.endDate, item.period)}</span>
            </div>
            {item.description ? (
              <p>
                <LinkedText text={item.description} />
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </ResumeSection>
  );
});

const EducationSection = memo(function EducationSection({
  items
}: {
  items: EducationItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSection title="학력">
      <div className="resume-stack">
        {items.map((item, index) => (
          <article className="resume-item" key={`preview-education-${index}`}>
            <div className="item-heading">
              <div>
                <h3>{item.school || "학교명"}</h3>
                {item.degree || item.gpa ? (
                  <p className="item-meta-row">
                    {item.degree ? <span>{item.degree}</span> : null}
                    {item.degree && item.gpa ? <span className="item-dot">·</span> : null}
                    {item.gpa ? <span>학점 {item.gpa}</span> : null}
                  </p>
                ) : null}
              </div>
              <span>{formatResumePeriod(item.startDate, item.endDate, item.period)}</span>
            </div>
          </article>
        ))}
      </div>
    </ResumeSection>
  );
});

const CertificationSection = memo(function CertificationSection({
  items
}: {
  items: CertificationItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSection title="자격증">
      <div className="resume-stack">
        {items.map((item, index) => (
          <article className="resume-item" key={`preview-certification-${index}`}>
            <div className="item-heading">
              <div>
                <h3>{item.name || "자격증 이름"}</h3>
                <p>{item.issuer || "제공 단체"}</p>
              </div>
              <span>{formatResumeDate(item.date)}</span>
            </div>
          </article>
        ))}
      </div>
    </ResumeSection>
  );
});

const LanguageStudySection = memo(function LanguageStudySection({
  items
}: {
  items: LanguageStudyItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSection title="어학연수">
      <div className="resume-stack">
        {items.map((item, index) => (
          <article className="resume-item" key={`preview-language-study-${index}`}>
            <div className="item-heading">
              <div>
                <h3>{item.program || "프로그램명"}</h3>
                {item.institution || item.location ? (
                  <p className="item-meta-row">
                    {item.institution ? <span>{item.institution}</span> : null}
                    {item.institution && item.location ? (
                      <span className="item-dot">·</span>
                    ) : null}
                    {item.location ? <span>{item.location}</span> : null}
                  </p>
                ) : null}
              </div>
              <span>{formatResumePeriod(item.startDate, item.endDate, item.period)}</span>
            </div>
            {item.description ? (
              <p>
                <LinkedText text={item.description} />
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </ResumeSection>
  );
});

const SalarySection = memo(function SalarySection({
  desiredSalary,
  previousSalary
}: {
  desiredSalary: string;
  previousSalary: string;
}) {
  if (!previousSalary && !desiredSalary) {
    return null;
  }

  return (
    <ResumeSection title="연봉">
      <div className="salary-grid">
        {previousSalary ? (
          <article className="salary-card">
            <p className="salary-label">전 직장 연봉</p>
            <strong className="salary-value">{previousSalary}</strong>
          </article>
        ) : null}
        {desiredSalary ? (
          <article className="salary-card">
            <p className="salary-label">희망 연봉</p>
            <strong className="salary-value">{desiredSalary}</strong>
          </article>
        ) : null}
      </div>
    </ResumeSection>
  );
});

const PortfolioSection = memo(function PortfolioSection({
  items
}: {
  items: PortfolioItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSection title="포트폴리오">
      <ul className="bullet-list">
        {items.map((item, index) => (
          <li key={`preview-portfolio-${index}`}>
            <InlineLink href={toWebsiteHref(item.url)}>{item.url}</InlineLink>
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
});

function ResumeSection({
  children,
  className = "",
  title
}: {
  children: ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <section className={`resume-section ${className}`.trim()}>
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

const LinkedText = memo(function LinkedText({ text }: { text: string }) {
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
              return <Fragment key={`text-${lineIndex}-${partIndex}`}>{part}</Fragment>;
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
});

function InlineLink({
  children,
  className = "resume-link",
  href
}: {
  children: ReactNode;
  className?: string;
  href: string;
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

function hasExperienceContent(item: ResumeData["experience"][number]) {
  return Boolean(
    item.company ||
      item.role ||
      item.period ||
      item.startDate ||
      item.endDate ||
      item.description ||
      item.highlights
  );
}

function hasEducationContent(item: ResumeData["education"][number]) {
  return Boolean(item.school || item.degree || item.gpa || item.period || item.startDate || item.endDate);
}

function hasProjectContent(item: ResumeData["projects"][number]) {
  return Boolean(
    item.name || item.period || item.startDate || item.endDate || item.link || item.description
  );
}

function hasCertificationContent(item: ResumeData["certifications"][number]) {
  return Boolean(item.name || item.date || item.issuer);
}

function hasLanguageStudyContent(item: ResumeData["languageStudies"][number]) {
  return Boolean(
    item.program ||
      item.institution ||
      item.location ||
      item.period ||
      item.startDate ||
      item.endDate ||
      item.description
  );
}
