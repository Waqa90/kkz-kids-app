// OCR text cleanup utilities for Tesseract.js output
// Tesseract often produces noisy text — these helpers clean it up for child-friendly display

/**
 * Clean raw OCR text:
 * - Remove lines with only symbols/numbers/garbage
 * - Collapse multiple spaces
 * - Remove very short "words" that are likely OCR noise
 */
export function cleanOcrText(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => {
      if (line.length < 2) return false;
      // Keep lines that have at least one real word (3+ letters)
      return /[a-zA-Z]{2,}/.test(line);
    })
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Split cleaned OCR text into sentences for display.
 */
export function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

/**
 * Tokenize a block of text into word tokens.
 * Each token preserves trailing punctuation for display
 * but cleanWordForSpeech() strips it for TTS.
 */
export function tokenizeWords(text: string): string[] {
  return text.match(/[\w']+[.,!?;:]?/g) ?? [];
}

/**
 * Check if a string looks like a real readable word
 * (for filtering OCR noise from the word list).
 */
export function isRealWord(token: string): boolean {
  const clean = token.replace(/[^a-zA-Z']/g, '');
  return clean.length >= 2;
}