export const TENCENT_CONFIG = {
  API_HOST: 'asr.tencentcloudapi.com',
  API_VERSION: '2019-06-14',
  REGION: 'ap-guangzhou',
  // 从环境变量获取敏感信息
  SECRET_ID: process.env.NEXT_PUBLIC_TENCENT_SECRET_ID,
  SECRET_KEY: process.env.NEXT_PUBLIC_TENCENT_SECRET_KEY,
}; 