# Raycast Command Shell UI Token Delta v1

Deprecated: 이 문서는 특정 launcher shell에 과도하게 치우친 안이다. [`docs/raycast-native-workspace-spec-v1.md`](/Users/kai/Desktop/ai/docs/raycast-native-workspace-spec-v1.md)를 사용한다.

작성일: 2026-03-24 (KST)

이 문서는 [`docs/raycast-command-shell-mockup-v1.md`](/Users/kai/Desktop/ai/docs/raycast-command-shell-mockup-v1.md)를 구현 값으로 해석한 토큰 문서다.
구현 에이전트는 이 문서와 [`docs/raycast-command-shell-ui-tokens.json`](/Users/kai/Desktop/ai/docs/raycast-command-shell-ui-tokens.json)만 보면 된다.

## 1. 기본 원칙

이번 토큰은 `card UI`가 아니라 `shell UI`를 만들기 위한 값들이다.

- glass보다 shell surface가 우선
- row가 card보다 우선
- red bloom은 background layer
- violet glow는 ambient layer
- accent amber는 CTA / status only

## 2. Surface Rules

### 2.1 surface types

- `canvas`: 전체 배경
- `shell`: 메인 command palette 표면
- `shellSecondary`: 상단 utility shell
- `rowActive`: 선택된 행
- `rowIdle`: 일반 행
- `paper`: 결과물

규칙:

- shell 내부에 또 shell을 중첩하지 않는다
- row는 배경색 차이만으로 구분한다
- 일반 카드 surface를 새로 만들지 않는다

### 2.2 surface budget

- login strong surfaces max: 2
- list strong surfaces max: 2
- editor strong surfaces max: 3
- mobile strong surfaces max: 2

## 3. Color Usage

### 3.1 base

- 배경은 거의 black
- shell은 slightly lifted dark
- text는 cool white

### 3.2 blooms

- red bloom은 shell 뒤 또는 shell 내부 overlay
- amber bloom은 아주 약하게
- violet glow는 paper 주변이나 화면 코너에만

규칙:

- bloom이 UI border보다 강하면 안 된다
- color effect가 structure를 이기면 안 된다

## 4. Spacing Rules

- shell outer padding: 20
- shell inner padding: 16
- row height desktop: 44~48
- row height mobile: 40~44
- row gap: 8
- section gap desktop: 24
- section gap mobile: 12

규칙:

- row는 항상 촘촘해야 한다
- card처럼 넓게 숨 쉬는 간격을 쓰지 않는다

## 5. Radius / Shadow / Blur

### radius

- outer frame: 30
- shell: 22
- row: 10
- utility shell: 18
- dock: 22
- paper: 20

### shadow

- shell shadow는 깊고 부드럽게
- paper shadow는 가장 강하게
- 일반 row에는 shadow 없음

### blur

- blur는 최소화
- top utility shell 또는 dock에만 제한적으로

## 6. Component Defaults

### 6.1 Utility Shell

- height desktop: 58~64
- height mobile: 52~56
- left: title / context
- right: max 3 actions

### 6.2 Main Command Shell

- max width desktop: 620
- padding: 16~20
- search line first
- section label one line
- rows follow immediately

### 6.3 Rows

- active row: full emphasis
- passive row: muted emphasis
- left icon dot
- middle label + short meta
- right tag

규칙:

- right tag는 `Command`, `Recent`, `Resume`, `Edit`, `Open` 정도의 짧은 단어
- long description 금지

### 6.4 Paper Stage

- paper max width desktop: 280~320 in mockup shell
- real app preview can be wider, but shell-first hierarchy 유지
- faint violet glow behind paper

### 6.5 Mobile Bottom Dock

- min height: 56
- primary button dominant
- secondary and tertiary are clearly subordinate

## 7. Typography

- hero: 44 / 800 / -0.05em
- shell title: 28 / 800 / -0.03em
- row label: 16 / 600
- row meta: 13 / 500
- tag: 12 / 600
- kicker: 12 / 700 / 0.16em

규칙:

- hero copy 2줄 이내
- shell 내부 설명은 거의 쓰지 않는다
- row meta는 한 덩어리 이상 길어지면 자른다

## 8. 검수 체크

다음이 보이면 잘못 구현된 것이다.

- 행보다 박스가 먼저 보인다
- tag보다 description이 더 길다
- topbar가 row list보다 시각적으로 무겁다
- red bloom이 콘텐츠 가독성을 해친다
- 모바일에서 shell보다 개별 card가 더 많다

## 9. 구현 에이전트 전달 문장

`Raycast Command Shell` 구현의 핵심은 `shell + row + paper` 3단이다. 값은 [`docs/raycast-command-shell-ui-tokens.json`](/Users/kai/Desktop/ai/docs/raycast-command-shell-ui-tokens.json), 규칙은 [`docs/raycast-command-shell-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/raycast-command-shell-ui-token-delta-v1.md)를 따르고, 새로운 card나 support panel을 임의로 추가하지 말 것.
