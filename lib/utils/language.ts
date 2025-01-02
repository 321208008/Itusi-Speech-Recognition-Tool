import type { Language } from '../translations';

export function getBrowserLanguage(): Language {
  // 只在客户端执行
  if (typeof window === 'undefined') {
    return 'en';
  }

  const browserLang = navigator.language.toLowerCase();
  
  // 检查是否为中文
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  
  // 其他语言默认使用英语
  return 'en';
} 