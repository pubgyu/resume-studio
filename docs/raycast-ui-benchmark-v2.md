# Raycast UI Benchmark v2

> Deprecated on 2026-03-24. 이 문서는 `search shell 과해석` 이전 버전이다. 최신 기준은 [`docs/raycast-product-benchmark-v3.md`](/Users/kai/Desktop/ai/docs/raycast-product-benchmark-v3.md) 를 사용한다.

작성일: 2026-03-24 (KST)

목적:
Raycast의 특정 검색 컴포넌트 모양을 복제하는 것이 아니라, 실제 제품이 주는 `속도감`, `정보 위계`, `타이포 밀도`, `모바일/데스크톱 차이`를 `Resume Room`에 맞게 해석하기 위한 벤치마크 문서다.

## 1. 확인한 공식 소스

- [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)
- [Raycast for iOS](https://www.raycast.com/ios)
- [Raycast for iOS blog](https://www.raycast.com/blog/raycast-for-ios)
- [Raycast Notes Manual](https://manual.raycast.com/notes)
- [Windows Settings Manual](https://manual.raycast.com/windows/settings)
- [Windows App Launcher Manual](https://manual.raycast.com/windows/app-launcher)

## 2. 공식 소스에서 확인되는 핵심 원칙

### 2.1 Fast, simple, delightful

Raycast는 디자인 원칙을 `fast, simple, and delightful`라고 직접 말한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

의미:

- UI를 화려하게 만드는 것보다 동작 이해 속도가 먼저
- 표면 수를 늘리는 것보다 정보 해석 속도가 먼저
- 미세한 glow/그라디언트는 구조가 정리된 뒤에만 써야 함

### 2.2 Bigger search bar는 “검색이 메인인 흐름”에서만

Raycast는 검색 바가 거의 모든 상호작용의 중심이기 때문에 더 크게 만들었다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- 모든 화면을 검색창처럼 만들라는 뜻이 아니다
- `탐색 대상이 많은 화면`에서만 검색 진입점이 전면에 있어야 한다
- `Resume Room`에서는 목록/빠른 열기/섹션 점프에만 검색형 패턴이 맞다
- 로그인, 빈 상태, 소개 화면 전체를 검색 UI로 만들 필요는 없다

### 2.3 Bottom action bar는 맥락을 묶는 장치

Raycast는 액션, 토스트, 네비게이션 타이틀을 하단 액션 바에 통합했다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- 버튼을 상단에 많이 늘어놓기보다 `현재 문맥의 액션`을 하단 또는 한 줄에 묶는 쪽이 Raycast스럽다
- `Resume Room` 에디터에서는 저장/PDF/더보기 같은 문맥 액션을 퍼뜨리지 말고 한 곳에 모아야 한다

### 2.4 Compact Mode = 주변 chrome를 줄이고 결과에 집중

Raycast는 Compact Mode가 더 focused 하게 만든다고 말한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- UI 감각은 `많은 패널`보다 `적은 크롬`에서 나온다
- editor 화면은 설명/도움말/보조 패널보다 문서와 현재 섹션에 집중해야 한다

### 2.5 모바일은 데스크톱 축소판이 아니다

Raycast iOS는 Home screen을 따로 두고, `search is just a pull away`라고 설명한다.  
출처: [Raycast for iOS](https://www.raycast.com/ios)

또 iOS 블로그에서는 모바일 버전을 여러 번 다시 만들고 `speed, power, and elegance`를 유지하도록 설계했다고 설명한다.  
출처: [Raycast for iOS blog](https://www.raycast.com/blog/raycast-for-ios)

해석:

- 모바일 첫 화면에 큰 검색창을 고정할 필요는 없다
- 모바일에서는 `최근 작업`, `즐겨찾기`, `핵심 기능`이 먼저 보여야 한다
- 검색은 gesture, pull-down, secondary action으로 더 자연스럽다

### 2.6 Notes는 lightweight, frictionless, one-note-focus

Raycast Notes는 `lightweight`, `frictionless`라고 설명하고, 한 번에 하나의 note만 보이는 stack 구조를 사용한다고 설명한다.  
출처: [Raycast Notes Manual](https://manual.raycast.com/notes)

해석:

- 편집 화면은 여러 정보 패널이 아니라 `현재 문서 1개`에 집중해야 한다
- 한번에 한 일만 하게 만드는 구조가 더 Raycast스럽다

### 2.7 Settings / Launcher의 구조적 특징

Windows Settings 문서에서는 Expanded/Compact 모드와 좌측 패널 구조를 설명한다.  
출처: [Windows Settings Manual](https://manual.raycast.com/windows/settings)

App Launcher 문서에서는 `open → type → highlight → enter`, 그리고 `Ctrl K` 액션 패널 흐름을 설명한다.  
출처: [Windows App Launcher Manual](https://manual.raycast.com/windows/app-launcher)

해석:

- 핵심 흐름은 `찾기 → 선택 → 액션`
- 레이아웃도 이 3단을 방해하면 안 된다

## 3. Raycast UI가 실제로 주는 시각 인상

다음은 공식 스크린샷과 문서에서 읽히는 인상이다. 일부는 `공식 설명 + 시각적 관찰`을 합친 해석이다.

### 3.1 구조

- 상단 또는 중심에 핵심 입력/문맥 영역 1개
- 리스트는 row 기반
- 선택된 row 1개가 명확
- 액션은 주변으로 흩어지지 않고 문맥에 붙음

### 3.2 타이포

중요:
공식 문서에서 Raycast 앱의 폰트명을 직접 밝히지는 않았다. 아래는 공식 스크린샷과 플랫폼 성격을 보고 한 `추론`이다.

추론:

- macOS/iOS 네이티브 시스템 산세리프에 가까운 인상
- 과장된 display font를 쓰지 않음
- row label은 중간 굵기
- 메타는 작고 흐리지만 충분히 읽힘
- 타이틀도 크기보다 밀도와 정렬로 힘을 줌

웹 구현 권장:

- 한글: `Noto Sans KR`
- 굵기 운영: `500 / 600 / 700 / 800`
- 폰트 인상을 화려하게 만들기보다 크기/행간/정렬을 닮게 한다

### 3.3 색

- 다크 베이스
- 단일 평면 검정이 아니라 약한 bloom이 들어간 배경
- row active에는 밝은 오버레이
- 액센트는 넓게 쓰지 않고 포인트로만

### 3.4 아이콘

Raycast는 icon set를 단순한 outline style과 굵은 stroke width로 재정비했다고 밝힌다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- Resume Room도 아이콘을 장식으로 많이 쓰기보다 단순하고 일관된 스트로크 규칙으로 맞춰야 한다

## 4. Resume Room에 그대로 가져오면 안 되는 것

- 모든 화면을 command palette처럼 만드는 것
- 로그인 화면 전체를 검색 입력창 구조로 바꾸는 것
- row list를 무시하고 카드만 늘리는 것
- 모바일 첫 화면에 데스크톱 검색 쉘을 그대로 고정하는 것

## 5. Resume Room에 맞게 번역한 원칙

### 데스크톱

- 목록 화면: `compact utility bar + recent row list + optional preview`
- 편집 화면: `left section list + right paper + contextual action bar`
- 검색은 목록과 빠른 열기에만 적극 사용

### 모바일

- 홈: 최근 문서 / 즐겨찾기 / 핵심 기능 우선
- 검색: pull-down 또는 secondary action
- 편집: 한 번에 하나의 섹션 또는 하나의 preview에 집중

## 6. 최종 판단

Raycast의 본질은 `검색창 모양`이 아니라 아래다.

1. 적은 chrome
2. row 중심 구조
3. 빠른 액션 위계
4. lightweight focus
5. 플랫폼에 맞는 UI 번역

따라서 `Resume Room`도 `검색 컴포넌트를 어디에 붙일지`보다 `어떤 화면이 row-first여야 하는지`, `어디서만 search-first여야 하는지`, `모바일에서 search를 숨기는지`를 먼저 결정해야 한다.
