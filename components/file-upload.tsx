'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { recognizeSpeech } from '@/lib/api/speech';

interface FileUploadProps {
  onRecognitionResult: (text: string) => void;
}

export function FileUpload({ onRecognitionResult }: FileUploadProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
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

    // 检查文件类型
    if (!file.type.startsWith('audio/')) {
      toast.error(t('file.type.invalid'));
      return;
    }

    // 检查文件大小
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('文件大小超过5MB限制');
      return;
    }

    try {
      setIsLoading(true);
      const result = await recognizeSpeech(file);

      if (result.status === 'error') {
        throw new Error(result.error);
      }

      onRecognitionResult(result.text);
      toast.success(t('uploadSuccess'));
    } catch (error) {
      console.error('上传错误:', error);
      toast.error(error instanceof Error ? error.message : t('uploadError'));
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          "w-32 flex items-center justify-center space-x-2",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleClick}
        disabled={isLoading}
      >
        <Upload className="w-4 h-4 inline-block" />
        <span>
          {mounted ? (isLoading ? t('uploading') : t('upload')) : '上传音频'}
        </span>
      </Button>
    </>
  );
}