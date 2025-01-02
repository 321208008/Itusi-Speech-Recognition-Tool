import { NextResponse } from 'next/server';
import { recognizeSpeech } from '@/lib/api/speech';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: '请上传音频文件' },
        { status: 400 }
      );
    }

    console.log('开始处理音频文件:', {
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    });

    const result = await recognizeSpeech(file);
    
    if (result.status === 'error') {
      console.error('识别失败:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log('识别成功:', {
      requestId: result.requestId,
      textLength: result.text.length,
    });

    return NextResponse.json({
      text: result.text,
      requestId: result.requestId,
      success: true
    });

  } catch (error) {
    console.error('处理上传文件时出错:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理文件时出错' },
      { status: 500 }
    );
  }
} 