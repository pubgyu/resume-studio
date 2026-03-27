"use client";

import { Fragment, type ReactNode } from "react";

import {
  Document,
  Font,
  Image as PdfImage,
  Link,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";

import {
  formatResumeDate,
  formatResumePeriod,
  formatTotalExperienceLabel,
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

const PDF_FONT_FAMILY = "NotoSansKR";
const PDF_COLORS = {
  accent: "#444444",
  border: "#dddddd",
  muted: "#666666",
  page: "#fcfcfa",
  surface: "#f4f4f2",
  tag: "#eeeeeb",
  text: "#1a1a1a"
};

let fontsRegistered = false;

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

const styles = StyleSheet.create({
  page: {
    backgroundColor: PDF_COLORS.page,
    color: PDF_COLORS.text,
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10.5,
    lineHeight: 1.65,
    paddingBottom: 28,
    paddingHorizontal: 30,
    paddingTop: 28
  },
  pageCompact: {
    fontSize: 9.8,
    lineHeight: 1.56,
    paddingBottom: 24,
    paddingHorizontal: 26,
    paddingTop: 24
  },
  header: {
    borderBottomColor: PDF_COLORS.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 18
  },
  headerCompact: {
    paddingBottom: 16
  },
  headerSplit: {
    paddingBottom: 16
  },
  identity: {
    flexDirection: "row",
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 14
  },
  avatarWrap: {
    alignItems: "center",
    backgroundColor: "#f0f0ed",
    borderColor: "#d9d9d4",
    borderRadius: 16,
    borderWidth: 1,
    height: 86,
    justifyContent: "center",
    marginRight: 14,
    overflow: "hidden",
    width: 72
  },
  avatarWrapCompact: {
    borderRadius: 14,
    height: 78,
    marginRight: 12,
    width: 66
  },
  avatarImage: {
    height: "100%",
    objectFit: "cover",
    width: "100%"
  },
  avatarText: {
    color: "#4a4a4a",
    fontSize: 24,
    fontWeight: 700
  },
  avatarTextCompact: {
    fontSize: 21
  },
  person: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: "center"
  },
  kicker: {
    color: PDF_COLORS.accent,
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 2.4,
    marginBottom: 4
  },
  kickerCompact: {
    fontSize: 7.4,
    marginBottom: 3
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 4
  },
  nameCompact: {
    fontSize: 21,
    marginBottom: 3
  },
  title: {
    color: PDF_COLORS.muted,
    fontSize: 12.5,
    fontWeight: 500
  },
  titleCompact: {
    fontSize: 11.2
  },
  contactList: {
    flexShrink: 0,
    paddingTop: 2,
    width: 172
  },
  contactListCompact: {
    width: 156
  },
  contactLine: {
    marginBottom: 5
  },
  contactLineCompact: {
    marginBottom: 4
  },
  contactLink: {
    color: PDF_COLORS.text,
    fontSize: 10,
    textAlign: "right",
    textDecoration: "underline"
  },
  contactLinkCompact: {
    fontSize: 9.2
  },
  splitColumns: {
    columnGap: 18,
    flexDirection: "row",
    marginTop: 2
  },
  splitSidebar: {
    flexBasis: "34%",
    flexGrow: 0,
    flexShrink: 0,
    paddingRight: 14
  },
  splitMain: {
    flexBasis: "66%",
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 6
  },
  section: {
    marginTop: 18
  },
  sectionCompact: {
    marginTop: 14
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10
  },
  sectionHeaderCompact: {
    marginBottom: 8
  },
  sectionBar: {
    backgroundColor: PDF_COLORS.accent,
    borderRadius: 999,
    height: 4,
    marginRight: 8,
    width: 20
  },
  sectionBarCompact: {
    height: 3,
    marginRight: 7,
    width: 16
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700
  },
  sectionTitleCompact: {
    fontSize: 11
  },
  bodyLine: {
    fontSize: 10.5,
    lineHeight: 1.65
  },
  bodyLineCompact: {
    fontSize: 9.8,
    lineHeight: 1.55
  },
  bodyLineSpaced: {
    marginTop: 4
  },
  inlineLink: {
    color: PDF_COLORS.text,
    textDecoration: "underline"
  },
  bulletList: {
    marginTop: 2
  },
  bulletItem: {
    flexDirection: "row",
    marginTop: 4
  },
  bulletMarker: {
    fontSize: 11,
    marginRight: 6,
    width: 10
  },
  bulletMarkerCompact: {
    fontSize: 10,
    marginRight: 5,
    width: 9
  },
  bulletContent: {
    flexGrow: 1,
    flexShrink: 1
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tag: {
    backgroundColor: PDF_COLORS.tag,
    borderRadius: 999,
    marginBottom: 6,
    marginRight: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  tagCompact: {
    marginBottom: 5,
    marginRight: 5,
    paddingHorizontal: 7,
    paddingVertical: 3
  },
  tagText: {
    color: PDF_COLORS.text,
    fontSize: 9,
    fontWeight: 500
  },
  tagTextCompact: {
    fontSize: 8.3
  },
  totalExperienceCard: {
    backgroundColor: PDF_COLORS.surface,
    borderColor: PDF_COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  totalExperienceCardCompact: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  totalExperienceText: {
    fontSize: 11.2,
    fontWeight: 700
  },
  totalExperienceTextCompact: {
    fontSize: 10.2
  },
  salaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2
  },
  salaryCard: {
    backgroundColor: PDF_COLORS.surface,
    borderColor: PDF_COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  salaryCardCompact: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  salaryLabel: {
    color: PDF_COLORS.muted,
    fontSize: 8.8,
    marginBottom: 3
  },
  salaryLabelCompact: {
    fontSize: 8.1
  },
  salaryValue: {
    fontSize: 11,
    fontWeight: 700
  },
  salaryValueCompact: {
    fontSize: 10
  },
  stack: {
    marginTop: 2
  },
  item: {
    marginTop: 12
  },
  itemCompact: {
    marginTop: 10
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemHeaderLeft: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 12
  },
  itemTitle: {
    fontSize: 11.2,
    fontWeight: 700,
    lineHeight: 1.3
  },
  itemTitleCompact: {
    fontSize: 10.4
  },
  itemTitleLink: {
    color: PDF_COLORS.text,
    fontSize: 11.2,
    fontWeight: 700,
    lineHeight: 1.3,
    textDecoration: "underline"
  },
  itemTitleLinkCompact: {
    fontSize: 10.4
  },
  itemSubtitle: {
    color: PDF_COLORS.muted,
    fontSize: 10,
    marginTop: 2
  },
  itemSubtitleCompact: {
    fontSize: 9.2
  },
  itemPeriod: {
    color: PDF_COLORS.muted,
    fontSize: 9.5,
    textAlign: "right"
  },
  itemPeriodCompact: {
    fontSize: 8.7
  },
  itemLink: {
    color: PDF_COLORS.text,
    fontSize: 9.8,
    marginTop: 4,
    textDecoration: "underline"
  },
  itemLinkCompact: {
    fontSize: 9
  },
  metaRow: {
    color: PDF_COLORS.muted,
    fontSize: 9.8,
    marginTop: 3
  },
  metaRowCompact: {
    fontSize: 9
  }
});

type ResumePdfDocumentProps = {
  presentation: ResumePresentation;
  resume: ResumeData;
  resumeName: string;
};

export function ResumePdfDocument({
  presentation,
  resume,
  resumeName
}: ResumePdfDocumentProps) {
  registerResumePdfFonts();

  const visibility = presentation.sectionVisibility;
  const isCompact = presentation.templateId === "compact";
  const isSplit = presentation.templateId === "split";
  const strengthLines = splitLines(resume.strengths);
  const skillTags = splitTags(resume.skills);
  const experienceItems = resume.experience.filter((item) => item.visible).filter(hasExperienceContent);
  const educationItems = resume.education.filter((item) => item.visible).filter(hasEducationContent);
  const projectItems = resume.projects.filter((item) => item.visible).filter(hasProjectContent);
  const certificationItems = resume.certifications
    .filter((item) => item.visible)
    .filter(hasCertificationContent);
  const languageStudyItems = resume.languageStudies
    .filter((item) => item.visible)
    .filter(hasLanguageStudyContent);
  const portfolioItems = resume.portfolios.filter((item) => item.visible && item.url.trim());
  const totalExperienceLabel = visibility.totalExperience
    ? formatTotalExperienceLabel(experienceItems)
    : "";
  const hasSalary = visibility.salary && Boolean(resume.salary.previous || resume.salary.desired);
  const hasHeader = visibility.photo || visibility.basic || visibility.contact;

  const summarySection =
    visibility.summary && resume.summary ? (
      <PdfSection key="summary" isCompact={isCompact} title="소개">
        <PdfParagraph isCompact={isCompact} text={resume.summary} />
      </PdfSection>
    ) : null;
  const strengthsSection =
    visibility.strengths && strengthLines.length > 0 ? (
      <PdfSection key="strengths" isCompact={isCompact} title="핵심 강점">
        <View style={styles.bulletList}>
          {strengthLines.map((line) => (
            <PdfBullet key={line} isCompact={isCompact} text={line} />
          ))}
        </View>
      </PdfSection>
    ) : null;
  const skillsSection =
    visibility.skills && skillTags.length > 0 ? (
      <PdfSection key="skills" isCompact={isCompact} title="기술 스택">
        <View style={styles.tagRow}>
          {skillTags.map((tag) => (
            <View key={tag} style={isCompact ? [styles.tag, styles.tagCompact] : styles.tag}>
              <Text
                style={isCompact ? [styles.tagText, styles.tagTextCompact] : styles.tagText}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </PdfSection>
    ) : null;
  const totalExperienceSection =
    visibility.totalExperience && totalExperienceLabel ? (
      <PdfSection key="totalExperience" isCompact={isCompact} title="총 경력">
        <View
          style={
            isCompact
              ? [styles.totalExperienceCard, styles.totalExperienceCardCompact]
              : styles.totalExperienceCard
          }
        >
          <Text
            style={
              isCompact
                ? [styles.totalExperienceText, styles.totalExperienceTextCompact]
                : styles.totalExperienceText
            }
          >
            {totalExperienceLabel}
          </Text>
        </View>
      </PdfSection>
    ) : null;
  const experienceSection =
    visibility.experience && experienceItems.length > 0 ? (
      <PdfSection key="experience" isCompact={isCompact} title="경력">
        <View style={styles.stack}>
          {experienceItems.map((item, index) => (
            <View
              key={`pdf-experience-${index}`}
              style={isCompact ? [styles.item, styles.itemCompact] : styles.item}
              wrap={false}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  <Text
                    style={isCompact ? [styles.itemTitle, styles.itemTitleCompact] : styles.itemTitle}
                  >
                    {item.role || "직무"}
                  </Text>
                  {item.company ? (
                    <Text
                      style={
                        isCompact
                          ? [styles.itemSubtitle, styles.itemSubtitleCompact]
                          : styles.itemSubtitle
                      }
                    >
                      {item.company}
                    </Text>
                  ) : null}
                </View>
                {formatResumePeriod(item.startDate, item.endDate, item.period) ? (
                  <Text
                    style={
                      isCompact
                        ? [styles.itemPeriod, styles.itemPeriodCompact]
                        : styles.itemPeriod
                    }
                  >
                    {formatResumePeriod(item.startDate, item.endDate, item.period)}
                  </Text>
                ) : null}
              </View>

              {item.description ? <PdfParagraph isCompact={isCompact} text={item.description} /> : null}

              {splitLines(item.highlights).length > 0 ? (
                <View style={styles.bulletList}>
                  {splitLines(item.highlights).map((line) => (
                    <PdfBullet key={`${item.role}-${line}`} isCompact={isCompact} text={line} />
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </PdfSection>
    ) : null;
  const projectSection =
    visibility.projects && projectItems.length > 0 ? (
      <PdfSection key="projects" isCompact={isCompact} title="프로젝트">
        <View style={styles.stack}>
          {projectItems.map((item, index) => (
            <View
              key={`pdf-project-${index}`}
              style={isCompact ? [styles.item, styles.itemCompact] : styles.item}
              wrap={false}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  {item.link ? (
                    <Link
                      src={toWebsiteHref(item.link)}
                      style={
                        isCompact
                          ? [styles.itemTitleLink, styles.itemTitleLinkCompact]
                          : styles.itemTitleLink
                      }
                    >
                      {item.name || item.link}
                    </Link>
                  ) : (
                    <Text
                      style={isCompact ? [styles.itemTitle, styles.itemTitleCompact] : styles.itemTitle}
                    >
                      {item.name || "프로젝트"}
                    </Text>
                  )}
                </View>
                {formatResumePeriod(item.startDate, item.endDate, item.period) ? (
                  <Text
                    style={
                      isCompact
                        ? [styles.itemPeriod, styles.itemPeriodCompact]
                        : styles.itemPeriod
                    }
                  >
                    {formatResumePeriod(item.startDate, item.endDate, item.period)}
                  </Text>
                ) : null}
              </View>

              {item.description ? <PdfParagraph isCompact={isCompact} text={item.description} /> : null}

              {item.link ? (
                <Link
                  src={toWebsiteHref(item.link)}
                  style={isCompact ? [styles.itemLink, styles.itemLinkCompact] : styles.itemLink}
                >
                  {item.link}
                </Link>
              ) : null}
            </View>
          ))}
        </View>
      </PdfSection>
    ) : null;
  const educationSection =
    visibility.education && educationItems.length > 0 ? (
      <PdfSection key="education" isCompact={isCompact} title="학력">
        <View style={styles.stack}>
          {educationItems.map((item, index) => (
            <View
              key={`pdf-education-${index}`}
              style={isCompact ? [styles.item, styles.itemCompact] : styles.item}
              wrap={false}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  <Text
                    style={isCompact ? [styles.itemTitle, styles.itemTitleCompact] : styles.itemTitle}
                  >
                    {item.school || "학교명"}
                  </Text>
                  {item.degree || item.gpa ? (
                    <Text style={isCompact ? [styles.metaRow, styles.metaRowCompact] : styles.metaRow}>
                      {item.degree || ""}
                      {item.degree && item.gpa ? " · " : ""}
                      {item.gpa ? `학점 ${item.gpa}` : ""}
                    </Text>
                  ) : null}
                </View>
                {formatResumePeriod(item.startDate, item.endDate, item.period) ? (
                  <Text
                    style={
                      isCompact
                        ? [styles.itemPeriod, styles.itemPeriodCompact]
                        : styles.itemPeriod
                    }
                  >
                    {formatResumePeriod(item.startDate, item.endDate, item.period)}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </PdfSection>
    ) : null;
  const certificationSection =
    visibility.certifications && certificationItems.length > 0 ? (
      <PdfSection key="certifications" isCompact={isCompact} title="자격증">
        <View style={styles.stack}>
          {certificationItems.map((item, index) => (
            <View
              key={`pdf-certification-${index}`}
              style={isCompact ? [styles.item, styles.itemCompact] : styles.item}
              wrap={false}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  <Text
                    style={isCompact ? [styles.itemTitle, styles.itemTitleCompact] : styles.itemTitle}
                  >
                    {item.name || "자격증"}
                  </Text>
                  {item.issuer ? (
                    <Text
                      style={
                        isCompact
                          ? [styles.itemSubtitle, styles.itemSubtitleCompact]
                          : styles.itemSubtitle
                      }
                    >
                      {item.issuer}
                    </Text>
                  ) : null}
                </View>
                {item.date ? (
                  <Text
                    style={
                      isCompact
                        ? [styles.itemPeriod, styles.itemPeriodCompact]
                        : styles.itemPeriod
                    }
                  >
                    {formatResumeDate(item.date)}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </PdfSection>
    ) : null;
  const languageStudySection =
    visibility.languageStudies && languageStudyItems.length > 0 ? (
      <PdfSection key="languageStudies" isCompact={isCompact} title="어학연수">
        <View style={styles.stack}>
          {languageStudyItems.map((item, index) => (
            <View
              key={`pdf-language-study-${index}`}
              style={isCompact ? [styles.item, styles.itemCompact] : styles.item}
              wrap={false}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  <Text
                    style={isCompact ? [styles.itemTitle, styles.itemTitleCompact] : styles.itemTitle}
                  >
                    {item.program || "프로그램명"}
                  </Text>
                  {item.institution || item.location ? (
                    <Text style={isCompact ? [styles.metaRow, styles.metaRowCompact] : styles.metaRow}>
                      {item.institution || ""}
                      {item.institution && item.location ? " · " : ""}
                      {item.location || ""}
                    </Text>
                  ) : null}
                </View>
                {formatResumePeriod(item.startDate, item.endDate, item.period) ? (
                  <Text
                    style={
                      isCompact
                        ? [styles.itemPeriod, styles.itemPeriodCompact]
                        : styles.itemPeriod
                    }
                  >
                    {formatResumePeriod(item.startDate, item.endDate, item.period)}
                  </Text>
                ) : null}
              </View>
              {item.description ? <PdfParagraph isCompact={isCompact} text={item.description} /> : null}
            </View>
          ))}
        </View>
      </PdfSection>
    ) : null;
  const salarySection =
    hasSalary ? (
      <PdfSection key="salary" isCompact={isCompact} title="연봉">
        <View style={styles.salaryRow}>
          {resume.salary.previous ? (
            <View
              style={isCompact ? [styles.salaryCard, styles.salaryCardCompact] : styles.salaryCard}
            >
              <Text
                style={
                  isCompact ? [styles.salaryLabel, styles.salaryLabelCompact] : styles.salaryLabel
                }
              >
                전 직장 연봉
              </Text>
              <Text
                style={
                  isCompact ? [styles.salaryValue, styles.salaryValueCompact] : styles.salaryValue
                }
              >
                {resume.salary.previous}
              </Text>
            </View>
          ) : null}
          {resume.salary.desired ? (
            <View
              style={isCompact ? [styles.salaryCard, styles.salaryCardCompact] : styles.salaryCard}
            >
              <Text
                style={
                  isCompact ? [styles.salaryLabel, styles.salaryLabelCompact] : styles.salaryLabel
                }
              >
                희망 연봉
              </Text>
              <Text
                style={
                  isCompact ? [styles.salaryValue, styles.salaryValueCompact] : styles.salaryValue
                }
              >
                {resume.salary.desired}
              </Text>
            </View>
          ) : null}
        </View>
      </PdfSection>
    ) : null;
  const portfolioSection =
    visibility.portfolios && portfolioItems.length > 0 ? (
      <PdfSection key="portfolios" isCompact={isCompact} title="포트폴리오">
        <View style={styles.stack}>
          {portfolioItems.map((item, index) => (
            <View
              key={`pdf-portfolio-${index}`}
              style={isCompact ? [styles.item, styles.itemCompact] : styles.item}
              wrap={false}
            >
              <Link
                src={toWebsiteHref(item.url)}
                style={isCompact ? [styles.itemLink, styles.itemLinkCompact] : styles.itemLink}
              >
                {item.url}
              </Link>
            </View>
          ))}
        </View>
      </PdfSection>
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
    <Document
      author="Resume Room"
      creator="Resume Room"
      keywords="resume, cv"
      producer="Resume Room"
      subject="Resume"
      title={resumeName ? `${resumeName} Resume` : "Resume"}
    >
      <Page size="A4" style={isCompact ? [styles.page, styles.pageCompact] : styles.page}>
        {hasHeader ? (
          <PdfHeader
            contact={resume.contact}
            isCompact={isCompact}
            isSplit={isSplit}
            name={resume.name}
            photo={resume.photo}
            showBasic={visibility.basic}
            showContact={visibility.contact}
            showPhoto={visibility.photo}
            title={resume.title}
          />
        ) : null}

        {isSplit ? (
          <View style={styles.splitColumns}>
            <View style={styles.splitSidebar}>{splitSidebarSections}</View>
            <View style={styles.splitMain}>{splitMainSections}</View>
          </View>
        ) : (
          orderedSections
        )}
      </Page>
    </Document>
  );
}

function PdfHeader({
  contact,
  isCompact,
  isSplit,
  name,
  photo,
  showBasic,
  showContact,
  showPhoto,
  title
}: {
  contact: ResumeData["contact"];
  isCompact: boolean;
  isSplit: boolean;
  name: string;
  photo: string;
  showBasic: boolean;
  showContact: boolean;
  showPhoto: boolean;
  title: string;
}) {
  const placeholderLabel = showBasic ? name || title : "Resume";

  return (
    <View
      style={[
        styles.header,
        ...(isCompact ? [styles.headerCompact] : []),
        ...(isSplit ? [styles.headerSplit] : [])
      ]}
      wrap={false}
    >
      {showPhoto || showBasic ? (
        <View style={styles.identity}>
          {showPhoto ? (
            <View style={isCompact ? [styles.avatarWrap, styles.avatarWrapCompact] : styles.avatarWrap}>
              {photo ? (
                <PdfImage src={photo} style={styles.avatarImage} />
              ) : (
                <Text
                  style={
                    isCompact ? [styles.avatarText, styles.avatarTextCompact] : styles.avatarText
                  }
                >
                  {getInitials(placeholderLabel)}
                </Text>
              )}
            </View>
          ) : null}

          {showBasic ? (
            <View style={styles.person}>
              <Text style={isCompact ? [styles.kicker, styles.kickerCompact] : styles.kicker}>
                RESUME
              </Text>
              <Text style={isCompact ? [styles.name, styles.nameCompact] : styles.name}>
                {name || "이름을 입력하세요"}
              </Text>
              {title ? (
                <Text style={isCompact ? [styles.title, styles.titleCompact] : styles.title}>
                  {title}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      {showContact ? (
        <View style={isCompact ? [styles.contactList, styles.contactListCompact] : styles.contactList}>
          {contact.email ? (
            <View style={isCompact ? [styles.contactLine, styles.contactLineCompact] : styles.contactLine}>
              <Link
                src={`mailto:${contact.email}`}
                style={isCompact ? [styles.contactLink, styles.contactLinkCompact] : styles.contactLink}
              >
                {contact.email}
              </Link>
            </View>
          ) : null}
          {contact.phone ? (
            <View style={isCompact ? [styles.contactLine, styles.contactLineCompact] : styles.contactLine}>
              <Link
                src={toPhoneHref(contact.phone)}
                style={isCompact ? [styles.contactLink, styles.contactLinkCompact] : styles.contactLink}
              >
                {contact.phone}
              </Link>
            </View>
          ) : null}
          {contact.website ? (
            <View style={isCompact ? [styles.contactLine, styles.contactLineCompact] : styles.contactLine}>
              <Link
                src={toWebsiteHref(contact.website)}
                style={isCompact ? [styles.contactLink, styles.contactLinkCompact] : styles.contactLink}
              >
                {contact.website}
              </Link>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function PdfSection({
  children,
  isCompact,
  title
}: {
  children: ReactNode;
  isCompact: boolean;
  title: string;
}) {
  return (
    <View style={isCompact ? [styles.section, styles.sectionCompact] : styles.section}>
      <View
        style={isCompact ? [styles.sectionHeader, styles.sectionHeaderCompact] : styles.sectionHeader}
        wrap={false}
      >
        <View style={isCompact ? [styles.sectionBar, styles.sectionBarCompact] : styles.sectionBar} />
        <Text
          style={isCompact ? [styles.sectionTitle, styles.sectionTitleCompact] : styles.sectionTitle}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function PdfParagraph({ isCompact, text }: { isCompact: boolean; text: string }) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <View>
      {lines.map((line, index) => (
        <PdfLinkedLine key={`${line}-${index}`} isCompact={isCompact} spaced={index > 0} text={line} />
      ))}
    </View>
  );
}

function PdfBullet({
  isCompact,
  text
}: {
  isCompact: boolean;
  text: string;
}) {
  return (
    <View style={styles.bulletItem}>
      <Text style={isCompact ? [styles.bulletMarker, styles.bulletMarkerCompact] : styles.bulletMarker}>
        •
      </Text>
      <View style={styles.bulletContent}>
        <PdfLinkedLine isCompact={isCompact} text={text} />
      </View>
    </View>
  );
}

function PdfLinkedLine({
  isCompact,
  spaced = false,
  text
}: {
  isCompact: boolean;
  spaced?: boolean;
  text: string;
}) {
  const lineStyle = spaced
    ? isCompact
      ? [styles.bodyLine, styles.bodyLineCompact, styles.bodyLineSpaced]
      : [styles.bodyLine, styles.bodyLineSpaced]
    : isCompact
      ? [styles.bodyLine, styles.bodyLineCompact]
      : styles.bodyLine;

  return (
    <Text style={lineStyle}>
      {text.split(LINK_PATTERN).map((part, index) => {
        if (!part) {
          return null;
        }

        const { core, suffix } = splitTrailingPunctuation(part);
        const href = getInlineHref(core);

        if (!href) {
          return <Text key={`text-${index}`}>{part}</Text>;
        }

        return (
          <Text key={`link-${index}`}>
            <Link src={href} style={styles.inlineLink}>
              {core}
            </Link>
            {suffix}
          </Text>
        );
      })}
    </Text>
  );
}

function registerResumePdfFonts() {
  if (fontsRegistered) {
    return;
  }

  Font.register({
    family: PDF_FONT_FAMILY,
    fonts: [
      {
        fontWeight: 400,
        src: "/fonts/NotoSansKR-Regular.otf"
      },
      {
        fontWeight: 500,
        src: "/fonts/NotoSansKR-Medium.otf"
      },
      {
        fontWeight: 700,
        src: "/fonts/NotoSansKR-Bold.otf"
      }
    ]
  });
  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
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
  return Boolean(item.name || item.period || item.link || item.description);
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
