'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function LanguageToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { locale, setLocale } = useLanguage();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    setLocale(newLocale);
  };

  // 在客户端渲染之前返回一个固定的初始状态
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
      >
        中
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
    >
      {locale === 'zh' ? '中' : 'En'}
    </Button>
  );
}