# Raycast Strict Workspace Spec v3

작성일: 2026-03-24 (KST)

이 문서는 `Resume Room`의 최신 Raycast strict 설계 정본이다.

읽어야 할 파일:

- [`docs/raycast-strict-benchmark-v4.md`](/Users/kai/Desktop/ai/docs/raycast-strict-benchmark-v4.md)
- [`docs/raycast-strict-workspace-spec-v3.md`](/Users/kai/Desktop/ai/docs/raycast-strict-workspace-spec-v3.md)
- [`docs/raycast-strict-ui-tokens-v3.json`](/Users/kai/Desktop/ai/docs/raycast-strict-ui-tokens-v3.json)
- [`docs/mockups/raycast-strict-rough-v3.svg`](/Users/kai/Desktop/ai/docs/mockups/raycast-strict-rough-v3.svg)

## 1. 한 줄 방향

`Resume Room을 Raycast처럼 보이게 하되, 검색창을 복제하지 말고 dark utility window + dense rows + bottom action bar 구조로 재구성한다.`

## 2. 공통 규칙

### 2.1 폰트

- 한글: `Noto Sans KR`
- display 전용 서체 금지
- 대부분의 UI를 `12 / 14 / 16` 스케일에서 해결
- hero heading도 2줄을 넘기지 않는다

### 2.2 색

- base는 near-black / slate
- active background는 밝아진 charcoal overlay
- 살구색, 브라운, 피치색 큰 fill 금지
- accent는 shortcut hint, focus ring, CTA text edge 정도로 제한

### 2.3 surface budget

- desktop login: 2
- desktop list: 4
- desktop editor: 5
- mobile screens: 3

### 2.4 action budget

- topbar primary action 최대 1개
- bottom action bar visible action 최대 3개
- row 내부 상시 visible action 최대 0개

### 2.5 strict 금지 사항

- fake search shell
- fake search row
- support card stack
- feature card 3개 나열
- large warm CTA
- row마다 duplicate / delete 노출

## 3. Desktop Login

목표:

- 로그인 화면도 Raycast utility window처럼 간결하게

레이아웃:

- 화면 중앙 floating shell
- max width `980px`
- 내부 `48 / 52` split
- 좌측 intro
- 우측 sign-in panel

좌측 intro:

- eyebrow 1줄
- title 2줄 이하
- body 2줄 이하
- tiny meta chips 최대 2개

우측 sign-in panel:

- panel title 1줄
- body 1줄
- dark neutral Google 버튼 1개
- 작은 보조 문장 1줄

스타일 규칙:

- 검색 입력창 금지
- command row 금지
- 강조는 button fill보다 shell contrast로 해결

## 4. Desktop List

목표:

- 최근 작업을 가장 빠르게 다시 여는 화면

레이아웃:

- floating shell max width `1240px`
- 상단 window bar
- 본문 `56 / 44` split
- 하단 action bar

window bar:

- 좌측: app title + location
- 중앙: compact search
- 우측: theme, 새 이력서

list pane:

- `최근 작업` section
- `모든 문서` section
- 모두 row-first

row 구조:

- leading thumbnail 36px
- title 14px/600
- meta 12px/500
- trailing date 또는 상태

row interaction:

- hover
- active
- enter = open
- more actions는 하단 action bar 기준

preview pane:

- 선택 문서 하나만 표시
- 상단 짧은 meta
- paper preview 중심
- 설명용 보조 카드 금지

action bar:

- 좌측: 현재 선택 상태
- 우측: 열기 / 복제 / 삭제
- shortcut hint 스타일 적용 가능

## 5. Desktop Editor

목표:

- Raycast Notes처럼 빠르고 가볍게 편집

레이아웃:

- floating shell max width `1360px`
- 상단 window bar
- 본문 3열
- 하단 action bar

3열 구성:

- section rail `216px`
- form surface `360px`
- preview stage `min 460px`

section rail:

- dense rows
- active row 1개만 강조
- count 또는 visibility 같은 보조 정보는 최소화

form surface:

- 현재 섹션만 보이는 flat panel
- nested card 금지
- field group 간 divider만 사용

preview stage:

- dark canvas 위 paper
- paper 외 보조 surface 최소화

action bar:

- 저장 상태
- PDF
- import/export 또는 more

규칙:

- 상단 toolbar에 버튼 많이 두지 않는다
- 아코디언이 있어도 외형은 flat list처럼 보여야 한다

## 6. Mobile Home

목표:

- iOS Raycast처럼 home-first

레이아웃:

- compact header
- recent spotlight 1개
- favorites / quick action 1줄
- dense document rows
- search는 pull-down 또는 icon

규칙:

- 큰 hero 금지
- 상단 고정 검색바 금지
- 카드 그리드 금지

## 7. Mobile Editor

목표:

- single-task 편집기

레이아웃:

- compact header
- segmented control `편집 / 미리보기`
- content surface 1개
- sticky dock

dock:

- 저장
- more
- 필요 시 preview toggle

규칙:

- 한 화면에 한 작업만
- 편집과 미리보기를 세로 적층하지 않는다
- support panel 금지

## 8. Active / Hover / Focus 규칙

active row:

- 배경은 `rgba(255,255,255,0.08)` 전후
- 얇은 inside stroke 또는 top highlight 허용
- fill accent 금지

hover row:

- 배경은 `rgba(255,255,255,0.04)` 전후

primary button:

- 기본은 dark neutral button
- 진짜 primary 한 개만 약한 밝기 상승
- large warm fill 금지

focus ring:

- faint violet 또는 neutral light
- 두께 `1.5px ~ 2px`

## 9. 구현 에이전트 지침

- Raycast가 아닌 UI 해석을 넣지 않는다
- card dashboard로 회귀하지 않는다
- 리스트는 반드시 row-first
- 편집기는 반드시 single form surface + paper preview
- active 색은 accent fill이 아니라 neutral highlight로 처리

## 10. 구현 기준 문장

`Raycast에서 없는 UI 스타일을 invent 하지 말고, 검색이 필요한 곳에만 search를 두고 나머지는 dark utility window 안의 dense row UI로 정리하라.`
