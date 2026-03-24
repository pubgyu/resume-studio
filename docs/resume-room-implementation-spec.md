# Resume Room 구현 명세서

이 문서는 현재 저장된 코드 기준의 구현 구조를 정리한 명세서다. 새로운 에이전트는 이 문서를 읽고 현재 책임 분리와 데이터 흐름을 이해한 뒤 작업해야 한다.

## 1. 기술 스택

코드 기준 확인 파일:

- `package.json`
- `next.config.ts`
- `tsconfig.json`

현재 스택은 아래와 같다.

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- SCSS
- Jotai
- dnd-kit
- Supabase SSR / Supabase JS
- React PDF Renderer
- Three.js
- Vercel

타이포 기준:

- `app/layout.tsx`
  - `Noto Sans KR`를 body/display 모두에 사용
  - display 변수는 유지하지만 serif가 아니라 sans 단일 기준으로 연결됨

## 2. 루트 구조

현재 실제 주요 디렉터리:

- `app/`
  - 라우트, API, 화면 엔트리, 컴포넌트
- `lib/`
  - 도메인 로직, 데이터 모델, 유틸, Supabase helper
- `public/`
  - 폰트, OG 이미지 등 정적 자산
- `supabase/`
  - SQL 스키마
- `docs/`
  - 프로젝트 문서

현재 디자인 기준 문서:

- `docs/raycast-strict-benchmark-v4.md`
- `docs/raycast-strict-workspace-spec-v3.md`
- `docs/raycast-strict-ui-tokens-v3.json`
- `docs/mockups/raycast-strict-rough-v3.svg`

## 3. 주요 라우트

### 3.1 페이지 라우트

- `/`
  - 로그인 여부와 저장 이력서 유무를 확인한 뒤 적절한 페이지로 redirect
- `/login`
  - Google 로그인 페이지
- `/resumes`
  - 저장된 이력서 목록
- `/resumes/new`
  - 신규 이력서 편집 시작
- `/resumes/[resumeId]`
  - 기존 이력서 편집

### 3.2 인증 콜백

- `/auth/callback`
  - Supabase OAuth code를 세션으로 교환하고, 현재 origin 기준으로 next 경로로 redirect

### 3.3 API 라우트

- `POST /api/resumes`
  - 신규 이력서 생성
- `PUT /api/resumes/[resumeId]`
  - 기존 이력서 저장
- `DELETE /api/resumes/[resumeId]`
  - 기존 이력서 삭제
- `POST /api/resumes/[resumeId]/duplicate`
  - 기존 이력서 복제
- `POST /api/spellcheck`
  - 맞춤법 검사

## 4. 인증 및 세션 구조

### 4.1 인증 제공자

- Supabase Auth
- 소셜 로그인 제공자: Google

### 4.2 인증 동작

- 클라이언트 로그인 시작은 `app/components/auth/google-sign-in-button.tsx`
- `redirectTo`는 `window.location.origin` 기반으로 생성
- 콜백 처리 후 `request.url`의 origin 기준으로 앱 내부 경로에 복귀

### 4.3 주의사항

- 로컬 개발과 운영 도메인을 모두 쓰려면 Supabase Redirect URLs에 둘 다 허용해야 한다.
- `redirectTo`에 쿼리 문자열이 붙으므로 exact path보다 wildcard 허용이 안전하다.

권장 예시:

- `http://localhost:3000/**`
- `http://127.0.0.1:3000/**`
- `https://resume-studio-navy.vercel.app/**`

## 5. 데이터 모델

### 5.1 핵심 문서 모델

핵심 타입 파일:

- `lib/resume-template.ts`
- `lib/resumes/types.ts`
- `lib/resumes/utils.ts`

현재 저장 단위는 `ResumeDraftDocument`이다.

```ts
type ResumeDraftDocument = {
  presentation: ResumePresentation;
  resume: ResumeData;
  resumeName: string;
};
```

### 5.2 문서 표시 관련 모델

```ts
type ResumePresentation = {
  sectionOrder: ResumeSectionOrderKey[];
  sectionVisibility: Record<ResumeVisibilityKey, boolean>;
  templateId: "default" | "compact" | "split";
};
```

역할:

- `templateId`
  - 문서 레이아웃 선택
- `sectionVisibility`
  - 문서 섹션 단위 숨김/표시
- `sectionOrder`
  - 섹션 순서

현재 `sectionVisibility`는 아래 수준까지 세분화되어 있다.

- `basic`
- `summary`
- `photo`
- `contact`
- `strengths`
- `skills`
- `totalExperience`
- `experience`
- `education`
- `projects`
- `certifications`
- `languageStudies`
- `salary`
- `portfolios`

주의:

- 예전 저장 데이터의 `basic`, `skills`, `experience` 묶음 visibility는 로드 시 새 키로 자동 매핑된다.
- 현재 직렬화 버전은 `version: 4`다.

### 5.3 ResumeData

`ResumeData`는 실제 문서 내용을 가진다.

주요 필드:

- `name`
- `title`
- `photo`
- `summary`
- `contact`
- `strengths`
- `skills`
- `salary`
- `experience[]`
- `education[]`
- `projects[]`
- `certifications[]`
- `languageStudies[]`
- `portfolios[]`

### 5.4 반복 항목 메타

반복 항목은 공통적으로 아래 메타를 가진다.

```ts
type ResumeItemMeta = {
  id: string;
  visible: boolean;
};
```

역할:

- `id`
  - 안정적인 렌더링, 토글, 순회 처리 기준
- `visible`
  - 항목 단위 숨김/표시

## 6. DB 설계

스키마 파일:

- `supabase/resumes.sql`

현재 테이블:

```sql
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_name text not null,
  resume_json text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 6.1 저장 방식

- `resume_name`
  - 목록, 편집기 상단, PDF 파일명용 메타
- `resume_json`
  - `ResumeDraftDocument`를 직렬화한 JSON string

### 6.2 보안

- RLS 활성화
- 본인 `user_id`에 해당하는 행만 조회/수정/삭제 가능

## 7. 편집기 구조

핵심 컴포넌트:

- `app/components/resume-builder/index.tsx`
- `app/components/resume-builder/editor/editor-panel.tsx`
- `app/components/resume-builder/preview/resume-preview.tsx`
- `app/components/resume-builder/pdf/resume-pdf-document.tsx`
- `app/components/resume-builder/toolbar/resume-toolbar.tsx`

### 7.1 책임 분리

- `ResumeBuilder`
  - 편집기 전체 상태와 저장 흐름 오케스트레이션
- `EditorPanel`
  - 좌측 입력 패널
- `ResumePreview`
  - 우측 HTML 문서 미리보기
- `ResumePdfDocument`
  - PDF 렌더링 전용 문서
- `ResumeToolbar`
  - 저장/PDF/import/export/메뉴 액션
- `ResumeListWorkspace`
  - row 기반 목록, 선택 문서, 목록 액션 오케스트레이션
- `ResumePdfPreview`
  - 목록 우측 PDF viewer 미리보기 생성 및 표시

### 7.2 편집기 동작 원칙

- 좌측 입력 변경 시 우측 미리보기 즉시 반영
- `useDeferredValue`로 미리보기 부하를 분산
- draft는 localStorage에 debounce 저장
- DB는 저장 버튼 또는 자동 저장 조건으로 반영
- 문서 순서 드래그는 `dnd-kit` 기반으로 동작한다.
- 모바일에서는 전체 row가 아니라 grip handle 기준으로 드래그를 시작한다.

모바일 추가 동작:

- `720px` 이하에서는 편집기와 미리보기를 동시에 세로 적층하지 않는다.
- `ResumeBuilder` 내부 상태로 `edit / preview` 전환을 관리한다.
- 하단 sticky action bar에서 `저장`과 `편집/미리보기 전환`을 제공한다.
- 상단 툴바는 모바일에서 utility/overflow 성격만 유지하고 저장/PDF는 하단 액션으로 우선 제공한다.

## 8. 저장 정책

### 8.1 local draft

관련 유틸:

- `lib/resume-builder/utils.ts`
- `lib/resume-builder/constants.ts`

정책:

- 편집 중 브라우저 draft 유지
- 새로고침/일시 이탈에도 현재 편집본 유지
- 다른 이력서로 이동하거나 목록으로 나갈 때 draft 정리

### 8.2 DB 저장

관련 구현:

- `app/components/resume-builder/index.tsx`
- `app/api/resumes/route.ts`
- `app/api/resumes/[resumeId]/route.ts`

정책:

- 신규 이력서: 수동 저장 시 DB row 생성
- 기존 이력서: 수동 저장 가능
- 기존 이력서: idle 시간 이후 자동 저장 가능

현재 기준:

- draft debounce 저장: 상수 기반
- DB autosave idle: `10000ms`

### 8.3 이탈 경고

동작:

- `beforeunload` 경고
- 브라우저 뒤로 가기/앱 내부 이동 전 confirm

## 9. 템플릿/표시 제어 명세

### 9.1 템플릿

현재 지원:

- `default`
- `compact`
- `split`

원칙:

- 데이터는 동일
- HTML 미리보기와 PDF에서 같은 `templateId`를 사용
- 레이아웃만 바뀌고 문서 내용은 유지
- 모바일 미리보기에서는 A4 축소본 고정보다 가독성 우선 배율을 사용

### 9.2 섹션 표시 제어

- 섹션 단위 숨김/표시 가능
- 항목 단위 숨김/표시 가능
- 섹션 순서 드래그 변경 가능
- `summary`, `strengths`, `totalExperience`도 별도 visibility key로 독립 제어된다

### 9.3 자동 계산

- 총 경력은 `experience` 기반으로 계산되어 표시된다.
- 날짜 기반 기간은 `startDate`, `endDate` 입력 시 `period` 문자열로 동기화된다.

## 10. PDF 및 데이터 이동

### 10.1 PDF

관련 파일:

- `app/components/resume-builder/pdf/resume-pdf-document.tsx`
- `app/components/resumes/resume-pdf-preview.tsx`

원칙:

- HTML 캡처가 아니라 React PDF 기반 텍스트 문서
- 템플릿 상태 반영
- 링크 포함
- 파일명은 `resumeName` 기준
- 목록 페이지 우측 선택 미리보기는 PDF blob + iframe viewer 기준으로 노출된다

### 10.2 데이터 import/export

- 편집기 overflow 메뉴에서 `이력서 data import/export`를 수행한다.
- import 시 현재 draft 문서를 교체하며, export는 현재 문서 스냅샷을 JSON으로 저장한다.

관련 구현:

- `handleImportJson`
- `handleExportJson`

정책:

- 확장자는 `.json`
- `presentation`, `resume`, `resumeName`, `version` 포함
- import 시 현재 편집기 상태를 새 문서 구조로 덮어쓴다.

## 11. 맞춤법 검사

관련 파일:

- `app/api/spellcheck/route.ts`
- `lib/resume-builder/daum-spellcheck.ts`
- `lib/resume-builder/spellcheck.ts`

구조:

- 클라이언트 입력 필드에서 debounce
- 서버 API로 텍스트 전달
- 외부 검사기 결과를 정규화해 제안 표시

주의:

- 현재 provider는 Daum 기반
- 실패 시 `502 spellcheck-failed`
- 반복 필드 동시 검사와 중복 요청을 고려한 큐/중복 방지 로직이 적용되어 있다

## 12. SEO / OG / 정적 자산

관련 파일:

- `app/layout.tsx`
- `app/login/page.tsx`
- `app/opengraph-image.tsx`
- `public/og/resume-room-og.png`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/manifest.ts`

정책:

- 공개 진입은 `/login`
- 비공개 페이지는 noindex
- 카카오/메신저 호환성을 위해 정적 PNG OG 이미지 사용

## 13. 환경 변수

현재 코드가 직접 요구하는 공개 변수:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

근거:

- `lib/supabase/env.ts`

참고:

- 현재 저장소 루트에는 `.env.example` 파일이 없다.
- 환경 변수 문서는 필요 시 별도 추가하는 것이 좋다.

## 14. 에이전트 작업 가이드

새 에이전트는 아래 순서로 작업하는 것이 안전하다.

1. `app/page.tsx`, `app/login/page.tsx`, `app/resumes/page.tsx`, `app/resumes/new/page.tsx`, `app/resumes/[resumeId]/page.tsx`로 사용자 흐름을 이해한다.
2. `lib/resume-template.ts`, `lib/resumes/types.ts`, `lib/resumes/utils.ts`로 데이터 모델을 이해한다.
3. `app/components/resume-builder/index.tsx`, `app/components/resume-builder/editor/editor-panel.tsx`에서 저장 정책과 편집기 상태 흐름, section order/visibility 동작을 확인한다.
4. 수정 범위가 저장/인증/API에 걸치면 `app/api/resumes/*`, `lib/resumes/server.ts`, `lib/supabase/*`, `supabase/resumes.sql`을 함께 본다.
5. 목록 화면 수정이면 `app/components/resumes/resume-list-workspace.tsx`, `app/components/resumes/resume-pdf-preview.tsx`를 같이 본다.

## 15. 변경 시 주의사항

- `resume_json` 포맷을 바꾸면 `normalizeResumeDocument`, `serializeResumeDocument`와 기존 저장 데이터 호환성을 같이 고려해야 한다.
- 템플릿 관련 수정은 HTML 미리보기와 PDF 구현을 동시에 확인해야 한다.
- 로그인/redirect 수정은 Supabase Redirect URLs 설정까지 같이 봐야 한다.
- 메뉴/문구만 바꾸는 작업이어도 저장 상태, PDF 파일명, SEO 설명처럼 노출 지점이 여러 곳일 수 있다.
