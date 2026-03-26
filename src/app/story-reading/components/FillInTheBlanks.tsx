'use client';

/**
 * FillInTheBlanks — interactive reading comprehension activity
 * - Auto-extracts 5 sentences from the story
 * - Each sentence has one missing word shown as a blank
 * - Missing words appear as large colorful draggable circles at the bottom
 * - Clicking a circle plays pronunciation of the word
 * - Each sentence has a speaker button to read the full sentence aloud
 * - Correct drop fills the blank + plays success sound
 * - Incorrect drop returns word to its circle
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Story } from '@/lib/stories';
import { saveFillInBlanksResult } from '@/lib/fillInBlanksResults';
import { speak, stopSpeech } from '@/lib/speech';
import { playCorrectSound, playWrongSound, playSentenceReadSound } from '@/lib/sounds';
import { playCelebrationVoice } from '@/lib/celebrationVoice';

interface BlankSentence {
  id: number;
  beforeBlank: string;
  afterBlank: string;
  missingWord: string;
  fullSentence: string;
  filled: boolean;
  filledWord: string | null;
}

interface WordCircle {
  id: string;
  word: string;
  color: string;
  used: boolean;
}

const CIRCLE_COLORS = [
  'bg-pink-400 border-pink-500',
  'bg-blue-400 border-blue-500',
  'bg-green-400 border-green-500',
  'bg-yellow-400 border-yellow-500',
  'bg-purple-400 border-purple-500',
];

const CIRCLE_TEXT_COLORS = [
  'text-pink-900',
  'text-blue-900',
  'text-green-900',
  'text-yellow-900',
  'text-purple-900',
];

function extractSentences(text: string): string[] {
  // Split on sentence-ending punctuation
  const raw = text.match(/[^.!?]+[.!?]+/g) ?? [];
  return raw.map((s) => s.trim()).filter((s) => s.split(' ').length >= 4);
}

function pickMissingWord(sentence: string): { before: string; after: string; word: string } | null {
  // Remove trailing punctuation for processing
  const clean = sentence.replace(/[.!?]+$/, '').trim();
  const words = clean.split(/\s+/);
  // Pick a content word (not first, not last, length >= 3)
  const candidates = words
    .map((w, i) => ({ w: w.replace(/[^a-zA-Z]/g, ''), i }))
    .filter(({ w, i }) => w.length >= 3 && i > 0 && i < words.length - 1);

  if (candidates.length === 0) return null;

  // Pick a word roughly in the middle-ish area
  const pick = candidates[Math.floor(candidates.length / 2)];
  const before = words.slice(0, pick.i).join(' ');
  const after = words.slice(pick.i + 1).join(' ');
  return { before, after, word: pick.w };
}

function buildBlanks(story: Story): BlankSentence[] {
  const sentences = extractSentences(story.text);
  // Pick up to 5 evenly spaced sentences
  const step = Math.max(1, Math.floor(sentences.length / 5));
  const picked: string[] = [];
  for (let i = 0; i < sentences.length && picked.length < 5; i += step) {
    picked.push(sentences[i]);
  }
  // Fill to 5 if needed
  if (picked.length < 5) {
    for (const s of sentences) {
      if (!picked.includes(s)) picked.push(s);
      if (picked.length >= 5) break;
    }
  }

  const blanks: BlankSentence[] = [];
  const usedWords = new Set<string>();

  for (let i = 0; i < picked.length; i++) {
    const s = picked[i];
    const result = pickMissingWord(s);
    if (!result) continue;
    // Avoid duplicate missing words
    if (usedWords.has(result.word.toLowerCase())) {
      // Try another word from the sentence
      const clean = s.replace(/[.!?]+$/, '').trim();
      const words = clean.split(/\s+/);
      const alt = words
        .map((w, idx) => ({ w: w.replace(/[^a-zA-Z]/g, ''), idx }))
        .filter(({ w, idx }) => w.length >= 3 && idx > 0 && idx < words.length - 1 && !usedWords.has(w.toLowerCase()));
      if (alt.length === 0) continue;
      const pick = alt[0];
      const before = words.slice(0, pick.idx).join(' ');
      const after = words.slice(pick.idx + 1).join(' ');
      usedWords.add(pick.w.toLowerCase());
      blanks.push({
        id: i,
        beforeBlank: before,
        afterBlank: after,
        missingWord: pick.w,
        fullSentence: s,
        filled: false,
        filledWord: null,
      });
    } else {
      usedWords.add(result.word.toLowerCase());
      blanks.push({
        id: i,
        beforeBlank: result.before,
        afterBlank: result.after,
        missingWord: result.word,
        fullSentence: s,
        filled: false,
        filledWord: null,
      });
    }
  }

  return blanks.slice(0, 5);
}

function buildWordCircles(blanks: BlankSentence[]): WordCircle[] {
  const words = blanks.map((b, i) => ({
    id: `word-${i}`,
    word: b.missingWord,
    color: CIRCLE_COLORS[i % CIRCLE_COLORS.length],
    used: false,
  }));
  // Shuffle
  return [...words].sort(() => Math.random() - 0.5);
}

interface Props {
  story: Story;
  childName?: string;
  slowMode?: boolean;
}

export default function FillInTheBlanks({ story, childName, slowMode }: Props) {
  const [blanks, setBlanks] = useState<BlankSentence[]>(() => buildBlanks(story));
  const [circles, setCircles] = useState<WordCircle[]>(() => buildWordCircles(buildBlanks(story)));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [shakingBlank, setShakingBlank] = useState<number | null>(null);
  const [successBlank, setSuccessBlank] = useState<number | null>(null);
  const [allDone, setAllDone] = useState(false);
  const dragWordRef = useRef<string>('');

  // Touch drag state
  const touchCircleRef = useRef<string | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const allFilled = blanks.every((b) => b.filled);

  useEffect(() => {
    if (allFilled && blanks.length > 0) {
      setAllDone(true);
      playCorrectSound();
      // Save result to parent dashboard
      const score = blanks.filter((b) => b.filled).length;
      saveFillInBlanksResult({ storyTitle: story.title, childName, score, total: blanks.length });
      playCelebrationVoice(childName, score, blanks.length, 'fill-blanks');
    }
  }, [allFilled, blanks.length]);

  // Reset when story changes
  useEffect(() => {
    const newBlanks = buildBlanks(story);
    setBlanks(newBlanks);
    setCircles(buildWordCircles(newBlanks));
    setAllDone(false);
    setDraggingId(null);
    setSpeakingId(null);
  }, [story.id]);

  const speakWord = useCallback((word: string, id: string) => {
    stopSpeech();
    setSpeakingId(id);
    speak(word, {
      rate: slowMode ? 0.6 : 0.85,
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  }, [slowMode]);

  const speakSentence = useCallback((sentence: string, id: string) => {
    stopSpeech();
    playSentenceReadSound();
    setSpeakingId(`sentence-${id}`);
    speak(sentence, {
      rate: slowMode ? 0.55 : 0.8,
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  }, [slowMode]);

  const handleDrop = useCallback(
    (blankId: number, word: string, circleId: string) => {
      const blank = blanks.find((b) => b.id === blankId);
      if (!blank || blank.filled) return;

      if (word.toLowerCase() === blank.missingWord.toLowerCase()) {
        // Correct!
        playCorrectSound();
        setSuccessBlank(blankId);
        setTimeout(() => setSuccessBlank(null), 1200);
        setBlanks((prev) =>
          prev.map((b) => (b.id === blankId ? { ...b, filled: true, filledWord: word } : b))
        );
        setCircles((prev) =>
          prev.map((c) => (c.id === circleId ? { ...c, used: true } : c))
        );
      } else {
        // Wrong — shake blank, return word
        playWrongSound();
        setShakingBlank(blankId);
        setTimeout(() => setShakingBlank(null), 600);
      }
    },
    [blanks]
  );

  // ── Desktop drag events ───────────────────────────────────
  const handleDragStart = (circleId: string, word: string) => {
    setDraggingId(circleId);
    dragWordRef.current = word;
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    dragWordRef.current = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnBlank = (e: React.DragEvent, blankId: number) => {
    e.preventDefault();
    if (!draggingId || !dragWordRef.current) return;
    handleDrop(blankId, dragWordRef.current, draggingId);
    setDraggingId(null);
    dragWordRef.current = '';
  };

  // ── Touch drag events ─────────────────────────────────────
  const createGhost = (word: string, x: number, y: number, color: string) => {
    removeGhost();
    const ghost = document.createElement('div');
    ghost.id = 'drag-ghost';
    ghost.textContent = word;
    ghost.style.cssText = `
      position: fixed; z-index: 9999; pointer-events: none;
      width: 80px; height: 80px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 800; color: white;
      background: #a855f7; border: 3px solid #7c3aed;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      transform: translate(-50%, -50%) scale(1.15);
      transition: transform 0.1s;
      left: ${x}px; top: ${y}px;
    `;
    document.body.appendChild(ghost);
    ghostRef.current = ghost;
  };

  const removeGhost = () => {
    const existing = document.getElementById('drag-ghost');
    if (existing) existing.remove();
    ghostRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent, circleId: string, word: string, color: string) => {
    const touch = e.touches[0];
    touchCircleRef.current = circleId;
    dragWordRef.current = word;
    createGhost(word, touch.clientX, touch.clientY, color);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchCircleRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (ghostRef.current) {
      ghostRef.current.style.left = `${touch.clientX}px`;
      ghostRef.current.style.top = `${touch.clientY}px`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchCircleRef.current) return;
    const touch = e.changedTouches[0];
    removeGhost();

    // Find element under touch point
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const blankEl = el?.closest('[data-blank-id]') as HTMLElement | null;
    if (blankEl) {
      const blankId = parseInt(blankEl.dataset.blankId ?? '-1', 10);
      if (blankId >= 0) {
        handleDrop(blankId, dragWordRef.current, touchCircleRef.current);
      }
    }

    touchCircleRef.current = null;
    dragWordRef.current = '';
  };

  const handleReset = () => {
    const newBlanks = buildBlanks(story);
    setBlanks(newBlanks);
    setCircles(buildWordCircles(newBlanks));
    setAllDone(false);
  };

  const filledCount = blanks.filter((b) => b.filled).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-400 to-cyan-400 rounded-3xl p-5 text-white text-center shadow-md">
        <div className="text-4xl mb-1">✏️</div>
        <h2 className="text-2xl font-extrabold">Fill in the Blanks!</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <p className="text-teal-100 font-semibold text-base">
            Drag the correct word into each blank space
          </p>
          <button
            onClick={() => {
              speak('Drag the correct word into each blank space', { rate: slowMode ? 0.6 : 0.85, pitch: 1.2, volume: 1.0 });
            }}
            aria-label="Hear activity instruction"
            title="Hear instruction"
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white border-2 border-white/40 transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
            </svg>
          </button>
        </div>
        {/* Progress */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {blanks.map((b, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-lg transition-all duration-300 ${
                b.filled ? 'bg-white text-teal-500' : 'bg-teal-300 text-white'
              }`}
            >
              {b.filled ? '✓' : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* All done celebration */}
      {allDone && (
        <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-3xl p-6 text-center shadow-lg animate-bounce-in">
          <div className="text-5xl mb-2">🎉🌟🎊</div>
          <p className="text-2xl font-extrabold text-orange-800">Amazing! You got them all!</p>
          <button
            onClick={handleReset}
            className="mt-4 px-6 py-3 bg-orange-500 text-white font-extrabold text-lg rounded-2xl shadow-md hover:bg-orange-600 active:scale-95 transition-all"
          >
            🔄 Play Again
          </button>
        </div>
      )}

      {/* Paragraph — all 5 sentences together */}
      <div className="bg-white rounded-3xl border-2 border-purple-100 p-6 shadow-sm">
        <p className="text-xl md:text-2xl font-bold text-gray-800 leading-loose flex flex-wrap items-center gap-x-2 gap-y-3">
          {blanks.map((blank, idx) => (
            <React.Fragment key={blank.id}>
              {/* Before-blank text */}
              {blank.beforeBlank && <span>{blank.beforeBlank}</span>}

              {/* Drop zone */}
              <span
                data-blank-id={blank.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnBlank(e, blank.id)}
                className={`inline-flex items-center justify-center min-w-[100px] h-12 rounded-2xl border-dashed transition-all duration-200 px-3 ${
                  blank.filled
                    ? 'bg-green-200 border-green-400 text-green-800 border-solid'
                    : shakingBlank === blank.id
                    ? 'border-red-400 bg-red-50 animate-shake'
                    : successBlank === blank.id
                    ? 'border-green-400 bg-green-50 scale-105'
                    : draggingId
                    ? 'border-purple-400 bg-purple-50 scale-105' :'border-gray-300 bg-gray-50'
                }`}
                style={{ borderWidth: '3px' }}
                aria-label={blank.filled ? `Filled with: ${blank.filledWord}` : 'Drop word here'}
              >
                {blank.filled ? (
                  <span className="font-extrabold text-green-700 text-xl">
                    ✓ {blank.filledWord}
                  </span>
                ) : (
                  <span className="text-gray-400 font-bold text-base">drop here</span>
                )}
              </span>

              {/* After-blank text + sentence speaker */}
              {blank.afterBlank && <span>{blank.afterBlank}.</span>}

              {/* Speaker button inline after each sentence */}
              <button
                onClick={() => speakSentence(blank.fullSentence, String(blank.id))}
                className={`inline-flex flex-shrink-0 w-9 h-9 rounded-full items-center justify-center text-base transition-all active:scale-90 border-2 ${
                  speakingId === `sentence-${blank.id}`
                    ? 'bg-teal-400 text-white border-teal-500 shadow-md animate-pulse'
                    : 'bg-teal-100 text-teal-600 border-teal-200 hover:bg-teal-200'
                }`}
                aria-label="Read sentence aloud"
              >
                🔊
              </button>

              {/* Space between sentences */}
              {idx < blanks.length - 1 && <span className="w-1" />}
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* Word circles at the bottom */}
      <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-100 p-5 mt-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-center text-purple-600 font-extrabold text-base">
            🎯 Drag a word into the blank — or tap to hear it!
          </p>
          <button
            onClick={() => {
              speak('Drag a word into the blank, or tap to hear it!', { rate: slowMode ? 0.6 : 0.85, pitch: 1.2, volume: 1.0 });
            }}
            aria-label="Hear word bank instruction"
            title="Hear instruction"
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-500 border-2 border-purple-200 transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {circles.map((circle, idx) => (
            <div
              key={circle.id}
              draggable={!circle.used}
              onDragStart={() => handleDragStart(circle.id, circle.word)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => !circle.used && handleTouchStart(e, circle.id, circle.word, circle.color)}
              onTouchMove={(e) => !circle.used && handleTouchMove(e)}
              onTouchEnd={(e) => !circle.used && handleTouchEnd(e)}
              onClick={() => !circle.used && speakWord(circle.word, circle.id)}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-all duration-300 shadow-lg ${
                circle.used
                  ? 'opacity-30 scale-90 cursor-not-allowed'
                  : draggingId === circle.id
                  ? 'scale-110 shadow-xl opacity-80'
                  : 'hover:scale-110 hover:shadow-xl active:scale-95'
              } ${circle.color}`}
              style={{ touchAction: 'none' }}
              aria-label={`Word: ${circle.word}${circle.used ? ' (used)' : ''}`}
              role="button"
              tabIndex={circle.used ? -1 : 0}
            >
              <span
                className={`font-extrabold text-center leading-tight px-1 ${
                  circle.word.length > 6 ? 'text-sm' : circle.word.length > 4 ? 'text-base' : 'text-lg'
                } ${CIRCLE_TEXT_COLORS[idx % CIRCLE_TEXT_COLORS.length]}`}
              >
                {circle.word}
              </span>
              {/* Speaking pulse ring */}
              {speakingId === circle.id && (
                <span className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-60" />
              )}
              {/* Used checkmark */}
              {circle.used && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full text-white text-xs flex items-center justify-center font-bold border-2 border-white">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reset button */}
      {!allDone && filledCount > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl border-2 border-gray-200 hover:bg-gray-200 active:scale-95 transition-all text-base"
          >
            🔄 Reset
          </button>
        </div>
      )}
    </div>
  );
}