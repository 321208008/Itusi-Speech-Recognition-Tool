export const translations = {
  en: {
    title: 'Speech Recognition Tool',
    upload: 'Upload Audio File',
    record: 'Record Audio',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    accuracy: 'Recognition Accuracy',
    targetLang: 'Target Language',
    export: 'Export',
    status: {
      idle: 'Ready',
      recording: 'Recording...',
      processing: 'Processing...',
      done: 'Done',
    },
  },
  zh: {
    title: '语音识别工具',
    upload: '上传音频文件',
    record: '录制音频',
    settings: '设置',
    language: '语言',
    theme: '主题',
    accuracy: '识别精度',
    targetLang: '目标语言',
    export: '导出',
    status: {
      idle: '就绪',
      recording: '录音中...',
      processing: '处理中...',
      done: '完成',
    },
  },
};

export type Language = keyof typeof translations;