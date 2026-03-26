'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { type Story } from '@/lib/stories';
import { saveWordMatchResult } from '@/lib/wordMatchResults';
import { speak } from '@/lib/speech';
import { playCorrectSound, playWrongSound, playAchievementSound, playGoodJobSound } from '@/lib/sounds';
import { playCelebrationVoice } from '@/lib/celebrationVoice';

interface WordDef {
  word: string;
  definition: string;
}

interface WordMatchGameProps {
  story: Story;
  childName?: string;
  slowMode?: boolean;
}

// ── Word/definition pairs per story ──────────────────────────────────────────
// Each story has 5 curated word-definition pairs drawn from its vocabulary

const STORY_WORD_DEFS: Record<string, WordDef[]> = {
  'cat-and-hat': [
    { word: 'mat', definition: 'A flat piece you put on the floor' },
    { word: 'hat', definition: 'Something you wear on your head' },
    { word: 'red', definition: 'The colour of fire engines' },
    { word: 'wore', definition: 'Past tense of "wear"' },
    { word: 'happy', definition: 'Feeling very pleased and glad' },
  ],
  'dog-and-ball': [
    { word: 'caught', definition: 'Grabbed something moving through the air' },
    { word: 'jumped', definition: 'Leaped up off the ground' },
    { word: 'threw', definition: 'Sent something through the air with your hand' },
    { word: 'friend', definition: 'Someone you like and play with' },
    { word: 'hug', definition: 'Wrapping your arms around someone warmly' },
  ],
  'little-fish': [
    { word: 'coral', definition: 'A colourful reef structure found in the sea' },
    { word: 'cave', definition: 'A hollow space inside a rock or cliff' },
    { word: 'sparkly', definition: 'Shining with tiny flashes of light' },
    { word: 'shell', definition: 'A hard outer covering found on the beach' },
    { word: 'shelf', definition: 'A flat board on a wall for storing things' },
  ],
  'rainy-day': [
    { word: 'puddles', definition: 'Small pools of water on the ground after rain' },
    { word: 'raincoat', definition: 'A waterproof coat worn in the rain' },
    { word: 'boots', definition: 'Tall shoes that cover your ankles' },
    { word: 'muddy', definition: 'Covered in wet, dirty earth' },
    { word: 'splash', definition: 'The sound and action of hitting water' },
  ],
  'stars-at-night': [
    { word: 'stars', definition: 'Bright lights you see in the night sky' },
    { word: 'grass', definition: 'The green plants that cover a lawn' },
    { word: 'amazing', definition: 'Causing great wonder and surprise' },
    { word: 'dipper', definition: 'A group of stars shaped like a ladle' },
    { word: 'touch', definition: 'To make contact with something with your hand' },
  ],
  'big-red-hen': [
    { word: 'nest', definition: 'A cosy place a bird makes to lay eggs' },
    { word: 'eggs', definition: 'Oval objects that baby birds hatch from' },
    { word: 'cracked', definition: 'Broke open with a sharp sound' },
    { word: 'chicks', definition: 'Baby birds that have just hatched' },
    { word: 'farm', definition: 'A place where animals and crops are raised' },
  ],
  'little-seed': [
    { word: 'seed', definition: 'A tiny thing planted in soil that grows into a plant' },
    { word: 'ground', definition: 'The surface of the earth under your feet' },
    { word: 'shoot', definition: 'A new young growth coming up from a plant' },
    { word: 'flower', definition: 'The colourful bloom that grows on a plant' },
    { word: 'proud', definition: 'Feeling very pleased with what you have done' },
  ],
  'the-lost-sock': [
    { word: 'sock', definition: 'A soft covering you wear on your foot inside a shoe' },
    { word: 'looked', definition: 'Used your eyes to search for something' },
    { word: 'behind', definition: 'At the back of something' },
    { word: 'laughed', definition: 'Made a happy sound because something was funny' },
    { word: 'warm', definition: 'Having a comfortable, cosy heat' },
  ],
  'the-yellow-bus': [
    { word: 'bus', definition: 'A large vehicle that carries many passengers' },
    { word: 'corner', definition: 'The point where two roads or edges meet' },
    { word: 'driver', definition: 'The person who controls a vehicle' },
    { word: 'seats', definition: 'Places where you sit on a vehicle' },
    { word: 'school', definition: 'A building where children go to learn' },
  ],
  'the-apple-tree': [
    { word: 'apple', definition: 'A round fruit that grows on trees' },
    { word: 'climbed', definition: 'Went up something using hands and feet' },
    { word: 'sweet', definition: 'Having a pleasant sugary taste' },
    { word: 'crunchy', definition: 'Making a crisp sound when you bite it' },
    { word: 'pie', definition: 'A baked dish with a pastry crust and filling' },
  ],
  'the-little-boat': [
    { word: 'boat', definition: 'A small vessel that floats on water' },
    { word: 'pond', definition: 'A small body of still water' },
    { word: 'floated', definition: 'Rested on top of water without sinking' },
    { word: 'wind', definition: 'Moving air that you can feel but not see' },
    { word: 'smiled', definition: 'Turned the corners of your mouth up happily' },
  ],
  'the-sleepy-bear': [
    { word: 'burrow', definition: 'A hole or tunnel dug as a home by an animal' },
    { word: 'cosy', definition: 'Warm, comfortable and snug' },
    { word: 'winter', definition: 'The coldest season of the year' },
    { word: 'spring', definition: 'The season when flowers bloom after winter' },
    { word: 'stretched', definition: 'Extended arms and legs to their full length' },
  ],
  'the-rainbow': [
    { word: 'rainbow', definition: 'An arc of colours in the sky after rain' },
    { word: 'colours', definition: 'Red, blue, yellow and other shades you can see' },
    { word: 'pointed', definition: 'Directed a finger toward something' },
    { word: 'orange', definition: 'A colour between red and yellow' },
    { word: 'purple', definition: 'A colour made by mixing red and blue' },
  ],
};

// Fallback: extract key words from story text
function buildFallbackPairs(story: Story): WordDef[] {
  const words = story.text.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '').toLowerCase()).filter(w => w.length > 4);
  const unique = [...new Set(words)].slice(0, 5);
  return unique.map(w => ({ word: w, definition: `A word from the story: "${w}"` }));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WordMatchGame({ story, childName, slowMode }: WordMatchGameProps) {
  const pairs: WordDef[] = useMemo(
    () => STORY_WORD_DEFS[story.id] ?? buildFallbackPairs(story),
    [story.id]
  );

  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<WordDef[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({}); // defIndex → word
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [saved, setSaved] = useState(false);
  const [wrongSlots, setWrongSlots] = useState<Set<number>>(new Set());
  const [correctSlots, setCorrectSlots] = useState<Set<number>>(new Set());
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);
  const [speakingDef, setSpeakingDef] = useState<number | null>(null);

  // Touch drag state
  const touchWordRef = useRef<string | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const init = useCallback(() => {
    setShuffledWords(shuffle(pairs.map(p => p.word)));
    setShuffledDefs(shuffle(pairs));
    setMatches({});
    setSubmitted(false);
    setScore(0);
    setWrongSlots(new Set());
    setCorrectSlots(new Set());
    setSaved(false);
  }, [pairs]);

  useEffect(() => { init(); }, [init]);

  // ── Desktop drag handlers ─────────────────────────────────
  const handleDragStart = (word: string) => setDragging(word);
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const handleDropOnDef = (defIdx: number) => {
    if (!dragging) return;
    // If this word is already placed somewhere else, remove it
    const newMatches = { ...matches };
    Object.keys(newMatches).forEach(k => {
      if (newMatches[k] === dragging) delete newMatches[k];
    });
    newMatches[defIdx] = dragging;
    setMatches(newMatches);
    setDragging(null);
    setDragOver(null);
  };

  const handleDropOnWordBank = () => {
    if (!dragging) return;
    const newMatches = { ...matches };
    Object.keys(newMatches).forEach(k => {
      if (newMatches[k] === dragging) delete newMatches[k];
    });
    setMatches(newMatches);
    setDragging(null);
  };

  // ── Touch drag handlers ───────────────────────────────────
  const handleTouchStart = (word: string, e: React.TouchEvent) => {
    touchWordRef.current = word;
    const touch = e.touches[0];
    // Create ghost element
    const ghost = document.createElement('div');
    ghost.textContent = word;
    ghost.style.cssText = `
      position: fixed; z-index: 9999; pointer-events: none;
      background: #8b5cf6; color: white; padding: 8px 16px;
      border-radius: 12px; font-weight: 800; font-size: 16px;
      transform: translate(-50%, -50%);
      left: ${touch.clientX}px; top: ${touch.clientY}px;
      box-shadow: 0 4px 20px rgba(139,92,246,0.5);
    `;
    document.body.appendChild(ghost);
    ghostRef.current = ghost;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (ghostRef.current) {
      ghostRef.current.style.left = `${touch.clientX}px`;
      ghostRef.current.style.top = `${touch.clientY}px`;
    }
    // Highlight drop zone under finger
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = el?.closest('[data-defidx]');
    if (slot) {
      const idx = parseInt((slot as HTMLElement).dataset.defidx ?? '-1');
      setDragOver(idx);
    } else {
      setDragOver(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (ghostRef.current) {
      document.body.removeChild(ghostRef.current);
      ghostRef.current = null;
    }
    const word = touchWordRef.current;
    touchWordRef.current = null;
    setDragOver(null);
    if (!word) return;

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = el?.closest('[data-defidx]');
    if (slot) {
      const idx = parseInt((slot as HTMLElement).dataset.defidx ?? '-1');
      if (idx >= 0) {
        const newMatches = { ...matches };
        Object.keys(newMatches).forEach(k => {
          if (newMatches[k] === word) delete newMatches[k];
        });
        newMatches[idx] = word;
        setMatches(newMatches);
      }
    } else {
      // Dropped on word bank — unplace
      const newMatches = { ...matches };
      Object.keys(newMatches).forEach(k => {
        if (newMatches[k] === word) delete newMatches[k];
      });
      setMatches(newMatches);
    }
  };

  const handleSpeakWord = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeakingWord(word);
    speak(word, {
      rate: slowMode ? 0.6 : 0.85,
      onEnd: () => setSpeakingWord(null),
      onError: () => setSpeakingWord(null),
    });
  };

  const handleSpeakDef = (definition: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeakingDef(idx);
    speak(definition, {
      rate: slowMode ? 0.6 : 0.9,
      onEnd: () => setSpeakingDef(null),
      onError: () => setSpeakingDef(null),
    });
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    let correct = 0;
    const wrong = new Set<number>();
    const correct_ = new Set<number>();
    shuffledDefs.forEach((def, idx) => {
      if (matches[idx] === def.word) {
        correct++;
        correct_.add(idx);
      } else if (matches[idx]) {
        wrong.add(idx);
      }
    });
    setScore(correct);
    setWrongSlots(wrong);
    setCorrectSlots(correct_);
    setSubmitted(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Play sound based on result
    const pctNow = pairs.length > 0 ? Math.round((correct / pairs.length) * 100) : 0;
    if (pctNow === 100) {
      playAchievementSound();
      playCelebrationVoice(childName, correct, pairs.length, 'word-match');
    } else if (wrong.size > 0 && correct > 0) {
      // Mixed: some correct, some wrong — play correct then wrong
      playCorrectSound();
      setTimeout(() => playWrongSound(), 600);
    } else if (correct > 0) {
      playGoodJobSound();
      playCelebrationVoice(childName, correct, pairs.length, 'word-match');
    } else {
      playWrongSound();
    }

    if (!saved) {
      setSaved(true);
      await saveWordMatchResult({
        storyTitle: story.title,
        childName,
        score: correct,
        total: pairs.length,
        attempts: newAttempts,
      });
    }
  };

  const handleRetry = () => {
    init();
    setAttempts(a => a + 1);
  };

  const placedWords = new Set(Object.values(matches));
  const unplacedWords = shuffledWords.filter(w => !placedWords.has(w));
  const allPlaced = unplacedWords.length === 0;
  const pct = pairs.length > 0 ? Math.round((score / pairs.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold">🔤 Word Match</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-violet-200">Drag each word to its correct definition</p>
              <button
                onClick={() => {
                  speak('Drag each word to its correct definition', { rate: slowMode ? 0.6 : 0.85, pitch: 1.2, volume: 1.0 });
                }}
                aria-label="Hear activity instruction"
                title="Hear instruction"
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white border border-white/40 transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
                </svg>
              </button>
            </div>
          </div>
          {attempts > 0 && (
            <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
              <div className="text-lg font-extrabold">{attempts}</div>
              <div className="text-xs text-violet-200">Attempt{attempts !== 1 ? 's' : ''}</div>
            </div>
          )}
        </div>
      </div>

      {/* Result banner */}
      {submitted && (
        <div className={`rounded-3xl p-5 border-2 text-center ${
          pct === 100 ? 'bg-green-50 border-green-300' :
          pct >= 60 ? 'bg-yellow-50 border-yellow-300': 'bg-red-50 border-red-300'
        }`}>
          <div className="text-4xl mb-2">
            {pct === 100 ? '🏆' : pct >= 60 ? '⭐' : '💪'}
          </div>
          <p className="text-2xl font-extrabold text-purple-800">
            {score} / {pairs.length} correct!
          </p>
          <p className="text-sm text-purple-500 mt-1">
            {pct === 100 ? 'Perfect match! Amazing work! 🎉' :
             pct >= 60 ? 'Great effort! Keep practising!': 'Keep trying — you can do it!'}
          </p>
          <button
            onClick={handleRetry}
            className="mt-3 px-6 py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-extrabold rounded-2xl transition-all active:scale-95 text-sm shadow-md"
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {/* Word bank */}
      <div
        className="bg-white rounded-3xl border-2 border-violet-100 p-4"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDropOnWordBank}
      >
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-extrabold text-violet-500 uppercase tracking-wide">
            📦 Word Bank — drag a word to a definition below
          </p>
          <button
            onClick={() => {
              speak('Word Bank. Drag a word to a definition below.', { rate: slowMode ? 0.6 : 0.85, pitch: 1.2, volume: 1.0 });
            }}
            aria-label="Hear word bank instruction"
            title="Hear instruction"
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-violet-50 hover:bg-violet-100 text-violet-400 border border-violet-200 transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[48px]">
          {unplacedWords.length === 0 ? (
            <p className="text-sm text-violet-300 font-semibold italic">All words placed!</p>
          ) : (
            unplacedWords.map(word => (
              <div
                key={word}
                draggable
                onDragStart={() => handleDragStart(word)}
                onDragEnd={handleDragEnd}
                onTouchStart={e => handleTouchStart(word, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-extrabold text-sm cursor-grab active:cursor-grabbing select-none transition-colors
                  ${dragging === word
                    ? 'bg-violet-600 text-white shadow-lg opacity-80'
                    : 'bg-violet-500 text-white hover:bg-violet-600 shadow-sm'
                  }`}
              >
                <span>{word}</span>
                <button
                  onClick={e => handleSpeakWord(word, e)}
                  onMouseDown={e => e.stopPropagation()}
                  className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                    speakingWord === word
                      ? 'bg-white/40 scale-110' :'bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Hear "${word}"`}
                  aria-label={`Speak word ${word}`}
                >
                  {speakingWord === word ? (
                    <svg className="w-3.5 h-3.5 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Definition slots */}
      <div className="space-y-3">
        {shuffledDefs.map((def, idx) => {
          const placed = matches[idx];
          const isCorrect = correctSlots.has(idx);
          const isWrong = wrongSlots.has(idx);

          return (
            <div
              key={idx}
              data-defidx={idx}
              onDragOver={e => { e.preventDefault(); setDragOver(idx); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDropOnDef(idx)}
              className={`flex items-center gap-3 p-4 rounded-3xl border-2 transition-colors ${
                isCorrect ? 'bg-green-50 border-green-400' : isWrong ?'bg-red-50 border-red-300' :
                dragOver === idx ? 'bg-violet-50 border-violet-400': placed ?'bg-purple-50 border-purple-200': 'bg-white border-purple-100 hover:border-violet-200'
              }`}
            >
              {/* Drop zone */}
              <div
                className={`flex-shrink-0 min-w-[90px] h-10 flex items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                  isCorrect ? 'border-green-400 bg-green-100' : isWrong ?'border-red-300 bg-red-100' :
                  dragOver === idx ? 'border-violet-400 bg-violet-100': placed ?'border-purple-300 bg-purple-100': 'border-purple-200 bg-purple-50'
                }`}
              >
                {placed ? (
                  <span className={`font-extrabold text-sm px-2 ${
                    isCorrect ? 'text-green-700' : isWrong ?'text-red-600': 'text-purple-700'
                  }`}>
                    {isCorrect && '✓ '}{isWrong && '✗ '}{placed}
                  </span>
                ) : (
                  <span className="text-xs text-purple-300 font-semibold">drop here</span>
                )}
              </div>

              {/* Definition text */}
              <p className="text-sm font-semibold text-purple-800 flex-1 leading-snug">
                {def.definition}
              </p>

              {/* Voice button for definition */}
              <button
                onClick={e => handleSpeakDef(def.definition, idx, e)}
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                  speakingDef === idx
                    ? 'bg-violet-200 text-violet-700 scale-110'
                    : 'bg-violet-50 text-violet-400 hover:bg-violet-100 hover:text-violet-600'
                }`}
                title="Hear definition"
                aria-label="Speak definition"
              >
                {speakingDef === idx ? (
                  <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>

              {/* Reveal answer after submit */}
              {submitted && isWrong && (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-xl whitespace-nowrap">
                  ✓ {def.word}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allPlaced}
          className={`w-full py-4 rounded-3xl font-extrabold text-lg transition-all active:scale-95 shadow-md ${
            allPlaced
              ? 'bg-violet-500 hover:bg-violet-600 text-white'
              : 'bg-purple-100 text-purple-300 cursor-not-allowed'
          }`}
        >
          {allPlaced ? '✅ Check My Answers!' : `Place all ${unplacedWords.length} remaining word${unplacedWords.length !== 1 ? 's' : ''} to submit`}
        </button>
      )}
    </div>
  );
}