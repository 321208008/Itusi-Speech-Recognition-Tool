'use client';

import { Github, Twitter, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function Footer() {
  const { t, locale } = useLanguage();
  const currentYear = new Date().getFullYear();

  const copyright = locale === 'zh' 
    ? `© ${currentYear} Itusi 语音识别工具。保留所有权利。`
    : `© ${currentYear} Itusi Speech Recognition Tool. All rights reserved.`;

  return (
    <footer className="w-full border-t border-border/40 bg-background py-4">
      <div className="container flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/321208008"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="https://twitter.com/zyailive"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </a>
          <a
            href="https://itusi.cn"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Website</span>
          </a>
        </div>
        <div className="flex flex-col items-center gap-4 px-8 md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
} 