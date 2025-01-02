'use client';

import { create } from 'zustand';
import type { TranslationKeys } from '../i18n/types';
import en from '../i18n/locales/en.json';
import zh from '../i18n/locales/zh.json';

type Language = 'en' | 'zh';

interface LanguageState {
  locale: Language;
  translations: Record<Language, TranslationKeys>;
  t: (key: keyof TranslationKeys) => string;
  setLanguage: (language: Language) => void;
}

export const useLanguage = create<LanguageState>((set, get) => ({
  locale: 'en',
  translations: {
    en,
    zh,
  },
  t: (key) => {
    const state = get();
    const translation = state.translations[state.locale];
    const keys = key.split('.');
    let value: any = translation;
    for (const k of keys) {
      value = value[k];
    }
    return value || key;
  },
  setLanguage: (language) => set({ locale: language }),
}));