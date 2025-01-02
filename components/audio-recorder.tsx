'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface AudioRecorderProps {
  onRecognitionResult: (text: string) => void;
}

export function AudioRecorder({ onRecognitionResult }: AudioRecorderProps) {
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
        const formData = new FormData();
        formData.append('file', blob);

        try {
          const response = await fetch('/api/speech/submit', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('录音识别失败');
          }

          const data = await response.json();
          onRecognitionResult(data.text || '');
        } catch (error) {
          console.error('识别错误:', error);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('录音错误:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // 在客户端渲染之前返回一个固定的初始状态
  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="w-32"
      >
        <Mic className="mr-2 h-4 w-4" />
        录音
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-32"
      onClick={isRecording ? stopRecording : startRecording}
    >
      <Mic className={`mr-2 h-4 w-4 ${isRecording ? 'text-red-500' : ''}`} />
      {isRecording ? t('recording') : t('record')}
    </Button>
  );
}