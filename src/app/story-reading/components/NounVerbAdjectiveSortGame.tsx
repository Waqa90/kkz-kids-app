'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { type Story } from '@/lib/stories';
import { saveNounVerbAdjectiveResult } from '@/lib/nounVerbAdjectiveResults';
import { speak } from '@/lib/speech';
import { playCorrectSound, playWrongSound, playAchievementSound } from '@/lib/sounds';
import { playCelebrationVoice } from '@/lib/celebrationVoice';

interface WordItem {
  word: string;
  category: 'noun' | 'verb' | 'adjective';
  emoji: string;
}

interface NounVerbAdjectiveSortGameProps {
  story: Story;
  childName?: string;
  slowMode?: boolean;
}

// ── Word sets per story ───────────────────────────────────────────────────────
const STORY_WORDS: Record<string, WordItem[]> = {
  'cat-and-hat': [
    // Nouns
    { word: 'cat', category: 'noun', emoji: '🐱' },
    { word: 'hat', category: 'noun', emoji: '🎩' },
    { word: 'mat', category: 'noun', emoji: '🟫' },
    { word: 'head', category: 'noun', emoji: '🗣️' },
    { word: 'day', category: 'noun', emoji: '📅' },
    // Verbs
    { word: 'sat', category: 'verb', emoji: '🪑' },
    { word: 'ran', category: 'verb', emoji: '🏃' },
    { word: 'wore', category: 'verb', emoji: '👗' },
    { word: 'fell', category: 'verb', emoji: '⬇️' },
    { word: 'liked', category: 'verb', emoji: '❤️' },
    // Adjectives
    { word: 'big', category: 'adjective', emoji: '🐘' },
    { word: 'red', category: 'adjective', emoji: '🔴' },
    { word: 'fat', category: 'adjective', emoji: '🫃' },
    { word: 'happy', category: 'adjective', emoji: '😄' },
    { word: 'every', category: 'adjective', emoji: '🔢' },
  ],
  'dog-and-ball': [
    { word: 'dog', category: 'noun', emoji: '🐶' },
    { word: 'ball', category: 'noun', emoji: '🔴' },
    { word: 'friend', category: 'noun', emoji: '👦' },
    { word: 'sky', category: 'noun', emoji: '☁️' },
    { word: 'hug', category: 'noun', emoji: '🤗' },
    { word: 'ran', category: 'verb', emoji: '🏃' },
    { word: 'jumped', category: 'verb', emoji: '⬆️' },
    { word: 'caught', category: 'verb', emoji: '🤲' },
    { word: 'threw', category: 'verb', emoji: '🤾' },
    { word: 'gave', category: 'verb', emoji: '🎁' },
    { word: 'fast', category: 'adjective', emoji: '💨' },
    { word: 'red', category: 'adjective', emoji: '🔴' },
    { word: 'big', category: 'adjective', emoji: '🐘' },
    { word: 'good', category: 'adjective', emoji: '⭐' },
    { word: 'high', category: 'adjective', emoji: '⬆️' },
  ],
  'little-fish': [
    { word: 'fish', category: 'noun', emoji: '🐟' },
    { word: 'sea', category: 'noun', emoji: '🌊' },
    { word: 'reef', category: 'noun', emoji: '🪸' },
    { word: 'cave', category: 'noun', emoji: '🕳️' },
    { word: 'shell', category: 'noun', emoji: '🐚' },
    { word: 'swam', category: 'verb', emoji: '🏊' },
    { word: 'found', category: 'verb', emoji: '🔍' },
    { word: 'lived', category: 'verb', emoji: '🏠' },
    { word: 'picked', category: 'verb', emoji: '✋' },
    { word: 'put', category: 'verb', emoji: '📥' },
    { word: 'little', category: 'adjective', emoji: '🐜' },
    { word: 'bright', category: 'adjective', emoji: '💡' },
    { word: 'pretty', category: 'adjective', emoji: '🌸' },
    { word: 'hidden', category: 'adjective', emoji: '🕵️' },
    { word: 'sparkly', category: 'adjective', emoji: '✨' },
  ],
  'rainy-day': [
    { word: 'rain', category: 'noun', emoji: '🌧️' },
    { word: 'puddles', category: 'noun', emoji: '💧' },
    { word: 'boots', category: 'noun', emoji: '👢' },
    { word: 'raincoat', category: 'noun', emoji: '🧥' },
    { word: 'path', category: 'noun', emoji: '🛤️' },
    { word: 'jumped', category: 'verb', emoji: '⬆️' },
    { word: 'looked', category: 'verb', emoji: '👀' },
    { word: 'loved', category: 'verb', emoji: '❤️' },
    { word: 'got', category: 'verb', emoji: '✋' },
    { word: 'put', category: 'verb', emoji: '📥' },
    { word: 'rainy', category: 'adjective', emoji: '🌧️' },
    { word: 'yellow', category: 'adjective', emoji: '🟡' },
    { word: 'muddy', category: 'adjective', emoji: '🟤' },
    { word: 'happy', category: 'adjective', emoji: '😄' },
    { word: 'red', category: 'adjective', emoji: '🔴' },
  ],
  'stars-at-night': [
    { word: 'stars', category: 'noun', emoji: '⭐' },
    { word: 'night', category: 'noun', emoji: '🌙' },
    { word: 'grass', category: 'noun', emoji: '🌿' },
    { word: 'dad', category: 'noun', emoji: '👨' },
    { word: 'sky', category: 'noun', emoji: '🌌' },
    { word: 'came', category: 'verb', emoji: '➡️' },
    { word: 'liked', category: 'verb', emoji: '❤️' },
    { word: 'said', category: 'verb', emoji: '💬' },
    { word: 'wanted', category: 'verb', emoji: '🙏' },
    { word: 'fly', category: 'verb', emoji: '✈️' },
    { word: 'tiny', category: 'adjective', emoji: '🐜' },
    { word: 'bright', category: 'adjective', emoji: '💡' },
    { word: 'amazing', category: 'adjective', emoji: '🤩' },
    { word: 'far', category: 'adjective', emoji: '🏔️' },
    { word: 'big', category: 'adjective', emoji: '🐘' },
  ],
  'big-red-hen': [
    { word: 'hen', category: 'noun', emoji: '🐔' },
    { word: 'egg', category: 'noun', emoji: '🥚' },
    { word: 'nest', category: 'noun', emoji: '🪺' },
    { word: 'farm', category: 'noun', emoji: '🏡' },
    { word: 'chick', category: 'noun', emoji: '🐣' },
    { word: 'sat', category: 'verb', emoji: '🪑' },
    { word: 'cracked', category: 'verb', emoji: '💥' },
    { word: 'kept', category: 'verb', emoji: '🤲' },
    { word: 'hatched', category: 'verb', emoji: '🐣' },
    { word: 'loved', category: 'verb', emoji: '❤️' },
    { word: 'big', category: 'adjective', emoji: '🐘' },
    { word: 'red', category: 'adjective', emoji: '🔴' },
    { word: 'warm', category: 'adjective', emoji: '🔥' },
    { word: 'cosy', category: 'adjective', emoji: '🛏️' },
    { word: 'happy', category: 'adjective', emoji: '😄' },
  ],
  'little-seed': [
    { word: 'seed', category: 'noun', emoji: '🌱' },
    { word: 'soil', category: 'noun', emoji: '🌍' },
    { word: 'rain', category: 'noun', emoji: '🌧️' },
    { word: 'sun', category: 'noun', emoji: '☀️' },
    { word: 'flower', category: 'noun', emoji: '🌸' },
    { word: 'grew', category: 'verb', emoji: '📈' },
    { word: 'pushed', category: 'verb', emoji: '💪' },
    { word: 'reached', category: 'verb', emoji: '🤲' },
    { word: 'bloomed', category: 'verb', emoji: '🌺' },
    { word: 'fell', category: 'verb', emoji: '⬇️' },
    { word: 'little', category: 'adjective', emoji: '🐜' },
    { word: 'dark', category: 'adjective', emoji: '🌑' },
    { word: 'slow', category: 'adjective', emoji: '🐢' },
    { word: 'proud', category: 'adjective', emoji: '🏆' },
    { word: 'dry', category: 'adjective', emoji: '🏜️' },
  ],
  'the-lost-sock': [
    { word: 'sock', category: 'noun', emoji: '🧦' },
    { word: 'bed', category: 'noun', emoji: '🛏️' },
    { word: 'floor', category: 'noun', emoji: '🟫' },
    { word: 'drawer', category: 'noun', emoji: '🗄️' },
    { word: 'dog', category: 'noun', emoji: '🐶' },
    { word: 'lost', category: 'verb', emoji: '❓' },
    { word: 'found', category: 'verb', emoji: '🔍' },
    { word: 'laughed', category: 'verb', emoji: '😂' },
    { word: 'looked', category: 'verb', emoji: '👀' },
    { word: 'wore', category: 'verb', emoji: '👗' },
    { word: 'warm', category: 'adjective', emoji: '🔥' },
    { word: 'soft', category: 'adjective', emoji: '🧸' },
    { word: 'happy', category: 'adjective', emoji: '😄' },
    { word: 'clean', category: 'adjective', emoji: '✨' },
    { word: 'funny', category: 'adjective', emoji: '😄' },
  ],
  'the-yellow-bus': [
    { word: 'bus', category: 'noun', emoji: '🚌' },
    { word: 'school', category: 'noun', emoji: '🏫' },
    { word: 'driver', category: 'noun', emoji: '🧑‍✈️' },
    { word: 'children', category: 'noun', emoji: '👧👦' },
    { word: 'road', category: 'noun', emoji: '🛣️' },
    { word: 'drove', category: 'verb', emoji: '🚗' },
    { word: 'stopped', category: 'verb', emoji: '🛑' },
    { word: 'waved', category: 'verb', emoji: '👋' },
    { word: 'waited', category: 'verb', emoji: '⏳' },
    { word: 'arrived', category: 'verb', emoji: '✅' },
    { word: 'yellow', category: 'adjective', emoji: '🟡' },
    { word: 'big', category: 'adjective', emoji: '🐘' },
    { word: 'fast', category: 'adjective', emoji: '💨' },
    { word: 'full', category: 'adjective', emoji: '🪣' },
    { word: 'early', category: 'adjective', emoji: '⏰' },
  ],
  'the-apple-tree': [
    { word: 'tree', category: 'noun', emoji: '🌳' },
    { word: 'apple', category: 'noun', emoji: '🍎' },
    { word: 'branch', category: 'noun', emoji: '🌿' },
    { word: 'garden', category: 'noun', emoji: '🌻' },
    { word: 'basket', category: 'noun', emoji: '🧺' },
    { word: 'grew', category: 'verb', emoji: '📈' },
    { word: 'picked', category: 'verb', emoji: '✋' },
    { word: 'fell', category: 'verb', emoji: '⬇️' },
    { word: 'tasted', category: 'verb', emoji: '😋' },
    { word: 'shared', category: 'verb', emoji: '🤝' },
    { word: 'sweet', category: 'adjective', emoji: '🍬' },
    { word: 'crunchy', category: 'adjective', emoji: '🍏' },
    { word: 'big', category: 'adjective', emoji: '🐘' },
    { word: 'happy', category: 'adjective', emoji: '😄' },
    { word: 'old', category: 'adjective', emoji: '🏚️' },
  ],
  'the-little-boat': [
    { word: 'boat', category: 'noun', emoji: '⛵' },
    { word: 'sea', category: 'noun', emoji: '🌊' },
    { word: 'sail', category: 'noun', emoji: '⛵' },
    { word: 'wind', category: 'noun', emoji: '💨' },
    { word: 'shore', category: 'noun', emoji: '🏖️' },
    { word: 'floated', category: 'verb', emoji: '🏊' },
    { word: 'sailed', category: 'verb', emoji: '⛵' },
    { word: 'rocked', category: 'verb', emoji: '🌊' },
    { word: 'reached', category: 'verb', emoji: '🤲' },
    { word: 'drifted', category: 'verb', emoji: '➡️' },
    { word: 'little', category: 'adjective', emoji: '🐜' },
    { word: 'fast', category: 'adjective', emoji: '💨' },
    { word: 'wet', category: 'adjective', emoji: '💧' },
    { word: 'happy', category: 'adjective', emoji: '😄' },
    { word: 'still', category: 'adjective', emoji: '🛑' },
  ],
  'the-sleepy-bear': [
    { word: 'bear', category: 'noun', emoji: '🐻' },
    { word: 'cave', category: 'noun', emoji: '🕳️' },
    { word: 'winter', category: 'noun', emoji: '❄️' },
    { word: 'spring', category: 'noun', emoji: '🌸' },
    { word: 'forest', category: 'noun', emoji: '🌲' },
    { word: 'slept', category: 'verb', emoji: '😴' },
    { word: 'woke', category: 'verb', emoji: '👀' },
    { word: 'yawned', category: 'verb', emoji: '🥱' },
    { word: 'stretched', category: 'verb', emoji: '🤸' },
    { word: 'walked', category: 'verb', emoji: '🚶' },
    { word: 'sleepy', category: 'adjective', emoji: '😴' },
    { word: 'cosy', category: 'adjective', emoji: '🛏️' },
    { word: 'dark', category: 'adjective', emoji: '🌑' },
    { word: 'big', category: 'adjective', emoji: '🐘' },
    { word: 'slow', category: 'adjective', emoji: '🐢' },
  ],
  'the-rainbow': [
    { word: 'rainbow', category: 'noun', emoji: '🌈' },
    { word: 'rain', category: 'noun', emoji: '🌧️' },
    { word: 'sky', category: 'noun', emoji: '🌌' },
    { word: 'colours', category: 'noun', emoji: '🎨' },
    { word: 'sun', category: 'noun', emoji: '☀️' },
    { word: 'appeared', category: 'verb', emoji: '✨' },
    { word: 'shone', category: 'verb', emoji: '💡' },
    { word: 'stopped', category: 'verb', emoji: '🛑' },
    { word: 'looked', category: 'verb', emoji: '👀' },
    { word: 'smiled', category: 'verb', emoji: '😊' },
    { word: 'bright', category: 'adjective', emoji: '💡' },
    { word: 'colourful', category: 'adjective', emoji: '🎨' },
    { word: 'beautiful', category: 'adjective', emoji: '🌸' },
    { word: 'wide', category: 'adjective', emoji: '↔️' },
    { word: 'happy', category: 'adjective', emoji: '😄' },
  ],
};

function buildFallbackWords(story: Story): WordItem[] {
  return [
    { word: 'cat', category: 'noun', emoji: '🐱' },
    { word: 'dog', category: 'noun', emoji: '🐶' },
    { word: 'sun', category: 'noun', emoji: '☀️' },
    { word: 'tree', category: 'noun', emoji: '🌳' },
    { word: 'ball', category: 'noun', emoji: '🔴' },
    { word: 'ran', category: 'verb', emoji: '🏃' },
    { word: 'jumped', category: 'verb', emoji: '⬆️' },
    { word: 'played', category: 'verb', emoji: '🎮' },
    { word: 'sat', category: 'verb', emoji: '🪑' },
    { word: 'looked', category: 'verb', emoji: '👀' },
    { word: 'big', category: 'adjective', emoji: '🐘' },
    { word: 'happy', category: 'adjective', emoji: '😄' },
    { word: 'fast', category: 'adjective', emoji: '💨' },
    { word: 'bright', category: 'adjective', emoji: '💡' },
    { word: 'little', category: 'adjective', emoji: '🐜' },
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

type ColumnKey = 'noun' | 'verb' | 'adjective';

const COLUMN_CONFIG: { key: ColumnKey; label: string; emoji: string; color: string; border: string; bg: string; badge: string }[] = [
  { key: 'noun', label: 'Nouns', emoji: '🏷️', color: 'text-blue-700', border: 'border-blue-300', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  { key: 'verb', label: 'Verbs', emoji: '⚡', color: 'text-green-700', border: 'border-green-300', bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
  { key: 'adjective', label: 'Adjectives', emoji: '🎨', color: 'text-purple-700', border: 'border-purple-300', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
];

export default function NounVerbAdjectiveSortGame({ story, childName, slowMode }: NounVerbAdjectiveSortGameProps) {
  const words: WordItem[] = useMemo(
    () => STORY_WORDS[story.id] ?? buildFallbackWords(story),
    [story.id]
  );

  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  // placed: word → column it was dropped into
  const [placed, setPlaced] = useState<Record<string, ColumnKey>>({});
  const [dragWord, setDragWord] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<ColumnKey | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [correctWords, setCorrectWords] = useState<Set<string>>(new Set());
  const [wrongWords, setWrongWords] = useState<Set<string>>(new Set());
  // Touch drag state
  const [touchDragWord, setTouchDragWord] = useState<string | null>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const columnRefs = useRef<Record<ColumnKey, HTMLDivElement | null>>({ noun: null, verb: null, adjective: null });

  const init = useCallback(() => {
    setShuffledWords(shuffle(words));
    setPlaced({});
    setDragWord(null);
    setDragOver(null);
    setSubmitted(false);
    setScore(0);
    setSaved(false);
    setCorrectWords(new Set());
    setWrongWords(new Set());
    setTouchDragWord(null);
    setTouchPos(null);
  }, [words]);

  useEffect(() => { init(); }, [init]);

  const allPlaced = Object.keys(placed).length === words.length;

  // ── Speak ─────────────────────────────────────────────────
  const handleSpeak = (word: string) => {
    setSpeaking(word);
    speak(word, {
      rate: slowMode ? 0.6 : 1.0,
      onEnd: () => setSpeaking(null),
      onError: () => setSpeaking(null),
    });
  };

  // ── Desktop drag handlers ──────────────────────────────────
  const handleDragStart = (e: React.DragEvent, word: string) => {
    if (submitted) return;
    setDragWord(word);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', word);
  };

  const handleDragEnd = () => {
    setDragWord(null);
    setDragOver(null);
  };

  const handleDragOver = (e: React.DragEvent, col: ColumnKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(col);
  };

  const handleDragLeave = () => setDragOver(null);

  const handleDrop = (e: React.DragEvent, col: ColumnKey) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain') || dragWord;
    if (!word) return;
    setPlaced((prev) => ({ ...prev, [word]: col }));
    setDragWord(null);
    setDragOver(null);
  };

  // ── Touch drag handlers ────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent, word: string) => {
    if (submitted) return;
    setTouchDragWord(word);
    const t = e.touches[0];
    setTouchPos({ x: t.clientX, y: t.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragWord) return;
    const t = e.touches[0];
    setTouchPos({ x: t.clientX, y: t.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchDragWord || !touchPos) {
      setTouchDragWord(null);
      setTouchPos(null);
      return;
    }
    // Find which column the touch ended over
    let droppedCol: ColumnKey | null = null;
    for (const col of ['noun', 'verb', 'adjective'] as ColumnKey[]) {
      const el = columnRefs.current[col];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        touchPos.x >= rect.left && touchPos.x <= rect.right &&
        touchPos.y >= rect.top && touchPos.y <= rect.bottom
      ) {
        droppedCol = col;
        break;
      }
    }
    if (droppedCol) {
      setPlaced((prev) => ({ ...prev, [touchDragWord]: droppedCol! }));
    }
    setTouchDragWord(null);
    setTouchPos(null);
  };

  // Remove word from column (click on placed word to return to bank)
  const handleRemovePlaced = (word: string) => {
    if (submitted) return;
    setPlaced((prev) => {
      const next = { ...prev };
      delete next[word];
      return next;
    });
  };

  // ── Check answers ──────────────────────────────────────────
  const handleCheck = async () => {
    if (!allPlaced || submitted) return;
    let correct = 0;
    const correctSet = new Set<string>();
    const wrongSet = new Set<string>();

    words.forEach((w) => {
      if (placed[w.word] === w.category) {
        correct++;
        correctSet.add(w.word);
        playCorrectSound();
      } else {
        wrongSet.add(w.word);
        playWrongSound();
      }
    });

    setScore(correct);
    setCorrectWords(correctSet);
    setWrongWords(wrongSet);
    setSubmitted(true);

    if (correct === words.length) {
      playAchievementSound();
      await playCelebrationVoice(childName ?? 'friend', correct, words.length, 'word-match');
    }

    // Save result
    if (!saved) {
      setSaved(true);
      await saveNounVerbAdjectiveResult({
        storyTitle: story.title,
        childName: childName ?? undefined,
        score: correct,
        total: words.length,
        attempts: 1,
      });
    }
  };

  // Words still in the bank (not placed)
  const bankWords = shuffledWords.filter((w) => !(w.word in placed));
  // Words placed in each column
  const columnWords = (col: ColumnKey) =>
    shuffledWords.filter((w) => placed[w.word] === col);

  const pct = words.length > 0 ? Math.round((score / words.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-200 p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-indigo-800">🔤 Sort the Words!</h2>
            <p className="text-sm text-indigo-500 font-semibold mt-0.5">
              Drag each word into the correct column — Nouns, Verbs, or Adjectives
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
              {Object.keys(placed).length}/{words.length} placed
            </span>
            {submitted && (
              <span className={`px-3 py-1 rounded-full font-bold text-sm ${pct === 100 ? 'bg-green-100 text-green-700' : pct >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {score}/{words.length} ✓
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Word Bank */}
      {!submitted && bankWords.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-4">
          <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-3">📦 Word Bank — drag words to the columns below</p>
          <div className="flex flex-wrap gap-2">
            {bankWords.map((w) => (
              <div
                key={w.word}
                draggable
                onDragStart={(e) => handleDragStart(e, w.word)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, w.word)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 font-bold text-sm cursor-grab active:cursor-grabbing select-none transition-colors
                  ${dragWord === w.word || touchDragWord === w.word
                    ? 'border-indigo-400 bg-indigo-100 text-indigo-700 opacity-60' :'border-gray-300 bg-gray-50 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
              >
                <span>{w.emoji}</span>
                <span>{w.word}</span>
                <button
                  onClick={() => handleSpeak(w.word)}
                  className={`ml-1 text-xs px-1 py-0.5 rounded-lg transition-colors ${speaking === w.word ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                  aria-label={`Hear ${w.word}`}
                >
                  🔊
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sorting Table */}
      <div className="grid grid-cols-3 gap-3">
        {COLUMN_CONFIG.map((col) => (
          <div
            key={col.key}
            ref={(el) => { columnRefs.current[col.key] = el; }}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`rounded-3xl border-2 p-3 min-h-[180px] transition-colors
              ${dragOver === col.key ? `${col.bg} ${col.border} border-dashed` : `bg-white ${col.border}`}
            `}
          >
            {/* Column header */}
            <div className={`flex items-center justify-center gap-1.5 mb-3 pb-2 border-b-2 ${col.border}`}>
              <span className="text-lg">{col.emoji}</span>
              <span className={`font-extrabold text-sm ${col.color}`}>{col.label}</span>
            </div>

            {/* Placed words */}
            <div className="flex flex-col gap-2">
              {columnWords(col.key).map((w) => {
                const isCorrect = submitted && correctWords.has(w.word);
                const isWrong = submitted && wrongWords.has(w.word);
                return (
                  <div
                    key={w.word}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border-2 font-bold text-xs transition-colors
                      ${isCorrect ? 'bg-green-100 border-green-400 text-green-800' : isWrong ?'bg-red-100 border-red-400 text-red-800' :
                        `${col.bg} ${col.border} text-gray-800`}
                      ${!submitted ? 'cursor-pointer hover:opacity-80' : ''}
                    `}
                    onClick={() => handleRemovePlaced(w.word)}
                    title={!submitted ? 'Click to return to word bank' : undefined}
                  >
                    <span>{w.emoji}</span>
                    <span className="flex-1">{w.word}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSpeak(w.word); }}
                      className={`text-[10px] px-1 py-0.5 rounded-lg transition-colors ${speaking === w.word ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                      aria-label={`Hear ${w.word}`}
                    >
                      🔊
                    </button>
                    {isCorrect && <span>✅</span>}
                    {isWrong && <span>❌</span>}
                  </div>
                );
              })}
              {columnWords(col.key).length === 0 && (
                <div className={`flex items-center justify-center h-16 rounded-xl border-2 border-dashed ${col.border} opacity-40`}>
                  <span className={`text-xs font-bold ${col.color}`}>Drop here</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* After submit: show correct answers for wrong ones */}
      {submitted && wrongWords.size > 0 && (
        <div className="bg-yellow-50 rounded-3xl border-2 border-yellow-200 p-4">
          <p className="text-sm font-extrabold text-yellow-800 mb-2">📖 Correct Answers:</p>
          <div className="flex flex-wrap gap-2">
            {words.filter((w) => wrongWords.has(w.word)).map((w) => (
              <span key={w.word} className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white border-2 border-yellow-300 text-xs font-bold text-yellow-800">
                {w.emoji} <strong>{w.word}</strong> → {COLUMN_CONFIG.find(c => c.key === w.category)?.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Check / Try Again buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {!submitted ? (
          <button
            onClick={handleCheck}
            disabled={!allPlaced}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-base transition-all active:scale-95 shadow-md
              ${allPlaced
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white' :'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <span>✅</span>
            <span>{allPlaced ? 'Check Answers!' : `Place all ${words.length - Object.keys(placed).length} remaining words first`}</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`px-5 py-3 rounded-2xl font-extrabold text-base ${pct === 100 ? 'bg-green-100 text-green-800' : pct >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {pct === 100 ? '🎉 Perfect!' : pct >= 60 ? '👍 Good job!' : '💪 Keep trying!'} {score}/{words.length}
            </div>
            <button
              onClick={init}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-base bg-indigo-500 hover:bg-indigo-600 text-white transition-all active:scale-95 shadow-md"
            >
              <span>🔄</span>
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Touch drag ghost */}
      {touchDragWord && touchPos && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-2 rounded-2xl border-2 border-indigo-400 bg-indigo-100 text-indigo-700 font-bold text-sm shadow-lg opacity-80"
          style={{ left: touchPos.x - 40, top: touchPos.y - 20 }}
        >
          {words.find(w => w.word === touchDragWord)?.emoji} {touchDragWord}
        </div>
      )}
    </div>
  );
}
