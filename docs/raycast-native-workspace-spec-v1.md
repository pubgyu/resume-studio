# Raycast Native Workspace Spec v1

> Deprecated on 2026-03-24. 최신 설계 정본은 [`docs/raycast-workspace-spec-v2.md`](/Users/kai/Desktop/ai/docs/raycast-workspace-spec-v2.md) 이다.

작성일: 2026-03-24 (KST)

이 문서는 `Resume Room`을 Raycast의 실제 UI 원칙에 가깝게 번역한 최신 설계 문서다.

읽어야 할 파일:

- [`docs/raycast-ui-benchmark-v2.md`](/Users/kai/Desktop/ai/docs/raycast-ui-benchmark-v2.md)
- [`docs/raycast-native-workspace-spec-v1.md`](/Users/kai/Desktop/ai/docs/raycast-native-workspace-spec-v1.md)
- [`docs/raycast-native-ui-tokens-v1.json`](/Users/kai/Desktop/ai/docs/raycast-native-ui-tokens-v1.json)

## 1. 한 줄 방향

`검색은 필요한 곳에만 전면 배치하고, 나머지 화면은 row-first productivity UI로 정리한다.`

## 2. 핵심 차이

이전 잘못된 방향:

- 로그인도 search shell
- 목록도 과한 command shell
- 카드와 shell이 혼합되어 오히려 복잡

이번 방향:

- login: compact split layout
- list: utility bar + recent rows + selected preview
- editor: section list + paper + contextual actions
- mobile home: recent/favorites first, search secondary

## 3. 화면 구조

### 3.1 Desktop Login

구성:

- 상단 compact brand bar
- 좌측: 짧은 브랜드 메시지
- 우측: sign-in panel
- 배경: 약한 bloom만

규칙:

- 타이틀 2줄 이하
- 설명 2줄 이하
- 보조 칩 3개 이하
- 설명용 카드 스택 금지
- search-like field 금지

핵심:

- 로그인은 `명령 실행`이 아니라 `진입`이므로 search-first가 아님

### 3.2 Desktop List

구성:

- top utility bar
- left main list area
- right selected preview area

left main area:

- `최근 작업` row group
- `내 문서` row group
- row는 active / default 2가지 강조만

right preview area:

- 선택된 문서 paper preview 1개
- 짧은 meta
- 액션 2~3개

규칙:

- 카드 그리드보다 row list 우선
- search field는 utility bar 안에 작게만
- right preview는 `선택된 문서 1개`만 보여줌
- support rail 금지

### 3.3 Desktop Editor

구성:

- top utility bar
- left section list
- right paper preview / editing content
- bottom contextual action bar 또는 하단 액션 군

left section list:

- 섹션을 row로 나열
- active section 1개 강조
- 나머지는 muted

right side:

- paper가 주인공
- 편집 form은 current section만
- preview를 유지한다면 chrome를 줄여 paper 중심으로

규칙:

- 아코디언 카드 더미 금지
- section마다 같은 카드 반복 금지
- context actions는 흩어놓지 말고 모은다

### 3.4 Mobile Home

구성:

- compact header
- recent resume block
- favorites or quick actions
- document rows

규칙:

- 상단 고정 검색창 금지
- search는 pull-down 또는 아이콘 진입
- 최근 문서 1개 강조
- 나머지는 dense row list

### 3.5 Mobile Editor

구성:

- compact header
- segmented control: 편집 / 미리보기
- active section rows 또는 preview
- sticky bottom action bar

규칙:

- 한 화면에서 한 작업만
- multiple cards stack 금지
- 더보기 메뉴에 부가 동작 이동

## 4. 타이포 설계

공식 Raycast 앱 폰트명은 확인되지 않았으므로, 아래는 `공식 화면 인상 + 시스템 UI 관성`을 바탕으로 한 설계다.

권장 폰트:

- 한글: `Noto Sans KR`

굵기 운영:

- 800: 로그인 타이틀, 큰 페이지 타이틀
- 700: 섹션 헤더, 패널 타이틀
- 600: row label, 버튼, 상태 태그
- 500: 본문, meta

크기 운영:

- login hero: `40px`
- page title: `28px`
- panel title: `20px`
- row label: `15px`
- meta: `12px`
- utility text: `13px`

원칙:

- 큰 제목도 많지 않게
- 진짜 UI의 대부분은 `15/12` 밀도로 해결
- 행간보다 padding으로 호흡을 만든다

## 5. 컬러 설계

기본:

- background: near-black
- panel: charcoal
- active row: 밝은 반투명 오버레이
- accent: warm amber
- ambient: red bloom + faint violet glow

원칙:

- 브라운 평면 배경 금지
- red bloom은 광원처럼 뒤에서만
- amber는 CTA / active accent 전용

## 6. 레이아웃 비율

desktop list:

- left list: 58%
- right preview: 42%

desktop editor:

- left section list: 320~360px
- right content/paper: 나머지

mobile:

- horizontal gutter: 16px
- row height: 44px 전후
- dock height: 56~62px

## 7. 구현 금지 사항

- 모든 화면에 큰 search shell 넣기
- support card 3개 반복
- shell / card / panel / rail을 한 화면에 다 섞기
- CTA보다 설명이 더 많아 보이게 만들기
- 모바일에서 large hero + long intro + card stack 조합

## 8. 구현 에이전트 전달 문장

이 구현은 `Raycast Native Workspace` 기준으로 한다. search-first는 목록/빠른 열기에만 쓰고, login/editor/mobile home에는 row-first 구조를 우선한다. 이전 shell obsession은 버리고, [`docs/raycast-ui-benchmark-v2.md`](/Users/kai/Desktop/ai/docs/raycast-ui-benchmark-v2.md), [`docs/raycast-native-workspace-spec-v1.md`](/Users/kai/Desktop/ai/docs/raycast-native-workspace-spec-v1.md), [`docs/raycast-native-ui-tokens-v1.json`](/Users/kai/Desktop/ai/docs/raycast-native-ui-tokens-v1.json)을 기준으로 UI를 재구성하라.
