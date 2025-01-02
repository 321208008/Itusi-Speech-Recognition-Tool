'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function LanguageToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { locale, setLanguage } = useLanguage();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={mounted ? toggleLanguage : undefined}
    >
      {mounted ? (locale === 'zh' ? '中' : 'EN') : 'EN'}
    </Button>
  );
}