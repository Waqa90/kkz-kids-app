'use client';

// Individual practice word card — tap to hear, star to mark practiced, X to remove

import React, { useState } from 'react';
import type { SavedWord } from '@/lib/savedWords';
import SpeakingIndicator from '@/components/SpeakingIndicator';

// Card color palette — cycles through friendly colors per word
const CARD_COLORS = [
  { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800', activeBg: 'bg-orange-400' },
  { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', activeBg: 'bg-purple-400' },
  { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', activeBg: 'bg-blue-400' },
  { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800', activeBg: 'bg-pink-400' },
  { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', activeBg: 'bg-green-400' },
  { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', activeBg: 'bg-yellow-400' },
  { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-800', activeBg: 'bg-cyan-400' },
];

function getCardColor(word: string) {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = word.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length];
}

interface PracticeWordCardProps {
  wordObj: SavedWord;
  isActive: boolean;
  isSpeaking: boolean;
  onSpeak: (wordObj: SavedWord) => void;
  onTogglePracticed: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function PracticeWordCard({
  wordObj,
  isActive,
  isSpeaking,
  onSpeak,
  onTogglePracticed,
  onRemove,
}: PracticeWordCardProps) {
  const [removing, setRemoving] = useState(false);
  const color = getCardColor(wordObj.word);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(wordObj.id), 300);
  };

  return (
    <div
      className={`
        practice-card border-2 select-none
        ${color.bg} ${color.border}
        ${wordObj.practiced ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
        ${removing ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}
        transition-all duration-300
      `}
    >
      {/* Remove button — top-right */}
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-bold opacity-0 group-hover:opacity-100 focus:opacity-100"
        style={{ opacity: 0.7 }}
        aria-label={`Remove word ${wordObj.word}`}
      >
        ✕
      </button>

      {/* Practiced star — top-left */}
      <button
        onClick={() => onTogglePracticed(wordObj.id)}
        className={`absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90 text-lg
          ${wordObj.practiced
            ? 'bg-yellow-300 text-yellow-700 shadow-sm'
            : 'bg-white/60 text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
          }`}
        aria-label={wordObj.practiced ? `Mark ${wordObj.word} as not practiced` : `Mark ${wordObj.word} as practiced`}
        aria-pressed={wordObj.practiced}
      >
        ⭐
      </button>

      {/* Word — main tap area */}
      <button
        onClick={() => onSpeak(wordObj)}
        className={`w-full flex flex-col items-center justify-center gap-2 pt-6 pb-2 rounded-2xl transition-all active:scale-95
          ${isActive ? `${color.activeBg} text-white -mx-0 -mb-0 px-2 py-4 rounded-xl` : `${color.text}`}
        `}
        aria-label={`Hear the word: ${wordObj.word}`}
      >
        <span className={`font-extrabold text-center break-words leading-tight
          ${wordObj.word.length > 8 ? 'text-xl' : wordObj.word.length > 5 ? 'text-2xl' : 'text-3xl'}
        `}>
          {wordObj.word}
        </span>
        {isSpeaking ? (
          <SpeakingIndicator isActive={true} color={isActive ? 'bg-white' : 'bg-orange-400'} />
        ) : (
          <span className="text-2xl">🔊</span>
        )}
      </button>

      {/* Source label */}
      <div className="mt-1 text-center">
        <span className="text-xs font-semibold text-gray-400">
          {wordObj.source === 'story' ? '📖' : '📷'}
          {wordObj.practiceCount > 0 && (
            <span className="ml-1">×{wordObj.practiceCount}</span>
          )}
        </span>
      </div>
    </div>
  );
}