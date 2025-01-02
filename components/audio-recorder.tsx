'use client';

import * as React from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { recognizeSpeech } from '@/lib/api/speech';

interface AudioRecorderProps {
  onRecognitionResult?: (text: string) => void;
}

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'error';

export function AudioRecorder({ onRecognitionResult }: AudioRecorderProps) {
  const [status, setStatus] = React.useState<RecordingStatus>('idle');
  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,         // 单声道
          sampleRate: 16000,       // 16kHz采样率
          sampleSize: 16,          // 16位
          echoCancellation: true,  // 回声消除
          noiseSuppression: true,  // 噪声抑制
        } 
      });

      // 检查支持的 MIME 类型
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg')
          ? 'audio/ogg'
          : 'audio/mp4';

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 256000,
      });

      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        setStatus('processing');
        try {
          const result = await recognizeSpeech(audioBlob);
          if (result.status === 'success' && result.text) {
            onRecognitionResult?.(result.text);
            setStatus('idle');
          } else {
            setStatus('error');
            toast({
              title: t('error'),
              description: result.error || t('recognition.failed'),
              variant: 'destructive',
            });
          }
        } catch (error) {
          setStatus('error');
          toast({
            title: t('error'),
            description: error instanceof Error ? error.message : t('recognition.failed'),
            variant: 'destructive',
          });
        }
      };

      // 每100ms触发一次ondataavailable事件
      mediaRecorder.current.start(100);
      setStatus('recording');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setStatus('error');
      toast({
        title: t('error'),
        description: t('microphone.permission.denied'),
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && status === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const isRecording = status === 'recording';
  const isProcessing = status === 'processing';

  return (
    <Button
      variant={isRecording ? 'destructive' : 'default'}
      size="icon"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
    >
      {isRecording ? (
        <Square className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
      <span className="sr-only">
        {isRecording ? t('status.recording') : t('record')}
      </span>
    </Button>
  );
}