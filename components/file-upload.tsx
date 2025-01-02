'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

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

  // 在客户端渲染之前返回一个固定的初始状态
  if (!mounted) {
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
          className="w-32"
          onClick={handleClick}
        >
          <Upload className="mr-2 h-4 w-4" />
          上传音频
        </Button>
      </>
    );
  }

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
        className="w-32"
        onClick={handleClick}
      >
        <Upload className="mr-2 h-4 w-4" />
        {t('upload')}
      </Button>
    </>
  );
}