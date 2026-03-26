'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Story } from '@/lib/stories';
import { saveRhymeMatchResult } from '@/lib/rhymeMatchResults';
import { speak } from '@/lib/speech';
import { playCorrectSound, playWrongSound, playAchievementSound, playGoodJobSound } from '@/lib/sounds';
import { playCelebrationVoice } from '@/lib/celebrationVoice';

interface RhymeGroup {
  sound: string;       // e.g. "-at"
  label: string;       // display label e.g. "🐱 -at words"
  words: string[];     // correct words for this group
}

interface RhymeMatchGameProps {
  story: Story;
  childName?: string;
  slowMode?: boolean;
}

// ── Rhyme groups per story ────────────────────────────────────────────────────
// Each story has 2–3 rhyme groups with 2–3 words each

const STORY_RHYME_GROUPS: Record<string, RhymeGroup[]> = {
  'cat-and-hat': [
    { sound: '-at', label: '🐱 -at words', words: ['cat', 'hat', 'mat', 'fat', 'sat'] },
    { sound: '-ed', label: '❤️ -ed words', words: ['red', 'fed', 'bed'] },
    { sound: '-ay', label: '☀️ -ay words', words: ['day', 'way', 'say'] },
  ],
  'dog-and-ball': [
    { sound: '-ast', label: '💨 -ast words', words: ['fast', 'last', 'past'] },
    { sound: '-ack', label: '🔙 -ack words', words: ['back', 'pack', 'track'] },
    { sound: '-ot', label: '🔴 -ot words', words: ['got', 'lot', 'hot'] },
  ],
  'little-fish': [
    { sound: '-ea', label: '🌊 -ea words', words: ['sea', 'free', 'tree'] },
    { sound: '-ell', label: '🐚 -ell words', words: ['shell', 'shelf', 'well'] },
    { sound: '-ound', label: '🕳️ -ound words', words: ['found', 'round', 'sound'] },
  ],
  'rainy-day': [
    { sound: '-oot', label: '👢 -oot words', words: ['boots', 'roots', 'hoots'] },
    { sound: '-ash', label: '💦 -ash words', words: ['splash', 'crash', 'flash'] },
    { sound: '-ay', label: '☀️ -ay words', words: ['day', 'play', 'way'] },
  ],
  'stars-at-night': [
    { sound: '-ar', label: '⭐ -ar words', words: ['star', 'far', 'bar'] },
    { sound: '-ight', label: '🌙 -ight words', words: ['night', 'bright', 'light'] },
    { sound: '-ass', label: '🌿 -ass words', words: ['grass', 'class', 'pass'] },
  ],
  'big-red-hen': [
    { sound: '-est', label: '🪺 -est words', words: ['nest', 'best', 'rest'] },
    { sound: '-arm', label: '🏡 -arm words', words: ['farm', 'warm', 'charm'] },
    { sound: '-ack', label: '🐣 -ack words', words: ['cracked', 'back', 'black'] },
  ],
  'little-seed': [
    { sound: '-ound', label: '🌍 -ound words', words: ['ground', 'found', 'round'] },
    { sound: '-ower', label: '🌻 -ower words', words: ['flower', 'power', 'tower'] },
    { sound: '-ay', label: '☀️ -ay words', words: ['day', 'way', 'say'] },
  ],
  'the-lost-sock': [
    { sound: '-ook', label: '👀 -ook words', words: ['looked', 'book', 'took'] },
    { sound: '-ack', label: '🔙 -ack words', words: ['back', 'pack', 'track'] },
    { sound: '-arm', label: '🧦 -arm words', words: ['warm', 'farm', 'charm'] },
  ],
  'the-yellow-bus': [
    { sound: '-ool', label: '🏫 -ool words', words: ['school', 'cool', 'pool'] },
    { sound: '-oad', label: '🛣️ -oad words', words: ['road', 'load', 'toad'] },
    { sound: '-ay', label: '☀️ -ay words', words: ['day', 'say', 'way'] },
  ],
  'the-apple-tree': [
    { sound: '-eet', label: '🍎 -eet words', words: ['sweet', 'meet', 'feet'] },
    { sound: '-unch', label: '🥧 -unch words', words: ['crunchy', 'lunch', 'bunch'] },
    { sound: '-arden', label: '🌳 -arden words', words: ['garden', 'pardon', 'harden'] },
  ],
  'the-little-boat': [
    { sound: '-oat', label: '⛵ -oat words', words: ['boat', 'coat', 'float'] },
    { sound: '-ond', label: '🌊 -ond words', words: ['pond', 'bond', 'fond'] },
    { sound: '-ind', label: '💨 -ind words', words: ['wind', 'find', 'kind'] },
  ],
  'the-sleepy-bear': [
    { sound: '-inter', label: '❄️ -inter words', words: ['winter', 'hinter', 'sprinter'] },
    { sound: '-ing', label: '🌸 -ing words', words: ['spring', 'ring', 'sing'] },
    { sound: '-osy', label: '🐻 -osy words', words: ['cosy', 'rosy', 'nosy'] },
  ],
  'the-rainbow': [
    { sound: '-ain', label: '🌧️ -ain words', words: ['rain', 'plain', 'train'] },
    { sound: '-ow', label: '🌈 -ow words', words: ['rainbow', 'glow', 'show'] },
    { sound: '-urple', label: '💜 -urple words', words: ['purple', 'hurtle', 'turtle'] },
  ],
};

// Fallback: generate simple rhyme groups from story words
function buildFallbackGroups(story: Story): RhymeGroup[] {
  const words = story.text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z]/g, '').toLowerCase())
    .filter((w) => w.length >= 3);
  const unique = [...new Set(words)];
  // Group by last 2 chars
  const byEnding: Record<string, string[]> = {};
  unique.forEach((w) => {
    const end = w.slice(-2);
    if (!byEnding[end]) byEnding[end] = [];
    byEnding[end].push(w);
  });
  const groups = Object.entries(byEnding)
    .filter(([, ws]) => ws.length >= 2)
    .slice(0, 3)
    .map(([end, ws]) => ({
      sound: `-${end}`,
      label: `🔤 -${end} words`,
      words: ws.slice(0, 3),
    }));
  return groups.length >= 2 ? groups : [
    { sound: '-at', label: '🐱 -at words', words: ['cat', 'hat', 'mat'] },
    { sound: '-ay', label: '☀️ -ay words', words: ['day', 'way', 'say'] },
  ];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RhymeMatchGame({ story, childName, slowMode }: RhymeMatchGameProps) {
  const groups: RhymeGroup[] = STORY_RHYME_GROUPS[story.id] ?? buildFallbackGroups(story);

  // All words shuffled into a word bank
  const allWords = groups.flatMap((g) => g.words);
  const totalWords = allWords.length;

  // placements: wordBank words → group index (-1 = in bank)
  const [placements, setPlacements] = useState<Record<string, number>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null); // group index or -1 for bank
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [saved, setSaved] = useState(false);
  const [wordBankWords, setWordBankWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<Set<string>>(new Set());
  const [wrongWords, setWrongWords] = useState<Set<string>>(new Set());
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  // Touch drag
  const touchWordRef = useRef<string | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const init = useCallback(() => {
    setWordBankWords(shuffle(allWords));
    setPlacements({});
    setSubmitted(false);
    setScore(0);
    setCorrectWords(new Set());
    setWrongWords(new Set());
    setSaved(false);
  }, [story.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { init(); }, [init]);

  // Words currently in the bank (not placed)
  const bankWords = wordBankWords.filter((w) => placements[w] === undefined || placements[w] === -1);

  // Words placed in a specific group
  const wordsInGroup = (groupIdx: number) =>
    wordBankWords.filter((w) => placements[w] === groupIdx);

  // ── Desktop drag ──────────────────────────────────────────
  const handleDragStart = (word: string) => setDragging(word);
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const dropOnGroup = (groupIdx: number) => {
    if (!dragging) return;
    const newP = { ...placements };
    newP[dragging] = groupIdx;
    setPlacements(newP);
    setDragging(null);
    setDragOver(null);
  };

  const dropOnBank = () => {
    if (!dragging) return;
    const newP = { ...placements };
    delete newP[dragging];
    setPlacements(newP);
    setDragging(null);
    setDragOver(null);
  };

  // ── Touch drag ────────────────────────────────────────────
  const handleTouchStart = (word: string, e: React.TouchEvent) => {
    touchWordRef.current = word;
    const touch = e.touches[0];
    const ghost = document.createElement('div');
    ghost.textContent = word;
    ghost.style.cssText = `
      position:fixed;z-index:9999;pointer-events:none;
      background:#ec4899;color:white;padding:8px 16px;
      border-radius:12px;font-weight:800;font-size:16px;
      transform:translate(-50%,-50%);
      left:${touch.clientX}px;top:${touch.clientY}px;
      box-shadow:0 4px 20px rgba(236,72,153,0.5);
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
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = el?.closest('[data-groupidx]');
    if (slot) {
      setDragOver(parseInt((slot as HTMLElement).dataset.groupidx ?? '-1'));
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
    const slot = el?.closest('[data-groupidx]');
    if (slot) {
      const idx = parseInt((slot as HTMLElement).dataset.groupidx ?? '-1');
      if (idx >= 0) {
        const newP = { ...placements };
        newP[word] = idx;
        setPlacements(newP);
        return;
      }
    }
    // Dropped on bank
    const bankEl = el?.closest('[data-bank]');
    if (bankEl) {
      const newP = { ...placements };
      delete newP[word];
      setPlacements(newP);
    }
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    let correct = 0;
    const cWords = new Set<string>();
    const wWords = new Set<string>();

    wordBankWords.forEach((word) => {
      const placedGroupIdx = placements[word];
      if (placedGroupIdx === undefined) return; // still in bank — skip
      const correctGroupIdx = groups.findIndex((g) => g.words.includes(word));
      if (placedGroupIdx === correctGroupIdx) {
        correct++;
        cWords.add(word);
      } else {
        wWords.add(word);
      }
    });

    const newAttempts = attempts + 1;
    setScore(correct);
    setAttempts(newAttempts);
    setCorrectWords(cWords);
    setWrongWords(wWords);
    setSubmitted(true);

    // Sound effects
    const placed = Object.keys(placements).length;
    if (correct === placed && correct === totalWords) {
      playAchievementSound();
      playCelebrationVoice(childName, correct, totalWords, 'rhyme-match');
    } else if (wWords.size === 0 && correct > 0) {
      playGoodJobSound();
      playCelebrationVoice(childName, correct, totalWords, 'rhyme-match');
    } else if (correct > 0) {
      playCorrectSound();
      if (wWords.size > 0) setTimeout(() => playWrongSound(), 400);
    } else {
      playWrongSound();
    }

    // Save result
    if (!saved) {
      setSaved(true);
      await saveRhymeMatchResult({
        storyTitle: story.title,
        childName,
        score: correct,
        total: totalWords,
        attempts: newAttempts,
      });
    }
  };

  // ── Speak ─────────────────────────────────────────────────
  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeakingWord(text);
    speak(text, {
      rate: slowMode ? 0.6 : 0.85,
      onEnd: () => setSpeakingWord(null),
      onError: () => setSpeakingWord(null),
    });
  };

  const allPlaced = wordBankWords.every((w) => placements[w] !== undefined);
  const anyPlaced = Object.keys(placements).length > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl border-2 border-pink-200 p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎵</span>
          <div>
            <h2 className="text-xl font-extrabold text-pink-800">Rhyme Match!</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-pink-600 font-semibold">
                Drag each word into the group it rhymes with
              </p>
              <button
                onClick={() => {
                  speak('Drag each word into the group it rhymes with', { rate: slowMode ? 0.6 : 0.85, pitch: 1.2, volume: 1.0 });
                }}
                aria-label="Hear activity instruction"
                title="Hear instruction"
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 hover:bg-pink-200 text-pink-500 border border-pink-200 transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {groups.map((g) => (
            <span key={g.sound} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-bold border border-pink-200">
              {g.label}
            </span>
          ))}
        </div>
      </div>

      {/* Word Bank */}
      <div
        data-bank="true"
        onDragOver={(e) => { e.preventDefault(); setDragOver(-1); }}
        onDragLeave={() => setDragOver(null)}
        onDrop={dropOnBank}
        className={`bg-white rounded-3xl border-2 p-4 transition-all ${
          dragOver === -1 ? 'border-pink-400 bg-pink-50' : 'border-purple-100'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-extrabold text-purple-500 uppercase tracking-wide">
            🗂 Word Bank — drag words into the rhyme groups below
          </p>
          <button
            onClick={() => {
              speak('Word Bank. Drag words into the rhyme groups below.', { rate: slowMode ? 0.6 : 0.85, pitch: 1.2, volume: 1.0 });
            }}
            aria-label="Hear word bank instruction"
            title="Hear instruction"
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-pink-50 hover:bg-pink-100 text-pink-400 border border-pink-200 transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[48px]">
          {bankWords.length === 0 ? (
            <p className="text-purple-300 text-sm font-semibold italic">All words placed!</p>
          ) : (
            bankWords.map((word) => (
              <div
                key={word}
                draggable={!submitted}
                onDragStart={() => handleDragStart(word)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => !submitted && handleTouchStart(word, e)}
                onTouchMove={(e) => !submitted && handleTouchMove(e)}
                onTouchEnd={(e) => !submitted && handleTouchEnd(e)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-extrabold text-base border-2 select-none transition-all
                  ${submitted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95'}
                  ${dragging === word ? 'opacity-40 scale-95' : ''}
                  bg-pink-500 text-white border-pink-600 shadow-sm`}
              >
                <span>{word}</span>
                <button
                  onClick={(e) => handleSpeak(word, e)}
                  className={`text-pink-200 hover:text-white transition-colors ${speakingWord === word ? 'animate-pulse' : ''}`}
                  aria-label={`Hear ${word}`}
                >
                  🔊
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rhyme Groups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group, gIdx) => {
          const placed = wordsInGroup(gIdx);
          const isOver = dragOver === gIdx;

          return (
            <div
              key={group.sound}
              data-groupidx={gIdx}
              onDragOver={(e) => { e.preventDefault(); setDragOver(gIdx); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => dropOnGroup(gIdx)}
              className={`rounded-3xl border-2 p-4 min-h-[140px] transition-all ${
                isOver
                  ? 'border-pink-400 bg-pink-50 scale-[1.02]'
                  : 'border-purple-200 bg-white'
              }`}
            >
              {/* Group header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{group.label.split(' ')[0]}</span>
                <div>
                  <p className="font-extrabold text-purple-800 text-sm">{group.sound} family</p>
                  <p className="text-xs text-purple-400 font-semibold">{group.label.split(' ').slice(1).join(' ')}</p>
                </div>
              </div>

              {/* Placed words */}
              <div className="flex flex-wrap gap-2">
                {placed.length === 0 && (
                  <div className="w-full h-10 rounded-2xl border-2 border-dashed border-purple-200 flex items-center justify-center">
                    <span className="text-purple-300 text-xs font-semibold">Drop rhyming words here</span>
                  </div>
                )}
                {placed.map((word) => {
                  const isCorrect = correctWords.has(word);
                  const isWrong = wrongWords.has(word);
                  return (
                    <div
                      key={word}
                      draggable={!submitted}
                      onDragStart={() => !submitted && handleDragStart(word)}
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) => !submitted && handleTouchStart(word, e)}
                      onTouchMove={(e) => !submitted && handleTouchMove(e)}
                      onTouchEnd={(e) => !submitted && handleTouchEnd(e)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-extrabold text-sm border-2 select-none transition-all
                        ${submitted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:scale-105'}
                        ${submitted && isCorrect ? 'bg-green-100 text-green-800 border-green-400' : ''}
                        ${submitted && isWrong ? 'bg-red-100 text-red-700 border-red-400' : ''}
                        ${!submitted ? 'bg-violet-100 text-violet-800 border-violet-300' : ''}
                      `}
                    >
                      {submitted && isCorrect && <span>✅</span>}
                      {submitted && isWrong && <span>❌</span>}
                      <span>{word}</span>
                      <button
                        onClick={(e) => handleSpeak(word, e)}
                        className={`text-current opacity-60 hover:opacity-100 transition-opacity ${speakingWord === word ? 'animate-pulse' : ''}`}
                        aria-label={`Hear ${word}`}
                      >
                        🔊
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / Result */}
      {!submitted ? (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!anyPlaced}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-lg transition-all active:scale-95 shadow-md
              ${anyPlaced
                ? 'bg-pink-500 hover:bg-pink-600 text-white' :'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <span>🎵</span>
            <span>Check My Rhymes!</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-pink-200 p-6 text-center shadow-sm">
          {/* Score */}
          <div className="text-5xl mb-2">
            {score === totalWords ? '🏆' : score >= totalWords * 0.7 ? '🌟' : score >= totalWords * 0.4 ? '👍' : '💪'}
          </div>
          <p className="text-2xl font-extrabold text-pink-800 mb-1">
            {score} / {totalWords} correct!
          </p>
          <p className="text-sm text-pink-500 font-semibold mb-1">
            {score === totalWords
              ? '🎉 Perfect rhyme master!'
              : score >= totalWords * 0.7
              ? '🌟 Great rhyming!'
              : score >= totalWords * 0.4
              ? '👍 Good try! Keep practising!' :'💪 Keep going — you can do it!'}
          </p>
          <p className="text-xs text-purple-400 font-semibold mb-5">
            Attempt #{attempts} · Saved to parent dashboard ✓
          </p>

          {/* Correct answers reveal */}
          {score < totalWords && (
            <div className="mb-5 text-left bg-pink-50 rounded-2xl p-4 border border-pink-100">
              <p className="text-sm font-extrabold text-pink-700 mb-2">✨ Correct groupings:</p>
              {groups.map((g) => (
                <div key={g.sound} className="mb-1">
                  <span className="text-xs font-bold text-purple-600">{g.label}: </span>
                  <span className="text-xs text-purple-800 font-semibold">{g.words.join(', ')}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={init}
            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-base rounded-2xl transition-all active:scale-95 shadow-md"
          >
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}