'use client';

/**
 * PhotoTextContent — full OCR + word-tap experience
 * 1. Upload / camera capture
 * 2. Tesseract.js OCR with progress indicator
 * 3. Cleaned tokenized text — tap to hear words
 * 4. Save words to practice list
 *
 * Backend integration point: replace Tesseract.js with a cloud OCR API
 * (e.g. Google Vision, AWS Textract) for higher accuracy on real photos.
 */

import React, { useState, useRef, useCallback } from 'react';
import { speak, isSpeechSupported } from '@/lib/speech';
import { cleanOcrText, tokenizeWords, isRealWord } from '@/lib/ocrUtils';
import { cleanWordForSpeech } from '@/lib/stories';
import { addSavedWord, loadSavedWords } from '@/lib/savedWords';
import WordToken from '@/components/WordToken';
import SpeakingIndicator from '@/components/SpeakingIndicator';
import SaveWordToast from '@/components/SaveWordToast';
import OcrUploadZone from './OcrUploadZone';
import OcrProgressBar from './OcrProgressBar';

type OcrStatus = 'idle' | 'loading' | 'done' | 'error';

export default function PhotoTextContent() {
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrProgressMsg, setOcrProgressMsg] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedWords, setSavedWords] = useState<Set<string>>(() => {
    const words = loadSavedWords();
    return new Set(words.map((w) => w.word.toLowerCase()));
  });
  const [toastWord, setToastWord] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const tokens = tokenizeWords(extractedText).filter(isRealWord);

  // ── Run OCR on an image file ──────────────────────────────
  const runOcr = useCallback(async (file: File) => {
    setOcrStatus('loading');
    setOcrProgress(0);
    setOcrProgressMsg('Getting ready…');
    setExtractedText('');
    setErrorMsg('');
    setActiveWord(null);

    try {
      // Dynamic import to avoid SSR issues with Tesseract
      const { createWorker } = await import('tesseract.js');

      // Backend integration point: swap this block for a fetch() to a cloud OCR endpoint
      const worker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'loading tesseract core') {
            setOcrProgressMsg('Loading reading helper…');
            setOcrProgress(10);
          } else if (m.status === 'loading language traineddata') {
            setOcrProgressMsg('Loading English words…');
            setOcrProgress(30);
          } else if (m.status === 'initializing api') {
            setOcrProgressMsg('Getting ready to read…');
            setOcrProgress(50);
          } else if (m.status === 'recognizing text') {
            setOcrProgressMsg('Reading the picture…');
            setOcrProgress(50 + Math.round(m.progress * 45));
          }
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      const cleaned = cleanOcrText(data.text);
      if (!cleaned || cleaned.length < 4) {
        setErrorMsg(
          "I couldn't find any words in that picture. Try a clearer photo with big printed text!"
        );
        setOcrStatus('error');
        return;
      }

      setExtractedText(cleaned);
      setOcrProgress(100);
      setOcrProgressMsg('Done!');
      setOcrStatus('done');
    } catch (err) {
      console.error('OCR error:', err);
      setErrorMsg(
        'Something went wrong reading the picture. Please try again with a clearer photo.'
      );
      setOcrStatus('error');
    }
  }, []);

  // ── Handle file upload ────────────────────────────────────
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      runOcr(file);
    },
    [runOcr]
  );

  // ── Tap a word ────────────────────────────────────────────
  const handleWordTap = useCallback(
    (word: string, idx: number) => {
      const clean = cleanWordForSpeech(word);
      if (!clean) return;
      setActiveWord(clean);
      setActiveWordIdx(idx);
      setIsSpeaking(true);
      speak(clean, {
        rate: 0.9,
        onEnd: () => {
          setIsSpeaking(false);
          setActiveWord(null);
          setActiveWordIdx(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setActiveWord(null);
          setActiveWordIdx(null);
        },
      });
    },
    []
  );

  // ── Save word ─────────────────────────────────────────────
  const handleSaveWord = useCallback((word: string) => {
    const updated = addSavedWord(word, 'photo');
    setSavedWords(new Set(updated.map((w) => w.word.toLowerCase())));
    setToastWord(word);
    setToastVisible(false);
    setTimeout(() => setToastVisible(true), 50);
  }, []);

  // ── Reset ─────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setOcrStatus('idle');
    setExtractedText('');
    setImagePreview(null);
    setActiveWord(null);
    setErrorMsg('');
    setOcrProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, []);

  const speechSupported = isSpeechSupported();

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3 animate-float inline-block">📷</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 mb-2">
          Picture Reader
        </h1>
        <p className="text-lg md:text-xl text-purple-500 font-semibold">
          Take a photo of any words and tap them to hear them!
        </p>
      </div>

      {!speechSupported && (
        <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-2xl text-center">
          <p className="text-yellow-800 font-bold text-base">
            ⚠️ Voice reading isn&apos;t available in this browser. Try Chrome or Safari!
          </p>
        </div>
      )}

      {/* Upload zone — shown when idle or after reset */}
      {ocrStatus === 'idle' && (
        <OcrUploadZone
          fileInputRef={fileInputRef}
          cameraInputRef={cameraInputRef}
          onFileChange={handleFileChange}
        />
      )}

      {/* Loading state */}
      {ocrStatus === 'loading' && (
        <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-kitty p-8">
          {/* Image preview thumbnail */}
          {imagePreview && (
            <div className="flex justify-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Uploaded photo being processed"
                className="max-h-48 rounded-2xl border-2 border-purple-200 shadow-md object-contain"
              />
            </div>
          )}

          <OcrProgressBar progress={ocrProgress} message={ocrProgressMsg} />

          <p className="text-center text-purple-600 font-bold text-xl mt-4 animate-pulse">
            🔍 Reading your picture…
          </p>
        </div>
      )}

      {/* Error state */}
      {ocrStatus === 'error' && (
        <div className="bg-red-50 rounded-3xl border-2 border-red-200 shadow-md p-8 text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-extrabold text-red-700 mb-3">Oops!</h2>
          <p className="text-red-600 font-semibold text-lg mb-6">{errorMsg}</p>
          <button onClick={handleReset} className="btn-primary mx-auto">
            <span>📷</span> Try Again
          </button>
        </div>
      )}

      {/* Success — tokenized text */}
      {ocrStatus === 'done' && (
        <div>
          {/* Preview + reset */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Uploaded photo that was processed"
                className="h-20 rounded-2xl border-2 border-purple-200 shadow-sm object-contain"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-green-600 font-extrabold text-lg">
                ✅ Found {tokens.length} words!
              </p>
              <p className="text-purple-500 font-semibold text-sm">
                Tap any word to hear it. Long-press to save ⭐
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn-ghost text-sm px-4 py-2"
            >
              <span>📷</span> New Photo
            </button>
          </div>

          {/* Hint bar */}
          <div className="mb-4 px-5 py-3 bg-orange-50 border-2 border-orange-200 rounded-2xl">
            <p className="text-orange-700 font-bold text-base md:text-lg text-center">
              👆 Tap any word to hear it out loud!
            </p>
          </div>

          {/* Tokenized word grid */}
          <div
            className="bg-white rounded-3xl border-2 border-purple-100 shadow-kitty p-6 md:p-8"
            role="region"
            aria-label="Extracted text words"
          >
            <div className="flex flex-wrap items-start">
              {tokens.map((word, idx) => {
                const clean = cleanWordForSpeech(word);
                return (
                  <WordToken
                    key={idx}
                    word={word}
                    cleanWord={clean}
                    isActive={activeWordIdx === idx}
                    isSaved={savedWords.has(clean.toLowerCase())}
                    onTap={(w) => handleWordTap(w, idx)}
                    onLongPress={handleSaveWord}
                  />
                );
              })}
            </div>
          </div>

          {/* Active word display */}
          {activeWord && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 bg-orange-400 text-white px-8 py-5 rounded-3xl shadow-word">
                <span className="text-4xl md:text-5xl font-extrabold tracking-wide">
                  {activeWord}
                </span>
                <SpeakingIndicator isActive={isSpeaking} color="bg-white" />
              </div>
              <button
                onClick={() => handleSaveWord(activeWord)}
                disabled={savedWords.has(activeWord.toLowerCase())}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base transition-all active:scale-95
                  ${savedWords.has(activeWord.toLowerCase())
                    ? 'bg-purple-100 text-purple-400 cursor-not-allowed border-2 border-purple-200' :'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
                  }`}
              >
                <span>⭐</span>
                <span>
                  {savedWords.has(activeWord.toLowerCase())
                    ? 'Already saved!' :'Save to Practice'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save toast */}
      <SaveWordToast word={toastWord} visible={toastVisible} />
    </div>
  );
}