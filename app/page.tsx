'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { AudioRecorder } from '@/components/audio-recorder';
import { LanguageToggle } from '@/components/language-toggle';
import { ModeToggle } from '@/components/mode-toggle';
import { FileUpload } from '@/components/file-upload';
import { useLanguage } from '@/lib/hooks/useLanguage';
import Image from 'next/image';

export default function Home() {
  const { locale, t } = useLanguage();
  const [recognitionText, setRecognitionText] = React.useState('');

  const handleRecognitionResult = (text: string) => {
    setRecognitionText(text);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg dark:invert"
              priority
            />
            <h1 className="text-3xl font-bold">
              {locale === 'zh' ? '语音识别工具' : 'Speech Recognition Tool'}
            </h1>
          </div>
          <div className="flex gap-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
        </div>

        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <FileUpload onRecognitionResult={handleRecognitionResult} />
              <AudioRecorder onRecognitionResult={handleRecognitionResult} />
            </div>

            <div className="min-h-[200px] rounded-lg border border-border p-4">
              {recognitionText ? (
                <p className="whitespace-pre-wrap">{recognitionText}</p>
              ) : (
                <p className="text-muted-foreground">
                  {locale === 'zh' ? '识别结果将显示在这里...' : 'Recognition results will be displayed here...'}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}