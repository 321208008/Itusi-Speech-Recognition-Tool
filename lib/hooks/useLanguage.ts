'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TranslationKeys } from '@/lib/i18n/types';
import en from '@/lib/i18n/locales/en.json';
import zh from '@/lib/i18n/locales/zh.json';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

function getBrowserLanguage(): 'zh' | 'en' {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('zh') ? 'zh' : 'en';
}

export function useLanguage() {
  const [currentLocale, setCurrentLocale] = useState(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      return localStorage.getItem('locale') || getBrowserLanguage();
    }
    return 'en';
  });

  const translations = currentLocale === 'zh' ? zh : en;

  const t = useCallback((key: NestedKeyOf<TranslationKeys>) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value[k];
    }
    return value || key;
  }, [translations]);

  const setLocale = useCallback((newLocale: 'zh' | 'en') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      setCurrentLocale(newLocale);
      window.location.reload();
    }
  }, []);

  return { locale: currentLocale, t, setLocale };
}