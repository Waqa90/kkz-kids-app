'use client';

// Empty state shown when no words have been saved yet

import React from 'react';
import Link from 'next/link';

export default function PracticeEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Kitty illustration */}
      <div className="text-8xl mb-4 animate-float" role="img" aria-label="Sleepy cat">
        😸
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-3">
        No practice words yet!
      </h2>

      <p className="text-purple-400 font-semibold text-lg md:text-xl max-w-md mb-8">
        When you find a tricky word while reading, tap it and press{' '}
        <span className="text-purple-600">⭐ Save to Practice</span>.
        It will appear here!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/story-reading" className="btn-primary text-lg px-8 py-4">
          <span>📖</span> Read a Story
        </Link>
        <Link href="/photo-text-reader" className="btn-secondary text-lg px-8 py-4">
          <span>📷</span> Scan Some Words
        </Link>
      </div>
    </div>
  );
}