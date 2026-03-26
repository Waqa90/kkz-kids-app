'use client';

// Reusable tappable word button used in both Story Reading and Photo Text Reader
// Handles active/saved/speaking states and emits onTap events

import React from 'react';

interface WordTokenProps {
  word: string;           // Display word (may include punctuation)
  cleanWord: string;      // Stripped word for TTS / save
  isActive: boolean;      // Currently being spoken
  isSaved: boolean;       // In the practice list
  onTap: (word: string) => void;
  onLongPress?: (word: string) => void;  // Long press to save
  size?: 'normal' | 'large';
}

export default function WordToken({
  word,
  cleanWord,
  isActive,
  isSaved,
  onTap,
  onLongPress,
  size = 'normal',
}: WordTokenProps) {
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = () => {
    if (!onLongPress) return;
    longPressTimer.current = setTimeout(() => {
      onLongPress(cleanWord);
    }, 600);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const sizeClass = size === 'large' ?'text-3xl md:text-4xl px-3 py-1.5' :'text-2xl md:text-3xl px-2 py-1';

  return (
    <button
      type="button"
      aria-label={`Tap to hear: ${cleanWord}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={() => onTap(cleanWord)}
      className={`
        word-btn inline-flex items-center justify-center
        mx-0.5 my-1 rounded-xl font-extrabold
        border-2 shadow-sm
        transition-all duration-150 active:scale-95
        ${sizeClass}
        ${isActive
          ? 'bg-orange-400 border-orange-500 text-white shadow-word scale-105'
          : isSaved
            ? 'bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200' :'bg-white border-purple-200 text-purple-900 hover:bg-orange-50 hover:border-orange-300 hover:-translate-y-0.5 hover:shadow-md'
        }
      `}
    >
      {word}
      {isSaved && !isActive && (
        <span className="ml-1 text-sm leading-none">⭐</span>
      )}
    </button>
  );
}