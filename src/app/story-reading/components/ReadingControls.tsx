'use client';

// Toolbar with slow mode, sentence mode, read-all, stop controls

import React from 'react';

interface ReadingControlsProps {
  isSpeaking: boolean;
  slowMode: boolean;
  sentenceMode: boolean;
  onToggleSlowMode: () => void;
  onToggleSentenceMode: () => void;
  onReadAll: () => void;
  onStop: () => void;
}

export default function ReadingControls({
  isSpeaking,
  slowMode,
  sentenceMode,
  onToggleSlowMode,
  onToggleSentenceMode,
  onReadAll,
  onStop,
}: ReadingControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Read whole story */}
      <button
        onClick={isSpeaking ? onStop : onReadAll}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-sm
          ${isSpeaking
            ? 'bg-red-400 text-white hover:bg-red-500' :'bg-orange-400 text-white hover:bg-orange-500'
          }`}
        aria-label={isSpeaking ? 'Stop reading' : 'Read whole story aloud'}
      >
        <span className="text-xl">{isSpeaking ? '⏹' : '▶️'}</span>
        <span>{isSpeaking ? 'Stop' : 'Read All'}</span>
      </button>

      {/* Slow mode toggle */}
      <button
        onClick={onToggleSlowMode}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2
          ${slowMode
            ? 'bg-blue-400 text-white border-blue-500 shadow-md'
            : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
          }`}
        aria-pressed={slowMode}
        aria-label="Toggle slow reading mode"
      >
        <span className="text-xl">🐢</span>
        <span>Slow{slowMode ? ' ON' : ''}</span>
      </button>

      {/* Sentence mode toggle */}
      <button
        onClick={onToggleSentenceMode}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2
          ${sentenceMode
            ? 'bg-green-400 text-white border-green-500 shadow-md'
            : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
          }`}
        aria-pressed={sentenceMode}
        aria-label="Toggle sentence read-aloud mode"
      >
        <span className="text-xl">📝</span>
        <span>Sentences{sentenceMode ? ' ON' : ''}</span>
      </button>
    </div>
  );
}