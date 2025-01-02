'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TranslationKeys } from '@/lib/i18n/types';
import en from '@/lib/i18n/locales/en.json';
import zh from '@/lib/i18n/locales/zh.json';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export function useLanguage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('zh');

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('locale') || 'zh';
    setCurrentLocale(savedLocale);
  }, []);

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
    localStorage.setItem('locale', newLocale);
    setCurrentLocale(newLocale);
    router.refresh();
  }, [router]);

  return { locale: currentLocale, t, setLocale, mounted };
}