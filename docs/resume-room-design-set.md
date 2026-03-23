# Resume Room Design Set v1.1

작성일: 2026-03-23 (KST)

v1 대비 변경점만 확인하려면 [`docs/resume-room-design-delta-v1.1.md`](/Users/kai/Desktop/ai/docs/resume-room-design-delta-v1.1.md)만 읽으면 된다.

## 1. 프로젝트 해석

코드 기준으로 `Resume Room`은 마케팅 랜딩보다 "개인 이력서 작업실"에 가까운 제품이다.

- [`app/page.tsx`](/Users/kai/Desktop/ai/app/page.tsx): 로그인 여부에 따라 즉시 작업 화면으로 이동한다.
- [`app/resumes/page.tsx`](/Users/kai/Desktop/ai/app/resumes/page.tsx): 저장된 이력서 목록을 보여주는 개인 스튜디오다.
- [`app/components/resume-builder/index.tsx`](/Users/kai/Desktop/ai/app/components/resume-builder/index.tsx): 자동 저장, PDF 내보내기, 불러오기, 복제까지 포함된 메인 편집기다.
- [`app/globals.scss`](/Users/kai/Desktop/ai/app/globals.scss): 현재 톤은 차분한 네이비 기반 워크스페이스이며, 에디터 좌측 + 미리보기 우측 구조가 이미 잡혀 있다.

따라서 새 디자인은 "예쁜 랜딩"보다 아래 3가지를 우선해야 한다.

1. 작업 집중감
2. 문서 제작 도구다운 신뢰감
3. 저장/편집/미리보기 상태가 명확한 운영감

## 2. 벤치마크 요약

확인 소스:

- [Linear](https://linear.app/)
- [Notion Product](https://www.notion.com/product)
- [Framer](https://www.framer.com/)
- [VisualCV](https://www.visualcv.com/)

핵심 해석:

| 소스 | 가져올 점 | 버릴 점 |
| --- | --- | --- |
| Linear | 밀도 높은 상단 제어부, 빠른 작업감, 차가운 정렬감 | 너무 차갑고 개발툴처럼 보이는 무드 |
| Notion | 패널 구조의 명확함, 카드형 정보 정리, 부담 없는 여백 | 지나치게 중립적인 인상 |
| Framer | 에디토리얼 타이포, 강한 첫인상, 과하지 않은 모션 | 마케팅성 큰 그라디언트를 작업 화면에 그대로 쓰는 것 |
| VisualCV | 이력서 제품다운 "템플릿/예시/다중 버전" 기대치 | 피처 홍보성 블록이 많은 구조 |

## 3. 채택 컨셉

컨셉 이름: `Paper Atelier`

한 줄 정의:
차분한 생산성 도구 위에 문서 편집 집중감을 얹은 "커리어 작업실".

키워드:

- warm modern
- precise workspace
- crafted paper
- quiet confidence

피해야 할 방향:

- 보라색 중심의 범용 SaaS 톤
- 과한 글래스모피즘
- 템플릿 쇼핑몰처럼 보이는 카드 나열
- 미리보기보다 UI 프레임이 더 강하게 보이는 구성

## 4. 비주얼 시스템

### 4.1 Color

기본 원칙:

- 앱 크롬은 따뜻한 스톤 계열
- 강조색은 코퍼/테라코타 계열
- 실제 이력서 종이는 밝은 아이보리 유지
- 다크 모드에서도 "종이" 느낌은 죽이지 않는다

주요 토큰은 [`docs/resume-room-design-tokens.json`](/Users/kai/Desktop/ai/docs/resume-room-design-tokens.json)에 정리했다.

### 4.2 Typography

폰트 조합:

- Primary UI / Heading / Body: `Noto Sans KR`
- Mono: 기본 시스템 모노

규칙:

- 한글은 전체를 `Noto Sans KR` 한 종류로 통일한다.
- 브랜드명 `Resume Room`, 페이지 타이틀, 이력서 이름도 serif를 쓰지 않는다.
- 에디토리얼 무드는 폰트 교체가 아니라 크기, 두께, 자간, 여백으로 만든다.
- 큰 제목은 자간을 약간 줄이고, 작은 라벨은 자간을 넓힌다.

타입 스케일:

- Hero title: `clamp(2.25rem, 4vw, 3.6rem)`
- Page title: `clamp(1.5rem, 2vw, 2.1rem)`
- Section title: `1rem`
- Body: `0.95rem`
- Meta: `0.78rem`
- Eyebrow: `0.72rem`

### 4.3 Shape

- 가장 큰 카드 반경: `28px`
- 기본 패널 반경: `22px`
- 입력창/버튼 반경: `16px`
- 작은 칩 반경: `999px`

모서리는 완전 둥글기보다 "종이 보관함" 같은 안정감을 우선한다.

### 4.4 Shadow

- 기본 패널: 짧고 넓은 그림자
- 강조 카드: 위로 뜨는 그림자보다 아래로 눌린 듯한 깊이
- 미리보기 종이: 가장 강한 그림자 허용

### 4.5 Motion

- 기본 인터랙션: `160ms`
- 패널 진입: `220ms`
- 페이지 첫 로드 스태거: `260ms`
- 이징: `cubic-bezier(0.22, 1, 0.36, 1)`

모션 규칙:

- hover는 `translateY(-1px)` 수준까지만
- 색 변화보다 광택 변화가 먼저 보이게
- 편집 화면에서는 시선 분산을 막기 위해 반복 애니메이션 최소화

## 5. 화면별 디자인 명세

### 5.1 Login

목표:
단순 로그인 화면이 아니라 "문서 작업실 입구"처럼 보여야 한다.

데스크톱 구조:

```text
+---------------------------------------------------------------+
| brand / promise / proof chips         | auth card            |
| strong sans hero                      | Google CTA           |
| 2-line explanation                    | privacy note         |
| 3 value chips                         | theme toggle         |
+---------------------------------------------------------------+
```

규칙:

- 현재의 중앙 카드 구조를 유지해도 되지만, 내부는 좌우 비대칭으로 바꾼다.
- 배경은 기존 canvas 계열을 유지하되, 종이 결 느낌의 라인 패턴을 아주 약하게 추가한다.
- `Resume Room` 브랜드와 CTA 모두 `Noto Sans KR`로 통일한다.
- 타이틀은 폰트 변경이 아니라 `700~800` 두께와 넓은 행간으로 존재감을 만든다.
- 구글 버튼 아래에는 "저장된 이력서 이어쓰기 / PDF 내보내기 / 다중 버전 관리" 보조 문구를 둔다.

### 5.2 Resume List

목표:
"파일 카드 모음"이 아니라 "작업 중인 문서 서랍장"처럼 보여야 한다.

규칙:

- 카드 그리드는 데스크톱 기준 `5열` 대신 `4열`이 적절하다.
- 각 카드는 정사각형보다 세로로 약간 긴 문서 비율이 낫다.
- 카드 상단 65~70%는 종이 썸네일 영역으로 사용한다.
- 카드 하단에는 제목, 마지막 저장 시각, 템플릿 라벨을 둔다.
- 액션 버튼은 항상 드러내지 말고 hover 또는 focus에서 강조한다.

카드 시각 규칙:

- 썸네일 영역 배경은 실제 미리보기 종이와 유사한 아이보리 톤
- 카드 상단에 얇은 상태 라인 추가
- hover 시 카드 전체가 뜨기보다 종이 썸네일의 대비가 먼저 올라오게

### 5.3 Editor Workspace

목표:
왼쪽은 조용한 제어 레일, 오른쪽은 실제 결과물을 보는 스테이지.

레이아웃:

```text
+------------------------+--------------------------------------+
| editor rail            | preview stage                        |
| accordion sections     | sticky status note                   |
| field groups           | large paper frame                    |
| repeatable cards       | generous outer margin                |
+------------------------+--------------------------------------+
```

규칙:

- `studio-grid`는 현재 구조를 유지하되 왼쪽 폭을 `380~430px` 범위로 고정한다.
- 에디터 패널은 밝은 패널 위에 낮은 대비를 쓰고, 미리보기 쪽은 여백을 더 크게 둔다.
- 저장 상태는 툴바 버튼 텍스트만 바꾸지 말고, 작은 상태 필 또는 점으로 보강한다.
- 섹션 아코디언은 "설정 카드"가 아니라 "문단 묶음"처럼 보여야 한다.
- 섹션 숨김 상태는 회색화보다 작은 칩과 헤어라인으로 표시한다.

### 5.4 Mobile UX

목표:
모바일은 데스크톱 레이아웃 축소판이 아니라 "한 손 편집" 중심의 별도 UX로 본다.

핵심 판단:

- 현재 코드 기준으로 모바일에서는 패널이 세로로 쌓이고 툴바가 wrap된다.
- 깨지지는 않지만, 편집과 미리보기를 한 화면에서 모두 보려다 스크롤 부담이 커진다.
- 모바일 사용자는 "빠른 수정", "저장 상태 확인", "PDF 확인"이 우선이다.

모바일 기본 원칙:

- 편집기와 미리보기는 동시 노출보다 `편집 / 미리보기` 전환이 낫다.
- 주요 액션은 상단이 아니라 하단 thumb zone에 둔다.
- 터치 타깃은 최소 `48px`, 주요 CTA는 `52~56px`를 권장한다.
- 좌우 패딩은 최소 `16px`, section 간격은 `12~16px`로 압축한다.

모바일 편집기 규칙:

- 상단에는 문서명과 저장 상태만 남기고, 부가 액션은 overflow 메뉴로 보낸다.
- `저장`, `미리보기 전환`, `PDF` 중 자주 쓰는 2개만 하단 sticky bar에 둔다.
- 하단 바는 safe area를 포함해 고정하고, 배경은 반투명보다 불투명 패널에 가깝게 처리한다.
- 아코디언은 기본적으로 모두 접고, 마지막 편집 섹션 또는 오류가 있는 섹션만 우선 열어 준다.
- 반복 섹션 카드의 삭제/복제/숨김은 아이콘만 나열하지 말고 overflow 또는 swipe 없이 명시 버튼으로 둔다.

모바일 미리보기 규칙:

- 미리보기는 전체 A4 축소본을 고집하지 말고, 가독성 우선 축소 비율을 사용한다.
- 확대가 필요한 경우 pinch보다 `확대 보기` 진입 액션을 별도로 두는 편이 낫다.
- 미리보기 상단에는 현재 템플릿 이름과 마지막 저장 상태만 간단히 노출한다.

모바일 목록 규칙:

- 목록은 1열 유지가 맞다.
- 모바일 카드만큼은 정사각형 카드 대신 `좌측 문서 썸네일 + 우측 정보`의 가로형 카드가 더 낫다.
- `새 이력서` CTA는 상단 밀집 툴바보다 하단 sticky CTA 또는 눈에 잘 띄는 단일 버튼이 낫다.

모바일 로그인 규칙:

- 첫 화면 안에 타이틀, 핵심 설명, 로그인 버튼이 모두 보여야 한다.
- 장식 요소보다 CTA 가시성을 우선한다.
- 배경 효과는 유지하되 대비를 낮춰 텍스트 판독성을 먼저 보장한다.

### 5.5 Resume Paper

목표:
앱보다 결과물 자체가 더 고급스러워 보이게 한다.

규칙:

- 종이색은 완전 흰색보다 아이보리 계열
- 제목 계층은 지금보다 더 선명하게 분리
- 포인트 컬러는 코퍼 계열을 아주 제한적으로만 사용
- 구분선은 회색 선보다 투명한 잉크선 느낌으로 처리

추천 사용 위치:

- 이름 하단의 얇은 포인트 라인
- 소제목의 좌측 짧은 바
- 링크 hover 또는 강조 태그

## 6. 컴포넌트 규칙

### 6.1 Topbar

- 왼쪽은 브랜드와 문맥, 오른쪽은 조작
- 버튼이 많아도 한 줄 정렬이 아니라 2개의 클러스터처럼 보여야 한다
- topbar 자체는 glass보다 matte panel이 맞다
- 모바일에서는 topbar를 유지하기보다 요약 헤더 + 하단 액션 바로 분리한다

### 6.2 Button

- Primary는 코퍼 배경 + 밝은 텍스트
- Ghost는 종이색에 가까운 matte fill
- Link 스타일은 선명한 색보다 깊은 잉크색에 가까워야 한다
- hover 시 lift보다 border/shine 변화를 먼저 준다
- 모바일 primary 버튼 높이는 `52px` 이상을 권장한다

### 6.3 Input

- 입력창은 지금보다 조금 더 두껍고 덜 차가워야 한다
- focus ring은 1중 border + 1중 soft outer glow
- textarea는 문서 입력답게 line-height를 넉넉히 둔다
- 모바일 입력창은 키보드 진입을 고려해 상하 패딩을 줄이지 않는다

### 6.4 Accordion Card

- 카드 사이 간격은 늘리고 카드 내부는 더 단단하게
- 제목/설명/상태 칩의 위계를 더 명확히
- open 상태에서만 설명이 충분히 보이게
- 모바일에서는 한 번에 하나만 열리게 해도 좋다

### 6.5 Resume Card

- 카드 안에 작은 문서 미리보기 구조를 넣는다
- 제목보다 "이 문서가 어떤 상태인지"가 먼저 읽혀야 한다
- 삭제 액션은 항상 붉게 두되, 시각적 우선순위는 가장 낮게 둔다
- 모바일 카드 액션은 카드 하단 분산 버튼보다 우측 상단 overflow가 더 적합하다

## 7. 톤 앤 매너

카피 원칙:

- 과장하지 않는다
- 도움말은 짧고 운영 친화적으로 쓴다
- "빠르게", "쉽게"보다 "이어쓰기", "저장", "내보내기" 같은 작업 동사를 쓴다

추천 어휘:

- 작업실
- 저장됨
- 최근 수정
- 초안
- 내보내기
- 버전

## 8. 구현 우선순위

### Phase 1

- 전역 색상 토큰 교체
- `Noto Sans KR` 단일 폰트 기준 정리
- 버튼/패널/입력창 공통 스타일 정리
- 모바일 터치 타깃과 safe-area 규칙 반영

### Phase 2

- 로그인 화면 재구성
- 이력서 카드 문서형 썸네일 적용
- 상단 topbar 밀도 조정
- 모바일 목록 카드와 CTA 배치 재설계

### Phase 3

- 에디터 아코디언 밀도 개선
- 저장 상태 배지 도입
- 미리보기 스테이지 여백 및 종이 프레임 조정
- 모바일 `편집 / 미리보기` 전환 UX 도입

### Phase 4

- 다크 모드 디테일 조정
- 페이지 진입 스태거와 hover polish
- PDF 미리보기와 실제 인쇄 결과의 시각 차이 보정

## 9. 파일 매핑

- [`app/layout.tsx`](/Users/kai/Desktop/ai/app/layout.tsx): `Noto Sans KR` 단일 폰트 유지, display 용 별도 serif 추가하지 않음
- [`app/globals.scss`](/Users/kai/Desktop/ai/app/globals.scss): 루트 토큰, 배경, topbar, grid, panel, editor, preview, responsive 전부 반영
- [`app/login/page.tsx`](/Users/kai/Desktop/ai/app/login/page.tsx): 로그인 스테이지 레이아웃과 보조 카피 보강
- [`app/resumes/page.tsx`](/Users/kai/Desktop/ai/app/resumes/page.tsx): 헤더 정보 구조 정리
- [`app/components/resumes/resume-list-card.tsx`](/Users/kai/Desktop/ai/app/components/resumes/resume-list-card.tsx): 문서형 카드 구조 확장
- [`app/components/resume-builder/toolbar/resume-toolbar.tsx`](/Users/kai/Desktop/ai/app/components/resume-builder/toolbar/resume-toolbar.tsx): 상태 배지와 버튼 클러스터 정리
- [`app/components/ui/button.module.scss`](/Users/kai/Desktop/ai/app/components/ui/button.module.scss): 버튼 형태와 상호작용 업데이트
- [`app/components/resume-builder/index.tsx`](/Users/kai/Desktop/ai/app/components/resume-builder/index.tsx): 모바일에서 `편집 / 미리보기` 전환 상태를 둘 경우 진입 지점
- [`app/components/resume-builder/preview/resume-preview.tsx`](/Users/kai/Desktop/ai/app/components/resume-builder/preview/resume-preview.tsx): 모바일 축소 미리보기 및 확대 보기 진입 UX 검토

## 10. 구현 에이전트 전달 문장

다음 에이전트는 `Paper Atelier` 컨셉을 유지하되, 한글 폰트는 `Noto Sans KR` 하나로 통일하고 모바일을 데스크톱 축소판이 아니라 별도 UX로 구현하면 된다. 이전 명세를 이미 읽었다면 [`docs/resume-room-design-delta-v1.1.md`](/Users/kai/Desktop/ai/docs/resume-room-design-delta-v1.1.md)와 갱신된 [`docs/resume-room-design-tokens.json`](/Users/kai/Desktop/ai/docs/resume-room-design-tokens.json)만 읽고 진행하면 된다.
