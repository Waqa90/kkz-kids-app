'use client';

// Upload zone with camera button (mobile) and file picker (desktop)

import React from 'react';

interface OcrUploadZoneProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function OcrUploadZone({
  fileInputRef,
  cameraInputRef,
  onFileChange,
}: OcrUploadZoneProps) {
  return (
    <div className="bg-white rounded-3xl border-3 border-dashed border-purple-300 shadow-kitty p-8 md:p-12">
      <div className="flex flex-col items-center gap-6">
        {/* Illustration */}
        <div className="text-8xl animate-float">📸</div>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-800 mb-2">
            Take a Photo of Words!
          </h2>
          <p className="text-purple-500 font-semibold text-lg">
            Point your camera at a book, sign, or worksheet
          </p>
        </div>

        {/* Camera button (mobile first) */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="btn-primary text-xl px-8 py-5 w-full max-w-xs"
          aria-label="Open camera to take a photo"
        >
          <span className="text-2xl">📷</span>
          Take a Photo
        </button>

        {/* File upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-ghost text-lg px-8 py-4 w-full max-w-xs"
          aria-label="Upload a photo from your device"
        >
          <span className="text-xl">🖼️</span>
          Choose from Photos
        </button>

        <p className="text-purple-300 font-semibold text-sm text-center">
          Works best with clear, printed text on a white background
        </p>
      </div>

      {/* Hidden inputs */}
      {/* Camera input — capture attribute triggers camera on mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-hidden="true"
        onChange={onFileChange}
      />
      {/* File picker input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden="true"
        onChange={onFileChange}
      />
    </div>
  );
}