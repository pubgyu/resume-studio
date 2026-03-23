# Resume Room Design Delta v1.1

이 문서는 `v1`을 이미 읽은 구현 에이전트를 위한 변경점 전용 문서다.

- 이전 문서를 이미 읽었다면 이 파일과 [`docs/resume-room-design-tokens.json`](/Users/kai/Desktop/ai/docs/resume-room-design-tokens.json)만 다시 보면 된다.
- 전체 정본이 필요하면 [`docs/resume-room-design-set.md`](/Users/kai/Desktop/ai/docs/resume-room-design-set.md)를 본다.

## 1. 이번 변경의 핵심

1. 한글 폰트는 `Noto Sans KR` 하나로 통일한다.
2. 모바일은 보조 대응이 아니라 별도 UX 대상으로 설계한다.
3. 모바일 편집기에서는 `편집 / 미리보기` 전환 UX를 우선 검토한다.

## 2. 타이포 변경

이전:

- `Noto Serif KR` + `Noto Sans KR` 조합

변경:

- `Noto Sans KR` 단일 사용
- 브랜드, 히어로, 이력서 이름, 섹션 타이틀까지 모두 sans
- 에디토리얼 인상은 serif가 아니라 `700~800` 두께, 좁은 자간, 큰 여백으로 해결

구현 메모:

- [`app/layout.tsx`](/Users/kai/Desktop/ai/app/layout.tsx)는 serif 추가 없이 현재 sans 기반을 유지하는 방향이 맞다.
- `var(--font-display)`를 유지하더라도 실제 폰트는 `Noto Sans KR`로 연결하면 된다.

## 3. 모바일 UX 변경

### 목록

- 모바일 목록은 1열 유지
- 카드 형태는 정사각형보다 `가로형 문서 카드` 우선
- `새 이력서`는 상단 도구군보다 눈에 띄는 단일 CTA로 처리

### 편집기

- 상단에 모든 버튼을 유지하지 않는다
- 자주 쓰는 액션 2개만 하단 sticky action bar에 둔다
- 권장 조합: `저장` + `미리보기`
- `PDF`, `가져오기`, `내보내기`, `삭제` 등은 overflow 메뉴로 이동
- 편집기와 미리보기를 긴 한 페이지에 모두 쌓지 말고 전환형 UX를 우선 검토

### 미리보기

- 모바일에서 A4 축소본 고집 금지
- 가독성 우선 배율 사용
- 필요시 별도 `확대 보기` 액션 제공

### 로그인

- 첫 화면 안에 설명 + 로그인 CTA가 모두 들어오게 유지
- 배경 효과는 텍스트 판독성보다 우선하지 않는다

## 4. 변경된 토큰만 빠르게 보기

- `meta.version`: `1.1.0`
- `fonts.display.family`: `Noto Sans KR`
- `fonts.display.weights`: `[700, 800]`
- `breakpoints`: 신규 추가
- `components.buttonHeightMobile`: `52px`
- `components.inputMinHeightMobile`: `48px`
- `components.touchTargetMin`: `48px`
- `components.mobilePageGutter`: `16px`
- `components.mobileSectionGap`: `14px`
- `components.mobileBottomBarHeight`: `64px`
- `components.resumeCardThumbnailRatioMobile`: `0.32`
- `components.safeAreaBottom`: `env(safe-area-inset-bottom, 0px)`

## 5. 구현 우선순위 변경

1. 폰트 정책을 `Noto Sans KR` 단일 기준으로 정리
2. 모바일 하단 액션 바와 safe-area 규칙 반영
3. 모바일 편집/미리보기 전환 UX 반영
4. 모바일 목록 카드와 CTA 배치 수정
5. 이후 데스크톱 polish 진행
