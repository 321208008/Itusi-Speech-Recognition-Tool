'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { recognizeSpeech } from '@/lib/api/speech';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onRecognitionResult: (text: string) => void;
  className?: string;
}

export function AudioRecorder({ onRecognitionResult, className }: AudioRecorderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const { t } = useLanguage();
  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const chunks = React.useRef<Blob[]>([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        try {
          const result = await recognizeSpeech(blob);
          
          if (result.status === 'error') {
            throw new Error(result.error);
          }

          onRecognitionResult(result.text);
          toast.success(t('uploadSuccess'));
        } catch (error) {
          console.error('识别错误:', error);
          toast.error(error instanceof Error ? error.message : t('recognition.failed'));
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      toast.success(t('status.recording'));
    } catch (error) {
      console.error('录音错误:', error);
      toast.error(t('microphone.permission.denied'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="lg"
        className="min-w-[140px] h-[42px]"
      >
        <Mic className="w-4 h-4 mr-2" />
        <span className="text-sm">录音</span>
      </Button>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="lg"
        className={cn(
          "min-w-[140px] h-[42px] gap-2 font-medium transition-all",
          isRecording && "border-red-500 hover:border-red-500"
        )}
        onClick={isRecording ? stopRecording : startRecording}
      >
        <Mic className={cn(
          "w-4 h-4 transition-colors",
          isRecording && "text-red-500"
        )} />
        <span className="text-sm">
          {isRecording ? t('recording') : t('record')}
        </span>
      </Button>
    </div>
  );
}