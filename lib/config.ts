export const TENCENT_CONFIG = {
  // 固定配置
  API_HOST: 'asr.tencentcloudapi.com',
  API_VERSION: '2019-06-14',
  REGION: 'ap-guangzhou',
  
  // 从环境变量获取敏感信息
  SECRET_ID: process.env.NEXT_PUBLIC_TENCENT_SECRET_ID,
  SECRET_KEY: process.env.NEXT_PUBLIC_TENCENT_SECRET_KEY,
};

// 验证必需的环境变量
if (!TENCENT_CONFIG.SECRET_ID || !TENCENT_CONFIG.SECRET_KEY) {
  throw new Error('Missing required Tencent Cloud credentials. Please check your environment variables.');
} 