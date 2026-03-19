"use client";

import { atom } from "jotai";

import {
  createSpellcheckFieldState,
  type SpellcheckFieldState
} from "@/lib/resume-builder/spellcheck";

export const EDITOR_SECTION_IDS = [
  "template",
  "basic",
  "photo",
  "contact",
  "skills",
  "salary",
  "experience",
  "education",
  "projects",
  "certifications",
  "languageStudies",
  "portfolios"
] as const;

export type ThemeMode = "light" | "dark";
export type EditorSectionId = (typeof EDITOR_SECTION_IDS)[number];

export const themeModeAtom = atom<ThemeMode>("light");
export const hasLoadedThemeAtom = atom(false);
export const openSectionIdsAtom = atom<EditorSectionId[]>([]);
export const spellcheckFieldStatesAtom = atom<Record<string, SpellcheckFieldState>>({});

export const toggleThemeModeAtom = atom(null, (get, set) => {
  set(themeModeAtom, get(themeModeAtom) === "dark" ? "light" : "dark");
});

export const setOpenSectionIdsAtom = atom(null, (_get, set, nextValues: string[]) => {
  set(openSectionIdsAtom, nextValues.filter(isEditorSectionId));
});

export const setSpellcheckFieldStateAtom = atom(
  null,
  (get, set, payload: { fieldId: string; nextState: Partial<SpellcheckFieldState> }) => {
    const currentState =
      get(spellcheckFieldStatesAtom)[payload.fieldId] ?? createSpellcheckFieldState();

    set(spellcheckFieldStatesAtom, {
      ...get(spellcheckFieldStatesAtom),
      [payload.fieldId]: {
        ...currentState,
        ...payload.nextState
      }
    });
  }
);

export const clearSpellcheckFieldStateAtom = atom(null, (get, set, fieldId: string) => {
  const nextStates = { ...get(spellcheckFieldStatesAtom) };

  delete nextStates[fieldId];
  set(spellcheckFieldStatesAtom, nextStates);
});

function isEditorSectionId(value: string): value is EditorSectionId {
  return EDITOR_SECTION_IDS.includes(value as EditorSectionId);
}
