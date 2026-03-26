// Text-to-speech utilities using Web Speech API (browser built-in)
// Backend integration point: replace with a cloud TTS API (e.g. Google TTS, ElevenLabs) for higher quality voices

export interface SpeechOptions {
  rate?: number;   // 0.1 – 2.0 (default 1.0; slow mode = 0.6)
  pitch?: number;  // 0.0 – 2.0 (default 1.0)
  volume?: number; // 0.0 – 1.0 (default 1.0)
  lang?: string;   // e.g. 'en-US'
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (e: SpeechSynthesisErrorEvent) => void;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Pick the best clear female English voice from the available voices.
 * Priority: well-known female names → Google US English → any en-US female → any en-GB female → any en-* voice.
 */
function getFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.name.toLowerCase().includes('samantha')) ||
    voices.find((v) => v.name.toLowerCase().includes('victoria')) ||
    voices.find((v) => v.name.toLowerCase().includes('karen')) ||
    voices.find((v) => v.name.toLowerCase().includes('moira')) ||
    voices.find((v) => v.name.toLowerCase().includes('tessa')) ||
    voices.find((v) => v.name.toLowerCase().includes('fiona')) ||
    voices.find((v) => v.name.toLowerCase().includes('google us english')) ||
    voices.find((v) => v.lang === 'en-US' && v.name.toLowerCase().includes('female')) ||
    voices.find((v) => v.lang === 'en-GB' && v.name.toLowerCase().includes('female')) ||
    voices.find((v) => /\bfemale\b/i.test(v.name)) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en-')) ||
    null
  );
}

/**
 * Speak a string using the browser's speech synthesis with a clear female voice.
 * Handles async voice loading automatically.
 * Cancels any currently playing speech first.
 */
export function speak(text: string, options: SpeechOptions = {}): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const doSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.2;
    utterance.volume = options.volume ?? 1.0;
    utterance.lang = options.lang ?? 'en-US';

    const voice = getFemaleVoice();
    if (voice) utterance.voice = voice;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Voices may not be loaded yet on first call — wait if needed
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      doSpeak();
    };
  } else {
    doSpeak();
  }
}

/**
 * Stop any currently playing speech.
 */
export function stopSpeech(): void {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

/**
 * Check if speech synthesis is supported.
 */
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}