# Resume Room Docs

이 폴더는 Resume Room 서비스를 다른 에이전트가 빠르게 이해하고 이어서 작업할 수 있도록 정리한 문서 모음이다.

## 문서 목록

- `raycast-strict-benchmark-v4.md`
  - 현재 로그인/목록/편집기 UI를 구성하는 Raycast strict 벤치마크 문서
- `raycast-strict-workspace-spec-v3.md`
  - 현재 워크스페이스 구조와 화면별 배치 기준을 정리한 최신 UI 정본
- `raycast-strict-ui-tokens-v3.json`
  - 현재 strict UI 색, 간격, surface budget 토큰 모음
- `mockups/raycast-strict-rough-v3.svg`
  - 최신 strict rough layout 기준 시각 자료
- `resume-room-service-overview.md`
  - 서비스 목적, 사용자 흐름, 핵심 기능, 현재 제품 범위를 정리한 개요 문서
- `resume-room-implementation-spec.md`
  - 현재 코드 기준 구조, 데이터 모델, 라우트, 저장 정책, API, 배포/설정 전제를 정리한 구현 명세서

## 빠른 시작

1. `resume-room-service-overview.md`를 먼저 읽고 서비스 의도를 이해한다.
2. UI 개편이나 모바일 대응 작업이면 `raycast-strict-benchmark-v4.md`, `raycast-strict-workspace-spec-v3.md`, `raycast-strict-ui-tokens-v3.json`, `mockups/raycast-strict-rough-v3.svg`를 먼저 확인한다.
3. 실제 수정이 필요하면 `resume-room-implementation-spec.md`에서 관련 구조와 책임 범위를 확인한다.
4. 코드 수정 전에는 현재 엔트리 포인트와 저장 정책, Supabase 의존 여부를 먼저 확인한다.

## 현재 프로젝트 전제

- 프레임워크: Next.js 16 App Router
- UI: React 19, SCSS, shadcn 스타일의 자체 UI 컴포넌트
- 상태 관리: Jotai + React state
- 인증/DB: Supabase Auth(Google), Supabase Postgres
- 배포: Vercel
