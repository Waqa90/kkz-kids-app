'use client';

// Progress bar showing how many words have been practiced

import React from 'react';

interface PracticeProgressBarProps {
  practiced: number;
  total: number;
}

export default function PracticeProgressBar({ practiced, total }: PracticeProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((practiced / total) * 100);

  return (
    <div className="mb-6 bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-extrabold text-purple-800 text-lg">
          My Progress
        </span>
        <span className="font-extrabold text-orange-500 text-xl">
          {practiced} / {total} ⭐
        </span>
      </div>

      {/* Track */}
      <div className="w-full h-7 bg-purple-100 rounded-full overflow-hidden border-2 border-purple-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-700 ease-out flex items-center justify-end pr-3"
          style={{ width: `${pct}%`, minWidth: pct > 0 ? '2.5rem' : '0' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${practiced} of ${total} words practiced`}
        >
          {pct > 10 && (
            <span className="text-white font-extrabold text-sm">{pct}%</span>
          )}
        </div>
      </div>

      <p className="mt-2 text-purple-500 font-semibold text-sm text-center">
        {pct === 100
          ? '🎉 All done! You are amazing!'
          : pct >= 50
          ? `Great job! Keep going — ${total - practiced} more to go!`
          : `You can do it! ${total - practiced} words left to practice.`}
      </p>
    </div>
  );
}