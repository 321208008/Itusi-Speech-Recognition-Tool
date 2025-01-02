'use client';

import * as React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { recognizeSpeech } from '@/lib/api/speech';

interface FileUploadProps {
  onRecognitionResult?: (text: string) => void;
}

export function FileUpload({ onRecognitionResult }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: t('error'),
        description: t('file.type.invalid'),
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await recognizeSpeech(file);
      if (result.status === 'success' && result.text) {
        onRecognitionResult?.(result.text);
      } else {
        toast({
          title: t('error'),
          description: result.error || t('recognition.failed'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('recognition.failed'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="gap-2"
      >
        <Upload className="h-5 w-5" />
        {isProcessing ? t('processing') : t('upload')}
      </Button>
    </>
  );
}