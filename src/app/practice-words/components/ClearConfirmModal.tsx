'use client';

// Confirmation modal before clearing all practice words — child-friendly copy

import React, { useEffect } from 'react';

interface ClearConfirmModalProps {
  wordCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ClearConfirmModal({
  wordCount,
  onConfirm,
  onCancel,
}: ClearConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-modal-title"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-4xl shadow-2xl p-8 max-w-sm w-full text-center animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">🗑️</div>

        <h2
          id="clear-modal-title"
          className="text-2xl font-extrabold text-purple-800 mb-3"
        >
          Delete All Words?
        </h2>

        <p className="text-purple-500 font-semibold text-lg mb-6">
          This will remove all <strong>{wordCount}</strong> practice{' '}
          {wordCount === 1 ? 'word' : 'words'}. You cannot undo this!
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-lg bg-red-400 text-white hover:bg-red-500 transition-all active:scale-95 shadow-md"
          >
            <span>🗑️</span> Yes, Delete All
          </button>
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all active:scale-95"
          >
            <span>↩️</span> No, Keep Them!
          </button>
        </div>
      </div>
    </div>
  );
}