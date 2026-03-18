export type ContactInfo = {
  email: string;
  phone: string;
  website: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string;
};

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
};

export type ProjectItem = {
  name: string;
  period: string;
  link: string;
  description: string;
};

export type CertificationItem = {
  name: string;
  date: string;
  issuer: string;
};

export type PortfolioItem = {
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
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  portfolios: PortfolioItem[];
};

export const createExperience = (): ExperienceItem => ({
  company: "",
  role: "",
  period: "",
  description: "",
  highlights: ""
});

export const createEducation = (): EducationItem => ({
  school: "",
  degree: "",
  period: ""
});

export const createProject = (): ProjectItem => ({
  name: "",
  period: "",
  link: "",
  description: ""
});

export const createCertification = (): CertificationItem => ({
  name: "",
  date: "",
  issuer: ""
});

export const createPortfolio = (): PortfolioItem => ({
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
  experience: [createExperience()],
  education: [createEducation()],
  projects: [createProject()],
  certifications: [createCertification()],
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
  experience: [
    {
      company: "Sample Tech",
      role: "Frontend Developer",
      period: "2023.03 - 현재",
      description:
        "서비스 메인 화면과 운영 도구를 개발하며 제품 사용성과 유지보수성을 개선했습니다.",
      highlights:
        "Next.js App Router 기반 신규 페이지 구축\n공통 UI 패턴 정리로 개발 속도 향상\nA/B 테스트용 화면을 빠르게 제작해 전환율 실험 지원"
    }
  ],
  education: [
    {
      school: "OO University",
      degree: "Computer Science",
      period: "2018.03 - 2022.02"
    }
  ],
  projects: [
    {
      name: "Resume Studio",
      period: "2026",
      link: "https://example.com",
      description:
        "이력서 작성 내용을 실시간 미리보기로 확인하고 인쇄용 PDF로 저장할 수 있는 도구를 제작했습니다."
    }
  ],
  certifications: [
    {
      name: "정보처리기사",
      date: "2024.06",
      issuer: "한국산업인력공단"
    }
  ],
  portfolios: [
    {
      url: "https://portfolio.example.com"
    }
  ]
};

export const cloneResume = (resume: ResumeData): ResumeData =>
  normalizeResume(JSON.parse(JSON.stringify(resume)));

export const normalizeResume = (value: unknown): ResumeData => {
  const input = isRecord(value) ? value : {};
  const contact = isRecord(input.contact) ? input.contact : {};

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
    experience: normalizeList(input.experience, createExperience, normalizeExperience),
    education: normalizeList(input.education, createEducation, normalizeEducation),
    projects: normalizeList(input.projects, createProject, normalizeProject),
    certifications: normalizeList(
      input.certifications,
      createCertification,
      normalizeCertification
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

function normalizeExperience(value: unknown): ExperienceItem {
  const input = isRecord(value) ? value : {};

  return {
    company: readString(input.company),
    role: readString(input.role),
    period: readString(input.period),
    description: readString(input.description),
    highlights: readString(input.highlights)
  };
}

function normalizeEducation(value: unknown): EducationItem {
  const input = isRecord(value) ? value : {};

  return {
    school: readString(input.school),
    degree: readString(input.degree),
    period: readString(input.period)
  };
}

function normalizeProject(value: unknown): ProjectItem {
  const input = isRecord(value) ? value : {};

  return {
    name: readString(input.name),
    period: readString(input.period),
    link: readString(input.link),
    description: readString(input.description)
  };
}

function normalizeCertification(value: unknown): CertificationItem {
  const input = isRecord(value) ? value : {};

  return {
    name: readString(input.name),
    date: readString(input.date),
    issuer: readString(input.issuer)
  };
}

function normalizePortfolio(value: unknown): PortfolioItem {
  const input = isRecord(value) ? value : {};

  return {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
