# Dark Command UI Token Delta v1

Deprecated: 이 문서는 더 이상 최신 기준이 아니다. [`docs/raycast-command-shell-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/raycast-command-shell-ui-token-delta-v1.md)를 사용한다.

작성일: 2026-03-24 (KST)

이 문서는 [`docs/dark-command-workspace-mockup-v1.md`](/Users/kai/Desktop/ai/docs/dark-command-workspace-mockup-v1.md)를 구현 가능한 값으로 풀어낸 토큰 해석 문서다.
구현 에이전트는 이 문서와 [`docs/dark-command-ui-tokens.json`](/Users/kai/Desktop/ai/docs/dark-command-ui-tokens.json)만 보면 된다.

## 1. 핵심 변화

이전보다 아래를 강하게 바꾼다.

1. 브라운 비중 감소
2. surface 수 감소
3. support card 제거
4. quick action 우선
5. 모바일 행동 중심 재정렬

## 2. 색상 사용 규칙

### 2.1 Base

- `canvas`: 전체 배경
- `surface`: 기본 top-level panel
- `surfaceStrong`: 중요 카드
- `surfaceGlass`: topbar / dock 전용

규칙:

- 화면 대부분은 `canvas + surface + paper` 3종이면 충분하다
- accent는 넓게 칠하지 않는다

### 2.2 Text

- `textPrimary`: 모든 핵심 제목
- `textSecondary`: 설명
- `textTertiary`: 메타

규칙:

- 설명은 `textSecondary`만 사용
- 메타는 항상 `textTertiary`

### 2.3 Accent

- `accent`: primary action
- `accentDeep`: hover / stronger action
- `accentSoft`: selected fill
- `glowBlue`: ambient depth only

규칙:

- amber는 CTA와 status pill에만
- blue glow는 background 혹은 preview stage 뒤에만

## 3. surface budget

### 3.1 화면당 허용 수

- login: strong surfaces 최대 2
- list: strong surfaces 최대 3
- editor desktop: strong surfaces 최대 4
- mobile editor: strong surfaces 최대 3

### 3.2 금지

- surface 안에 또 surface를 반복 중첩하는 것
- 설명 전용 패널 스택
- 같은 중요도를 가진 카드가 나란히 3개 이상 보이는 것

## 4. spacing rhythm

- shell top: 20
- shell side desktop: 24
- shell side mobile: 16
- section gap desktop: 28
- section gap mobile: 14
- panel padding: 20
- card padding: 16
- meta gap: 6
- chip gap: 8

규칙:

- 페이지가 복잡해 보이면 색보다 먼저 gap을 줄이지 말고 패널 수를 줄인다
- 새 card를 추가하기 전에 기존 card를 합칠 수 있는지 먼저 본다

## 5. radius / shadow / blur

### radius

- topbar: 22
- main panel: 22
- standard card: 18
- compact card: 16
- pill: 999

### shadow

- glass: 짧고 넓게
- panel: 얕게
- paper: 가장 깊게

### blur

- topbar: 16
- bottom dock: 18
- modal: 20

규칙:

- blur는 topbar와 dock에만 강하게
- 일반 카드에는 blur 금지

## 6. component defaults

### 6.1 Desktop Topbar

- height: 64
- padding: 12 x 16
- quick action field width: 220~280
- primary action count max: 1
- secondary action count max: 2

### 6.2 Login Layout

- left hero width: flexible
- right login card width: 320~360
- support card count: 0
- chips max: 3

### 6.3 List Layout

- recent work card: full width single spotlight
- grid columns: 2
- sidebar panels: 0
- document card min height: 180

### 6.4 Editor Layout

- rail width: 400~420
- preview stage width: flexible
- preview paper max width: 860
- topbar action max visible: 3

### 6.5 Mobile Header

- height: 56
- title size: 16
- visible action max: 2

### 6.6 Segmented Control

- height: 40
- labels: 2 only
- full width in mobile

### 6.7 Bottom Dock

- min height: 62
- primary button width ratio: 0.48 이상
- total actions max: 3

## 7. type hierarchy

- hero: 56 / 800 / -0.05em
- page title: 32 / 800 / -0.03em
- card title: 24 / 700 / -0.02em
- section label: 12 / 700 / 0.14em
- body: 16 / 500 / normal
- meta: 12 / 500 / 0.01em

규칙:

- title이 크면 설명은 짧아져야 한다
- 한 화면에 large title은 1개만

## 8. Raycast-like 검수 체크

아래가 충족되지 않으면 Raycast 느낌이 부족한 것이다.

- 첫 2초 안에 main action이 보인다
- topbar가 길고 낮다
- 불필요한 설명 card가 없다
- action 수보다 surface 수가 적다
- glow가 콘텐츠보다 먼저 보이지 않는다

## 9. 구현 에이전트 전달 문장

새 방향은 `Dark Command Workspace`다. warm-glass 기준의 support card 구조를 버리고, `dark slate base + compact glass topbar + single recent-work spotlight + 2-column document grid + mobile bottom dock`로 다시 구현하라. 값은 [`docs/dark-command-ui-tokens.json`](/Users/kai/Desktop/ai/docs/dark-command-ui-tokens.json), 사용 규칙은 [`docs/dark-command-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/dark-command-ui-token-delta-v1.md)를 따른다.
