'use client';

// Animated progress bar shown during Tesseract OCR processing

import React from 'react';

interface OcrProgressBarProps {
  progress: number;   // 0–100
  message: string;
}

export default function OcrProgressBar({ progress, message }: OcrProgressBarProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Message */}
      <p className="text-center text-purple-700 font-bold text-lg mb-3">
        {message}
      </p>

      {/* Track */}
      <div className="w-full h-6 bg-purple-100 rounded-full overflow-hidden border-2 border-purple-200">
        {/* Fill */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-purple-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`OCR progress: ${progress}%`}
        />
      </div>

      {/* Percentage */}
      <p className="text-center text-purple-500 font-bold text-sm mt-2">
        {progress}%
      </p>
    </div>
  );
}