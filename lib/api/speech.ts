import { v4 as uuidv4 } from 'uuid';

interface RecognitionResult {
  text: string;
  status: 'success' | 'error' | 'processing';
  error?: string;
  requestId?: string;
}

// 将 WebM 音频转换为 WAV
async function convertWebMToWav(audioBlob: Blob): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // 创建离线音频上下文
      const offlineContext = new OfflineAudioContext(
        1, // 单声道
        audioBuffer.length,
        16000 // 采样率
      );
      
      // 创建音频源
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      
      // 开始渲染
      source.start(0);
      const renderedBuffer = await offlineContext.startRendering();
      
      // 将 AudioBuffer 转换为 WAV 格式
      const wavData = audioBufferToWav(renderedBuffer);
      const wavBlob = new Blob([wavData], { type: 'audio/wav' });
      
      resolve(wavBlob);
    } catch (error) {
      reject(error);
    }
  });
}

// 将 AudioBuffer 转换为 WAV 格式的 ArrayBuffer
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = 1; // 单声道
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const data = buffer.getChannelData(0);
  const samples = Math.floor(data.length);
  const dataSize = samples * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  
  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);
  
  // WAV 文件头
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  
  // 写入音频数据
  const offset = 44;
  const volume = 0.8;
  for (let i = 0; i < samples; i++) {
    const sample = Math.max(-1, Math.min(1, data[i])) * volume;
    view.setInt16(offset + (i * bytesPerSample), sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }
  
  return arrayBuffer;
}

// 辅助函数：写入字符串到 DataView
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// 发送语音识别请求
export async function recognizeSpeech(audioFile: File | Blob): Promise<RecognitionResult> {
  try {
    // 检查文件大小
    const maxSize = 5 * 1024 * 1024; // 5MB
    if ('size' in audioFile && audioFile.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }

    const requestId = uuidv4();
    console.log('Starting recognition for file:', {
      size: 'size' in audioFile ? `${(audioFile.size / 1024 / 1024).toFixed(2)}MB` : 'unknown',
      type: 'type' in audioFile ? audioFile.type : 'unknown',
      requestId,
    });

    // 如果是 WebM 格式，先转换为 WAV
    let processedAudio = audioFile;
    if ('type' in audioFile && audioFile.type.toLowerCase() === 'audio/webm') {
      processedAudio = await convertWebMToWav(audioFile);
    }

    // 获取音频格式和Base64数据
    const format = getAudioFormat(processedAudio);
    const audio = await fileToBase64(processedAudio);

    // 构建请求参数
    const params = {
      ProjectId: 0,
      SubServiceType: 2,
      EngSerViceType: "16k",
      SourceType: 1,
      VoiceFormat: format,
      UsrAudioKey: requestId,
      Data: audio,
      DataLen: audio.length,
      FilterDirty: 0,
      FilterModal: 0,
      FilterPunc: 0,
      ConvertNumMode: 1,
    };

    // 发送识别请求
    const response = await fetch('/api/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    console.log('Recognition response:', data);

    if (!response.ok || data.error) {
      throw new Error(data.error || data.Response?.Error?.Message || 'Recognition failed');
    }

    if (data.Response?.Error) {
      throw new Error(data.Response.Error.Message || 'Recognition failed');
    }

    return {
      text: data.Response?.Result || '',
      status: 'success',
      requestId: data.Response?.RequestId,
    };
  } catch (error) {
    console.error('Speech recognition error:', error);
    return {
      text: '',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// 将音频文件转换为Base64
async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // 移除Data URL前缀
      resolve(base64.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
}

// 获取音频格式
function getAudioFormat(file: File | Blob): string {
  if ('type' in file) {
    // 处理常见的音频MIME类型
    switch (file.type.toLowerCase()) {
      case 'audio/wav':
      case 'audio/x-wav':
        return 'wav';
      case 'audio/mp3':
      case 'audio/mpeg':
        return 'mp3';
      case 'audio/m4a':
      case 'audio/x-m4a':
      case 'audio/mp4':
      case 'audio/x-mp4':
        return 'm4a';
      case 'audio/aac':
        return 'aac';
      case 'audio/ogg':
        return 'ogg-opus';
      case 'audio/webm':
        return 'wav'; // WebM格式将被转换为WAV格式发送
      case 'audio/amr':
        return 'amr';
      case 'audio/speex':
        return 'speex';
      case 'audio/silk':
        return 'silk';
      default:
        // 如果是其他格式，尝试从文件名获取
        if ('name' in file && file.name) {
          const ext = file.name.split('.').pop()?.toLowerCase();
          switch (ext) {
            case 'wav':
              return 'wav';
            case 'mp3':
              return 'mp3';
            case 'm4a':
              return 'm4a';
            case 'mp4':
              return 'm4a';
            case 'aac':
              return 'aac';
            case 'ogg':
            case 'opus':
              return 'ogg-opus';
            case 'webm':
              return 'wav'; // WebM格式将被转换为WAV格式发送
            case 'amr':
              return 'amr';
            case 'speex':
              return 'speex';
            case 'silk':
              return 'silk';
          }
        }
        // 如果无法确定格式，返回错误
        throw new Error(`Unsupported audio format: ${file.type}`);
    }
  }
  throw new Error('Unable to determine audio format');
} 