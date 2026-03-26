'use client';

// Small animated toast that appears when a word is saved to practice list

import React, { useEffect, useState } from 'react';

interface SaveWordToastProps {
  word: string;
  visible: boolean;
}

export default function SaveWordToast({ word, visible }: SaveWordToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(t);
    }
  }, [visible, word]);

  return (
    <div
      className={`
        fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50
        transition-all duration-300
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <div className="flex items-center gap-3 bg-purple-600 text-white px-6 py-4 rounded-3xl shadow-2xl font-bold text-lg">
        <span className="text-2xl">⭐</span>
        <span>
          <span className="text-purple-200">Saved</span>{' '}
          <span className="text-white">&ldquo;{word}&rdquo;</span>
          {' '}to practice!
        </span>
      </div>
    </div>
  );
}