# Warm Glass Workspace Mockup v1

Deprecated: 이 문서는 더 이상 기준이 아니다. [`docs/dark-command-workspace-mockup-v1.md`](/Users/kai/Desktop/ai/docs/dark-command-workspace-mockup-v1.md)를 사용한다.

작성일: 2026-03-24 (KST)

이 문서는 `Resume Room`의 다음 디자인 방향을 `Warm Glass Workspace` 하나로 확정한 단독 스펙이다.
이전 벤치마크 문서를 읽지 않았어도 이 파일만 보면 된다.

## 1. 한 줄 방향

`따뜻한 샌드 톤 배경 + 낮은 유리 질감 상단바 + 선명한 종이 미리보기 + 조용한 glow`

핵심은 "예쁜 카드들"이 아니라 `문서 작업실`처럼 보이는 것이다.

## 2. 소스 조합

- [Raycast](https://www.raycast.com/): 핵심 액션 바 위계, glow, 빠른 도구 느낌
- [Craft](https://www.craft.do/): 따뜻한 문서 무드, 여백, 몰입형 크롬
- [Arc](https://arc.net/): blur, 둥근 레이어, calm tone
- [Linear](https://linear.app/): 정보 밀도와 구조 정리

비율:

- Raycast 40
- Craft 35
- Arc 15
- Linear 10

## 3. 무드 보드 키워드

- warm glass
- sand chrome
- calm productivity
- soft bronze glow
- floating paper
- dense but quiet

## 4. 전체 규칙

### 4.1 배경

- 기본 바탕은 차가운 회색이 아니라 `sand / beige / warm stone`
- 전체 배경은 단색 금지
- 얕은 radial glow 2개까지 허용
- grid나 noise texture는 매우 약하게만 사용

### 4.2 글래스 사용법

- 진짜 glassmorphism처럼 과하게 투명하게 하지 않는다
- 상단바와 하단 액션 독에만 제한적으로 사용한다
- 패널 본문은 matte surface가 기본이다
- blur는 `14px~20px` 정도의 낮은 강도로 본다

### 4.3 glow 사용법

- 포인트는 코퍼/브론즈 계열
- glow는 `버튼 주변`보다 `종이 뒤 halo`에 쓰는 쪽이 더 적합하다
- 항상 1차 면이 먼저 읽히고, glow는 나중에 느껴져야 한다

### 4.4 여백 리듬

- 큰 덩어리 간격: 32
- 패널 내부 패딩: 24
- 카드 내부 패딩: 18
- 작은 메타 간격: 8
- 모바일 기본 좌우 패딩: 16

규칙:

- 같은 종류의 카드면 내부 패딩을 섞지 않는다
- section마다 다른 반경을 쓰지 않는다
- 시각적 고급감은 색보다 `간격의 일관성`에서 나온다

## 5. 화면 4장으로 확정

### Frame 1. PC Home / Resume List

용도:
로그인 후 처음 들어오는 문서 서랍장

레이아웃:

```text
+--------------------------------------------------------------+
| glass topbar                                                 |
| logo | recent status | search-like quick action | new button |
+--------------------------------------------------------------+
| hero intro          | recent resume focus card               |
+--------------------------------------------------------------+
| 2-column zone                                               |
| left: resume grid (2 x n large cards)                        |
| right: activity / template / tip stacked cards               |
+--------------------------------------------------------------+
```

핵심 규칙:

- 상단바는 전체 화면을 지배하지 말고 낮고 길게 간다
- 목록 카드는 `작은 문서 썸네일 + 제목 + 최근 수정 + 상태` 구조
- 기존 4~5열 작은 카드보다 `2열의 큰 카드`가 더 맞다
- 오른쪽 보조 컬럼은 "템플릿", "최근 작업", "팁" 같은 가벼운 메타 공간
- 메인 CTA는 `새 이력서` 하나만 확실하게 띄운다

비주얼:

- 배경은 따뜻한 샌드
- 메인 카드 위쪽에 얕은 bronze glow
- 문서 썸네일은 아이보리 종이로 통일

버릴 것:

- 동일한 크기의 카드만 반복되는 Pinterest형 배치
- 상단에 버튼이 너무 많이 몰린 툴바형 구성

### Frame 2. PC Editor / Preview Workspace

용도:
핵심 편집 작업 화면

레이아웃:

```text
+--------------------------------------------------------------+
| glass topbar                                                 |
| resume title | save state | template | actions               |
+---------------------------+----------------------------------+
| editor rail               | preview stage                    |
| matte cards               | large paper + soft halo          |
| accordion sections        | sticky preview meta              |
| section settings          | document center alignment        |
+---------------------------+----------------------------------+
```

폭 규칙:

- editor rail: 400~440px
- preview stage: 나머지 전체
- rail은 고정 느낌, preview는 열리는 느낌

핵심 규칙:

- 상단 액션은 `저장`, `PDF`, `더보기` 정도로 최소화
- 왼쪽 rail은 아코디언 카드가 아니라 정리된 작업 레일처럼 보여야 한다
- 오른쪽 preview는 앱 패널보다 종이가 먼저 보이게 한다
- preview 뒤에 아주 약한 halo를 둬서 결과물이 중심처럼 보이게 한다
- 저장 상태는 버튼 텍스트 대신 작은 상태 pill로 별도 노출한다

비주얼:

- 상단바만 blur
- 본문 패널은 matte
- 미리보기 프레임만 더 밝고 깊게

버릴 것:

- 에디터와 미리보기 모두 비슷한 강도의 카드 처리
- 왼쪽 rail 안의 카드들이 너무 촘촘한 관리툴 느낌

### Frame 3. Mobile Home / Resume List

용도:
한 손으로 최근 이력서를 다시 여는 첫 화면

레이아웃:

```text
+------------------------------+
| compact header               |
| Resume Room   + new          |
+------------------------------+
| recent focus card            |
| large title / updated / open |
+------------------------------+
| list                          |
| horizontal document cards x n |
+------------------------------+
| sticky bottom quick action    |
+------------------------------+
```

핵심 규칙:

- 첫 화면에서 `최근 문서 1개`를 크게 보여준다
- 나머지는 전부 1열 가로형 카드
- 모바일 카드 구조는 `좌측 썸네일 / 우측 정보 / 우측 상단 more`
- 상단에는 버튼을 많이 두지 않는다
- 하단에는 `새 이력서` 또는 `최근 문서 열기` 같은 단일 행동 중심 dock를 둔다

비주얼:

- 배경은 밝은 sand
- 카드 가장자리만 얇게 떠 있는 느낌
- 썸네일은 종이 카드처럼 보여야 한다

버릴 것:

- 데스크톱 카드 축소판
- 모바일에서 정사각형 카드 반복

### Frame 4. Mobile Editor / Preview

용도:
빠른 수정, 저장 상태 확인, 미리보기 전환

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
| edit: accordion stack        |
| preview: scaled paper card   |
+------------------------------+
| sticky bottom action dock    |
| save | preview toggle | pdf  |
+------------------------------+
```

핵심 규칙:

- 모바일은 `편집 / 미리보기` 동시 노출 금지
- segmented control로 전환
- 하단 dock는 항상 노출
- 입력 중에는 하단 dock가 키보드와 충돌하지 않게 safe area 기준으로 올라와야 한다
- preview는 A4 전체를 고집하지 말고 readable scale을 우선한다

하단 dock 구성:

- primary: `저장`
- secondary: `미리보기`
- tertiary: `PDF`

더보기 메뉴로 보낼 것:

- 가져오기
- 내보내기
- 삭제
- 로그아웃

버릴 것:

- 상단 wrap 툴바
- 미리보기와 편집기 긴 스크롤 병치

## 6. 컴포넌트 확정안

### 6.1 Topbar

- 높이 낮게
- blur는 topbar에만 집중
- 좌측은 문맥, 우측은 행동
- PC에서는 검색창처럼 보이는 quick action field 하나를 둘 수 있다

### 6.2 Resume Card

- 썸네일 40%
- 정보 60%
- 상태는 제목보다 작은 캡슐로 먼저 읽히게
- hover 시 lift보다 thumbnail contrast를 먼저 올린다

### 6.3 Editor Section Card

- 내부를 2단으로 나누지 않는다
- 제목, 설명, 필드가 한 흐름으로 내려가야 한다
- 카드 사이 간격은 넉넉히, 카드 안은 단단히

### 6.4 Preview Stage

- 프레임 자체보다 종이가 먼저 보여야 한다
- 종이 외곽 halo는 1개만
- 배경에 불필요한 장식 금지

### 6.5 Mobile Bottom Dock

- glass + border + soft shadow
- 최소 높이 64
- 버튼 3개를 같은 비중으로 두지 말고 저장을 가장 크게

## 7. 컬러 방향

추천 팔레트:

- background: `#f3ede5`
- background elevated: `#fbf6f0`
- panel: `rgba(255,250,244,0.74)`
- matte surface: `#fffaf4`
- line: `rgba(92,72,58,0.10)`
- line strong: `rgba(92,72,58,0.18)`
- text: `#201915`
- muted: `#6c6258`
- accent bronze: `#a86a45`
- accent deep: `#77462d`
- glow: `rgba(168,106,69,0.16)`

다크 모드는 나중에 확장하고, 우선 라이트 모드 완성도를 먼저 맞춘다.

## 8. 타입 방향

- 전체는 `Noto Sans KR`
- 헤드라인은 700~800
- 본문은 400~500
- 자간으로 세련됨을 만든다

권장:

- hero: 44~56
- page title: 28~34
- section title: 18~20
- body: 15~16
- meta: 12~13

## 9. 구현 순서

1. 전체 배경, topbar, 공통 카드 리듬 정리
2. PC 목록을 2열 큰 카드 구조로 변경
3. PC 편집기에서 preview stage 위계 강화
4. 모바일 목록을 가로형 카드로 변경
5. 모바일 편집기 `편집 / 미리보기` 전환 도입
6. 하단 sticky dock 추가

## 10. 구현 에이전트 전달 문장

이 프로젝트는 `Warm Glass Workspace` 하나로 간다. 레퍼런스는 `Raycast + Craft + Arc + Linear` 조합이고, 핵심은 따뜻한 sand 배경, 낮은 glass topbar, 크게 보이는 문서 카드, 조용한 glow, 모바일 하단 action dock이다. 화면 구성은 [`docs/warm-glass-workspace-mockup-v1.md`](/Users/kai/Desktop/ai/docs/warm-glass-workspace-mockup-v1.md), 시각 값은 [`docs/warm-glass-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/warm-glass-ui-token-delta-v1.md)와 [`docs/warm-glass-ui-tokens.json`](/Users/kai/Desktop/ai/docs/warm-glass-ui-tokens.json)을 기준으로 구현하면 된다.
