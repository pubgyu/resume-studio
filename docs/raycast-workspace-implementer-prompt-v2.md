# Raycast Workspace Implementer Prompt v2

> Deprecated on 2026-03-24. 최신 strict 프롬프트는 [`docs/raycast-strict-implementer-prompt-v3.md`](/Users/kai/Desktop/ai/docs/raycast-strict-implementer-prompt-v3.md) 를 사용한다.

`docs/raycast-product-benchmark-v3.md`, `docs/raycast-workspace-spec-v2.md`, `docs/raycast-workspace-ui-tokens-v2.json`, `docs/mockups/raycast-workspace-rough-v2.svg`만 기준으로 기존 기능은 유지한 채 UI를 다시 구성하라; Raycast를 검색창 모양으로 복제하지 말고 `native utility window + dense row hierarchy + contextual action bar`로 번역하며, 한글 폰트는 현재 코드 기준대로 `Noto Sans KR`를 유지하고 타입 밀도는 문서 수치대로 조정하라. Desktop login은 fake command row를 제거한 compact split utility window, list는 `window bar + recent/document row list + selected preview + bottom action bar`, editor는 `section rail + single form panel + paper preview`, mobile home은 `recent-first + dense row list + secondary search`, mobile editor는 `segmented control + single-task surface + sticky dock` 구조로 설계하고, 브라운 배경, support card stack, row별 과한 버튼 노출, search shell 남용은 금지하라.
