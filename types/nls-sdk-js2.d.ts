declare module '@alicloud/nls-sdk-js2' {
  interface SpeechRecognizerConfig {
    url: string;
    appKey: string | undefined;
    format: string;
    sampleRate: number;
    enableIntermediateResult?: boolean;
    enablePunctuation?: boolean;
    enableInverseTextNormalization?: boolean;
  }

  interface SpeechRecognizer {
    on(event: string, callback: (data: any) => void): void;
    start(): Promise<void>;
    send(data: ArrayBuffer): Promise<void>;
    stop(): Promise<void>;
  }

  class SpeechRecognizer {
    constructor(config: SpeechRecognizerConfig);
  }

  export = {
    SpeechRecognizer,
  };
} 