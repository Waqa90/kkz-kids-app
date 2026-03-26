'use client';

/**
 * PracticeWordsContent — saved difficult words review screen
 * - All saved words displayed as large colorful cards
 * - Tap to hear the word spoken aloud
 * - Star button to mark as practiced (turns gold)
 * - Delete button to remove word
 * - Progress summary bar
 * - Celebration banner when all words are practiced
 * - Empty state with CTA to go read a story
 *
 * Backend integration point: sync savedWords with a user account API
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  loadSavedWordsAsync,
  togglePracticed,
  removeWord,
  clearAllWords,
  type SavedWord,
} from '@/lib/savedWords';
import { speak } from '@/lib/speech';

import PracticeWordCard from './PracticeWordCard';
import PracticeEmptyState from './PracticeEmptyState';
import PracticeProgressBar from './PracticeProgressBar';
import ClearConfirmModal from './ClearConfirmModal';

export default function PracticeWordsContent() {
  const [words, setWords] = useState<SavedWord[]>([]);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unpracticed' | 'practiced'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [celebrateVisible, setCelebrateVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from Supabase (with localStorage fallback) on mount
  useEffect(() => {
    setLoading(true);
    loadSavedWordsAsync()
      .then((data) => setWords(data))
      .finally(() => setLoading(false));
  }, []);

  // Check if all words are practiced for celebration
  useEffect(() => {
    if (words.length > 0 && words.every((w) => w.practiced)) {
      setCelebrateVisible(true);
    } else {
      setCelebrateVisible(false);
    }
  }, [words]);

  // ── Speak a word ──────────────────────────────────────────
  const handleSpeak = useCallback((wordObj: SavedWord) => {
    setActiveWordId(wordObj.id);
    setIsSpeaking(true);
    speak(wordObj.word, {
      rate: 0.85,
      onEnd: () => {
        setIsSpeaking(false);
        setActiveWordId(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setActiveWordId(null);
      },
    });
  }, []);

  // ── Toggle practiced ──────────────────────────────────────
  const handleTogglePracticed = useCallback((id: string) => {
    const updated = togglePracticed(id);
    setWords(updated);
  }, []);

  // ── Remove word ───────────────────────────────────────────
  const handleRemove = useCallback((id: string) => {
    const updated = removeWord(id);
    setWords(updated);
  }, []);

  // ── Clear all ─────────────────────────────────────────────
  const handleClearAll = useCallback(() => {
    const updated = clearAllWords();
    setWords(updated);
    setShowClearConfirm(false);
  }, []);

  // ── Filtered word list ────────────────────────────────────
  const filteredWords = words.filter((w) => {
    if (filter === 'practiced') return w.practiced;
    if (filter === 'unpracticed') return !w.practiced;
    return true;
  });

  const practicedCount = words.filter((w) => w.practiced).length;
  const totalCount = words.length;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3 animate-float inline-block">⭐</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 mb-2">
          My Practice Words
        </h1>
        <p className="text-lg text-purple-500 font-semibold">
          Tap any word to hear it! Tap the star when you know it ✨
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 rounded-full border-4 border-purple-300 border-t-purple-600 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && words.length === 0 && <PracticeEmptyState />}

      {/* Words exist */}
      {!loading && words.length > 0 && (
        <>
          {/* Progress bar */}
          <PracticeProgressBar practiced={practicedCount} total={totalCount} />

          {/* Celebration banner */}
          {celebrateVisible && (
            <div className="mb-6 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-3xl border-2 border-yellow-400 p-6 text-center shadow-lg animate-bounce-in">
              <div className="text-5xl mb-2">🎉🐱🎉</div>
              <h2 className="text-2xl font-extrabold text-orange-800">
                Amazing! You practised ALL your words!
              </h2>
              <p className="text-orange-700 font-semibold text-lg mt-1">
                You&apos;re a reading superstar! Keep it up!
              </p>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {(
              [
                { key: 'all', label: `All (${totalCount})`, emoji: '📚' },
                { key: 'unpracticed', label: `To Learn (${totalCount - practicedCount})`, emoji: '🔵' },
                { key: 'practiced', label: `Done (${practicedCount})`, emoji: '⭐' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-base transition-all active:scale-95
                  ${filter === tab.key
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50'
                  }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Clear all button */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-base text-red-500 bg-red-50 border-2 border-red-200 hover:bg-red-100 transition-all active:scale-95"
              aria-label="Clear all practice words"
            >
              <span>🗑️</span>
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>

          {/* No results for filter */}
          {filteredWords.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">
                {filter === 'practiced' ? '🌟' : '✅'}
              </div>
              <p className="text-2xl font-extrabold text-purple-600">
                {filter === 'practiced' ?'No practiced words yet — keep going!' :'All words are practiced! Great job!'}
              </p>
            </div>
          )}

          {/* Word cards grid */}
          {filteredWords.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredWords.map((wordObj) => (
                <PracticeWordCard
                  key={wordObj.id}
                  wordObj={wordObj}
                  isActive={activeWordId === wordObj.id}
                  isSpeaking={isSpeaking && activeWordId === wordObj.id}
                  onSpeak={handleSpeak}
                  onTogglePracticed={handleTogglePracticed}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <ClearConfirmModal
          wordCount={words.length}
          onConfirm={handleClearAll}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
}