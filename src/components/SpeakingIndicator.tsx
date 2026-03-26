'use client';

// Animated bars shown while TTS is speaking — gives child visual feedback

import React from 'react';

interface SpeakingIndicatorProps {
  isActive: boolean;
  color?: string;
}

export default function SpeakingIndicator({
  isActive,
  color = 'bg-orange-400',
}: SpeakingIndicatorProps) {
  if (!isActive) return null;

  return (
    <span
      aria-label="Speaking"
      className="inline-flex items-end gap-0.5 h-5 ml-2"
    >
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`speaking-bar w-1 rounded-full ${color}`}
          style={{ height: '100%', animationDelay: `${(i - 1) * 0.1}s` }}
        />
      ))}
    </span>
  );
}