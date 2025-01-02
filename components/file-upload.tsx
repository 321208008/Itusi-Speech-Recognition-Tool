'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onRecognitionResult: (text: string) => void;
}

export function FileUpload({ onRecognitionResult }: FileUploadProps) {
  const [mounted, setMounted] = React.useState(false);
  const { t } = useLanguage();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/speech/submit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      onRecognitionResult(data.text || '');
    } catch (error) {
      console.error('上传错误:', error);
    }
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        accept="audio/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        className={cn(
          "w-32 flex items-center justify-center space-x-2"
        )}
        onClick={handleClick}
      >
        <Upload className="w-4 h-4 inline-block" />
        <span>{mounted ? t('upload') : '上传音频'}</span>
      </Button>
    </>
  );
}