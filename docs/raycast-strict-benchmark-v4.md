# Raycast Strict Benchmark v4

작성일: 2026-03-24 (KST)

목적:
이 문서는 `Resume Room`을 Raycast처럼 보이게 만들기 위한 최신 벤치마크다.  
이번 기준은 `Raycast에서 영감을 받은 UI`가 아니라, 공개된 Raycast 공식 문서에서 반복적으로 확인되는 패턴만 남기는 것이다.

## 1. 확인한 공식 소스

- [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)
- [Action Panel Manual](https://manual.raycast.com/action-panel)
- [Settings Manual](https://manual.raycast.com/preferences)
- [Raycast for iOS](https://www.raycast.com/blog/raycast-for-ios)
- [Raycast for Windows](https://www.raycast.com/blog/raycast-for-windows)
- [Meet the new Raycast Notes](https://www.raycast.com/blog/raycast-notes)
- [Raycast Notes](https://www.raycast.com/core-features/notes?via=09)
- [Windows App Launcher Manual](https://manual.raycast.com/windows/app-launcher)

## 2. 이번에 버릴 것

이전 설계에서 버려야 하는 것:

- 브라운 베이스 배경
- 살구색 또는 피치색 active fill
- 모든 화면을 command shell처럼 만드는 방식
- fake search row, fake action row
- 설명용 카드와 support card stack
- 각 row에 복제/삭제 버튼을 상시 노출하는 방식

이유:

- 이런 요소들은 Raycast 공식 문서보다 우리 해석이 더 많이 섞인 결과다
- Raycast는 화려한 브랜드 색보다 구조, 속도, 밀도, 액션 모델이 먼저다

## 3. 공식 소스에서 반복되는 Raycast 원칙

### 3.1 Fast, simple, delightful

Raycast는 디자인 원칙을 `fast, simple, and delightful`라고 직접 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- 정보 밀도를 높이되 복잡하게 보이면 안 된다
- 표면은 적고, 상호작용은 빨라야 한다
- 장식은 구조를 돕는 수준까지만 허용된다

### 3.2 Search는 중심일 때만 크게

Raycast는 검색이 거의 모든 상호작용의 중심이기 때문에 search bar를 크게 만들었다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- `list / quick open / search notes`에서는 검색이 주인공
- `login / editor / mobile home`에서는 검색이 주인공이 아니다

### 3.3 Bottom action bar는 Raycast 핵심 패턴

Raycast는 액션, 토스트, navigation title을 하단 action bar에 통합했다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

또 Action Panel 문서는 `↵`가 항상 primary action이고, `⌘K`가 more actions라고 설명한다.  
출처: [Action Panel Manual](https://manual.raycast.com/action-panel)

해석:

- 중요한 액션은 한 군데에 모여야 한다
- 선택된 대상이 바뀌면 action bar의 내용도 바뀌어야 한다
- row 안에 버튼을 많이 박는 방식은 Raycast와 멀다

### 3.4 Compact Mode와 low chrome

Raycast는 Compact Mode가 더 focused 하게 만든다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

Settings 문서도 text size, appearance, root search 복귀 위치 같은 세부 제어를 보여준다.  
출처: [Settings Manual](https://manual.raycast.com/preferences)

해석:

- 큰 카드보다 조밀한 row와 얇은 chrome가 중요하다
- UI는 전체 화면 대시보드보다 `떠 있는 utility window`에 가깝다

### 3.5 플랫폼에 맞게 속해야 한다

Raycast는 Windows 버전을 소개하며 `feel like it belongs here, not like something ported over`라고 설명한다.  
출처: [Raycast for Windows](https://www.raycast.com/blog/raycast-for-windows)

해석:

- Resume Room도 Raycast를 복제하는 게 아니라 웹에서 Raycast처럼 느껴져야 한다
- 즉, shape만 복사하지 말고 질감과 정보 구조를 가져와야 한다

### 3.6 Notes의 핵심은 fast, light, frictionless

Raycast Notes는 `fast, light, and frictionless`라고 설명한다.  
출처: [Meet the new Raycast Notes](https://www.raycast.com/blog/raycast-notes), [Raycast Notes](https://www.raycast.com/core-features/notes?via=09)

해석:

- 편집기는 카드 스택이 아니라 단일 작업면이어야 한다
- 한 번에 한 문맥만 보이게 해야 한다

### 3.7 모바일은 Home first

Raycast for iOS는 홈에서 시작하고, 홈은 자주 쓰는 기능 접근을 우선하며 search는 pull down으로 진입한다고 설명한다.  
출처: [Raycast for iOS](https://www.raycast.com/blog/raycast-for-ios)

해석:

- 모바일 첫 화면은 최근 작업과 핵심 진입점이 먼저다
- 데스크톱 launcher 창을 그대로 축소하면 안 된다

## 4. Raycast를 실제로 닮게 만드는 시각 규칙

중요:
공식 문서는 정확한 폰트명, 폰트 px, 컬러 토큰을 공개하지 않는다.  
아래는 공식 스크린샷과 문서 설명을 기준으로 한 `추론`이다.

### 4.1 창 감각

- 검은 풀스크린 페이지보다 어두운 떠 있는 창
- 내부는 2~3개의 강한 표면만 사용
- 배경 글로우는 약하고 뒤로 물러나야 한다

### 4.2 타이포

- 과장된 display font 금지
- 대부분의 정보는 `12px / 14px / 16px`대에서 해결
- 굵기는 `500 / 600 / 700`
- 웹 구현 한글은 현재 코드 기준대로 `Noto Sans KR`

### 4.3 색

- 베이스는 near-black / slate
- active는 살구색 fill이 아니라 `밝은 charcoal overlay`
- accent는 CTA나 shortcut hint에만 아주 작게
- warm accent도 가능하지만 넓은 면적 fill은 지양

### 4.4 아이콘

- outline 기반
- stroke와 radius 규칙 통일
- 문서 앱에서는 아이콘보다 row 구조와 action bar가 더 중요

## 5. Resume Room에 적용할 strict 번역

### Login

- 짧은 소개 + 로그인 panel
- fake command list 금지
- 버튼도 브랜드색 블록이 아니라 어두운 neutral control 중심

### List

- 검색 필드는 compact
- 핵심은 recent row list
- 선택 후 하단 action bar에서 열기/복제/삭제

### Editor

- 좌측 section rail
- 가운데 single form surface
- 우측 paper preview
- 하단 contextual action bar

### Mobile

- home screen first
- recent / favorites / core actions 우선
- search는 보조
- editor는 single-task + sticky dock

## 6. 최종 결론

Raycast처럼 보이게 하려면 다음을 지켜야 한다.

1. dark utility window
2. dense row-first hierarchy
3. bottom action bar
4. small neutral controls
5. fast, light, frictionless editing
6. mobile home-first flow

이 여섯 가지보다 더 중요한 `Raycast 느낌`은 없다.
