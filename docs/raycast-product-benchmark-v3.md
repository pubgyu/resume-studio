# Raycast Product Benchmark v3

> Deprecated on 2026-03-24. 최신 strict 기준은 [`docs/raycast-strict-benchmark-v4.md`](/Users/kai/Desktop/ai/docs/raycast-strict-benchmark-v4.md) 를 사용한다.

작성일: 2026-03-24 (KST)

목적:
이번 문서는 `검색창 한 장면`이 아니라, Raycast 제품 전반이 주는 실제 사용감과 시각적 밀도를 `Resume Room`에 맞게 번역하기 위한 최신 벤치마크다.

## 1. 이번에 다시 확인한 공식 소스

- [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)
- [Raycast for iOS](https://www.raycast.com/ios)
- [Raycast for iOS blog](https://www.raycast.com/blog/raycast-for-ios)
- [Meet the new Raycast Notes](https://www.raycast.com/blog/raycast-notes)
- [Notes Manual](https://manual.raycast.com/notes)
- [Raycast for Windows](https://www.raycast.com/blog/raycast-for-windows)
- [Windows App Launcher Manual](https://manual.raycast.com/windows/app-launcher)

## 2. 이번 재해석의 핵심

이전 오해:

- Raycast스럽다는 말을 `검색창 모양`으로 좁혀 해석했다
- 그래서 login, list, editor 전부가 가짜 command palette처럼 변했다
- 결과적으로 정보 위계보다 장식적 shell이 먼저 보였다

이번 결론:

- Raycast의 본질은 `native utility window`, `dense row hierarchy`, `contextual actions`, `low chrome`, `fast focus`다
- search-first는 검색이 중심인 순간에만 쓴다
- 나머지 화면은 `검색창 복제`가 아니라 `작업용 유틸리티 창`처럼 보여야 한다

## 3. 공식 소스에서 확인되는 제품 원칙

### 3.1 Fast, simple, delightful

Raycast는 디자인 원칙을 직접 `fast, simple, and delightful`라고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- 구조를 먼저 정리하고 효과를 나중에 얹는다
- 표면 수를 줄이고 동작 이해 속도를 높인다
- glow와 blur는 분위기용이지 레이아웃을 대신하지 않는다

### 3.2 Bigger search bar는 검색이 중심일 때만

Raycast는 검색 바가 거의 모든 상호작용의 중심이기 때문에 더 크게 만들었다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- 검색이 핵심인 `launcher`, `quick open`, `search notes`에는 크고 분명한 입력이 맞다
- 로그인, 소개, 편집 본문처럼 검색이 본업이 아닌 화면은 search shell을 복제하면 안 된다

### 3.3 Bottom action bar는 Raycast 감각의 핵심 장치다

Raycast는 액션, 토스트, 내비게이션 타이틀을 하단 action bar에 통합했다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- 버튼을 여기저기 흩뿌리는 대신 현재 선택된 문맥의 액션을 한 줄에 모은다
- `Resume Room` 목록과 편집기에서도 이 패턴이 더 자연스럽다

### 3.4 Compact Mode는 “덜 보여서 더 빠른” 구조다

Raycast는 Compact Mode가 더 focused 하게 만든다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- 큰 카드, 큰 배지, 큰 설명 덩어리보다 조밀한 row 구조가 먼저다
- 앱 화면은 랜딩 페이지처럼 꾸미지 않는다

### 3.5 Notes는 한 번에 하나에 집중한다

Raycast Notes는 `fast, light, and frictionless`하며, 매뉴얼에서는 `Only one note is visible at the time`라고 설명한다.  
출처: [Meet the new Raycast Notes](https://www.raycast.com/blog/raycast-notes), [Notes Manual](https://manual.raycast.com/notes)

해석:

- 편집기는 여러 카드 더미가 아니라 `현재 섹션`과 `현재 문서` 중심이어야 한다
- 부가 정보는 늘리지 말고 필요한 순간에만 보이게 한다

### 3.6 모바일은 데스크톱 복사본이 아니다

Raycast iOS는 Home을 따로 두고 `search is just a pull away`라고 설명한다.  
출처: [Raycast for iOS](https://www.raycast.com/ios)

또 iOS 블로그에서는 `speed, power, and elegance`를 모바일에 맞게 다시 맞췄다고 설명한다.  
출처: [Raycast for iOS blog](https://www.raycast.com/blog/raycast-for-ios)

해석:

- 모바일 첫 화면은 최근 항목과 핵심 액션이 먼저다
- 검색은 보조 진입이어야지 첫 화면의 주인공이 아니다

### 3.7 플랫폼에 맞게 “그 환경에 속한 것처럼” 보여야 한다

Raycast는 Windows 버전도 `feel like it belongs here, not like something ported over`라고 설명한다.  
출처: [Raycast for Windows](https://www.raycast.com/blog/raycast-for-windows)

해석:

- Resume Room도 Raycast를 흉내 내는 게 아니라 웹앱 안에서 자연스러운 생산성 도구처럼 보여야 한다
- 즉, `Raycast 복제`보다 `Raycast 원칙의 번역`이 더 중요하다

## 4. Raycast UI가 실제로 주는 시각 인상

아래는 공식 소스의 설명과 공개 스크린샷을 함께 본 뒤 내린 설계용 해석이다.  
특히 폰트명과 정확한 px 값은 공식 문서에 공개되어 있지 않으므로 `추론`임을 전제로 한다.

### 4.1 창 감각

- 전체 화면을 꽉 채우는 웹 랜딩보다 `떠 있는 utility window` 인상
- 외곽은 부드럽고 내부는 조밀하다
- 강한 surface는 2단 이내로 제한된다

### 4.2 정보 구조

- row가 기본 단위다
- active row 1개가 확실하다
- 상세 영역은 `선택 결과`를 보여주는 보조 무대다
- 액션은 하단이나 문맥 옆에 붙고, 모든 row에 항상 노출되지 않는다

### 4.3 타이포 인상

중요:
공식 앱 폰트명은 확인되지 않았다. 아래는 제품 스크린샷과 macOS / iOS / Windows 네이티브 UI 인상을 근거로 한 추론이다.

추론:

- 과장된 display font가 아니라 시스템 산세리프 계열 인상
- 큰 제목보다 `14px / 12px` 전후의 dense scale이 더 중요
- 굵기 대비와 정렬로 위계를 만든다

`Resume Room` 웹 구현 기준:

- 한글: `Noto Sans KR`
- 운영 굵기: `500 / 600 / 700 / 800`
- 영문 eyebrow도 별도 display font 없이 같은 계열 안에서 해결

권장 타입 스케일:

- window kicker: `11 / 14 / 700`
- utility text: `12 / 16 / 600`
- row title: `14 / 20 / 600`
- row meta: `12 / 16 / 500`
- section title: `18 / 24 / 700`
- page title: `24 / 28 / 700`
- login title desktop: `32 / 36 / 800`
- login title mobile: `28 / 32 / 800`

### 4.4 색과 빛

- 베이스는 브라운이 아니라 near-black / charcoal
- 배경은 완전 평면 검정이 아니라 아주 약한 red bloom + violet haze
- 활성 상태는 넓은 gradient가 아니라 얇은 overlay와 미세한 highlight
- CTA에만 warm amber를 제한적으로 사용

### 4.5 아이콘과 장식

Raycast는 outline icon과 더 굵은 stroke width를 정리했다고 설명한다.  
출처: [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

해석:

- 아이콘은 장식보다 방향성 표시용
- radius, stroke, icon optical size를 통일해야 한다
- 문서 썸네일과 paper preview가 아이콘보다 더 중요하다

## 5. Resume Room에 적용할 구조적 번역

### 5.1 Login

- 마케팅 히어로가 아니라 `compact utility window`
- 좌측은 짧은 가치 제안
- 우측은 진입 액션 하나
- fake command rows 금지

### 5.2 List

- 중심은 `recent row list + selected preview`
- 문서별 복제/삭제 버튼을 항상 노출하지 않는다
- 행 선택 이후 하단 action bar에 문맥 액션을 모은다

### 5.3 Editor

- `section rail + current form + paper preview`
- 현재 편집 중인 섹션만 분명하게 보이게 한다
- 아코디언 카드 더미, 설명 카드 더미 금지

### 5.4 Mobile

- 홈은 recent-first
- 검색은 secondary
- 편집은 single-task
- 하단 dock은 유지하되 액션 개수를 줄인다

## 6. 이번에 분명히 버릴 것

- 검색창처럼 보이는 login
- row마다 달린 과한 태그와 버튼
- support card 3개 이상 반복
- 브라운 대시보드 배경
- 카드와 panel과 shell이 한 화면에 모두 섞인 구조

## 7. 최종 판단

Raycast 느낌은 아래 조합에서 나온다.

1. 떠 있는 dark utility window
2. dense row hierarchy
3. 한 번에 하나에 집중하는 detail / preview
4. 분산되지 않은 contextual actions
5. 시스템 UI 같은 폰트 밀도
6. 절제된 red / violet ambient light

따라서 새 설계는 `search shell imitation`이 아니라 `native productivity window translation`을 목표로 해야 한다.
