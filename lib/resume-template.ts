type ResumeItemMeta = {
  id: string;
  visible: boolean;
};

export type ContactInfo = {
  email: string;
  phone: string;
  website: string;
};

export type SalaryInfo = {
  previous: string;
  desired: string;
};

export type ExperienceItem = ResumeItemMeta & {
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string;
};

export type EducationItem = ResumeItemMeta & {
  school: string;
  degree: string;
  gpa: string;
  period: string;
  startDate: string;
  endDate: string;
};

export type ProjectItem = ResumeItemMeta & {
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  link: string;
  description: string;
};

export type CertificationItem = ResumeItemMeta & {
  name: string;
  date: string;
  issuer: string;
};

export type LanguageStudyItem = ResumeItemMeta & {
  program: string;
  institution: string;
  location: string;
  period: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type PortfolioItem = ResumeItemMeta & {
  url: string;
};

export type ResumeData = {
  name: string;
  title: string;
  photo: string;
  summary: string;
  contact: ContactInfo;
  strengths: string;
  skills: string;
  salary: SalaryInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languageStudies: LanguageStudyItem[];
  portfolios: PortfolioItem[];
};

export const createExperience = (): ExperienceItem => ({
  ...createResumeItemMeta(),
  company: "",
  role: "",
  period: "",
  startDate: "",
  endDate: "",
  description: "",
  highlights: ""
});

export const createEducation = (): EducationItem => ({
  ...createResumeItemMeta(),
  school: "",
  degree: "",
  gpa: "",
  period: "",
  startDate: "",
  endDate: ""
});

export const createProject = (): ProjectItem => ({
  ...createResumeItemMeta(),
  name: "",
  period: "",
  startDate: "",
  endDate: "",
  link: "",
  description: ""
});

export const createCertification = (): CertificationItem => ({
  ...createResumeItemMeta(),
  name: "",
  date: "",
  issuer: ""
});

export const createLanguageStudy = (): LanguageStudyItem => ({
  ...createResumeItemMeta(),
  program: "",
  institution: "",
  location: "",
  period: "",
  startDate: "",
  endDate: "",
  description: ""
});

export const createPortfolio = (): PortfolioItem => ({
  ...createResumeItemMeta(),
  url: ""
});

export const createEmptyResume = (): ResumeData => ({
  name: "",
  title: "",
  photo: "",
  summary: "",
  contact: {
    email: "",
    phone: "",
    website: ""
  },
  strengths: "",
  skills: "",
  salary: {
    previous: "",
    desired: ""
  },
  experience: [createExperience()],
  education: [createEducation()],
  projects: [createProject()],
  certifications: [createCertification()],
  languageStudies: [createLanguageStudy()],
  portfolios: [createPortfolio()]
});

export const defaultResume: ResumeData = {
  name: "Kai Kim",
  title: "Frontend Developer",
  photo: "",
  summary:
    "사용자 경험과 제품 완성도를 함께 끌어올리는 프론트엔드 개발자입니다. Next.js와 React 기반 서비스에서 UI 설계, 성능 개선, 협업 문서화를 꾸준히 진행해 왔습니다.",
  contact: {
    email: "kai@example.com",
    phone: "010-1234-5678",
    website: "https://portfolio.example.com"
  },
  strengths:
    "문제를 빠르게 구조화하고 일정 안에 결과물을 마무리합니다.\n디자인 의도를 코드로 정교하게 옮기는 데 강점이 있습니다.\n기획자, 디자이너와 문서 중심으로 협업합니다.",
  skills:
    "Next.js, React, JavaScript, TypeScript, HTML, CSS, Tailwind CSS, Figma, Git",
  salary: {
    previous: "4,200만 원",
    desired: "5,000만 원"
  },
  experience: [
    {
      id: createResumeItemId(),
      visible: true,
      company: "Sample Tech",
      role: "Frontend Developer",
      period: "2023.03.01 - 진행 중",
      startDate: "2023-03-01",
      endDate: "",
      description:
        "서비스 메인 화면과 운영 도구를 개발하며 제품 사용성과 유지보수성을 개선했습니다.",
      highlights:
        "Next.js App Router 기반 신규 페이지 구축\n공통 UI 패턴 정리로 개발 속도 향상\nA/B 테스트용 화면을 빠르게 제작해 전환율 실험 지원"
    }
  ],
  education: [
    {
      id: createResumeItemId(),
      visible: true,
      school: "OO University",
      degree: "Computer Science",
      gpa: "4.2 / 4.5",
      period: "2018.03.01 - 2022.02.28",
      startDate: "2018-03-01",
      endDate: "2022-02-28"
    }
  ],
  projects: [
    {
      id: createResumeItemId(),
      visible: true,
      name: "Resume Room",
      period: "2026.01.01 - 2026.12.31",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      link: "https://example.com",
      description:
        "이력서 작성 내용을 실시간 미리보기로 확인하고 인쇄용 PDF로 저장할 수 있는 도구를 제작했습니다."
    }
  ],
  certifications: [
    {
      id: createResumeItemId(),
      visible: true,
      name: "정보처리기사",
      date: "2024-06-01",
      issuer: "한국산업인력공단"
    }
  ],
  languageStudies: [
    {
      id: createResumeItemId(),
      visible: true,
      program: "Business English Program",
      institution: "Vancouver Language Centre",
      location: "Canada, Vancouver",
      period: "2022.07.01 - 2022.12.31",
      startDate: "2022-07-01",
      endDate: "2022-12-31",
      description: "비즈니스 영어와 실무 커뮤니케이션 중심 과정 수료"
    }
  ],
  portfolios: [
    {
      id: createResumeItemId(),
      visible: true,
      url: "https://portfolio.example.com"
    }
  ]
};

export const cloneResume = (resume: ResumeData): ResumeData =>
  normalizeResume(JSON.parse(JSON.stringify(resume)));

export const normalizeResume = (value: unknown): ResumeData => {
  const input = isRecord(value) ? value : {};
  const contact = isRecord(input.contact) ? input.contact : {};
  const salary = isRecord(input.salary) ? input.salary : {};

  return {
    name: readString(input.name),
    title: readString(input.title),
    photo: readString(input.photo),
    summary: readString(input.summary),
    contact: {
      email: readString(contact.email),
      phone: readString(contact.phone),
      website: readString(contact.website)
    },
    strengths: readString(input.strengths),
    skills: readString(input.skills),
    salary: {
      previous: readString(salary.previous),
      desired: readString(salary.desired)
    },
    experience: normalizeList(input.experience, createExperience, normalizeExperience),
    education: normalizeList(input.education, createEducation, normalizeEducation),
    projects: normalizeList(input.projects, createProject, normalizeProject),
    certifications: normalizeList(
      input.certifications,
      createCertification,
      normalizeCertification
    ),
    languageStudies: normalizeList(
      input.languageStudies,
      createLanguageStudy,
      normalizeLanguageStudy
    ),
    portfolios: normalizeList(input.portfolios, createPortfolio, normalizePortfolio)
  };
};

export const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const splitTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const formatResumeDate = (value: string) => {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value.replace(/-/g, ".");
  }

  if (/^\d{4}-\d{2}$/.test(value)) {
    return value.replace(/-/g, ".");
  }

  return value;
};

export const formatResumePeriod = (
  startDate: string,
  endDate: string,
  fallback = ""
) => {
  const formattedStart = formatResumeDate(startDate);
  const formattedEnd = formatResumeDate(endDate);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }

  if (formattedStart) {
    return `${formattedStart} - 진행 중`;
  }

  if (formattedEnd) {
    return formattedEnd;
  }

  return fallback;
};

function normalizeExperience(value: unknown): ExperienceItem {
  const input = isRecord(value) ? value : {};
  const legacyPeriod = readString(input.period);
  const legacyDates = parseLegacyPeriod(legacyPeriod);
  const startDate = normalizePickerDate(input.startDate) || legacyDates.startDate;
  const endDate = normalizePickerDate(input.endDate) || legacyDates.endDate;

  return {
    id: readItemId(input.id),
    visible: readVisibleFlag(input.visible),
    company: readString(input.company),
    role: readString(input.role),
    period: formatResumePeriod(startDate, endDate, legacyPeriod),
    startDate,
    endDate,
    description: readString(input.description),
    highlights: readString(input.highlights)
  };
}

function normalizeEducation(value: unknown): EducationItem {
  const input = isRecord(value) ? value : {};
  const legacyPeriod = readString(input.period);
  const legacyDates = parseLegacyPeriod(legacyPeriod);
  const startDate = normalizePickerDate(input.startDate) || legacyDates.startDate;
  const endDate = normalizePickerDate(input.endDate) || legacyDates.endDate;

  return {
    id: readItemId(input.id),
    visible: readVisibleFlag(input.visible),
    school: readString(input.school),
    degree: readString(input.degree),
    gpa: readString(input.gpa),
    period: formatResumePeriod(startDate, endDate, legacyPeriod),
    startDate,
    endDate
  };
}

function normalizeProject(value: unknown): ProjectItem {
  const input = isRecord(value) ? value : {};
  const legacyPeriod = readString(input.period);
  const legacyDates = parseLegacyPeriod(legacyPeriod);
  const startDate = normalizePickerDate(input.startDate) || legacyDates.startDate;
  const endDate = normalizePickerDate(input.endDate) || legacyDates.endDate;

  return {
    id: readItemId(input.id),
    visible: readVisibleFlag(input.visible),
    name: readString(input.name),
    period: formatResumePeriod(startDate, endDate, legacyPeriod),
    startDate,
    endDate,
    link: readString(input.link),
    description: readString(input.description)
  };
}

function normalizeCertification(value: unknown): CertificationItem {
  const input = isRecord(value) ? value : {};

  return {
    id: readItemId(input.id),
    visible: readVisibleFlag(input.visible),
    name: readString(input.name),
    date: normalizePickerDate(input.date) || parseLegacyDate(readString(input.date)),
    issuer: readString(input.issuer)
  };
}

function normalizeLanguageStudy(value: unknown): LanguageStudyItem {
  const input = isRecord(value) ? value : {};
  const legacyPeriod = readString(input.period);
  const legacyDates = parseLegacyPeriod(legacyPeriod);
  const startDate = normalizePickerDate(input.startDate) || legacyDates.startDate;
  const endDate = normalizePickerDate(input.endDate) || legacyDates.endDate;

  return {
    id: readItemId(input.id),
    visible: readVisibleFlag(input.visible),
    program: readString(input.program),
    institution: readString(input.institution),
    location: readString(input.location),
    period: formatResumePeriod(startDate, endDate, legacyPeriod),
    startDate,
    endDate,
    description: readString(input.description)
  };
}

function normalizePortfolio(value: unknown): PortfolioItem {
  const input = isRecord(value) ? value : {};

  return {
    id: readItemId(input.id),
    visible: readVisibleFlag(input.visible),
    url: readString(input.url)
  };
}

function normalizeList<T>(
  value: unknown,
  createItem: () => T,
  normalizeItem: (item: unknown) => T
) {
  if (!Array.isArray(value)) {
    return [createItem()];
  }

  if (value.length === 0) {
    return [createItem()];
  }

  return value.map(normalizeItem);
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function createResumeItemMeta(): ResumeItemMeta {
  return {
    id: createResumeItemId(),
    visible: true
  };
}

function createResumeItemId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readItemId(value: unknown) {
  const normalized = readString(value);

  return normalized || createResumeItemId();
}

function readVisibleFlag(value: unknown) {
  return typeof value === "boolean" ? value : true;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizePickerDate(value: unknown) {
  const input = readString(value);

  return /^\d{4}-\d{2}-\d{2}$/.test(input) ? input : "";
}

function parseLegacyDate(value: string) {
  const cleaned = value.trim();

  if (!cleaned) {
    return "";
  }

  const fullMatch = cleaned.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);

  if (fullMatch) {
    return toIsoDate(fullMatch[1], fullMatch[2], fullMatch[3]);
  }

  const monthMatch = cleaned.match(/^(\d{4})[./-](\d{1,2})$/);

  if (monthMatch) {
    return toIsoDate(monthMatch[1], monthMatch[2], "1");
  }

  return "";
}

function parseLegacyPeriod(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { endDate: "", startDate: "" };
  }

  const [rawStart = "", rawEnd = ""] = trimmed.split(/\s+-\s+/).map((part) => part.trim());
  const startDate = parseLegacyDate(rawStart);

  if (!startDate) {
    return { endDate: "", startDate: "" };
  }

  if (!rawEnd || /(현재|진행 중|재직 중)/.test(rawEnd)) {
    return { endDate: "", startDate };
  }

  return {
    endDate: parseLegacyDate(rawEnd),
    startDate
  };
}

function toIsoDate(year: string, month: string, day: string) {
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function formatTotalExperienceLabel(
  items: ExperienceItem[],
  currentDate = new Date()
) {
  const coveredMonths = new Set<number>();
  const currentMonthIndex = currentDate.getFullYear() * 12 + currentDate.getMonth();

  items.forEach((item) => {
    const startMonthIndex = parseMonthIndex(item.startDate);

    if (startMonthIndex === null) {
      return;
    }

    const endMonthIndex = parseMonthIndex(item.endDate) ?? currentMonthIndex;

    if (endMonthIndex < startMonthIndex) {
      return;
    }

    for (let monthIndex = startMonthIndex; monthIndex <= endMonthIndex; monthIndex += 1) {
      coveredMonths.add(monthIndex);
    }
  });

  const totalMonths = coveredMonths.size;

  if (totalMonths === 0) {
    return "";
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return `총 ${years}년 ${months}개월`;
  }

  if (years > 0) {
    return `총 ${years}년`;
  }

  return `총 ${months}개월`;
}

function parseMonthIndex(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month] = value.split("-").map(Number);

  if (!year || !month) {
    return null;
  }

  return year * 12 + (month - 1);
}
