'use client';

import React from 'react';
import type { MathsSet } from '@/lib/maths';
import { getMathsResults } from '@/lib/mathsResults';

interface MathsSetSelectorProps {
  sets: MathsSet[];
  childName: string;
  onSelect: (set: MathsSet) => void;
}

export default function MathsSetSelector({ sets, childName, onSelect }: MathsSetSelectorProps) {
  const results = getMathsResults().filter((r) => r.childName === childName);
  const perfectIds = new Set(results.filter((r) => r.score === r.total && r.total > 0).map((r) => r.mathsSetId));

  if (sets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📚</div>
        <p className="text-purple-600 font-bold">No maths sets for this class yet!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sets.map((set) => (
        <div key={set.id} className={`${set.color} rounded-3xl border-2 border-transparent p-5 shadow-md hover:shadow-xl transition-all`}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-4xl">{set.emoji}</span>
            <div className="flex gap-1 items-center">
              {perfectIds.has(set.id) && <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 font-extrabold">⭐ Perfect!</span>}
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${set.levelColor}`}>Class {set.class}</span>
            </div>
          </div>
          <h3 className="font-extrabold text-gray-800 text-lg mb-1">{set.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{set.questions.length} questions</p>
          <button
            onClick={() => onSelect(set)}
            className="w-full py-2.5 bg-orange-400 hover:bg-orange-500 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow-sm"
          >
            Start! 🚀
          </button>
        </div>
      ))}
    </div>
  );
}
