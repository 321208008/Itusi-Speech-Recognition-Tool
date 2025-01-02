import { NextResponse } from 'next/server';
import crypto from 'crypto';

const TENCENT_CONFIG = {
  API_HOST: 'asr.tencentcloudapi.com',
  API_VERSION: '2019-06-14',
  REGION: 'ap-guangzhou',
  SECRET_ID: process.env.NEXT_PUBLIC_TENCENT_SECRET_ID,
  SECRET_KEY: process.env.NEXT_PUBLIC_TENCENT_SECRET_KEY,
};

interface SignatureResult {
  authorization: string;
  timestamp: number;
}

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 带重试的 fetch 函数
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 1000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retries > 0) {
      await delay(backoff);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

// 生成签名
function generateSignature(params: Record<string, any>, method: string = 'POST'): SignatureResult {
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().split('T')[0];

  // 1. 构建规范请求串
  const canonicalHeaders = 'content-type:application/json\n' + 
                         `host:${TENCENT_CONFIG.API_HOST}\n`;
  const signedHeaders = 'content-type;host';
  const hashedRequestPayload = crypto
    .createHash('sha256')
    .update(JSON.stringify(params))
    .digest('hex');

  const canonicalRequest = [
    method.toUpperCase(),
    '/',
    '',
    canonicalHeaders,
    signedHeaders,
    hashedRequestPayload,
  ].join('\n');

  // 2. 构建待签名字符串
  const algorithm = 'TC3-HMAC-SHA256';
  const credentialScope = `${date}/asr/tc3_request`;
  const hashedCanonicalRequest = crypto
    .createHash('sha256')
    .update(canonicalRequest)
    .digest('hex');

  const stringToSign = [
    algorithm,
    timestamp,
    credentialScope,
    hashedCanonicalRequest,
  ].join('\n');

  // 3. 计算签名
  const kDate = crypto
    .createHmac('sha256', `TC3${TENCENT_CONFIG.SECRET_KEY}`)
    .update(date)
    .digest();

  const kService = crypto
    .createHmac('sha256', kDate)
    .update('asr')
    .digest();

  const kSigning = crypto
    .createHmac('sha256', kService)
    .update('tc3_request')
    .digest();

  const signature = crypto
    .createHmac('sha256', kSigning)
    .update(stringToSign)
    .digest('hex');

  // 4. 构建授权信息
  const authorization = [
    `${algorithm} `,
    `Credential=${TENCENT_CONFIG.SECRET_ID}/${credentialScope}, `,
    `SignedHeaders=${signedHeaders}, `,
    `Signature=${signature}`,
  ].join('');

  return {
    authorization,
    timestamp,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 生成签名
    const { authorization, timestamp } = generateSignature(body);

    // 发送识别请求
    const response = await fetchWithRetry(
      `https://${TENCENT_CONFIG.API_HOST}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
          'Host': TENCENT_CONFIG.API_HOST,
          'X-TC-Action': 'SentenceRecognition',
          'X-TC-Version': TENCENT_CONFIG.API_VERSION,
          'X-TC-Region': TENCENT_CONFIG.REGION,
          'X-TC-Timestamp': timestamp.toString(),
          'Connection': 'keep-alive',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });
      throw new Error(errorData.Response?.Error?.Message || 'API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Speech recognition error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.cause : undefined,
      },
      { status: 500 }
    );
  }
} 