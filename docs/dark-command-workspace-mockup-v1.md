# Dark Command Workspace Mockup v1

Deprecated: 이 문서는 더 이상 최신 기준이 아니다. [`docs/raycast-command-shell-mockup-v1.md`](/Users/kai/Desktop/ai/docs/raycast-command-shell-mockup-v1.md)를 사용한다.

작성일: 2026-03-24 (KST)

이 문서는 `Resume Room`의 새 정본 디자인 방향이다.
이전 `Warm Glass` 문서는 더 이상 기준으로 쓰지 않는다.

읽어야 할 파일:

- [`docs/dark-command-workspace-mockup-v1.md`](/Users/kai/Desktop/ai/docs/dark-command-workspace-mockup-v1.md)
- [`docs/dark-command-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/dark-command-ui-token-delta-v1.md)
- [`docs/dark-command-ui-tokens.json`](/Users/kai/Desktop/ai/docs/dark-command-ui-tokens.json)
- 러프 보드: [`docs/mockups/dark-command-rough-board.svg`](/Users/kai/Desktop/ai/docs/mockups/dark-command-rough-board.svg)

## 1. 왜 방향을 바꾸는가

이전 결과의 문제는 스타일 부족이 아니라 `표면이 너무 많고 위계가 약한 것`이다.

- 브라운 계열이 강해서 Raycast보다 따뜻한 랜딩처럼 보인다.
- 설명 카드와 보조 UI가 너무 많아서 메인 행동이 흐려진다.
- 로그인과 목록 화면이 "설명" 중심이지 "열기/작성" 중심이 아니다.
- 모바일은 데스크톱을 세로로 쌓은 인상이라 빠른 작업 도구처럼 보이지 않는다.

이번 방향은 `더 적은 UI, 더 어두운 베이스, 더 빠른 위계`다.

## 2. 북극성

한 줄:

`Raycast식 빠른 액션 위계 + Linear식 정리감 + Arc식 깊이감`

키워드:

- dark slate
- command first
- quiet glow
- fewer surfaces
- floating paper
- fast hierarchy

가져올 레퍼런스:

- [Raycast](https://www.raycast.com/)
- [Raycast iOS](https://www.raycast.com/ios)
- [Linear](https://linear.app/)
- [Arc](https://arc.net/)

## 3. 가장 중요한 설계 원칙

### 3.1 설명보다 행동

- 로그인 화면에서 feature 카드 3개 금지
- 목록 화면에서 우측 정보 rail 금지
- 로그인 이후에는 마케팅 카피를 길게 두지 않는다

### 3.2 큰 덩어리부터 위계화

- 헤더
- 최근 작업 또는 현재 문서
- 문서 카드 목록 또는 편집 영역

이 3단만 먼저 보이고, 나머지는 나중에 보여야 한다.

### 3.3 표면 수 제한

- 한 화면에서 강하게 읽히는 surface는 최대 3종
- glass는 topbar / bottom dock 정도로 제한
- 일반 카드와 보조 카드의 시각 강도를 같게 두지 않는다

### 3.4 Raycast 느낌의 핵심

Raycast 느낌은 색이 아니라 아래에서 온다.

- 빠르게 이해되는 상단 액션 구조
- 큰 핵심 행동 1개
- 짧은 메타
- 적은 장식
- 다크 바탕 위 선명한 밝은 카드

## 4. 화면별 러프 확정안

### Frame 1. PC Login

목표:
로그인 페이지가 아니라 "작업실 진입"처럼 보여야 한다.

레이아웃:

```text
+--------------------------------------------------------------+
| compact topbar                                               |
| logo                                              theme      |
+--------------------------------------------------------------+
| left: short hero + 3 chips          right: login card        |
| left: faint paper preview behind    right: single CTA        |
+--------------------------------------------------------------+
```

규칙:

- 히어로 문장은 2줄 이내
- 설명은 1문장만
- 보조 칩은 3개 이하
- 종이 preview는 장식이 아니라 제품 정체성 표현용
- 로그인 카드 외 추가 설명 카드 금지

### Frame 2. PC List

목표:
파일 브라우저가 아니라 "최근 작업부터 바로 여는 대시보드"

레이아웃:

```text
+--------------------------------------------------------------+
| compact glass topbar                                         |
| logo | quick action/search | new resume | small actions      |
+--------------------------------------------------------------+
| recent work spotlight                                        |
+--------------------------------------------------------------+
| 2-column document grid                                       |
+--------------------------------------------------------------+
```

규칙:

- `최근 작업` 카드 1개만 크게
- 문서 목록은 2열 큰 카드
- 우측 보조 설명 카드 금지
- 최근 작업 아래 바로 문서 목록이 온다
- 상단 액션은 최대 `새 이력서`, `로그아웃`, `테마` 정도만 허용

### Frame 3. PC Editor

목표:
왼쪽은 조용한 명령 레일, 오른쪽은 결과물 스테이지

레이아웃:

```text
+--------------------------------------------------------------+
| compact glass topbar                                         |
| title | save pill | template | save/pdf/menu                |
+---------------------------+----------------------------------+
| command rail              | preview stage                    |
| section list              | paper first                      |
| matte cards               | faint cool glow behind paper     |
+---------------------------+----------------------------------+
```

규칙:

- topbar에 모든 액션을 올리지 않는다
- rail 안 카드 수가 많아 보여도 하나의 column처럼 읽혀야 한다
- 미리보기 프레임보다 종이가 먼저 보이게 한다
- 상태 정보는 `저장됨`, `수정 중` pill 정도만
- 편집기 화면에는 설명 텍스트 거의 금지

### Frame 4. Mobile Login

목표:
한 화면 안에서 의미와 행동이 모두 끝나야 한다

규칙:

- 상단 compact header
- 타이틀 2줄
- 설명 2줄 이내
- CTA 1개
- 종이 미니 preview 1개
- feature 카드 금지

### Frame 5. Mobile List

목표:
최근 문서를 다시 열고 새 문서를 바로 만드는 홈

레이아웃:

```text
+------------------------------+
| compact header               |
| logo                    +new |
+------------------------------+
| recent work card             |
+------------------------------+
| 1-column horizontal cards    |
+------------------------------+
| bottom quick action optional |
+------------------------------+
```

규칙:

- 최근 문서 1개를 크게
- 나머지는 모두 가로형 카드
- 모바일에서 정사각형 카드 금지
- more 메뉴는 카드 우상단 아이콘 1개만

### Frame 6. Mobile Editor

목표:
빠른 수정, 빠른 저장, 빠른 미리보기

레이아웃:

```text
+------------------------------+
| compact header               |
| back | title | saved | menu  |
+------------------------------+
| segmented control            |
| edit | preview               |
+------------------------------+
| active pane                  |
+------------------------------+
| sticky bottom dock           |
| save | preview | pdf         |
+------------------------------+
```

규칙:

- 편집/미리보기 동시 노출 금지
- 하단 dock 고정
- 모바일 상단 wrap 툴바 금지
- 더보기로 밀어 넣을 것: 가져오기, 내보내기, 삭제, 로그아웃

## 5. 무엇을 제거해야 하는가

### 로그인

- feature 설명 카드 3개 제거
- 좌측 floating 작은 카드 제거
- 긴 서비스 설명 제거

### 목록

- 우측 보조 설명 카드 스택 제거
- 섹션이 많아 보이는 장식성 레이아웃 제거
- "문서 서랍장" 같은 헤비 카피 제거

### 편집기

- status text 중복 제거
- rail 내부의 과한 sub-card 제거
- preview 주변의 과한 프레임 제거

### 모바일

- 데스크톱용 설명 블록 제거
- 섹션 카드 반복 패턴 축소
- 상단 버튼 군집 제거

## 6. 컬러 방향

이전:

- 브라운 중심
- 따뜻한 아이보리 비율이 너무 높음

새 방향:

- 바탕은 `dark slate`
- 기본 surface는 `charcoal navy`
- accent만 `warm amber`
- glow는 `cool blue / indigo`

핵심 팔레트:

- bg: `#0D1016`
- surface: `#141922`
- panel: `#1A202B`
- panel elevated: `#202735`
- text: `#F5F7FB`
- muted: `#98A1B3`
- accent amber: `#E8A978`
- accent deep: `#B97B4B`
- glow blue: `rgba(110,124,255,0.12)`

## 7. 컴포넌트 규칙

### Topbar

- 낮고 길게
- glass는 topbar에만 강하게
- 헤더 액션 4개 초과 금지
- quick action field가 버튼 묶음보다 먼저 읽혀야 한다

### Resume Card

- 문서 썸네일은 작아도 된다
- 카드의 핵심은 제목 + 최근 수정 + 열기 가능성
- 액션을 카드 하단에 많이 깔지 않는다

### Login Card

- 단일 CTA 중심
- 로그인 수단 외 2차 선택지 만들지 않는다
- 카드 안에 또 카드 금지

### Preview Stage

- 배경 glow는 약하게
- preview frame보다 paper 존재감 우선
- 주변 장식성 텍스트 금지

### Mobile Bottom Dock

- 3버튼까지 허용
- 저장이 가장 커야 한다
- 동일 비중 3분할 금지

## 8. 구현 가드레일

다음 중 하나라도 해당하면 과구현으로 본다.

- 로그인 화면에 카드가 3개 이상 보임
- 목록 화면에 `최근 작업` 외 보조 정보 패널이 2개 이상 보임
- 헤더에 액션 버튼이 5개 이상 있음
- 한 화면에서 서로 다른 카드 스타일이 4종 이상임
- 설명 문장이 CTA보다 더 먼저 읽힘
- 모바일에서 스크롤 첫 화면에 행동 버튼보다 설명 블록이 큼

## 9. 구현 에이전트 전달 문장

이 프로젝트는 `Dark Command Workspace` 기준으로 다시 설계한다. 이전 warm-glass 문서는 무시하고 [`docs/dark-command-workspace-mockup-v1.md`](/Users/kai/Desktop/ai/docs/dark-command-workspace-mockup-v1.md), [`docs/dark-command-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/dark-command-ui-token-delta-v1.md), [`docs/dark-command-ui-tokens.json`](/Users/kai/Desktop/ai/docs/dark-command-ui-tokens.json)만 읽어라. 핵심은 더 적은 UI, 더 어두운 베이스, 더 강한 최근 작업 위계, 모바일 하단 action dock, 그리고 Raycast식 빠른 액션 우선순위다.
