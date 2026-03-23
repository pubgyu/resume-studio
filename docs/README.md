# Resume Room Docs

이 폴더는 Resume Room 서비스를 다른 에이전트가 빠르게 이해하고 이어서 작업할 수 있도록 정리한 문서 모음이다.

## 문서 목록

- `resume-room-design-set.md`
  - 기본 디자인 컨셉 `Paper Atelier`와 화면별 UI 기준을 정리한 v1 디자인 문서
- `resume-room-design-delta-v1.1.md`
  - v1 대비 변경점만 빠르게 확인하는 모바일/타이포 보정 문서
- `resume-room-design-tokens.json`
  - 컬러, 타이포, 간격, 반경, 모바일 UX 관련 토큰 모음
- `resume-room-service-overview.md`
  - 서비스 목적, 사용자 흐름, 핵심 기능, 현재 제품 범위를 정리한 개요 문서
- `resume-room-implementation-spec.md`
  - 현재 코드 기준 구조, 데이터 모델, 라우트, 저장 정책, API, 배포/설정 전제를 정리한 구현 명세서

## 빠른 시작

1. `resume-room-service-overview.md`를 먼저 읽고 서비스 의도를 이해한다.
2. UI 개편이나 모바일 대응 작업이면 `resume-room-design-set.md`와 `resume-room-design-delta-v1.1.md`, `resume-room-design-tokens.json`을 먼저 확인한다.
3. 실제 수정이 필요하면 `resume-room-implementation-spec.md`에서 관련 구조와 책임 범위를 확인한다.
4. 코드 수정 전에는 현재 엔트리 포인트와 저장 정책, Supabase 의존 여부를 먼저 확인한다.

## 현재 프로젝트 전제

- 프레임워크: Next.js 16 App Router
- UI: React 19, SCSS, shadcn 스타일의 자체 UI 컴포넌트
- 상태 관리: Jotai + React state
- 인증/DB: Supabase Auth(Google), Supabase Postgres
- 배포: Vercel
