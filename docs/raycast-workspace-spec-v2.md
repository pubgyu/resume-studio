# Raycast Workspace Spec v2

> Deprecated on 2026-03-24. 최신 strict 설계 정본은 [`docs/raycast-strict-workspace-spec-v3.md`](/Users/kai/Desktop/ai/docs/raycast-strict-workspace-spec-v3.md) 이다.

작성일: 2026-03-24 (KST)

이 문서는 `Resume Room`의 최신 설계 정본이다.  
이전 `raycast-native-*` 문서는 검색 shell 해석이 과했고, 이번 문서가 그 오해를 바로잡는 기준이다.

읽어야 할 파일:

- [`docs/raycast-product-benchmark-v3.md`](/Users/kai/Desktop/ai/docs/raycast-product-benchmark-v3.md)
- [`docs/raycast-workspace-spec-v2.md`](/Users/kai/Desktop/ai/docs/raycast-workspace-spec-v2.md)
- [`docs/raycast-workspace-ui-tokens-v2.json`](/Users/kai/Desktop/ai/docs/raycast-workspace-ui-tokens-v2.json)
- [`docs/mockups/raycast-workspace-rough-v2.svg`](/Users/kai/Desktop/ai/docs/mockups/raycast-workspace-rough-v2.svg)

## 1. 한 줄 방향

`검색창을 복제하지 말고, Raycast 같은 dark utility window 안에 dense row hierarchy와 contextual action bar를 배치한다.`

## 2. 현재 구현에서 보정해야 할 문제

현재 캡처 기준 문제:

- login과 list가 모두 fake command shell처럼 보인다
- 설명용 row, tag, badge가 너무 많다
- 각 표면의 시각 무게가 비슷해서 핵심 행동이 약하다
- 브라운 톤이 강해서 Raycast 특유의 차갑고 밀도 높은 인상이 없다

이번 설계 목표:

- 표면 수를 줄인다
- row의 밀도를 높인다
- 액션을 하단이나 문맥 옆에 모은다
- preview와 paper를 주인공으로 만든다

## 3. 공통 규칙

### 3.1 폰트

- 한글 폰트는 현재 코드 기준과 동일하게 `Noto Sans KR`
- 별도 display font 금지
- 위계는 크기보다 `굵기 + 정렬 + spacing`으로 만든다

### 3.2 색

- base: near-black / charcoal
- ambient: 뒤에서만 보이는 red bloom + faint violet haze
- accent: warm amber
- 브라운 평면 배경 금지

### 3.3 표면 예산

- desktop login: 강한 surface 최대 2개
- desktop list: 강한 surface 최대 4개
- desktop editor: 강한 surface 최대 5개
- mobile screens: 강한 surface 최대 3개

### 3.4 액션 예산

- topbar 우측 주요 액션 최대 2개
- bottom action bar 가시 액션 최대 3개
- row 내부 상시 노출 버튼 최대 1개

### 3.5 금지 사항

- search shell을 화면 골격으로 남용
- support card stack
- 카드형 feature 설명 3개 이상
- row마다 duplicate / delete 버튼을 모두 노출
- login과 list에 긴 marketing paragraph

## 4. 화면 설계

### 4.1 Desktop Login

역할:

- 사용자가 빠르게 진입하는 창
- 소개보다 시작 액션이 우선

레이아웃:

- 전체는 화면 중앙의 `floating utility window`
- max width `1120px`
- 내부는 `46 / 54` split
- 좌측: brand copy
- 우측: sign-in panel

좌측 copy:

- kicker 1줄
- title 최대 2줄
- body 최대 2줄
- 보조 칩 최대 2개

우측 panel:

- panel title 1줄
- helper text 1줄
- Google 로그인 버튼 1개
- 보조 문장 1줄

디자인 규칙:

- 검색창처럼 보이는 상단 입력 금지
- fake row 2~3개 나열 금지
- 큰 glow보다 panel contrast로 위계 형성

### 4.2 Desktop List

역할:

- 최근 작업으로 빠르게 진입
- 전체 문서를 조밀한 row로 탐색

레이아웃:

- 중앙 floating workspace
- max width `1280px`
- 상단 `window bar`
- 본문 `58 / 42` split
- 하단 `context action bar`

window bar:

- 좌측: 앱명 + 현재 위치
- 중앙: compact search field
- 우측: theme / sign out / 새 이력서

좌측 list pane:

- `최근 작업` group
- `내 문서` group
- 문서는 모두 row 기반

row 구조:

- leading paper thumbnail 또는 단색 문서 아이콘
- title
- meta 1줄
- trailing date 또는 상태 1개

row 규칙:

- desktop row height `52px`
- hover / active만 구분
- 개별 row의 duplicate / delete 버튼 상시 노출 금지
- 추가 액션은 선택 후 action bar 또는 overflow로 이동

우측 preview pane:

- 선택된 문서 1개만 보여줌
- 상단 meta 2줄 이하
- paper preview 중심
- side info rail 금지

하단 action bar:

- 좌측: 선택된 문서명 또는 상태
- 우측: `열기 / 복제 / 삭제` 또는 `새 이력서`
- 버튼은 작고 밀도 높게

### 4.3 Desktop Editor

역할:

- 현재 섹션 편집과 문서 확인을 빠르게 오가는 작업 창

레이아웃:

- max width `1380px`
- 상단 window bar
- 본문은 3영역

영역 비율:

- section rail: `224px`
- form panel: `380px`
- preview stage: 나머지, 최소 `420px`

section rail:

- 섹션명을 dense row로 나열
- active section 1개 강조
- 섹션 추가 정보는 meta 1줄 이하

form panel:

- 현재 섹션 form만 노출
- 카드 여러 개 대신 `하나의 연속된 panel`
- group 사이 divider 사용
- 아코디언이 필요해도 시각적으로는 flat panel처럼 보여야 함

preview stage:

- dark canvas 위에 paper 1장
- 문서가 주인공
- 주변 장식 최소화

action bar:

- 저장 상태 / PDF / import-export / 더보기
- 상단에 흩뿌리지 말고 한 줄에 정리

반응형 규칙:

- viewport가 `1200px` 미만이면 rail을 form panel 상단 탭형으로 축소 가능
- 그렇더라도 다중 카드 레이아웃으로 바꾸지는 않는다

### 4.4 Mobile Home

역할:

- 저장된 문서를 빠르게 다시 여는 홈

레이아웃:

- compact header
- recent resume spotlight 1개
- document rows
- sticky create action

규칙:

- 큰 hero 금지
- 상단 고정 검색창 금지
- 검색은 pull-down 또는 icon entry
- recent spotlight는 카드 1개까지만 허용
- 나머지는 dense row list

### 4.5 Mobile Editor

역할:

- 한 번에 한 작업만 하게 만드는 편집기

레이아웃:

- compact header
- segmented control: `편집 / 미리보기`
- content surface 1개
- sticky bottom dock

편집 탭:

- 섹션 row list 또는 현재 섹션 form
- 한 번에 한 섹션만 깊게 본다

미리보기 탭:

- paper preview에 집중
- 편집용 보조 패널 숨김

dock 규칙:

- 가시 액션 최대 2개 + more 1개
- `저장`은 항상 명확
- PDF와 기타 부가 기능은 more 안으로 이동 가능

## 5. 타이포 상세

기본 원칙:

- 제목을 키우기보다 row를 조밀하게 설계
- uppercase eyebrow는 작고 얇지 않게
- meta가 작아도 흐려지기만 해서는 안 됨

권장 scale:

- window kicker: `11 / 14 / 700`
- utility label: `12 / 16 / 600`
- button: `13 / 18 / 600`
- body: `14 / 22 / 500`
- row title: `14 / 20 / 600`
- row meta: `12 / 16 / 500`
- panel title: `18 / 24 / 700`
- page title: `24 / 28 / 700`
- login title desktop: `32 / 36 / 800`
- login title mobile: `28 / 32 / 800`

## 6. 레이아웃 수치

desktop:

- outer shell radius: `24px`
- inner panel radius: `18px`
- row radius: `12px`
- action bar height: `56px`
- window bar height: `52px`
- gutter: `20px`
- inner gap: `16px`

mobile:

- screen gutter: `16px`
- row height: `48px`
- segmented height: `40px`
- dock height: `60px`
- panel radius: `18px`

## 7. 구현 에이전트 주의사항

- 현재 코드 구조를 바꾸기 어렵다면 데이터 로직은 유지하고 시각 구조만 평탄화한다
- `resume-list-row`는 유지하되 per-row visible actions를 줄이고 selected-context action으로 옮긴다
- editor의 아코디언 로직이 필요해도 겉보기에 카드 더미처럼 만들지 않는다
- theme를 바꾸더라도 종이 preview 스타일은 앱 chrome와 분리해 유지한다

## 8. 구현 금지 문장

`Raycast를 검색창으로 이해하지 말고, native utility window 안의 dense productivity UI로 이해하라.`
