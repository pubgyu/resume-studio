# Raycast Command Shell Mockup v1

Deprecated: 이 문서는 특정 launcher shell에 과도하게 치우친 안이다. [`docs/raycast-ui-benchmark-v2.md`](/Users/kai/Desktop/ai/docs/raycast-ui-benchmark-v2.md)와 [`docs/raycast-native-workspace-spec-v1.md`](/Users/kai/Desktop/ai/docs/raycast-native-workspace-spec-v1.md)를 사용한다.

작성일: 2026-03-24 (KST)

이 문서는 `Resume Room`의 최신 정본 디자인 방향이다.
이전 `Warm Glass`, `Dark Command Workspace` 문서는 기준이 아니다.

이번 기준에서 읽어야 할 파일:

- [`docs/raycast-command-shell-mockup-v1.md`](/Users/kai/Desktop/ai/docs/raycast-command-shell-mockup-v1.md)
- [`docs/raycast-command-shell-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/raycast-command-shell-ui-token-delta-v1.md)
- [`docs/raycast-command-shell-ui-tokens.json`](/Users/kai/Desktop/ai/docs/raycast-command-shell-ui-tokens.json)
- 러프 이미지: [`docs/mockups/raycast-command-shell-rough-v1.svg`](/Users/kai/Desktop/ai/docs/mockups/raycast-command-shell-rough-v1.svg)

## 1. 방향 정의

한 줄:

`Resume Room을 카드 대시보드가 아니라 command palette 기반 작업실로 다시 번역한다.`

핵심은 "예쁜 카드"가 아니라 아래 3개다.

1. 검색처럼 보이는 진입점
2. 빠르게 훑히는 row list
3. 종이가 결과물로 떠 있는 구조

## 2. 왜 이전 안이 틀렸는가

- Raycast의 인상은 카드가 아니라 `command shell`에서 나온다.
- 브라운 중심 팔레트와 큰 정보 카드들은 Raycast보다 무거운 랜딩처럼 보인다.
- 설명 카드와 부가 UI가 많아질수록 command palette의 속도가 사라진다.
- 모바일도 카드 축소판보다 `한 장의 쉘`처럼 보여야 한다.

## 3. 참조해야 할 감각

- [Raycast](https://www.raycast.com/)
- [Raycast iOS](https://www.raycast.com/ios)
- [Linear](https://linear.app/)

가져올 것:

- 상단 search shell
- active row 1개 + muted row 여러 개
- dark base 위의 붉은 bloom
- 빠른 액션 태그
- 명령 리스트 같은 정보 구조

버릴 것:

- 3개 이상 반복되는 설명 카드
- 크고 비슷한 위계의 박스형 카드들
- 브라운 랜딩 감성
- 데스크톱 카드 레이아웃을 모바일로 그대로 줄이는 방식

## 4. 핵심 설계 원칙

### 4.1 Shell First

모든 주요 화면은 먼저 `하나의 shell`로 읽혀야 한다.

- login: 로그인 shell
- list: 최근 문서 shell
- editor: section command rail

### 4.2 Row First

카드보다 row가 기본 단위다.

- active row 1개
- passive row 여러 개
- 오른쪽에는 action tag

문서 목록도 카드 그리드가 아니라 `list shell 안 row list`가 우선이다.

### 4.3 Surface Budget

한 화면에서 강하게 읽히는 덩어리는 3개 이하여야 한다.

- shell
- paper
- 하단 dock 또는 보조 shell

설명 전용 카드 스택은 금지한다.

### 4.4 Paper as Result

앱 자체보다 종이가 결과물처럼 보여야 한다.

- preview는 밝고 선명하게
- 주변은 어둡고 후퇴
- glow는 종이보다 먼저 읽히지 않게

## 5. 화면별 구조

### Frame 1. PC Login Shell

목표:
로그인을 "작업 시작 명령"처럼 느끼게 한다.

레이아웃:

```text
+--------------------------------------------------------------+
| outer frame                                                  |
|  hero copy on left                                           |
|  command shell centered/left                                 |
|  single login CTA inside shell                               |
+--------------------------------------------------------------+
```

구성:

- 좌측 짧은 hero 2줄
- shell 내부 search line
- active row: `Google 계정으로 시작`
- passive row 1~2개: 이어쓰기, PDF

규칙:

- 로그인 카드 별도 박스 금지
- 설명 카드 3개 금지
- CTA는 shell 내부에서 해결

### Frame 2. PC List Shell

목표:
최근 작업과 문서 열기를 command list처럼 만든다.

레이아웃:

```text
+--------------------------------------------------------------+
| top utility shell                                            |
+--------------------------------------------------------------+
| main list shell                                              |
| search line                                                  |
| active row: recent resume                                    |
| passive rows: saved resumes / new resume                     |
+--------------------------------------------------------------+
```

구성:

- 상단 compact utility shell
- 본문에 큰 command list shell 하나
- 행 단위로 문서 노출
- new resume도 카드가 아니라 row action으로 처리 가능

규칙:

- document card grid를 기본으로 두지 않는다
- 우측 보조 rail 금지
- 최근 작업 spotlight는 row active state로 해결한다

### Frame 3. PC Editor Shell

목표:
편집기는 `command rail + paper`의 2축이어야 한다.

레이아웃:

```text
+--------------------------------------------------------------+
| compact utility shell                                        |
+---------------------------+----------------------------------+
| section command shell     | paper stage                      |
| rows for basic/exp/etc    | floating paper                   |
| one active section        | faint cool glow                  |
+---------------------------+----------------------------------+
```

구성:

- 좌측: section shell
- 우측: paper stage
- top utility shell에는 저장, PDF, more 정도만

규칙:

- 좌측에 여러 카드로 섹션을 쪼개지 않는다
- 행 리스트 구조를 유지한다
- 상태 pill은 하나만

### Frame 4. Mobile Login Shell

목표:
모바일에서도 한 장의 command shell처럼 보이게 한다.

구성:

- compact header
- shell 하나
- active row가 CTA 역할
- hero는 shell 밖에서 2줄 이내

규칙:

- feature card 금지
- floating 서브 카드 금지

### Frame 5. Mobile List Shell

목표:
최근 문서와 문서 열기를 하나의 list shell에서 해결

구성:

- header
- main list shell
- active row: 최근 작업
- passive rows: 문서들
- 새 이력서 row 또는 하단 dock

규칙:

- 가로형 카드보다 row list가 우선
- 1 screen에서 shell 2개 이상 과도하게 나누지 않는다

### Frame 6. Mobile Editor Shell

목표:
편집과 미리보기 전환은 유지하되, 편집 영역 자체는 command sheet처럼 보이게

구성:

- compact header
- segmented control
- active pane: section rows 또는 paper
- sticky dock

규칙:

- row list 중심
- 카드 중첩 금지
- dock는 3액션 이하

## 6. 제거 규칙

다음은 이번 방향에서 삭제 대상이다.

- 설명용 3열 카드
- 서랍장/워크플로우/팁 같은 보조 정보 카드
- 카드 안에 썸네일이 또 있는 복합 카드
- 로그인 카드 + 플로팅 카드 동시 사용
- 목록 화면의 우측 사이드 정보 박스
- 모바일의 큰 마케팅 카피 블록

## 7. 컬러 방향

핵심은 Raycast 캡처처럼 `검정에 가까운 다크 바탕 + 붉은 bloom + 약한 보라 잔광`이다.

- bg: `#0A0B10`
- bg elevated: `#0E1017`
- shell: `rgba(8, 10, 14, 0.86)`
- shell line: `rgba(255, 255, 255, 0.08)`
- active row: `rgba(255, 255, 255, 0.10)`
- passive row: `rgba(255, 255, 255, 0.03)`
- text primary: `#F4F7FB`
- text secondary: `#C5CCDA`
- text tertiary: `#8C95A8`
- accent warm: `#E8A978`
- red bloom: `rgba(158, 31, 24, 0.55)`
- violet glow: `rgba(109, 92, 255, 0.18)`

## 8. 구현 가드레일

아래가 보이면 실패로 본다.

- card grid가 list shell보다 먼저 읽힘
- support card가 2개 이상 보임
- 설명 텍스트가 row label보다 크거나 많음
- shell 대신 panel/card 혼합 구조가 반복됨
- mobile에서 command list보다 카드가 더 많음

## 9. 구현 에이전트 전달 문장

`Resume Room`은 `Raycast Command Shell` 기준으로 다시 설계한다. 이전 warm-glass / dark-command 문서는 무시하고, [`docs/raycast-command-shell-mockup-v1.md`](/Users/kai/Desktop/ai/docs/raycast-command-shell-mockup-v1.md), [`docs/raycast-command-shell-ui-token-delta-v1.md`](/Users/kai/Desktop/ai/docs/raycast-command-shell-ui-token-delta-v1.md), [`docs/raycast-command-shell-ui-tokens.json`](/Users/kai/Desktop/ai/docs/raycast-command-shell-ui-tokens.json), [`docs/mockups/raycast-command-shell-rough-v1.svg`](/Users/kai/Desktop/ai/docs/mockups/raycast-command-shell-rough-v1.svg)만 기준으로 구현하라.
