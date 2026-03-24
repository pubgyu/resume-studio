# Modern Glow Benchmark Shortlist

작성일: 2026-03-24 (KST)

목적:
현재 UI가 "AI가 만든 기본형"처럼 보이는 가장 큰 이유는 색보다 레이아웃 리듬, 패널 위계, 여백의 일관성이 약하기 때문이다. 이 문서는 `Resume Room`에 맞는 실제 벤치마크와 조합 가능한 목업 방향만 추려 둔 리스트다.

## 1. 지금 화면에서 부족한 점

- 상단 영역과 본문 영역의 밀도 차이가 애매하다.
- 패널 반경, 내부 패딩, 섹션 간격이 화면마다 완전히 같은 리듬으로 느껴지지 않는다.
- PC에서는 "작업 공간"보다 "카드 몇 개를 올린 페이지"처럼 보일 위험이 있다.
- 모바일에서는 깨지지는 않지만 데스크톱 레이아웃을 세로로 쌓은 인상이 강하다.
- 미리보기와 에디터의 위계가 아직 충분히 분리되지 않았다.

## 2. 벤치마크 우선순위

### A. 가장 먼저 볼 레퍼런스

1. [Raycast](https://www.raycast.com/)
2. [Craft](https://www.craft.do/)
3. [Arc](https://arc.net/)
4. [Notion Calendar](https://www.notion.com/product/calendar)
5. [Framer Design](https://www.framer.com/design/)
6. [Linear](https://linear.app/)
7. [Superhuman](https://superhuman.com/)

### B. 왜 이 순서인가

- `Raycast`: 모던한 글로우, 빠른 위계, 작업도구다운 밀도
- `Craft`: 문서 기반 제품의 따뜻한 감성과 여백 처리
- `Arc`: 블러, 곡면, 차분한 미래감
- `Notion Calendar`: 데스크톱과 모바일을 다른 UX로 보는 태도
- `Framer`: 하이엔드 랜딩 polish와 유연한 레이아웃 연출
- `Linear`: 정보 밀도와 정리감
- `Superhuman`: 프리미엄 SaaS 톤과 높은 대비의 정제감

## 3. 벤치마크별로 가져올 것

### 3.1 Raycast

소스:

- [Raycast 홈페이지](https://www.raycast.com/)
- [Raycast iOS](https://www.raycast.com/ios)
- [A fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel)

근거:

- Raycast는 "fast, simple, and delightful"를 디자인 원칙으로 둔다. [출처](https://www.raycast.com/blog/a-fresh-look-and-feel)
- 검색 바와 하단 action bar의 위계를 강하게 만들었다. [출처](https://www.raycast.com/blog/a-fresh-look-and-feel)
- iOS에서는 홈, 위젯, 액션 버튼, 커스텀 키보드처럼 모바일 문맥에 맞는 진입점을 별도로 설계한다. [출처](https://www.raycast.com/ios)

가져올 것:

- PC에서 상단바보다 "핵심 액션 바"가 더 중요하게 읽히는 구조
- 어두운 바탕 위 부드러운 glow와 glass highlight
- 모바일에서 하단 액션 존을 명확히 두는 방식

버릴 것:

- 런처 앱처럼 너무 차가운 검정 UI
- 키보드 중심 도구의 과도한 하드코어 분위기

### 3.2 Craft

소스:

- [Craft 홈페이지](https://www.craft.do/)
- [Craft Customize](https://www.craft.do/customize)
- [Craft App Styles](https://support.craft.do/en/write-and-edit/styling/app-styles)
- [Craft iOS 제스처](https://support.craft.do/ko/introduction/mobile-features/gestures)

근거:

- Craft는 문서를 시각적으로도 pleasing 하게 느끼게 한다. [출처](https://www.craft.do/)
- `Glow Sand` 같은 스타일 이름처럼 문서 무드 자체를 제품 크롬에 확장한다. [출처](https://www.craft.do/customize)
- App Style은 문서의 색을 사이드바와 툴바로 확장해 immersive experience를 만든다. [출처](https://support.craft.do/en/write-and-edit/styling/app-styles)
- 모바일에서는 swipe 선택, 검색 제스처, long press 등 터치 우선 편집을 별도로 설계한다. [출처](https://support.craft.do/ko/introduction/mobile-features/gestures)

가져올 것:

- 따뜻한 아이보리, 샌드, 브론즈 계열 팔레트
- 문서와 앱 크롬이 분리되지 않는 몰입형 톤
- 모바일에서 버튼보다 제스처와 컨텍스트 액션을 먼저 생각하는 방식

버릴 것:

- 너무 종이풍으로만 가서 오래된 에디터처럼 보이는 위험

### 3.3 Arc

소스:

- [Arc 홈페이지](https://arc.net/)

근거:

- Arc는 "Clean and calm"을 전면에 둔다. [출처](https://arc.net/)
- Themes, Split View, Spaces처럼 개인화와 레이어가 동시에 보인다. [출처](https://arc.net/)

가져올 것:

- 블러와 반투명 레이어를 과하지 않게 쓰는 태도
- 둥근 패널과 떠 있는 사이드성 UI
- 기능성은 유지하면서도 "예쁜 도구"로 느껴지는 무드

버릴 것:

- 브라우저 앱 특유의 playful함이 너무 많아지는 것

### 3.4 Notion Calendar

소스:

- [Notion Calendar 제품 페이지](https://www.notion.com/product/calendar)
- [Notion Calendar 앱 문서](https://www.notion.com/help/notion-calendar-apps)

근거:

- Notion Calendar는 "beautifully designed"와 "Modern design"을 명시한다. [출처](https://www.notion.com/product/calendar)
- 모바일은 데스크톱과 다르고, 위젯과 제한된 뷰 범위를 따로 둔다. [출처](https://www.notion.com/help/notion-calendar-apps)

가져올 것:

- 데스크톱과 모바일을 같은 화면 축소판으로 취급하지 않는 태도
- 모바일 위젯/락스크린/빠른 확인 UX 사고방식
- 정보 밀도는 높지만 표면은 깨끗한 카드 설계

버릴 것:

- 너무 중립적인 노션식 평면감

### 3.5 Framer

소스:

- [Framer 홈페이지](https://www.framer.com/)
- [Framer Design](https://www.framer.com/design/)

근거:

- Framer는 breakpoints, animations, interactions를 한 흐름으로 보여준다. [출처](https://www.framer.com/design/)
- 실제 사례들에서 immersive brand site, design control 같은 문맥이 반복된다. [출처](https://www.framer.com/)

가져올 것:

- 히어로 섹션의 고급스러운 glow 처리
- 카드와 배경 레이어 간 깊이 차이
- 작은 모션만으로도 고급스럽게 보이는 polish

버릴 것:

- 마케팅 랜딩처럼 너무 화려한 그라디언트

### 3.6 Linear

소스:

- [Linear 홈페이지](https://linear.app/)

근거:

- Linear는 "Designed for speed"와 "Reduces noise and restores momentum"을 전면에 둔다. [출처](https://linear.app/)
- 데모 화면에서 레이아웃 밀도와 우선순위가 매우 명확하다. [출처](https://linear.app/)

가져올 것:

- 에디터 패널의 밀도 제어
- 같은 화면 안에서 헤더, 콘텐츠, 상태 정보의 위계 분리
- "빨리 쓸 수 있을 것 같은" 구조

버릴 것:

- 너무 업무툴스럽고 차가운 톤

### 3.7 Superhuman

소스:

- [Superhuman](https://superhuman.com/)

근거:

- 제품 소개에서 고급스러운 AI productivity suite 톤이 강하다. [출처](https://superhuman.com/)
- 시각적으로는 짙은 배경, 밝은 카드, soft glow 오브제가 반복된다. [출처](https://superhuman.com/)

가져올 것:

- 프리미엄한 대비
- 큰 타이틀과 짧은 보조카피의 균형
- 화면이 넓어 보여도 허전하지 않은 섹션 구성

버릴 것:

- 너무 기업 홍보형 랜딩으로 가는 구성

## 4. 목업 후보

### Mockup 1. Warm Glass Workspace

추천도: 가장 높음

조합:

- Raycast 40%
- Craft 35%
- Arc 15%
- Linear 10%

PC 방향:

- 상단은 낮고 넓은 matte glass bar
- 본문은 `editor rail + preview stage`의 분리감 강화
- preview 배경에 아주 약한 glow halo
- 카드 반경은 크되 내부 여백은 단단하게

모바일 방향:

- 상단은 문서명 + 저장 상태만
- 하단 sticky action dock
- `편집 / 미리보기` segmented 전환

적합한 이유:

- 지금 프로젝트의 문서/작업실 성격과 가장 잘 맞는다.

### Mockup 2. Dark Glow Studio

추천도: 높음

조합:

- Raycast 35%
- Arc 30%
- Superhuman 20%
- Linear 15%

PC 방향:

- 다크 차콜 바탕
- 패널 가장자리에 약한 블루/앰버 glow
- 미리보기 종이만 따뜻한 아이보리로 띄움

모바일 방향:

- 하단 바와 바텀시트가 핵심
- 미리보기는 다크 배경 위 단일 종이 카드처럼 처리

적합한 이유:

- 세련되지만 잘못하면 너무 AI 툴처럼 보일 수 있다.

### Mockup 3. Editorial Sand Glass

추천도: 높음

조합:

- Craft 45%
- Framer 30%
- Notion Calendar 15%
- Arc 10%

PC 방향:

- 샌드/아이보리 배경
- 유리처럼 흐린 상단바
- 히어로 카피보다 문서 카드와 종이 질감이 중심

모바일 방향:

- 카드형 리스트가 부드럽고 넓게 숨 쉬는 구조
- CTA는 크게, 나머지 도구는 간결하게

적합한 이유:

- 가장 "브랜드스럽고 보기 좋은" 방향이다.
- 대신 너무 부드러우면 생산성 툴의 날카로움이 부족할 수 있다.

### Mockup 4. Precision Calendar Workspace

추천도: 중상

조합:

- Notion Calendar 35%
- Linear 30%
- Raycast iOS 20%
- Craft 15%

PC 방향:

- 정보 밀도는 높지만 표면은 미니멀
- 상태 배지, 날짜, 저장 상태, 최근 수정 같은 메타가 정교하게 배치

모바일 방향:

- 위젯형 사고방식
- 최근 문서, 이어쓰기, 새 문서 액션을 first screen에 배치

적합한 이유:

- 실제 사용성 개선에는 강하다.
- 감성은 상대적으로 약할 수 있다.

### Mockup 5. Premium Minimal Resume OS

추천도: 중상

조합:

- Superhuman 35%
- Raycast 25%
- Craft 25%
- Framer 15%

PC 방향:

- 큰 타이틀과 극단적으로 적은 텍스트
- 핵심 카드만 강조하고 나머지는 후퇴
- 배경 오브제는 추상 glow 하나만 사용

모바일 방향:

- 홈 화면에서 `최근 이력서`, `저장 상태`, `새 이력서` 3개만 강하게

적합한 이유:

- SEO 이미지, 로그인, 랜딩 감성에는 좋다.
- 실제 편집기 화면에는 보완이 더 필요하다.

## 5. 최종 추천

### 1순위

`Warm Glass Workspace`

이유:

- 현재 앱이 문서 편집기이기 때문에 가장 현실적이다.
- glow/blur를 넣어도 과하지 않다.
- PC와 모바일 둘 다 자연스럽게 확장된다.

### 2순위

`Editorial Sand Glass`

이유:

- 브랜딩과 시각 완성도가 가장 좋다.
- SEO 썸네일과 로그인 화면까지 한 톤으로 묶기 좋다.

### 3순위

`Dark Glow Studio`

이유:

- 임팩트는 좋지만 제품이 조금 더 일반적인 AI 툴처럼 보일 수 있다.

## 6. 다음 액션 추천

다음 구현 에이전트에게는 아래처럼 전달하면 된다.

`Warm Glass Workspace`를 기본안으로 잡고, PC는 `Raycast + Craft + Arc`, 모바일은 `Raycast iOS + Notion Calendar + Craft Gestures`를 섞어서 재설계하라. 핵심은 패널 위계, 여백 리듬, blur/glow 강도 조절, 모바일 하단 액션 존 재배치다.
