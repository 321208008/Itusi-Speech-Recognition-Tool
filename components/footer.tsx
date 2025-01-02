'use client';

import * as React from 'react';
import { Github, Twitter, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function Footer() {
  const [mounted, setMounted] = React.useState(false);
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端渲染之前返回一个固定的初始状态
  if (!mounted) {
    return (
      <footer className="mt-auto border-t">
        <div className="mx-auto max-w-4xl p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <a
                href="https://github.com/321208008"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com/zyailive"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://itusi.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Globe className="h-6 w-6" />
                <span className="sr-only">Website</span>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Itusi 语音识别工具。保留所有权利。
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <a
              href="https://github.com/321208008"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com/zyailive"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://itusi.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Globe className="h-6 w-6" />
              <span className="sr-only">Website</span>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
} 