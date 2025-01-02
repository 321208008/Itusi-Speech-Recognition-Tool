type TranslationKeys = {
  title: string;
  upload: string;
  record: string;
  processing: string;
  error: string;
  'recognition.failed': string;
  'recognition.placeholder': string;
  'file.type.invalid': string;
  'microphone.permission.denied': string;
  'status.recording': string;
};

export type Language = 'en' | 'zh';

export const translations: Record<Language, TranslationKeys> = {
  en: {
    title: 'Speech Recognition Tool',
    upload: 'Upload Audio',
    record: 'Record Audio',
    processing: 'Processing...',
    error: 'Error',
    'recognition.failed': 'Speech recognition failed',
    'recognition.placeholder': 'Recognition results will be displayed here...',
    'file.type.invalid': 'Please upload an audio file',
    'microphone.permission.denied': 'Failed to start recording. Please check your microphone permissions.',
    'status.recording': 'Recording...',
  },
  zh: {
    title: '语音识别工具',
    upload: '上传音频',
    record: '录制音频',
    processing: '处理中...',
    error: '错误',
    'recognition.failed': '语音识别失败',
    'recognition.placeholder': '语音识别结果将显示在这里...',
    'file.type.invalid': '请上传音频文件',
    'microphone.permission.denied': '无法开始录音，请检查麦克风权限',
    'status.recording': '录音中...',
  },
}; 