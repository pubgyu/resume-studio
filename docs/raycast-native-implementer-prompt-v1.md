# Raycast Native Implementer Prompt v1

> Deprecated on 2026-03-24. 최신 프롬프트는 [`docs/raycast-workspace-implementer-prompt-v2.md`](/Users/kai/Desktop/ai/docs/raycast-workspace-implementer-prompt-v2.md) 를 사용한다.

`docs/raycast-ui-benchmark-v2.md`, `docs/raycast-native-workspace-spec-v1.md`, `docs/raycast-native-ui-tokens-v1.json`만 기준으로 기존 기능은 유지한 채 UI를 다시 구성하라; Raycast의 특정 검색 컴포넌트 모양을 모든 화면에 복제하지 말고, 공식 원칙인 `fast / simple / delightful`, `bigger search bar where search is primary`, `bottom action bar`, `compact mode`, `lightweight / frictionless`, `mobile home + pull-to-search`를 `Resume Room`에 맞게 번역하라. Desktop login은 compact split layout, list는 `utility bar + recent rows + selected preview`, editor는 `section list + paper + contextual actions`, mobile home은 `recent/favorites first, search secondary`, mobile editor는 `segmented control + sticky dock`로 설계하고, support card 스택이나 과한 브라운 배경은 추가하지 말라.
