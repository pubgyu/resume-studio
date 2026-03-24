# Warm Glass UI Token Delta v1

Deprecated: 이 문서는 더 이상 기준이 아니다. [`docs/dark-command-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/dark-command-ui-token-delta-v1.md)를 사용한다.

작성일: 2026-03-24 (KST)

이 문서는 [`docs/warm-glass-workspace-mockup-v1.md`](/Users/kai/Desktop/ai/docs/warm-glass-workspace-mockup-v1.md)의 시각 방향을 구현 가능한 토큰 단위로 잘게 쪼갠 문서다.
구현 에이전트는 이 문서와 [`docs/warm-glass-ui-tokens.json`](/Users/kai/Desktop/ai/docs/warm-glass-ui-tokens.json)만 보면 된다.

## 1. 목적

이번 델타는 아래 4가지만 고정한다.

1. 색 리듬
2. 여백 리듬
3. 반경과 그림자
4. 컴포넌트별 기본값

핵심 원칙:

- glow는 배경과 paper stage에서만 느껴지게
- glass는 topbar와 bottom dock에만 강하게
- 본문 패널은 matte
- 간격은 `큰 덩어리 여백 > 패널 패딩 > 카드 패딩 > 메타 간격` 순서가 무조건 보여야 한다

## 2. 색상 토큰 해석

### 2.1 Surface

- `canvas`: 전체 페이지 바탕
- `canvasElevated`: 상단 또는 넓은 섹션 배경
- `glassSurface`: blur가 들어가는 상단바/독 표면
- `panel`: 일반 패널
- `panelMuted`: 보조 패널
- `paper`: 실제 문서나 미리보기 종이

### 2.2 Text

- `textPrimary`: 제목, 핵심 숫자, CTA
- `textSecondary`: 본문, 설명, 라벨
- `textTertiary`: 힌트, 비활성 상태, 보조 메타

### 2.3 Accent

- `accent`: 버튼, 활성 segmented, 선택 상태
- `accentDeep`: hover, 강조 라인, 제목 밑 포인트
- `accentSoft`: 선택 배경, hover tint
- `accentGlow`: 배경 halo

규칙:

- accent를 카드 전체 배경에 넓게 쓰지 않는다
- 코퍼 계열은 항상 작고 정확하게

## 3. 여백 토큰 해석

### 3.1 페이지

- desktop shell padding top: 20
- desktop shell padding side: 24
- desktop section gap: 32
- mobile page gutter: 16
- mobile section gap: 14

### 3.2 패널

- topbar padding: 14 x 18
- panel padding: 24
- compact panel padding: 18
- card padding: 18
- chip padding x: 10
- chip padding y: 6

규칙:

- 패널 패딩보다 카드 패딩이 작아야 한다
- 카드 안에 카드가 들어가면 바깥 18, 안쪽 14 정도로만 줄인다

## 4. 반경 / 그림자 / blur

### 4.1 반경

- glass bar: 24
- main panel: 22
- card: 20
- compact card: 18
- paper frame: 28
- control: 18
- chip: 999

### 4.2 그림자

- `shadowGlass`: 유리 레이어용
- `shadowPanel`: 일반 패널용
- `shadowPaper`: 종이 미리보기용
- `shadowDock`: 모바일 하단 독용

규칙:

- glass는 그림자가 짧고 넓어야 한다
- paper는 가장 깊어도 된다
- 일반 카드 그림자는 과하지 않게

### 4.3 blur

- topbar blur: 18
- bottom dock blur: 20
- modal blur: 22

규칙:

- 한 화면에 강한 blur 레이어를 2개 이상 두지 않는다

## 5. 컴포넌트 기본값

### 5.1 Desktop Topbar

- height: 68
- padding: 14 x 18
- background: `glassSurface`
- border: `glassStroke`
- blur: `18px`
- left cluster gap: 12
- right cluster gap: 10

구성:

- logo
- recent status pill
- quick action field
- new resume primary button
- secondary actions

### 5.2 Desktop Resume List Card

- min height: 228
- radius: 24
- padding: 18
- thumbnail ratio: 0.42
- title gap: 8
- meta gap: 6

구성:

- status chip
- title
- updated meta
- mini paper thumbnail
- optional template label

hover:

- lift: `translateY(-1px)`
- thumbnail contrast up
- border alpha up

### 5.3 Desktop Editor Rail

- width: 420
- panel padding: 20
- section gap: 14
- accordion card padding: 16
- field gap: 10

규칙:

- 카드마다 너무 강한 박스 느낌 금지
- rail 전체가 하나의 column처럼 읽혀야 한다

### 5.4 Preview Stage

- paper max width: 820
- stage padding top: 12
- stage padding side: 24
- stage halo radius: 72
- stage halo opacity: 0.16

규칙:

- 종이와 프레임의 색 차이는 확실히
- halo는 background decoration이지 포인트 컬러 덩어리가 아니다

### 5.5 Mobile Header

- height: 56
- side padding: 16
- title size: 16
- action icon target: 44

규칙:

- 문서명, 저장 상태, 더보기만 남긴다
- back + title + state + menu 구조를 유지한다

### 5.6 Mobile Resume Card

- min height: 108
- radius: 20
- padding: 14
- thumbnail width ratio: 0.32
- title lines: 2
- meta size: 12

구성:

- left paper thumbnail
- right info stack
- more button

### 5.7 Segmented Control

- height: 40
- radius: 999
- track background: `panelMuted`
- active fill: `accent`
- active text: `accentContrast`

규칙:

- 모바일에서 탭처럼 크고 명확해야 한다
- 텍스트는 `편집`, `미리보기` 두 개만

### 5.8 Bottom Action Dock

- min height: 64
- padding: 10 x 12
- blur: 20
- background: `glassSurfaceStrong`
- border top: `glassStroke`

구성:

- primary large button: 저장
- secondary control: 미리보기
- tertiary ghost: PDF

규칙:

- 세 버튼 동일 비중 금지
- 저장이 항상 제일 넓다

## 6. 상태 토큰

### 6.1 Save State

- idle: `textTertiary`
- dirty: `accent`
- saving: `accentDeep`
- saved: `success`
- error: `danger`

표현:

- 텍스트만 바꾸지 말고 작은 pill 또는 점으로 같이 보여준다

### 6.2 Focus

- focus border: `focusRing`
- focus outer glow: `focusGlow`

규칙:

- 모든 interactive 요소는 동일한 focus 규칙 사용

## 7. 타이포 토큰

- hero: 52 / 700 / -0.04em
- page title: 32 / 700 / -0.03em
- section title: 18 / 700 / -0.02em
- body: 15 / 500 / normal
- meta: 12 / 500 / 0.01em
- eyebrow: 11 / 700 / 0.14em

규칙:

- 한글은 `Noto Sans KR`
- 두께 차이로 계층을 만든다
- 색보다 weight와 spacing으로 정리한다

## 8. 구현 순서

1. JSON 토큰을 CSS 변수로 매핑
2. topbar / panel / card 공통 스타일 고정
3. desktop list card와 preview stage 반영
4. mobile segmented / bottom dock 반영
5. 상태 pill과 focus 규칙 통일

## 9. 구현 에이전트 전달 문장

`Warm Glass Workspace`의 시각 값은 [`docs/warm-glass-ui-tokens.json`](/Users/kai/Desktop/ai/docs/warm-glass-ui-tokens.json)을 그대로 쓰고, 사용법은 [`docs/warm-glass-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/warm-glass-ui-token-delta-v1.md)를 따른다. glow는 배경과 paper stage 위주, glass는 topbar와 bottom dock 위주, 본문은 matte라는 규칙을 깨지 말 것.
